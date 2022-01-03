import { Imm16, Imm8, Instruction, Reg } from "../crasm"

const MEM = {
    'MOVE_BUFFER':          0x0000,
    'CONDITIONAL_BUFFER':   0x0001,
    'a':    0x0002,
    'b':    0x0003,
    'c':    0x0004,
    'd':    0x0005,
    'l':    0x0006,
    'h':    0x0007,
    'STACK_END':    0x0008,
    'STACK_START':  0x00FF,
    'HEAP_START':   0x0100,
} as const;

const HEAP_ILS = 6 as const; // HEAP INDIVIUAL LOCATION SIZE

const l = (amount: number) => '<'.repeat(amount);
const r = (amount: number) => '>'.repeat(amount);
const add = (amount: number) => '+'.repeat(amount);
const sub = (amount: number) => '-'.repeat(amount);

const rlInvert = (action: string) => action.replaceAll('<', '#').replaceAll('>', '<').replaceAll('#', '>');

const regLoc = (reg: any) => MEM[(reg as Reg).value]

const doAt = (location: number, action: string) => `
    ${r(location)}
    ${action}
    ${l(location)}
`;
const doAtReg = (reg: Reg, action: string) => doAt(MEM[(reg as Reg).value], action);

const doAwayFrom = (location: number, action: string) => `
    ${l(location)}
    ${action}
    ${r(location)}
`;
const doAwayFromReg = (reg: Reg, action: string) => doAwayFrom(MEM[(reg as Reg).value], action);


const loopAt = (location: number, action: string) => doAt(location, `[${action}]`)
const loopAtMB = (action: string) => loopAt(0, action);
const loopAtReg = (reg: Reg, action: string) => loopAt(MEM[(reg as Reg).value], action);

const reset = (location: number) => doAt(location, '[-]');
const resetReg = (reg: Reg) => doAtReg(reg, '[-]');

const increment = (location: number) => doAt(location, '+');
const decrement = (location: number) => doAt(location, '-');

const incrementReg = (reg: Reg, amount: number = 1) => `
    ${doAtReg(reg, add(amount))}
`;

const decrementReg = (reg: Reg, amount: number = 1) => `
    ${doAtReg(reg, sub(amount))}
`;

const setRegToValue = (reg: Reg, value: number) => `
    ${resetReg(reg)}
    ${incrementReg(reg, value)}
`;

const moveRegToMBWhileDoing = (reg: Reg, action: string) => `
    ${loopAtReg(reg, `
        ${doAwayFromReg(reg, `
            +
            ${action}
        `)}
        -
    `)}
`;

const moveWhileDoing = (dest: number, src: number, action: string) => `
    ${loopAt(src, `
        ${doAwayFrom(src, `
            ${doAt(dest, '+')}
            ${action}
        `)}
        -
    `)}
`;
const move = (dest: number, src: number) => moveWhileDoing(dest, src, '');
const moveRegToMB = (reg: Reg) => moveRegToMBWhileDoing(reg, '');
const moveMBToReg = (reg: Reg) => `
    ${loopAtMB(`
        ${incrementReg(reg)}
        -
    `)}
`;

const copy = (dest: number, src: number) => `
    ${reset(MEM['MOVE_BUFFER'])}
    ${reset(dest)}
    ${moveWhileDoing(MEM['MOVE_BUFFER'], src, increment(dest))}
    ${move(src, MEM['MOVE_BUFFER'])}
`;

const copyRegToReg = (dest: Reg, src: Reg) => `
    ${reset(MEM['MOVE_BUFFER'])}
    ${resetReg(dest)}
    ${moveRegToMBWhileDoing(src, incrementReg(dest))}
    ${moveMBToReg(src)}
`;

const copyRegToCB = (src: Reg) => `
    ${reset(MEM['MOVE_BUFFER'])}
    ${reset(MEM['CONDITIONAL_BUFFER'])}
    ${moveRegToMBWhileDoing(src, doAt(MEM['CONDITIONAL_BUFFER'], '+'))}
    ${moveMBToReg(src)}
`;

