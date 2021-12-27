import { readFile, writeFile } from "fs/promises";
import { Grammar, Parser } from "nearley";
import CompiledGrammar from "./grammar";

const getFileContent = async () => {
    if (process.argv.length < 3) throw new Error('not enough args')
    const filename = process.argv[2];
    return (await readFile(filename)).toString();
}

const main = async () => {
    const text = await getFileContent();
    const parser = new Parser(Grammar.fromCompiled(CompiledGrammar));
    parser.feed(text);
    const ast = parser.results[0];
    await writeFile('ast.json', JSON.stringify(ast, null, 4));
}

main();