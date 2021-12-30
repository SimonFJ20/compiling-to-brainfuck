import { writeFileSync } from "fs";
import { Grammar, Parser } from "nearley";
import imlgrammar from "./imlgrammar";

export const assembleToBrainfuck = (program: string): string => {
    const parser = new Parser(Grammar.fromCompiled(imlgrammar));
    parser.feed(program);
    const ast = parser.results[0];
    writeFileSync('imlast.json', JSON.stringify(ast, null, 4));

    return ''
}

const program = `(65535)`;

export const testAssembler = () => {
    const res = assembleToBrainfuck(program);
}