const addRegToReg = (dest: Reg, src: Reg) => `
    ${reset(MEM['MOVE_BUFFER'])}
    ${moveRegToMBWhileDoing(src, incrementReg(dest))}
    ${moveMBToReg(src)}
`;

const subtractRegFromReg = (dest: Reg, src: Reg) => `
    ${reset(MEM['MOVE_BUFFER'])}
    ${moveRegToMBWhileDoing(src, decrementReg(dest))}
    ${moveMBToReg(src)}
`;

const startLoopWithValue = (value: number) => `
    ${reset(MEM['CONDITIONAL_BUFFER'])}
    ${r(MEM['CONDITIONAL_BUFFER'])}
    ${add(value)}
    [
        ${l(MEM['CONDITIONAL_BUFFER'])}
`;

const startLoopWithReg = (reg: Reg) => `
    ${copyRegToCB(reg)}
    ${r(MEM['CONDITIONAL_BUFFER'])}
    [
        ${l(MEM['CONDITIONAL_BUFFER'])}
`;

const endLoopWithValue = (value: number) => `
        ${reset(MEM['CONDITIONAL_BUFFER'])}
        ${r(MEM['CONDITIONAL_BUFFER'])}
        ${add(value)}
    ]
    ${l(MEM['CONDITIONAL_BUFFER'])}
`;

const endLoopWithReg = (reg: Reg) => `
        ${copyRegToCB(reg)}
        ${r(MEM['CONDITIONAL_BUFFER'])}
    ]
    ${l(MEM['CONDITIONAL_BUFFER'])}
`;

const outputImm8 = (value: number) => `
    ${reset(MEM['MOVE_BUFFER'])}
    ${add(value)}
    .
`;

const lwReg_moveValuesTo_HEAP_START_TransferLocation = () => `
    // prepare values at HEAP_START for transfer
    ${copy(MEM['h'], MEM['HEAP_START'] + 2)}
    ${copy(MEM['l'], MEM['HEAP_START'] + 3)}
    ${copy(MEM['h'], MEM['HEAP_START'] + 4)}
    ${copy(MEM['l'], MEM['HEAP_START'] + 5)}
`;

const lwReg_move_execution_OH_OL_IH_IL_ToTarget_H_Index = () => `
    ${loopAt(2, ` // move self and values to target H index
        ${doAwayFrom(2, ` // move values to next H index
            ${move(0x0100 * HEAP_ILS + 2, 2)}
            ${move(0x0100 * HEAP_ILS + 3, 3)}
            ${move(0x0100 * HEAP_ILS + 4, 4)}
            ${move(0x0100 * HEAP_ILS + 5, 5)}
        `)}
        ${r(0x0100 * HEAP_ILS)} // go to next H index
        - // decrement OH
    `)}
`;

const lwReg_move_execution_OL_IH_IL_ToTarget_L_Index = () => `
    ${loopAt(3, ` // move self and values to target L index
        ${doAwayFrom(3, ` // move values to next L index
            ${move(HEAP_ILS + 3, 3)}
            ${move(HEAP_ILS + 4, 4)}
            ${move(HEAP_ILS + 5, 5)}
        `)}
        ${r(HEAP_ILS)} // go to next L index
        - // decrement OL
    `)}
`;

const lwReg_move_execution_T_IH_IL_To_L_ZeroIndex = () => `
    ${loopAt(5, ` // return to L=0
        ${doAwayFrom(5, ` // move values to prev L index
            ${rlInvert(move(HEAP_ILS + 1, 1))}
            ${rlInvert(move(HEAP_ILS + 4, 4))}
            ${rlInvert(move(HEAP_ILS + 5, 5))}
        `)}
        ${l(HEAP_ILS)} // go to prev L index
        - // decrement IL
    `)}
`;

