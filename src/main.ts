import { readFile, writeFile } from "fs/promises";
import { Grammar, Parser } from "nearley";
import { assemble } from "./assembler";
import { toBrainfuck } from "./brainfuck";
import CompiledGrammar from "./crustl_grammar.gen";

const cliHelpMessage = () => `

`;

const printHelpMessage = () => console.log(cliHelpMessage());

const getFileContent = async () => {
    if (process.argv.length < 3) throw new Error('not enough args')
    const filename = process.argv[2];
    return (await readFile(filename)).toString();
}

const main = async () => {
    // const text = await getFileContent();
    // const parser = new Parser(Grammar.fromCompiled(CompiledGrammar));
    // parser.feed(text);
    // const ast = parser.results[0];
    // await writeFile('crustl-ast.gen.json', JSON.stringify(ast, null, 4));
    // const brainfuck = toBrainfuck([ast]);
    // await writeFile('out.bf', brainfuck);
    assemble()
}

main();
