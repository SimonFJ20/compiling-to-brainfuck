import { readFile, writeFile, stat } from "fs/promises";
import { Grammar, Parser } from "nearley";
import { assembleCrasmToBrainfuck } from "./crasm";
import { crustlAstToBrainfuck } from "./brainfuck";
import { exit } from "process";
import { compileCrustlToBrainfuckDirectly, compileCrustlToCrasm, parseCrustlToAST } from "./crustl";


const cliHelpMessage = () => `
CRUSTL Compiler
Usage: crustl [options] file
    Replace 'crustl' with 'npm run start', 'yarn start', 'node .' or whatever.
Options:
    --help\t\tDisplay this message.
    --lang=<language>\tLanguage of the input file, 'crustl' or 'crasm', default is 'crustl'.
    --target=<target>\tTarget file, 'brainfuck', 'crasm', 'crustl-ast', default is 'brainfuck'.
    --emit-asm\t\tEmit intermidiary crasm file.
    --no-bin\t\tDont emit target file.
    --debug\t\tEmits debug friendly output.
    --legacy-direct\tUse deprecated direct compilation from crustl to brainfuck.
`.slice(1, -1);

const getArgs = () =>
    process.argv.filter(v => !/[(?:node)(?:main\.js)]$/.test(v));
const checkHelpArg = (args: string[]) => {
    if (args.includes('--help')) {
        console.log(cliHelpMessage());
        process.exit(0);
    }
}
const getLangFromArgs = (args: string[]): 'crustl' | 'crasm' => {
    const langArgRegex = /^\-\-lang='?(.*?)'?/;
    const langArgs = args.filter(arg => langArgRegex.test(arg));
    if (langArgs.length > 1) {
        console.error('fatal: only 1 language can be specified');
        process.exit(1);
    }
    if (langArgs[0] === undefined) return 'crustl';
    const langMatch = langArgs[0].match(langArgRegex);
    const lang = langMatch ? langMatch[1] : null;
    if (!lang || lang === 'crustl') {
        return 'crustl';
    } else if (lang === 'crasm') {
        return 'crasm';
    } else {
        console.error(`fatal: invalid value '${lang}' on arg '${langArgs[0]}'`);
        process.exit(1);
    }
}
const getTargetsFromArgs = (args: string[]) => {
    const targetArgRegex = /^\-\-target='?(.*?)'?/;
    const targetArgs = args.filter(arg => targetArgRegex.test(arg));
    const targets = targetArgs
        .map(a => a.match(targetArgRegex))
        .filter(a => a !== null)
        .map(a => a![1]);
    targets.forEach((v, i) => {
        if (typeof v === 'string'
            && !['brainfuck', 'crasm', 'crust-asm'].includes(v)) {
            console.error(`fatal: unknown target '${v}' on arg '${targetArgs[i]}'`);
            process.exit(1);
        }
    });
    if (targets.length === 0) targets.push('brainfuck');
    return targets as ('brainfuck' | 'crasm' | 'crustl-ast')[];
}
const checkLangTargetMatch = (lang: 'crustl' | 'crasm', targets: ('brainfuck' | 'crasm' | 'crustl-ast')[]) => {
    if (lang === 'crasm' && targets.includes('crustl-ast')) {
        console.error(`fatal: cannot use '--target=crustl-ast' when using '--lang=crasm'`);
        process.exit(1);
    }
}
const getLegacyDirectArgs = (args: string[], targets: ('brainfuck' | 'crasm' | 'crustl-ast')[]) => {
    if (args.includes('--legacy-direct')) {
        if (targets.filter(t => t !== 'brainfuck').length != 0) {
            console.error(`fatal: using '--legacy-direct' with other targets`
            + ` than 'brainfuck' is illegal on arg '${args.find(a => a === '--legacy-direct')![0]}'`);
            process.exit(1);
        }
        return true;
    }
    return false;
}
const checkEmitAsmArg = (args: string[]) => args.includes('--emit-asm');
const checkNoBinArg = (args: string[]) => args.includes('--no-bin');
const checkDebugArg = (args: string[]) => args.includes('--debug');
const getFilenames = (args: string[]) => args.filter(v => !/^\-/.test(v));
const checkInputFiles = (filenames: string[]) => {
    if (filenames.length === 0) {
        console.error('fatal: no input files');
        process.exit(1);
    }
}
const readInputFiles = async (inputNames: string[]) => {
    const fileIndeces = (await Promise.all(inputNames.map(fn => stat(fn)))).map((v, i) => v.isFile());
    return Promise.all(
        inputNames
            .filter((v, i) => fileIndeces[i])
            .map(async f => (await readFile(f)).toString())
    )
}

const main = async () => {
    const args = getArgs();
    checkHelpArg(args);
    const lang = getLangFromArgs(args);
    const targets = getTargetsFromArgs(args);
    checkLangTargetMatch(lang, targets);
    const useLegacyDirect = getLegacyDirectArgs(args, targets);
    const useEmitAsm = checkEmitAsmArg(args);
    const useNoBin = checkNoBinArg(args);
    const useDebug = checkDebugArg(args);
    const filenames = getFilenames(args);
    checkInputFiles(filenames);
    const inputFiles = await readInputFiles(filenames);

    if (lang === 'crustl') {
        const crustl = inputFiles[0];
        const ast = parseCrustlToAST(crustl);
        if (targets.includes('crustl-ast'))
            await writeFile('crustl-ast.gen.json', JSON.stringify(ast, null, 4));
        if (targets.includes('crasm') || targets.includes('brainfuck') && !useLegacyDirect) {
            const crasm = compileCrustlToCrasm(ast);
            if (targets.includes('crasm'))
                await writeFile('out.crasm', crasm);
            if (targets.includes('brainfuck')) {
                const brainfuck = assembleCrasmToBrainfuck(crasm);
                await writeFile('out.bf', brainfuck);
            }
        } else if (useLegacyDirect) {
            const brainfuck = compileCrustlToBrainfuckDirectly(ast);
            await writeFile('out.bf', brainfuck);
        }
    } else if (lang === 'crasm') {
        const crasm = inputFiles[0];
        if (targets.includes('crasm'))
            await writeFile('out.crasm', crasm);
        if (targets.includes('brainfuck')) {
            const brainfuck = assembleCrasmToBrainfuck(crasm);
            await writeFile('out.bf', brainfuck);
        }
    }
}

main().catch((catched) => {
    if (!(catched instanceof Error)) throw catched;
    const error = catched as Error;
    error.stack = error.stack?.replaceAll('/home/simon/Workspace/crustl/', '');
    console.error(error);
})