const lwReg_move_execution_T_IL_To_H_ZeroIndex = () => `
    ${loopAt(4, ` // return to H=0
        ${doAwayFrom(4, ` // move values to prev H index
            ${rlInvert(move(HEAP_ILS + 1, 1))}
            ${rlInvert(move(HEAP_ILS + 4, 4))}
        `)}
        ${l(0x0100 * HEAP_ILS)} // go to prev H index
        - // decrement IH
    `)}
`;

const lwReg_transferValus = () => `
    ${doAt(MEM['HEAP_START'], ` // relative to HEAP_START
        // T is garbage
        ${lwReg_move_execution_OH_OL_IH_IL_ToTarget_H_Index()}
        // OH is garbage
        ${lwReg_move_execution_OL_IH_IL_ToTarget_L_Index()}
        // OL is garbage
        ${move(1, 0)} // move V to T
        // T is no longer garbage
        ${lwReg_move_execution_T_IH_IL_To_L_ZeroIndex()}
        // IL is now garbage
        ${lwReg_move_execution_T_IL_To_H_ZeroIndex()}
        // OH is now garbage
    `)}
`;

const lwReg_moveTranferred_T_ToDestReg = (dest: Reg) => `
    // move T to dest reg
    ${move(MEM['HEAP_START'] + 1, regLoc(dest))}
`;

const loadWordAtHL = (dest: Reg) => `
    ${lwReg_moveValuesTo_HEAP_START_TransferLocation()}
    ${lwReg_transferValus()}
    ${lwReg_moveTranferred_T_ToDestReg(dest)}
`;

const swReg_moveValuesTo_HEAP_START_TransferLocation = (src: Reg) => `
    // move values to HEAP_START transfor location
    ${copy(regLoc(src), MEM['HEAP_START'] + 1)}
    ${copy(MEM['h'], MEM['HEAP_START'] + 2)}
    ${copy(MEM['l'], MEM['HEAP_START'] + 3)}
    ${copy(MEM['h'], MEM['HEAP_START'] + 4)}
    ${copy(MEM['l'], MEM['HEAP_START'] + 5)}
`;

const swReg_move_execution_T_OH_OL_IH_IL_ToTarget_H_Index = () => `
    ${loopAt(2, ` // move self and values to target H index
        ${doAwayFrom(2, ` // move values to next H index
            ${move(0x0100 * HEAP_ILS + 1, 1)}
            ${move(0x0100 * HEAP_ILS + 2, 2)}
            ${move(0x0100 * HEAP_ILS + 3, 3)}
            ${move(0x0100 * HEAP_ILS + 4, 4)}
            ${move(0x0100 * HEAP_ILS + 5, 5)}
        `)}
        ${r(0x0100 * HEAP_ILS)} // go to next H index
        - // decrement OH
    `)}
`;

const swReg_move_execution_T_OL_IH_IL_ToTarget_L_Index = () => `
    ${loopAt(3, ` // move self and values to target L index
        ${doAwayFrom(3, ` // move values to next L index
            ${move(HEAP_ILS + 1, 1)}
            ${move(HEAP_ILS + 3, 3)}
            ${move(HEAP_ILS + 4, 4)}
            ${move(HEAP_ILS + 5, 5)}
        `)}
        ${r(HEAP_ILS)} // go to next L index
        - // decrement OL
    `)}
`;

const swReg_move_execution_IH_IL_To_L_ZeroIndex = () => `
    ${loopAt(5, ` // return to L=0
        ${doAwayFrom(5, ` // move values to prev L index
            ${rlInvert(move(HEAP_ILS + 4, 4))}
            ${rlInvert(move(HEAP_ILS + 5, 5))}
        `)}
        ${l(HEAP_ILS)} // go to prev L index
        - // decrement IL
    `)}
`;

const swReg_move_execution_IL_To_L_ZeroIndex = () => `
    ${loopAt(4, ` // return to H=0
        ${doAwayFrom(4, ` // move values to prev H index
            ${rlInvert(move(HEAP_ILS + 4, 4))}
        `)}
        ${l(0x0100 * HEAP_ILS)} // go to prev H index
        - // decrement IH
    `)}
`;

