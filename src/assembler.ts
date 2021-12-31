import { writeFileSync } from "fs";
import { Grammar, Parser } from "nearley";
import { assembleToBrainfuck } from "./assemblers/toBrainfuck";
import imlgrammar from "./imlgrammar";

export type Reg = {
    type: 'reg',
    value: 'a' | 'b' | 'c' | 'd' | 'l' | 'h',
}

export type Imm8 = {
    type: 'imm8',
    value: number
}

export type Imm16 = {
    type: 'imm16',
    value: number
}

export type Instruction = {
    type: 'instruction',
    name: string,
    dest: Reg | Imm8 | Imm16 | null,
    src: Reg | Imm8 | Imm16 | null,
}

const parseAssembly = (program: string): Instruction[] => {
    const parser = new Parser(Grammar.fromCompiled(imlgrammar));
    parser.feed(program);
    writeFileSync('imlast.json', JSON.stringify(parser.results, null, 4));
    return parser.results[0];
}

const program = `
push 0x45
lstart
mov a, -255
output a
lend
`;

export const assemble = (): string => {
    const ast = parseAssembly(program);
    const res = assembleToBrainfuck(ast);
    return res;
}


