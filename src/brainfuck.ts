import {
    AccessNode,
    AdditionNode,
    AssigmentNode,
	BinaryOperationNode,
	BlockNode,
	BlockStatement,
	CallNode,
	CharNode,
	DeclarationNode,
	DefinitionNode,
	FileNode,
	HexNode,
	IfElseNode,
	IfNode,
	ImportNode,
	IntNode,
	Pos,
	ReturnNode,
	StringNode,
	SubtractionNode,
	ToplevelStatement,
	ValueNode,
	WhileNode
} from "./nodes";
import { stddefs } from "./stddefs";

const left = (repetitions: number): string => '<'.repeat(repetitions);
const right = (repetitions: number): string => '>'.repeat(repetitions);

const ensureStackLength = (ctx: Context, minimumSize: number) => {
    while (ctx.stackLength <= ctx.sp + minimumSize)
        ctx.stackLength++;
}

const ensureVarsLength = (ctx: Context, minimumSize: number) => {
    while (ctx.varsLength <= ctx.varCount + minimumSize)
        ctx.varsLength++;
}

const doOn = (offset: number = 0, jumper: string, returner: string, action: string) => `
    ${jumper}
    ${left(offset)}
    ${action}
    ${right(offset)}
    ${returner}
`;

const doOnStack = (offset: number, action: string) => doOn(offset, '$TOSTACK', '$FROMSTACK', action)
const doOnVar = (offset: number, action: string) => doOn(offset, '$TOVAR', '$FROMVAR', action)

const incrementStack = (offset: number) => doOnStack(offset, '+');
const decrementStack = (offset: number) => doOnStack(offset, '-');
const incrementVar   = (offset: number) => doOnVar(offset, '+');
const decrementVar   = (offset: number) => doOnVar(offset, '-');

const moveVarValueToStackZeroAndOne = (ctx: Context, varName: string) => `
    // moveVarValueToStackZeroAndOne
    $TOVAR
    ${left(ctx.vars[varName])}
    [
        ${right(ctx.vars[varName])}
        $FROMVAR
        ${incrementStack(ctx.sp)}
        ${incrementStack(ctx.sp + 1)}
        $TOVAR
        ${left(ctx.vars[varName])}
        -
    ]
    ${right(ctx.vars[varName])}
    $FROMVAR
`;

const moveStackOneToVar = (ctx: Context, varName: string) => `
    // moveStackOneToVar
    $TOSTACK
    ${left(ctx.sp + 1)}
    [
        ${right(ctx.sp + 1)}
        $FROMSTACK
        ${incrementVar(ctx.vars[varName])}
        $TOSTACK
        ${left(ctx.sp + 1)}
        -
    ]
    ${right(ctx.sp + 1)}
    $FROMSTACK
`;

const compileAccess = (ctx: Context, access: AccessNode): string => {
    if (!(access.name in ctx.vars))
        throw new Error(`use of undefined variable '${access.name}'`);
    ensureStackLength(ctx, 2);
    ctx.sp++;
    return `
        // compileAccess
        ${doOnStack(ctx.sp, '[-]')}
        ${doOnStack(ctx.sp+1, '[-]')}
        ${moveVarValueToStackZeroAndOne(ctx, access.name)}
        ${moveStackOneToVar(ctx, access.name)}
    `;
}

const compileBuiltinBinaryOpNode = (ctx: Context, node: BinaryOperationNode): string => {
    const res = `
        ${compileValue(ctx, node.left)}
        ${compileValue(ctx, node.right)}
        // compileBuiltinBinaryOpNode
        $TOSTACK
        ${left(ctx.sp)}
        [
            >
            ${node instanceof AdditionNode ? '+' : '-'}
            <
            -
        ]
        ${right(ctx.sp)}
        $FROMSTACK
    `;
    ctx.sp--;
    return res;
}

const compileBinaryOpNode = (ctx: Context, node: BinaryOperationNode): string => {
    if (node instanceof AdditionNode || node instanceof SubtractionNode) {
        return compileBuiltinBinaryOpNode(ctx, node)
    }
    throw new Error('not implemented');
}

const compileNumberLiteral = (value: ValueNode): string => {
    if (value instanceof HexNode) {
        return '+'.repeat(parseInt(value.value, 16));
    } else if (value instanceof IntNode) {
        return '+'.repeat(parseInt(value.value, 10));
    } else if (value instanceof CharNode) {
        if (value.value[0] === '\\') {
            const specialChars: {[key: string]: number} = {
                't':    9,
                'n':    10,
            }
            if (value.value[1] in specialChars)
                return '+'.repeat(specialChars[value.value[1]]);
        } else  {
            const charCode = value.value.charCodeAt(0);
            if (charCode > 31 && charCode < 128)
                return '+'.repeat(charCode);
        }
    }
    throw new Error('not implemented');
}