const swReg_transferValue = () => `
    ${doAt(MEM['HEAP_START'], ` // relative to HEAP_START
        ${swReg_move_execution_T_OH_OL_IH_IL_ToTarget_H_Index()}
        // OH is now garbage
        ${swReg_move_execution_T_OL_IH_IL_ToTarget_L_Index()}
        // at target location
        // OL is now garbage
        ${move(0, 1)} // move T to V
        // T is now garbage
        ${swReg_move_execution_IH_IL_To_L_ZeroIndex()}
        // IL is now garbage
        ${swReg_move_execution_IL_To_L_ZeroIndex()}
    `)}
`;

const storeWordAtHL = (src: Reg) => `
    ${swReg_moveValuesTo_HEAP_START_TransferLocation(src)}
    ${swReg_transferValue()}
`;

const assemblePushImm8 = (value: number) => `
    ${doAt(MEM['STACK_END'], `
        [>] // hit top of stack
        ${add(value)} // place value
        < [+] // reset new top to 0 (positive increment because its probably 255)
        [<] // go back to STACK_END
    `)}
`;

const pushReg_findTop = () => `
    // find the top
    [
        // copy value from last position to current
        [+]
        ${rlInvert(move(0, 1))}
        ${rlInvert(doAt(1, `[-]-`))}
        
        >
    ]
`;

const assemblePushReg = (reg: Reg) => `
    // push_reg
    ${copy(MEM['STACK_END'] + 1, MEM[reg.value])}
    ${doAt(MEM['STACK_END'], `
        // go to first empty
        >>
        ${pushReg_findTop()}
        // copy value from last position to current
        [+]
        ${rlInvert(move(0, 1))}
        // set top to 0
        ${rlInvert(doAt(1, `[-]`))}
        <<
        [<]
    `)}
`;

const pop_findTopOfStack = () => `[>]`;

const pop_swapValueAndTop = () => `${move(0, 1)}`

const pop_moveValueToStackEnd = () => `
    [ // move value stopping at STACK_END
        ${move(0, 1)}
        ${doAt(1, '-')} // reset to 255
        <
    ]
`;

const pop_doStackOperation = () => `
    ${doAt(MEM['STACK_END'], `
        // relpos
        > // skip looper stopper at STACK_END
        ${pop_findTopOfStack()}
        ${pop_swapValueAndTop()}
        < // go to void left for value
        ${pop_moveValueToStackEnd()}
    `)}
`;

const assemblePopReg = (reg: Reg) => `
    // pop_reg
    ${pop_doStackOperation()}
    ${move(MEM[reg.value], MEM['STACK_END'] + 1)}
    ${doAt(MEM['STACK_END'] + 1, '-')} // reset to 255
`;

const assembleLoadWord = (lw: Instruction): string => {
    if (lw.dest?.type === 'reg')
        if (lw.src?.type === 'imm16')
            return copy(MEM[lw.dest.value], lw.src.value * HEAP_ILS)
        else
            // before editing, please read 'intermidlang:spec'
            // specifically 'BRAINFUCK ASSEMBLER SPECIFIC'
            // because this is a bit complicated
            return loadWordAtHL(lw.dest);
    throw new Error('not implemented');
}

const assembleStoreWord = (sw: Instruction): string => {
    if (sw.src?.type === 'reg')
        if (sw.dest?.type === 'imm16')
            return copy(sw.dest.value * HEAP_ILS, MEM[sw.src.value]);
        else
            // before editing, please read 'intermidlang:spec'
            // specifically 'BRAINFUCK ASSEMBLER SPECIFIC'
            // because this is a bit complicated
            return storeWordAtHL(sw.src);
    throw new Error('not implemented');
}

const assembleMove = (mov: Instruction): string => {
    if (mov.dest?.type === 'reg')
        if (mov.src?.type === 'imm8')
            return setRegToValue(mov.dest, mov.src.value)
        else if (mov.src?.type === 'reg')
            return copyRegToReg(mov.dest, mov.src);
    throw new Error('not implemented');
}

