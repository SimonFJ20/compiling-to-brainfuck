// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var nl: any;
declare var name: any;
declare var lparen: any;
declare var rparen: any;
declare var comma: any;
declare var lbrace: any;
declare var rbrace: any;
declare var assign: any;
declare var hex: any;
declare var int: any;
declare var plus: any;
declare var minus: any;
declare var ws: any;
declare var comment: any;
declare var comment_ml: any;

import { compile, keywords } from 'moo';
const lexer = compile({
    nl:         {match: /[\n;]+/, lineBreaks: true},
    ws:         /[ \t]+/,
    comment_sl: /\/\/.*?$/,
    comment_ml: {match: /\*[^*]*\*+(?:[^/*][^*]*\*+)*/, lineBreaks: true},
    // float:      /\-?(?:(?:0|(?:[1-9][0-9]*))\.[0-9]+)/,
    hex:        /0x[0-9a-fA-F]+/,
    int:        /0|(?:[1-9][0-9]*)/,
    string:     {match: /"(?:\\["\\n]|[^\n"\\])*"/, value: s => s.slice(1, -1)},
    name:       {match: /[a-zA-Z][a-zA-Z0-9_]*/, type: keywords({
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
    UnaryNode,
    HexNode,
    IntNode,
} from "./nodes";

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "file", "symbols": ["namespace", "sl_", (lexer.has("nl") ? {type: "nl"} : nl), "tllist"], "postprocess": (v) => new FileNode(v[0], v[3], v[0].begin, v[3].length > 0 ? v[3][v[3].length-1].end : Pos.from(v[2]))},
    {"name": "tllist$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "tllist$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["sl_", (lexer.has("nl") ? {type: "nl"} : nl), "_", "tlstatement"]},
    {"name": "tllist$ebnf$1$subexpression$1$ebnf$1", "symbols": ["tllist$ebnf$1$subexpression$1$ebnf$1", "tllist$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "tllist$ebnf$1$subexpression$1", "symbols": ["_", "tlstatement", "tllist$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "tllist$ebnf$1", "symbols": ["tllist$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "tllist$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "tllist", "symbols": ["tllist$ebnf$1"], "postprocess": (v) => v[0] ? [v[0][1], ...v[0][2].map((v: any) => v[2])] : []},
    {"name": "tlstatement", "symbols": ["import"], "postprocess": id},
    {"name": "tlstatement", "symbols": ["definition"], "postprocess": id},
    {"name": "tlstatement", "symbols": ["declaration"], "postprocess": id},
    {"name": "namespace", "symbols": [{"literal":"namespace"}, "__", (lexer.has("name") ? {type: "name"} : name)], "postprocess": (v) => new NamespaceNode(v[2].value, Pos.from(v[0]), Pos.from(v[2]))},
    {"name": "import", "symbols": [{"literal":"import"}, "__", (lexer.has("name") ? {type: "name"} : name)], "postprocess": (v) => new ImportNode(v[2].value, Pos.from(v[0]), Pos.from(v[2]))},
    {"name": "definition", "symbols": [{"literal":"func"}, "__", (lexer.has("name") ? {type: "name"} : name), "_", (lexer.has("lparen") ? {type: "lparen"} : lparen), "namelist", (lexer.has("rparen") ? {type: "rparen"} : rparen), "_", "block"], "postprocess": (v) => new DefinitionNode(v[2], v[5], v[8], Pos.from(v[0]), v[8].end)},
    {"name": "namelist$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "namelist$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("comma") ? {type: "comma"} : comma), "_", (lexer.has("name") ? {type: "name"} : name)]},
    {"name": "namelist$ebnf$1$subexpression$1$ebnf$1", "symbols": ["namelist$ebnf$1$subexpression$1$ebnf$1", "namelist$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "namelist$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("name") ? {type: "name"} : name), "namelist$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "namelist$ebnf$1", "symbols": ["namelist$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "namelist$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "namelist", "symbols": ["namelist$ebnf$1", "_"], "postprocess": (v) => v[0] ? [v[0][1].value, ...v[0][2].map((v: any) => v[3].value)] : []},
    {"name": "block", "symbols": [(lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "statements", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace)], "postprocess": (v) => new BlockNode(v[1], Pos.from(v[0]), Pos.from(v[2]))},
    {"name": "statements$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "statements$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["sl_", (lexer.has("nl") ? {type: "nl"} : nl), "_", "statement"]},
    {"name": "statements$ebnf$1$subexpression$1$ebnf$1", "symbols": ["statements$ebnf$1$subexpression$1$ebnf$1", "statements$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "statements$ebnf$1$subexpression$1", "symbols": ["_", "statement", "statements$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "statements$ebnf$1", "symbols": ["statements$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "statements$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "statements", "symbols": ["statements$ebnf$1", "_"], "postprocess": (v) => v[0] ? [v[0][1], ...v[0][2].map((v: any) => v[2])] : []},
    {"name": "statement", "symbols": ["block"], "postprocess": id},
    {"name": "statement", "symbols": ["while"], "postprocess": id},
    {"name": "statement", "symbols": ["if_else"], "postprocess": id},
    {"name": "statement", "symbols": ["if"], "postprocess": id},
    {"name": "statement", "symbols": ["declaration"], "postprocess": id},
    {"name": "statement", "symbols": ["assignment"], "postprocess": id},
    {"name": "statement", "symbols": ["return"], "postprocess": id},
    {"name": "statement", "symbols": ["value"], "postprocess": id},
    {"name": "while", "symbols": [{"literal":"while"}, "__", "value", "__", "statement"], "postprocess": (v) => new WhileNode(v[2], v[4], Pos.from(v[0]), v[4].end)},
    {"name": "if_else", "symbols": ["if", "__", {"literal":"else"}, "__", "statement"], "postprocess": (v) => IfElseNode.from(v[0], v[4], v[4].end)},
    {"name": "if", "symbols": [{"literal":"if"}, "__", "value", "__", "statement"], "postprocess": (v) => new IfNode(v[1], v[4], Pos.from(v[0]), v[4].end)},
    {"name": "declaration", "symbols": [{"literal":"let"}, "__", (lexer.has("name") ? {type: "name"} : name), "_", (lexer.has("assign") ? {type: "assign"} : assign), "_", "value"], "postprocess": (v) => new DeclarationNode(v[2].value, v[6], Pos.from(v[0]), v[6].end)},
    {"name": "assignment", "symbols": [(lexer.has("name") ? {type: "name"} : name), "_", (lexer.has("assign") ? {type: "assign"} : assign), "_", "value"], "postprocess": (v) => new AssigmentNode(v[0].value, v[4], Pos.from(v[0]), Pos.from(v[4]))},
    {"name": "return", "symbols": [{"literal":"return"}, "__", "value"], "postprocess": (v) => new ReturnNode(v[2], Pos.from(v[0]), v[2].value)},
    {"name": "value", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "value", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": (v) => v[2]},
    {"name": "value", "symbols": ["call"], "postprocess": id},
    {"name": "value", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": ([v]) => new AccessNode(v.value, Pos.from(v), Pos.from(v))},
    {"name": "value", "symbols": ["add"], "postprocess": id},
    {"name": "value", "symbols": ["sub"], "postprocess": id},
    {"name": "value", "symbols": ["unary"], "postprocess": id},
    {"name": "value", "symbols": [(lexer.has("hex") ? {type: "hex"} : hex)], "postprocess": ([v]) => new HexNode(v, Pos.from(v))},
    {"name": "value", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": ([v]) => new IntNode(v, Pos.from(v))},
    {"name": "call", "symbols": [(lexer.has("name") ? {type: "name"} : name), "_", (lexer.has("lparen") ? {type: "lparen"} : lparen), "valuelist", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": (v) => new CallNode(v[0].value, v[3], Pos.from(v[0]), Pos.from(v[4]))},
    {"name": "valuelist$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "valuelist$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "value"]},
    {"name": "valuelist$ebnf$1$subexpression$1$ebnf$1", "symbols": ["valuelist$ebnf$1$subexpression$1$ebnf$1", "valuelist$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "valuelist$ebnf$1$subexpression$1", "symbols": ["_", "value", "valuelist$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "valuelist$ebnf$1", "symbols": ["valuelist$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "valuelist$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "valuelist", "symbols": ["valuelist$ebnf$1", "_"], "postprocess": (v) => v[0] ? [v[0][1], ...v[0][2].map((v: any) => v[3])] : []},
    {"name": "add", "symbols": ["value", "_", (lexer.has("plus") ? {type: "plus"} : plus), "_", "value"], "postprocess": (v) => new AdditionNode(v[0], v[4], v[0].begin, v[4].end)},
    {"name": "sub", "symbols": ["value", "_", (lexer.has("minus") ? {type: "minus"} : minus), "_", "value"], "postprocess": (v) => new SubtractionNode(v[0], v[4], v[0].begin, v[4].end)},
    {"name": "unary", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus), "_", "value"], "postprocess": (v) => new UnaryNode(v[2], Pos.from(v[0]), v[2].end)},
    {"name": "_$ebnf$1", "symbols": ["__"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1$subexpression$1", "symbols": [(lexer.has("nl") ? {type: "nl"} : nl)]},
    {"name": "__$ebnf$1$subexpression$1", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)]},
    {"name": "__$ebnf$1$subexpression$1", "symbols": [(lexer.has("comment_ml") ? {type: "comment_ml"} : comment_ml)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1$subexpression$1"]},
    {"name": "__$ebnf$1$subexpression$2", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1$subexpression$2", "symbols": [(lexer.has("nl") ? {type: "nl"} : nl)]},
    {"name": "__$ebnf$1$subexpression$2", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)]},
    {"name": "__$ebnf$1$subexpression$2", "symbols": [(lexer.has("comment_ml") ? {type: "comment_ml"} : comment_ml)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "__$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "sl_$ebnf$1", "symbols": ["sl__"], "postprocess": id},
    {"name": "sl_$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "sl_", "symbols": ["sl_$ebnf$1"]},
    {"name": "sl__$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "sl__$ebnf$1$subexpression$1", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)]},
    {"name": "sl__$ebnf$1$subexpression$1", "symbols": [(lexer.has("comment_ml") ? {type: "comment_ml"} : comment_ml)]},
    {"name": "sl__$ebnf$1", "symbols": ["sl__$ebnf$1$subexpression$1"]},
    {"name": "sl__$ebnf$1$subexpression$2", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "sl__$ebnf$1$subexpression$2", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)]},
    {"name": "sl__$ebnf$1$subexpression$2", "symbols": [(lexer.has("comment_ml") ? {type: "comment_ml"} : comment_ml)]},
    {"name": "sl__$ebnf$1", "symbols": ["sl__$ebnf$1", "sl__$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "sl__", "symbols": ["sl__$ebnf$1"]}
  ],
  ParserStart: "file",
};

export default grammar;