const compileValue = (ctx: Context, value: ValueNode) => {
    ensureStackLength(ctx, 1);
    ctx.sp++;
    if (value instanceof HexNode || value instanceof IntNode || value instanceof CharNode) {
        return `
            // compileValue HexNode || IntNode
            ${doOnStack(ctx.sp, compileNumberLiteral(value))}
        `;
    } else if (value instanceof StringNode) {

    } else if (value instanceof AccessNode) {
        return compileAccess(ctx, value);
    } else if (value instanceof BinaryOperationNode) {
        return compileBinaryOpNode(ctx, value);
    } else if (value instanceof CallNode) {
        return compileCall(ctx, value);
    }
    console.log(value);
    throw new Error('not implemented');
}

const popStackIntoVar = (ctx: Context, varName: string) => {
    const res = `
        // popStackIntoVar
        ${doOnVar(ctx.vars[varName], '[-]')}
        $TOSTACK
        ${left(ctx.sp)}
        [
            ${right(ctx.sp)}
            $FROMSTACK
            ${incrementVar(ctx.vars[varName])}
            $TOSTACK
            ${left(ctx.sp)}
            -
        ]
        ${right(ctx.sp)}
        $FROMSTACK
    `;
    ctx.sp--;
    return res;
}

const assignValueToVar = (ctx: Context, varName: string, valueNode: ValueNode) => {
    return `
        // assignValueToVar
        ${compileValue(ctx, valueNode)}
        ${popStackIntoVar(ctx, varName)}
    `;
}

const compileDeclaration = (ctx: Context, declaration: DeclarationNode): string => {
    // if (declaration.name in ctx.vars)
    //     throw new Error(`redeclaration of '${declaration.name}'`);
    ctx.vars[declaration.name] = ctx.varCount++;
    ensureVarsLength(ctx, 1)
    return assignValueToVar(ctx, declaration.name, declaration.value);
}

const compileAssignment = (ctx: Context, assignment: AssigmentNode): string => {
    if (!(assignment.name in ctx.vars))
        throw new Error(`use of undefined variable '${assignment.name}'`);
    return assignValueToVar(ctx, assignment.name, assignment.value);
}

const findMatchingDefinition = (ctx: Context, statement: CallNode) => {
    const func = ctx.definitions.find(({name}) => name === statement.name);
    if (func === undefined)
        throw new Error(`call to undefined function '${statement.name}'`);
    if (func.args.length > statement.args.length)
        throw new Error(`too few args passed to function '${func.name}' on line ${statement.begin.line}`);
    if (func.args.length < statement.args.length)
        throw new Error(`too many args passed to function '${func.name}' on line ${statement.begin.line}`);
    return func;
}

const compileCallArgs = (ctx: Context, statement: CallNode, func: DefinitionNode) => {
    return statement.args.map((v, i) => {
        ctx.vars[func.args[i]] = ctx.varCount++;
        ensureVarsLength(ctx, 1);
        return assignValueToVar(ctx, func.args[i], v);
    }).join('');  
}

const compileCall = (ctx: Context, statement: CallNode): string => {
    if (statement.name === '__brainfuck__')
        return statement.args
            .map(arg => arg.valueType === 'string' ? arg.value : '')
            .join('')
            .replaceAll('$SPL', left(ctx.sp))
            .replaceAll('$SPR', right(ctx.sp));
    if (ctx.callstack.includes(statement.name))
        throw new Error('recursion not allowed');
    if (statement.name === '__push__')
        return compileValue(ctx, statement.args[0]);
    const func = findMatchingDefinition(ctx, statement);
    const args = compileCallArgs(ctx, statement, func);
    ctx.callstack.push(func.name);
    const res = compileBlock(ctx, func.body);
    ctx.callstack.pop();
    return args + res;
}

const compileIf = (ctx: Context, statement: IfNode) => {
    return `
        ${compileValue(ctx, statement.condition)}
        $TOSTACK
        ${left(ctx.sp)}
        [
            ${right(ctx.sp)}
            $FROMSTACK
            ${compileBlockStatement(ctx, statement.truthy)}
            $TOSTACK
            ${left(ctx.sp)}
            [-]
        ]
        ${right(ctx.sp)}
        $FROMSTACK
    `;
}