const assemblePush = (push: Instruction): string => {
    if (push.src?.type === 'imm8')
        return assemblePushImm8(push.src.value);
    else if (push.src?.type === 'reg')
        return assemblePushReg(push.src);
    throw new Error('not implemented');
}

const assemblePop = (pop: Instruction): string => {
    if (pop.dest?.type === 'reg')
        return assemblePopReg(pop.dest);
    throw new Error('not implemented');
}

const assembleAdd = (add: Instruction): string => {
    if (add.dest?.type === 'reg')
        if (add.src?.type === 'imm8')
            return incrementReg(add.dest, add.src.value);
        else if (add.src?.type === 'reg')
            return addRegToReg(add.dest, add.src);
    throw new Error('not implemented');
}
const assembleSub = (sub: Instruction): string => {
    if (sub.dest?.type === 'reg')
        if (sub.src?.type === 'imm8')
            return incrementReg(sub.dest, sub.src.value);
        else if (sub.src?.type === 'reg')
            return subtractRegFromReg(sub.dest, sub.src);
    throw new Error('not implemented');
}

const assembleLstart = (lstart: Instruction): string => {
    if (lstart.src?.type === 'imm8')
        return startLoopWithValue(lstart.src.value);
    else if (lstart.src?.type === 'reg')
        return startLoopWithReg(lstart.src);
    throw new Error('not implemented');
}

const assembleLend = (lend: Instruction): string => {
    if (lend.src?.type === 'imm8')
        return endLoopWithValue(lend.src.value);
    else if (lend.src?.type === 'reg')
        return endLoopWithReg(lend.src);
    throw new Error('not implemented');
}

const assembleInput = (input: Instruction): string => {
    if (input.dest?.type === 'reg')
        return doAtReg(input.dest, ',');
    throw new Error('not implemented');
}

const assembleOutput = (output: Instruction): string => {
    if (output.src?.type === 'imm8')
        return outputImm8(output.src.value);
    else if (output.src?.type === 'reg')
        return doAtReg(output.src, '.');
    throw new Error('not implemented');
}

const assembleInstruction = (instruction: Instruction): string => {
    switch (instruction.name) {
        case 'lw':      return assembleLoadWord(instruction);
        case 'sw':      return assembleStoreWord(instruction);
        case 'mov':     return assembleMove(instruction);
        case 'push':    return assemblePush(instruction);
        case 'pop':     return assemblePop(instruction);
        case 'add':     return assembleAdd(instruction);
        case 'sub':     return assembleSub(instruction);
        case 'lstart':  return assembleLstart(instruction);
        case 'lend':    return assembleLend(instruction);
        case 'input':   return assembleInput(instruction);
        case 'output':  return assembleOutput(instruction);
    }
    throw new Error(`unknown instruction '${instruction.name}'`)
}

const initializeStack = () => {
    // if its needed to clear the stack, insert [-] somewhere here
    // REMEMBER: inward growing stack, meaning starting right, growing left
    return `
        ${doAt(MEM['STACK_START'], '+')} // set STACK_START to 1
        ${doAt(MEM['STACK_END'], `
            > [-] -     // skip STACK_END and change value to 255
            [ > - ]     // change all values from 0 to 255 on all slots
                        // stopping at STACK_START
                        // because instead of 0 to 255 its 1 to 0
            < [<]       // go back until hitting loop stopper at STACK_END
        `)}
    `;
}

export const assembleToBrainfuck = (program: Instruction[], debug: boolean = false): string => {
    const userProgram = program.map(instruction => assembleInstruction(instruction)).join('');
    const out = initializeStack() + userProgram
    if (debug) {
        return out
        .replace(/\s/g, '')
        .replace(/^    /gm, '')
        ;
    } else {
        return out
        .replace(/^    /gm, '')
        ;
    }
}


