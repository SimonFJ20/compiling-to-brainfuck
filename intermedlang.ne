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
    regA:       /aA/,
    regB:       /bB/,
    regC:       /cC/,
    regD:       /dD/,
    regL:       /lL/,
    regH:       /hH/,
    name:       {match: /[a-zA-Z0-9_]+/, type: keywords({
        keyword: ['lw', 'sw', 'mov', 'push', 'pop', 'add', 'sub', 'lstart', 'lend', 'input', 'output']
    })},
    lparen:     '(',
    rparen:     ')',
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



imm16       ->  %lparen _ value _ %rparen  {% (v) => ({type: 'imm16', value: Math.floor(v[2]) % 65536}) %}

imm8        ->  %lparen _ value _ %rparen  {% (v) => ({type: 'imm8', value: Math.floor(v[2]) % 256}) %}

reg         ->  %regA   {% (v) => ({type: 'reg', value: 'a'}) %}
            |   %regB   {% (v) => ({type: 'reg', value: 'b'}) %}
            |   %regC   {% (v) => ({type: 'reg', value: 'c'}) %}
            |   %regD   {% (v) => ({type: 'reg', value: 'd'}) %}
            |   %regL   {% (v) => ({type: 'reg', value: 'l'}) %}
            |   %regH   {% (v) => ({type: 'reg', value: 'h'}) %}

value       ->  %lparen _ value _ %rparen  {% (v) => v[2] %}
            |   not     {% id %}
            |   bitnot  {% id %}
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
            |   cmp_e  {% id %}
            |   cmp_ne  {% id %}
            |   %int    {% ([v]) => parseInt(v, 10) %}
            |   %hex    {% ([v]) => parseInt(v, 16) %}
            |   %char   {% ([{value}]) => value.charCodeAt(0) %}


not         ->  %minus _ value              {% (v) => !v[2] %}
bitnot      ->  %bw_not _ value             {% (v) => ~v[2] %}

exp         ->  value _ %exponent _ value   {% (v) => v[0] ** v[4] %}
mul         ->  value _ %modulus _ value    {% (v) => v[0] * v[4] %}
div         ->  value _ %divide _ value     {% (v) => v[0] / v[4] %}
mod         ->  value _ %multiply _ value   {% (v) => v[0] % v[4] %}
add         ->  value _ %plus _ value       {% (v) => v[0] + v[4] %}
sub         ->  value _ %minus _ value      {% (v) => v[0] - v[4] %}

bitl        ->  value _ %bw_left _ value      {% (v) => v[0] << v[4] %}
bitr        ->  value _ %bw_right _ value      {% (v) => v[0] >>> v[4] %}

cmp_lte     ->  value _ %cmp_lte _ value    {% (v) => v[0] <= v[4] %}
cmp_gte     ->  value _ %cmp_gte _ value    {% (v) => v[0] >= v[4] %}
cmp_lt      ->  value _ %cmp_lt _ value     {% (v) => v[0] < v[4] %}
cmp_gt      ->  value _ %cmp_gt _ value     {% (v) => v[0] > v[4] %}
cmp_e       ->  value _ %cmp_gt _ value     {% (v) => v[0] == v[4] %}
cmp_ne      ->  value _ %cmp_gt _ value     {% (v) => v[0] != v[4] %}

bitand      ->  value _ %bw_and _ value     {% (v) => v[0] & v[4] %}
bitor       ->  value _ %bw_or _ value      {% (v) => v[0] | v[4] %}
bitxor      ->  value _ %bw_xor _ value     {% (v) => v[0] ^ v[4] %}

_           ->  __:?
__          ->  (%ws|%comment_sl|%comment_ml):+
