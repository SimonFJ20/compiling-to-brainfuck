import { toCrasm } from "./crustl/toCrasm";
import { Parser, Grammar } from "nearley";
import { crustlAstToBrainfuck } from "./brainfuck";
import CompiledCrustlGrammar from "./crustl_grammar.gen";
import { FileNode } from "./nodes";

export const parseCrustlToAST = (program: string): FileNode => {
    const parser = new Parser(Grammar.fromCompiled(CompiledCrustlGrammar));
    parser.feed(program);
    console.log(parser.results)
    return parser.results[0];
}

export const compileCrustlToBrainfuckDirectly = (ast: any): string => {
    return crustlAstToBrainfuck([ast]);
}

export const compileCrustlToCrasm = (ast: any): string => {
    return toCrasm(ast);
}
