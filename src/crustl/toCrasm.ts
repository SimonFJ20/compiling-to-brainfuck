import { parseCrustlToAST } from "../crustl";
import { readFileSync } from "fs";
import {
    AccessNode,
    AdditionNode,
    CallNode,
    CharNode,
    DeclarationNode,
    DefinitionNode,
    FileNode,
    HexNode,
    ImportNode,
    IntNode,
    Node,
    StringNode,
    SubtractionNode,
    ToplevelStatement,
    ValueNode
} from "../nodes";

class Vars {
    public parent?: Vars;
    public values: {[key: string]: number};
    public memory: boolean[];

    public constructor (parent?: Vars) {
        this.parent = parent;
        this.values = {};
        this.memory = [];
    }

    public derive() {
        return new Vars(this);
    }

    public existsLocally(name: string): boolean {
        return name in this.values;
    }

    public exists(name: string): boolean {
        return this.parent ? name in this.values && this.parent.exists(name) : name in this.values;
    }

    public get(name: string): number {
        return this.values[name] ?? (this.parent && this.parent.get(name));
    }

    public alloc(name: string): number {
        const idx = this.memory.indexOf(false);
        if (idx !== -1) {
            return this.values[name] = idx;
        } else {
            const idx = this.values.length;
            this.memory.push(true);
            return this.values[name] = idx + 0xF0;
        } 
    }

    public dealloc(name: string) {
        if (!this.exists(name)) return;
        const idx = this.values[name] ?? this.parent?.get(name);
        this.memory[idx] = false;
    }
}

type Context = {
    filename: string,
    vars: Vars,
    funcs: DefinitionNode[],
    imports: string[],
}

const error = (ctx: Context, node: Node, msg: string): never => {
    console.log(`Compile Error: ${msg}`);
    console.log(`at ${ctx.filename}:${node.begin.line}:${node.begin.column}`);
    process.exit(1);
}

export type CompileValueRes = {type: 'u8' | 'ptr', value: string}

const compileValue = (ctx: Context, node: ValueNode): CompileValueRes => {
    if (node instanceof CharNode || node instanceof IntNode || node instanceof HexNode)
        return {type: 'u8', value: `push ${node.value}`}
    else if (node instanceof StringNode)
        return error(ctx, node, 'not implemented');
    else if (node instanceof AccessNode)
        return error(ctx, node, 'not implemented');
    else if (node instanceof CallNode)
        return error(ctx, node, 'not implemented');
    else if (node instanceof AdditionNode)
        return error(ctx, node, 'not implemented');
    else if (node instanceof SubtractionNode)
        return error(ctx, node, 'not implemented');
    return error(ctx, node, 'not a value');
}

const compileImport = (ctx: Context, node: ImportNode): string => {
    if (ctx.imports.includes(node.name)) return '';
    ctx.imports.push(node.name);
    const file = parseCrustlToAST(readFileSync(node.name).toString());
    file.setFilename(node.name);
    const nctx: Context = {
        filename: node.name,
        vars: new Vars(),
        funcs: ctx.funcs,
        imports: ctx.imports,
    };
    return compileTopLevelStatements(ctx, file.statements);
}

const compileDefintion = (ctx: Context, node: DefinitionNode): string => {
    ctx.funcs.push(node);
    return '';
}

const compileDeclaration = (ctx: Context, node: DeclarationNode): string => {
    const addr = ctx.vars.alloc(node.name);
    return `
        ${compileValue(ctx, node.value)}
        pop a
        sw ${addr}, a
    `;
}

const compileTopLevelStatement = (ctx: Context, node: ToplevelStatement): string => {
    if (node instanceof ImportNode)
        return compileImport(ctx, node);
    else if (node instanceof DefinitionNode)
        return compileDefintion(ctx, node);
    else if (node instanceof DeclarationNode)
        return compileDeclaration(ctx, node);
    return error(ctx, node, 'not a top level statement');
}

const compileTopLevelStatements = (ctx: Context, nodes: ToplevelStatement[]): string => {
    return nodes.map(node => compileTopLevelStatement(ctx, node)).join();
}

export const toCrasm = (ast: FileNode): string => {
    const ctx: Context = {
        filename: ast.filename,
        vars: new Vars(),
        funcs: [],
        imports: [],
    };
    const result = compileTopLevelStatements(ctx, ast.statements);
    return result
        .replace(/^[\t ]*/gm, '');
}
