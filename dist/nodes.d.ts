declare type Token = {
    type: string;
    value: string;
    text: string;
    offset: number;
    lineBreaks: number;
    line: number;
    col: number;
};
export declare class Pos {
    line: number;
    column: number;
    length: number;
    constructor(line: number, column: number, length: number);
    static from(token: Token): Pos;
}
export declare abstract class Node {
    type: string;
    begin: Pos;
    end: Pos;
    constructor(type: string, begin: Pos, end: Pos);
}
export declare abstract class ValueNode extends Node {
    valueType: string;
    value: string;
    constructor(valueType: string, token: Token, pos: Pos);
}
interface ToplevelStatement {
}
export declare class FileNode extends Node {
    namespace: NamespaceNode;
    statements: ToplevelStatement[];
    constructor(namespace: NamespaceNode, statements: ToplevelStatement[], begin: Pos, end: Pos);
}
export declare class NamespaceNode extends Node implements ToplevelStatement {
    name: string;
    constructor(name: string, begin: Pos, end: Pos);
}
export declare class ImportNode extends Node implements ToplevelStatement {
    name: string;
    constructor(name: string, begin: Pos, end: Pos);
}
export declare class DefinitionNode extends Node implements ToplevelStatement {
    name: string;
    args: string[];
    body: BlockNode;
    constructor(name: string, args: string[], body: BlockNode, begin: Pos, end: Pos);
}
interface BlockStatement {
}
export declare class BlockNode extends Node implements BlockStatement {
    nodes: BlockStatement[];
    constructor(nodes: Node[], begin: Pos, end: Pos);
}
export declare class WhileNode extends Node implements BlockStatement {
    condition: ValueNode;
    body: BlockStatement;
    constructor(condition: ValueNode, body: BlockStatement, begin: Pos, end: Pos);
}
export declare class IfElseNode extends Node implements BlockStatement {
    condition: ValueNode;
    truthy: BlockStatement;
    falsy: BlockStatement;
    constructor(condition: ValueNode, truthy: BlockStatement, falsy: BlockStatement, begin: Pos, end: Pos);
    static from(ifNode: IfNode, falsy: BlockStatement, end: Pos): IfElseNode;
}
export declare class IfNode extends Node implements BlockStatement {
    condition: ValueNode;
    truthy: BlockStatement;
    constructor(condition: ValueNode, truthy: BlockStatement, begin: Pos, end: Pos);
}
export declare class DeclarationNode extends Node implements BlockStatement, ToplevelStatement {
    name: string;
    value: ValueNode;
    constructor(name: string, value: ValueNode, begin: Pos, end: Pos);
}
export declare class AssigmentNode extends Node implements BlockStatement {
    name: string;
    value: ValueNode;
    constructor(name: string, value: ValueNode, begin: Pos, end: Pos);
}
export declare class ReturnNode extends Node implements BlockStatement {
    value: ValueNode;
    constructor(value: ValueNode, begin: Pos, end: Pos);
}
export declare class AccessNode extends Node {
    name: string;
    constructor(name: string, begin: Pos, end: Pos);
}
export declare class CallNode extends Node implements BlockStatement {
    name: string;
    args: ValueNode[];
    constructor(name: string, args: ValueNode[], begin: Pos, end: Pos);
}
export declare class BinaryOperationNode extends Node {
    left: ValueNode;
    right: ValueNode;
    constructor(type: string, left: ValueNode, right: ValueNode, begin: Pos, end: Pos);
}
export declare class AdditionNode extends BinaryOperationNode {
    constructor(left: ValueNode, right: ValueNode, begin: Pos, end: Pos);
}
export declare class SubtractionNode extends BinaryOperationNode {
    constructor(left: ValueNode, right: ValueNode, begin: Pos, end: Pos);
}
export declare class UnaryNode extends Node {
    value: ValueNode;
    constructor(value: ValueNode, begin: Pos, end: Pos);
}
export declare class HexNode extends ValueNode {
    constructor(token: Token, pos: Pos);
}
export declare class IntNode extends ValueNode {
    constructor(token: Token, pos: Pos);
}
export {};
