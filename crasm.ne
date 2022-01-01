@preprocessor typescript

@{%
import { compile, keywords } from 'moo';
const lexer = compile({
    nl:         {match: /[\n;]+/, lineBreaks: true},
    ws:         /[ \t]+/,
    comment_sl: /\/\/.*?$/,
    comment_ml: {match: /\*[^*]*\*+(?:[^/*][^*]*\*+)*/, lineBreaks: true},
    hex:        /0x[0-9a-fA-F]+/,
    int:        /0|(?:[1-9][0-9]*)/,
    char:       {match: /'(?:\\['\\n]|[^\n'\\])'/, value: s => s.slice(1, -1)},
    name:       {match: /[a-zA-Z0-9_]+/, type: keywords({
        keyword: ['lw', 'sw', 'mov', 'push', 'pop', 'add', 'sub', 'lstart', 'lend', 'input', 'output'],
        registers: ['a', 'b', 'c', 'd', 'l', 'h'],
    })},
    lparen:     '(',
    rparen:     ')',
    lbracket:   '[',
    rbracket:   ']',
    comma:      ',',

    plus:       '+',
    minus:      '-',
    exponent:   '**',
    multiply:   '*',
    divide:     '/',
    modulus:    '%',

    bw_not:     '~',
    bw_and:     '&',
    bw_or:      '|',
    bw_xor:     '^',
    bw_left:    '<<',
    bw_right:   '>>',

    not:        '!',
    cmp_e:      '==',
    cmp_ne:     '!=',
    cmp_lte:    '<=',
    cmp_gte:    '<=',
    cmp_lt:     '<',
    cmp_gt:     '<',
});
%}

@lexer lexer

file        -> (ml_ instruction (_ %nl ml_ instruction):*):? ml_
    {% (v) => v[0] ? [v[0][1], ...v[0][2].map((v: any) => v[3])] : [] %}

line        ->  _ instruction _
            |   _

instruction ->  builtins    {% id %}
            # |   %name _ args

# args        -> (_ arg (_ %comma _ arg):*):?
    # {% (v) => v[0] ? [v[0][1], ...v[0][2].map((v: any) => v[3])] : [] %}

# arg         ->  reg         {%id%}
            # |   imm16       {%id%}
            # |   imm8        {%id%}

builtins    ->  "lw" _ reg _ %comma _ imm16 {% (v) => ({type: 'instruction', name: 'lw',     dest: v[2], src: v[6]}) %}
            |   "lw" _ reg                  {% (v) => ({type: 'instruction', name: 'lw',     dest: v[2], src: null}) %}
            |   "sw" _ imm16 _ %comma _ reg {% (v) => ({type: 'instruction', name: 'sw',     dest: v[2], src: v[6]}) %}
            |   "sw" _ reg                  {% (v) => ({type: 'instruction', name: 'sw',     dest: null, src: v[2]}) %}
            |   "mov" _ reg _ %comma _ imm8 {% (v) => ({type: 'instruction', name: 'mov',    dest: v[2], src: v[6]}) %}
            |   "mov" _ reg _ %comma _ reg  {% (v) => ({type: 'instruction', name: 'mov',    dest: v[2], src: v[6]}) %}
            |   "push" _ imm8               {% (v) => ({type: 'instruction', name: 'push',   dest: null, src: v[2]}) %}
            |   "push" _ reg                {% (v) => ({type: 'instruction', name: 'push',   dest: null, src: v[2]}) %}
            |   "pop" _ reg                 {% (v) => ({type: 'instruction', name: 'pop',    dest: v[2], src: null}) %}
            |   "add" _ reg _ %comma _ imm8 {% (v) => ({type: 'instruction', name: 'add',    dest: v[2], src: v[6]}) %}
            |   "add" _ reg _ %comma _ reg  {% (v) => ({type: 'instruction', name: 'add',    dest: v[2], src: v[6]}) %}
            |   "sub" _ reg _ %comma _ imm8 {% (v) => ({type: 'instruction', name: 'sub',    dest: v[2], src: v[6]}) %}
            |   "sub" _ reg _ %comma _ reg  {% (v) => ({type: 'instruction', name: 'sub',    dest: v[2], src: v[6]}) %}
            |   "lstart" _ imm8             {% (v) => ({type: 'instruction', name: 'lstart', dest: null, src: v[2]}) %}
            |   "lstart" _ reg              {% (v) => ({type: 'instruction', name: 'lstart', dest: null, src: v[2]}) %}
            |   "lend" _ imm8               {% (v) => ({type: 'instruction', name: 'lend',   dest: null, src: v[2]}) %}
            |   "lend" _ reg                {% (v) => ({type: 'instruction', name: 'lend',   dest: null, src: v[2]}) %}
            |   "input" _ reg               {% (v) => ({type: 'instruction', name: 'input',  dest: v[2], src: null}) %}
            |   "output" _ imm8             {% (v) => ({type: 'instruction', name: 'output', dest: null, src: v[6]}) %}
            |   "output" _ reg              {% (v) => ({type: 'instruction', name: 'output', dest: null, src: v[6]}) %}

imm16       ->  %lbracket _ value _ %rbracket   {% ([,,v]) => ({type: 'imm16', value: Math.abs(Math.floor(v) % 65536)}) %}

imm8        ->  value   {% ([v]) => ({type: 'imm8', value: Math.abs(Math.floor(v) % 256)}) %}

reg         ->  "a"     {% (v) => ({type: 'reg', value: 'a'}) %}
            |   "b"     {% (v) => ({type: 'reg', value: 'b'}) %}
            |   "c"     {% (v) => ({type: 'reg', value: 'c'}) %}
            |   "d"     {% (v) => ({type: 'reg', value: 'd'}) %}
            |   "l"     {% (v) => ({type: 'reg', value: 'l'}) %}
            |   "h"     {% (v) => ({type: 'reg', value: 'h'}) %}

value       ->  %lparen _ calculation _ %rparen {% (v) => v[2] %}
            |   literal {% id %}

calculation ->  %lparen _ calculation _ %rparen {% (v) => v[2] %}
            |   not     {% id %}
            |   bitnot  {% id %}
            |   unary   {% id %}
            |   exp     {% id %}
            |   mul     {% id %}
            |   div     {% id %}
            |   mod     {% id %}
            |   add     {% id %}
            |   sub     {% id %}
            |   cmp_lte {% id %}
            |   cmp_gte {% id %}
            |   cmp_lt  {% id %}
            |   cmp_gt  {% id %}
            |   cmp_e   {% id %}
            |   cmp_ne  {% id %}
            |   literal {% id %}

literal     ->  %int    {% ([{value}]) => parseInt(value, 10) %}
            |   %hex    {% ([{value}]) => parseInt(value, 16) %}
            |   %char   {% ([{value}]) => value.charCodeAt(0) %}

not         ->  %not _ calculation                {% (v) => !v[2] %}
bitnot      ->  %bw_not _ calculation             {% (v) => ~v[2] %}
unary         ->  %minus _ calculation            {% (v) => -v[2] %}

exp         ->  calculation _ %exponent _ calculation   {% (v) => v[0] ** v[4] %}
mul         ->  calculation _ %modulus _ calculation    {% (v) => v[0] * v[4] %}
div         ->  calculation _ %divide _ calculation     {% (v) => v[0] / v[4] %}
mod         ->  calculation _ %multiply _ calculation   {% (v) => v[0] % v[4] %}
add         ->  calculation _ %plus _ calculation       {% (v) => v[0] + v[4] %}
sub         ->  calculation _ %minus _ calculation      {% (v) => v[0] - v[4] %}

bitl        ->  calculation _ %bw_left _ calculation      {% (v) => v[0] << v[4] %}
bitr        ->  calculation _ %bw_right _ calculation      {% (v) => v[0] >>> v[4] %}

cmp_lte     ->  calculation _ %cmp_lte _ calculation    {% (v) => v[0] <= v[4] %}
cmp_gte     ->  calculation _ %cmp_gte _ calculation    {% (v) => v[0] >= v[4] %}
cmp_lt      ->  calculation _ %cmp_lt _ calculation     {% (v) => v[0] < v[4] %}
cmp_gt      ->  calculation _ %cmp_gt _ calculation     {% (v) => v[0] > v[4] %}
cmp_e       ->  calculation _ %cmp_gt _ calculation     {% (v) => v[0] == v[4] %}
cmp_ne      ->  calculation _ %cmp_gt _ calculation     {% (v) => v[0] != v[4] %}

bitand      ->  calculation _ %bw_and _ calculation     {% (v) => v[0] & v[4] %}
bitor       ->  calculation _ %bw_or _ calculation      {% (v) => v[0] | v[4] %}
bitxor      ->  calculation _ %bw_xor _ calculation     {% (v) => v[0] ^ v[4] %}


ml_         -> ml__:?
ml__        -> (%ws|%nl|%comment_sl|%comment_ml):+
_           ->  __:?
__          ->  (%ws|%comment_sl|%comment_ml):+