const compileIfElse = (ctx: Context, statement: IfElseNode) => {
    ensureStackLength(ctx, 2);
    return `
        ${compileValue(ctx, statement.condition)}
        $TOSTACK
        ${left(ctx.sp)}
        < + >
        [
            < [-] >
            ${right(ctx.sp)}
            $FROMSTACK
            ${compileBlockStatement(ctx, statement.truthy)}
            $TOSTACK
            ${left(ctx.sp)}
            [-]
        ]
        <
        [
            ${right(ctx.sp)}
            $FROMSTACK
            ${compileBlockStatement(ctx, statement.falsy)}
            $TOSTACK
            ${left(ctx.sp)}
            [-]
        ]
        ${right(ctx.sp)}
        $FROMSTACK
    `;
}

const compileWhile = (ctx: Context, statement: WhileNode) => {
    ensureStackLength(ctx, 3);
    return `
        ${compileValue(ctx, statement.condition)}
        $TOSTACK
        ${left(ctx.sp)}
        [
            ${right(ctx.sp)}
            $FROMSTACK
            ${compileBlockStatement(ctx, statement.body)}
            $TOSTACK
            ${left(ctx.sp)}
            
            ${compileValue(ctx, statement.condition)}
            $TOSTACK
            ${left(ctx.sp + 1)}
            < + >
            [ < [-] > [-] ]
            <
            [
                > > [-]
                [-]
            ]
            ${right(ctx.sp + 1)}
            $FROMSTACK
        ]
        ${right(ctx.sp)}
        $FROMSTACK
    `;
}

const compileBlockStatement = (ctx: Context, statement: BlockStatement): string => {
    if (statement instanceof CallNode) {
        return compileCall(ctx, statement);
    } else if (statement instanceof ReturnNode) {
        return compileValue(ctx, statement.value)
    } else if (statement instanceof ReturnNode) {
        
    } else if (statement instanceof AssigmentNode) {
        return compileAssignment(ctx, statement);
    } else if (statement instanceof DeclarationNode) {
        return compileDeclaration(ctx, statement);
    } else if (statement instanceof IfNode) {
        return compileIf(ctx, statement);
    } else if (statement instanceof IfElseNode) {
        return compileIfElse(ctx, statement);
    } else if (statement instanceof WhileNode) {
        return compileWhile(ctx, statement);
    } else if (statement instanceof BlockNode) {
        return compileBlock(ctx, statement);
    }
    throw new Error('not implemented');
}

const compileBlock = (ctx: Context, block: BlockNode): string => {
    const nctx: Context = {
        ...Object.assign({}, ctx),
        vars: Object.assign({}, ctx.vars)
    }
    const res = block.nodes.map(statement => compileBlockStatement(nctx, statement)).join('');
    ctx.sp = nctx.sp;
    ctx.stackLength = nctx.stackLength;
    ctx.varsLength = nctx.varsLength;
    return res;
}

const compileDefinition = (ctx: Context, definition: DefinitionNode): string => {
    if (definition.name === 'main') {
        return compileBlock(ctx, definition.body);
    } else {
        if (ctx.definitions.find(({name}) => name === definition.name))
            throw new Error(`redifinition of function '${definition.name}'`)
        ctx.definitions.push(definition);
        return '';
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
    varsLength: number,
    varCount: number,
    vars: {[key: string]: number},
    definitions: DefinitionNode[],
    callstack: string[],
};

const removeUnusedSiblings = (brainfuck: string): string => {
    // return /(:?\<\>)|(:?\>\<)/.test(brainfuck) ? removeUnusedSiblings(brainfuck.replace(/(:?\<\>)|(:?\>\<)/, '')) : brainfuck;
    return brainfuck;
}

export const crustlAstToBrainfuck = (files: FileNode[]): string => {
    const ctx: Context = {
        sp: 0,
        stackLength: 1,
        varsLength: 0,
        varCount: 0,
        vars: {},
        definitions: [...stddefs()],
        callstack: [],
    };
    const res = files
        .map(file => compileFile(ctx, file))
        .join('')
        .replaceAll('$TOSTACK', right(ctx.stackLength) + '// TOSTACK')
        .replaceAll('$FROMSTACK', left(ctx.stackLength) + '// FROMSTACK')
        .replaceAll('$TOVAR', right(ctx.stackLength + ctx.varsLength) + '// TOVAR')
        .replaceAll('$FROMVAR', left(ctx.stackLength + ctx.varsLength) + '// FROMVAR')
        // .replace(/\/\/.*?$/gm, '')
        // .replace(/\s/g, '')

    return removeUnusedSiblings(res);
}
