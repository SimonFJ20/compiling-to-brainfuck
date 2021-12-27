
type Token = {
    type: string,
    value: string,
    text: string,
    offset: number,
    lineBreaks: number,
    line: number,
    col: number,
}

export class Pos {
    public line: number;
    public column: number;
    public length: number;

    constructor (line: number, column: number, length: number) {
        this.line = line;
        this.column = column;
        this.length = length;
    }

    public static from(token: Token) {
        return new Pos(token.line, token.col, token.text.length);
    }
}

export abstract class Node {
    public type: string;
    public begin: Pos;
    public end: Pos;

    constructor (type: string, begin: Pos, end: Pos) {
        this.type = type;
        this.begin = begin;
        this.end = end;
    }
}

export abstract class ValueNode extends Node {
    public valueType: string;
    public value: string;

    constructor(valueType: string, token: Token, pos: Pos) {
        super('value', pos, pos);
        this.valueType = valueType;
        this.value = token.value;
    }
}

interface ToplevelStatement {

}

export class FileNode extends Node {
    public namespace: NamespaceNode;
    public statements: ToplevelStatement[];

    constructor (namespace: NamespaceNode, statements: ToplevelStatement[], begin: Pos, end: Pos) {
        super('file', begin, end);
        this.namespace = namespace;
        this.statements = statements;
    }
}

export class NamespaceNode extends Node implements ToplevelStatement {
    public name: string;

    constructor (name: string, begin: Pos, end: Pos) {
        super('namespace', begin, end);
        this.name = name;
    }
}

export class ImportNode extends Node implements ToplevelStatement {
    public name: string;

    constructor (name: string, begin: Pos, end: Pos) {
        super('import', begin, end);
        this.name = name;
    }
}

export class DefinitionNode extends Node implements ToplevelStatement {
    public name: string;
    public args: string[];
    public body: BlockNode;

    constructor (name: string, args: string[], body: BlockNode, begin: Pos, end: Pos) {
        super('definition', begin, end);
        this.name = name;
        this.args = args;
        this.body = body;
    }
}

interface BlockStatement {

}

export class BlockNode extends Node implements BlockStatement {
    public nodes: BlockStatement[];

    constructor (nodes: Node[], begin: Pos, end: Pos) {
        super('block', begin, end);
        this.nodes = nodes;
    }
}

export class WhileNode extends Node implements BlockStatement {
    public condition: ValueNode;
    public body: BlockStatement;

    constructor (condition: ValueNode, body: BlockStatement, begin: Pos, end: Pos) {
        super('while', begin, end);
        this.condition = condition;
        this.body = body;
    }
}

export class IfElseNode extends Node implements BlockStatement {
    public condition: ValueNode;
    public truthy: BlockStatement;
    public falsy: BlockStatement;

    constructor (condition: ValueNode, truthy: BlockStatement, falsy: BlockStatement, begin: Pos, end: Pos) {
        super('if_else', begin, end);
        this.condition = condition;
        this.truthy = truthy;
        this.falsy = falsy;
    }

    public static from(ifNode: IfNode, falsy: BlockStatement, end: Pos) {
        return new IfElseNode(ifNode.condition, ifNode.truthy, falsy, ifNode.begin, end);
    }
}

export class IfNode extends Node implements BlockStatement {
    public condition: ValueNode;
    public truthy: BlockStatement;

    constructor (condition: ValueNode, truthy: BlockStatement, begin: Pos, end: Pos) {
        super('if', begin, end);
        this.condition = condition;
        this.truthy = truthy;
    }
}

export class DeclarationNode extends Node implements BlockStatement, ToplevelStatement {
    public name: string;
    public value: ValueNode;

    constructor (name: string, value: ValueNode, begin: Pos, end: Pos) {
        super('declaration', begin, end);
        this.name = name;
        this.value = value;
    }
}

export class AssigmentNode extends Node implements BlockStatement {
    public name: string;
    public value: ValueNode;

    constructor (name: string, value: ValueNode, begin: Pos, end: Pos) {
        super('assignment', begin, end);
        this.name = name;
        this.value = value;
    }
}

export class ReturnNode extends Node implements BlockStatement {
    public value: ValueNode;
    
    constructor (value: ValueNode, begin: Pos, end: Pos) {
        super('return', begin, end);
        this.value = value;
    }
}

export class AccessNode extends Node {
    public name: string;

    constructor (name: string, begin: Pos, end: Pos) {
        super('access', begin, end);
        this.name = name;
    }
}

export class CallNode extends Node implements BlockStatement {
    public name: string;
    public args: ValueNode[];

    constructor (name: string, args: ValueNode[], begin: Pos, end: Pos) {
        super('call', begin, end);
        this.name = name;
        this.args = args;
    }
}

export class BinaryOperationNode extends Node {
    public left: ValueNode;
    public right: ValueNode;
    
    constructor (type: string, left: ValueNode, right: ValueNode, begin: Pos, end: Pos) {
        super(type, begin, end);
        this.left = left;
        this.right = right;
    }
}

export class AdditionNode extends BinaryOperationNode {
    constructor (left: ValueNode, right: ValueNode, begin: Pos, end: Pos) {
        super('add', left, right, begin, end);
    }
}

export class SubtractionNode extends BinaryOperationNode {
    constructor (left: ValueNode, right: ValueNode, begin: Pos, end: Pos) {
        super('sub', left, right, begin, end);
    }
}

export class UnaryNode extends Node {
    public value: ValueNode;
    
    constructor (value: ValueNode, begin: Pos, end: Pos) {
        super('unary', begin, end);
        this.value = value;
    }
}

export class HexNode extends ValueNode {
    constructor(token: Token, pos: Pos) {
        super('hex', token, pos);
    }
}

export class IntNode extends ValueNode {
    constructor(token: Token, pos: Pos) {
        super('int', token, pos);
    }
}

