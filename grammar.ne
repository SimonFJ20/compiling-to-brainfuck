@preprocessor typescript

@{%
import { compile, keywords } from 'moo';
const lexer = compile({
    nl:         {match: /[\n;]+/, lineBreaks: true},
    ws:         /[ \t]+/,
    comment_sl: /\/\/.*?$/,
    comment_ml: {match: /\*[^*]*\*+(?:[^/*][^*]*\*+)*/, lineBreaks: true},
    // float:      /\-?(?:(?:0|(?:[1-9][0-9]*))\.[0-9]+)/,
    hex:        /0x[0-9a-fA-F]+/,
    int:        /0|(?:[1-9][0-9]*)/,
    char:       {match: /'(?:\\['\\n]|[^\n'\\])'/, value: s => s.slice(1, -1)},
    string:     {match: /"(?:\\["\\n]|[^\n"\\])*"/, value: s => s.slice(1, -1)},
    name:       {match: /[a-zA-Z0-9_]+/, type: keywords({
        keyword: ['func', 'return', 'let', 'if', 'else', 'while', 'namespace', 'import', 'export']
    })},
    lparen:     '(',
    rparen:     ')',
    lbrace:     '{',
    rbrace:     '}',
    // lbracket:   '[',
    // rbracket:   ']',
    comma:      ',',

    assign:     ':=',

    // not:        '!',
    // cmp_e:      '==',
    // cmp_ne:     '!=',
    // cmp_lt:     '<',
    // cmp_gt:     '<',
    // cmp_lte:    '<=',
    // cmp_gte:    '<=',
    
    plus:       '+',
    minus:      '-',
    // multiply:   '*',
    // divide:     '/',
    // modulus:    '%',

    //qmark:      '?',
    //colon:      ':',
});

import {
    Pos,
    FileNode,
    NamespaceNode,
    ImportNode,
    DefinitionNode,
    WhileNode,
    IfElseNode,
    IfNode,
    BlockNode,
    DeclarationNode,
    AssigmentNode,
    ReturnNode,
    AccessNode,
    CallNode,
    AdditionNode,
    SubtractionNode,
    // UnaryNode,
    HexNode,
    IntNode,
    CharNode,
    StringNode,
} from "./nodes";
%}

@lexer lexer

file        ->  namespace sl_ %nl tllist
    {% (v) => new FileNode(v[0], v[3], v[0].begin, v[3].length > 0 ? v[3][v[3].length-1].end : Pos.from(v[2])) %}

tllist      -> (_ tlstatement (sl_ %nl _ tlstatement):*):?
    {% (v) => v[0] ? [v[0][1], ...v[0][2].map((v: any) => v[3])] : [] %}

tlstatement ->  import      {% id %}
            |   definition  {% id %}
            |   declaration {% id %}

namespace   ->  "namespace" __ %name
    {% (v) => new NamespaceNode(v[2].value, Pos.from(v[0]), Pos.from(v[2])) %}

import      ->  "import" __ %name
    {% (v) => new ImportNode(v[2].value, Pos.from(v[0]), Pos.from(v[2])) %}

definition  ->  "func" __ %name _ %lparen namelist %rparen _ block
    {% (v) => new DefinitionNode(v[2].value, v[5], v[8], Pos.from(v[0]), v[8].end) %}

namelist    ->  (_ %name (_ %comma _ %name):*):? _
    {% (v) => v[0] ? [v[0][1].value, ...v[0][2].map((v: any) => v[3].value)] : [] %}

block       ->  %lbrace statements %rbrace
    {% (v) => new BlockNode(v[1], Pos.from(v[0]), Pos.from(v[2])) %}

statements  ->  (_ statement (sl_ %nl _ statement):*):? _
    {% (v) => v[0] ? [v[0][1], ...v[0][2].map((v: any) => v[3])] : [] %}

statement   ->  block       {% id %}
            |   while       {% id %}
            |   if_else     {% id %}
            |   if          {% id %}
            |   declaration {% id %}
            |   assignment  {% id %}
            |   return      {% id %}
            |   value       {% id %}

while       ->  "while" __ value __ statement
    {% (v) => new WhileNode(v[2], v[4], Pos.from(v[0]), v[4].end) %}

if_else     ->  if __ "else" __ statement
    {% (v) => IfElseNode.from(v[0], v[4], v[4].end) %}

if          ->  "if" __ value __ statement
    {% (v) => new IfNode(v[2], v[4], Pos.from(v[0]), v[4].end) %}

declaration ->  "let" __ %name _ %assign _ value
    {% (v) => new DeclarationNode(v[2].value, v[6], Pos.from(v[0]), v[6].end) %}

assignment  ->  %name _ %assign _ value
    {% (v) => new AssigmentNode(v[0].value, v[4], Pos.from(v[0]), v[4].end) %}

return      -> "return" __ value
    {% (v) => new ReturnNode(v[2], Pos.from(v[0]), v[2].value) %}

value       ->  %lparen _ value _ %rparen {% (v) => v[2] %}
            |   call    {% id %}
            |   %name   {% ([v]) => new AccessNode(v.value, Pos.from(v), Pos.from(v)) %}
            |   add     {% id %}
            |   sub     {% id %}
            # |   unary   {% id %}
            |   %hex    {% ([v]) => new HexNode(v, Pos.from(v)) %}
            |   %int    {% ([v]) => new IntNode(v, Pos.from(v)) %}
            |   %char   {% ([v]) => new CharNode(v, Pos.from(v)) %}
            |   %string {% ([v]) => new StringNode(v, Pos.from(v)) %}

call        -> %name _ %lparen valuelist %rparen
    {% (v) => new CallNode(v[0].value, v[3], Pos.from(v[0]), Pos.from(v[4])) %}

valuelist   -> (_ value (_ %comma _ value):*):? _
    {% (v) => v[0] ? [v[0][1], ...v[0][2].map((v: any) => v[3])] : [] %}

add         -> value _ %plus _ value
    {% (v) => new AdditionNode(v[0], v[4], v[0].begin, v[4].end) %}

sub         -> value _ %minus _ value
    {% (v) => new SubtractionNode(v[0], v[4], v[0].begin, v[4].end) %}

# unary       ->  %minus _ value
#     {% (v) => new UnaryNode(v[2], Pos.from(v[0]), v[2].end) %}

_           ->  __:?
__          ->  (%ws|%nl|%comment_sl|%comment_ml):+

sl_         ->  sl__:?
sl__        ->  (%ws|%comment_sl|%comment_ml):+
