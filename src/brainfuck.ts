import {
    AccessNode,
    AssigmentNode,
	BlockNode,
	BlockStatement,
	CallNode,
	DeclarationNode,
	DefinitionNode,
	FileNode,
	HexNode,
	IfElseNode,
	IfNode,
	ImportNode,
	IntNode,
	ReturnNode,
	StringNode,
	ToplevelStatement,
	ValueNode,
	WhileNode
} from "./nodes";

const _ = (text: string) => text.replace(/\s/g, '');

const left = (repetitions: number): string => '<'.repeat(repetitions);
const right = (repetitions: number): string => '>'.repeat(repetitions);

const ensureStackLength = (ctx: Context, slots: number) => {
    while (ctx.stackLength <= ctx.sp + slots)
        ctx.stackLength++;
}

const compileAccess = (ctx: Context, access: AccessNode): string => {
    const toVar = '$TO_VAR_STACK_START' + right(ctx.vars[access.name]);
    const fromVar = '$FROM_VAR_STACK_START' + left(ctx.vars[access.name]);
    return _(`
        ${right(ctx.sp)}
        [->-<]
        ${left(ctx.sp)}
        ${toVar}
        [
            ${fromVar}
            ${right(ctx.sp)}
            +>+<
            ${left(ctx.sp)}
            ${toVar}
            -
        ]
        ${fromVar}
        ${right(ctx.sp)}
        >
        [
            <
            ${left(ctx.sp)}
            ${toVar}
            +
            ${fromVar}
            ${right(ctx.sp)}
            >
            -
        ]
        <
        ${left(ctx.sp)}
    `);
}

const compileValue = (ctx: Context, value: ValueNode): string => {
    if (value instanceof HexNode) {
        return '+'.repeat(parseInt(value.value, 16));
    } else if (value instanceof IntNode) {
        return '+'.repeat(parseInt(value.value, 10));
    } else if (value instanceof StringNode) {
        
    } else if (value instanceof AccessNode) {
        return compileAccess(ctx, value);
    }
    throw new Error('not implemented');
}

const assignValueToVar = (ctx: Context, varName: string, valueNode: ValueNode) => {
    const value = compileValue(ctx, valueNode);
    const toVar = '$TO_VAR_STACK_START' + '>'.repeat(ctx.vars[varName]);
    const fromVar = '$FROM_VAR_STACK_START' + '<'.repeat(ctx.vars[varName]);
    return _(`
        ${right(ctx.sp)}
        ${value}
        [
            ${left(ctx.sp)}
            ${toVar}
            +
            ${fromVar}
            ${right(ctx.sp)}
            -
        ]
        ${left(ctx.sp)}
    `);
}

const compileDeclaration = (ctx: Context, declaration: DeclarationNode): string => {
    if (declaration.name in ctx.vars)
        throw new Error(`redeclaration of '${declaration.name}'`);
    ctx.vars[declaration.name] = ctx.varCount++;
    return assignValueToVar(ctx, declaration.name, declaration.value);
}

const compileAssignment = (ctx: Context, assignment: AssigmentNode): string => {
    if (!(assignment.name in ctx.vars))
        throw new Error(`redeclaration of '${assignment.name}'`);
    return assignValueToVar(ctx, assignment.name, assignment.value);
}

const compileCall = (ctx: Context, statement: CallNode): string => {
    switch (statement.name) {
        case '__brainfuck__':
            return statement.args.map(arg => arg.valueType === 'string' ? arg.value : '').join('');
        case '__output__':
            return `${compileValue(ctx, statement.args[0])}.`;
    }
    throw new Error('not implemented');
}

const compileBlockStatement = (ctx: Context, statement: BlockStatement): string => {
    if (statement instanceof CallNode) {
        return compileCall(ctx, statement);
    } else if (statement instanceof ReturnNode) {
        
    } else if (statement instanceof ReturnNode) {
        
    } else if (statement instanceof AssigmentNode) {
        return compileAssignment(ctx, statement);
    } else if (statement instanceof DeclarationNode) {
        return compileDeclaration(ctx, statement);
    } else if (statement instanceof IfNode) {

    } else if (statement instanceof IfElseNode) {
        
    } else if (statement instanceof WhileNode) {
        
    } else if (statement instanceof BlockNode) {
        return compileBlock(ctx, statement);
    }
    console.log(statement)
    throw new Error('not implemented');
}

const compileBlock = (ctx: Context, block: BlockNode): string => {
    return block.nodes.map(statement => compileBlockStatement(ctx, statement)).join('');
}

const compileDefinition = (ctx: Context, definition: DefinitionNode): string => {
    if (definition.name === 'main') {
        return compileBlock(ctx, definition.body);
    }
    throw new Error('not implemented');
}

const compileImport = (ctx: Context, statement: ImportNode): string => {
    throw new Error('not implemented');
}

const compileToplevelStatement = (ctx: Context, statement: ToplevelStatement): string => {
    if (statement instanceof ImportNode) {
        return compileImport(ctx, statement);
    } else if (statement instanceof DefinitionNode) {
        return compileDefinition(ctx, statement);
    }
    throw new Error('how tf this get reached');
}

const compileFile = (ctx: Context, file: FileNode): string => {
    return file.statements.map(statement => compileToplevelStatement(ctx, statement)).join('');
}

type Context = {
    sp: number,
    stackLength: number,
    varCount: number,
    vars: {[key: string]: number},
};

export const toBrainfuck =(files: FileNode[]): string => {
    const ctx: Context = {
        sp: 0,
        stackLength: 1,
        varCount: 0,
        vars: {},
    };
    return files
        .map(file => compileFile(ctx, file))
        .join('')
        .replaceAll('$TO_VAR_STACK_START', '>'.repeat(ctx.stackLength))
        .replaceAll('$FROM_VAR_STACK_START', '<'.repeat(ctx.stackLength))
}
