import { AccessNode, BlockNode, CallNode, DefinitionNode, IntNode, Pos, ReturnNode, StringNode, ValueNode } from "./nodes";

export const stddefs = (): DefinitionNode[] => {
    const np = new Pos(0, 0, 0);
    return [
        new DefinitionNode(
            '__input__',
            [],
            new BlockNode(
                [
                    new CallNode(
                        '__push__',
                        [
                            new IntNode({
                                col: 0,
                                line: 0,
                                lineBreaks: 0,
                                offset: 0,
                                type: 'int',
                                text: '0',
                                value: '0'
                            }, np)
                        ],
                    np, np),
                    new ReturnNode(
                        new CallNode(
                            '__brainfuck__',
                            [
                                new StringNode({
                                    col: 0,
                                    line: 0,
                                    lineBreaks: 0,
                                    offset: 0,
                                    type: 'string',
                                    text: '"$TOSTACK$SPL,$SPR$FROMSTACK"',
                                    value: '$TOSTACK$SPL,$SPR$FROMSTACK'
                                }, np)
                            ],
                        np, np) as any,
                    np, np)
                ],
            np, np),
        np, np),
        new DefinitionNode(
            '__output__',
            ['value'],
            new BlockNode(
                [
                    new CallNode(
                        '__push__',
                        [
                            new AccessNode('value', np, np) as any
                        ],
                    np, np),
                    new CallNode(
                        '__brainfuck__',
                        [
                            new StringNode({
                                col: 0,
                                line: 0,
                                lineBreaks: 0,
                                offset: 0,
                                type: 'string',
                                text: '"$TOSTACK$SPL.$SPR$FROMSTACK"',
                                value: '$TOSTACK$SPL.$SPR$FROMSTACK'
                            }, np)
                        ],
                    np, np),
                ],
            np, np),
        np, np)
    ];
}
