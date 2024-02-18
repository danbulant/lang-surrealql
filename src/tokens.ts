import { ExternalTokenizer, InputStream } from "@lezer/lr"
import {
    // tokens
    As,
    Since,
    Limit,
    Collate,
    Numeric,
    Asc,
    Desc,
    With,
    Order,
    Omit,
    Where,
    From,
    Split,
    Group,
    Start,
    Timeout,
    Parallel,
    Explain,
    In,
    Then,
    Else,
    End,

    // specialize
    Return,
    Transaction,
    Begin,
    Break,
    Cancel,
    Commit,
    Continue,
    Use,
    Ns,
    Db,
    Throw,
    Sleep,
    Show,
    For,
    Let,
    Info,
    Root,
    Namespace,
    Database,
    Scope,
    Value,
    At,
    By,
    Noindex,
    Index,
    Only,
    Full,
    If,
    True,
    False,
    None,
    Null,
    Comparison,
    And,
    Or,
    Select,

    // extend
    Changes,
    Table
} from "./surrealql.grammar.terms"

const enum Ch {
    Newline = 10,
    Space = 32,
    DoubleQuote = 34,
    Hash = 35,
    Dollar = 36,
    SingleQuote = 39,
    ParenL = 40, ParenR = 41,
    Star = 42,
    Plus = 43,
    Comma = 44,
    Dash = 45,
    Dot = 46,
    Slash = 47,
    Colon = 58,
    Semi = 59,
    Question = 63,
    At = 64,
    BracketL = 91, BracketR = 93,
    Backslash = 92,
    Underscore = 95,
    Backtick = 96,
    BraceL = 123, BraceR = 125,
  
    A = 65, a = 97,
    B = 66, b = 98,
    E = 69, e = 101,
    F = 70, f = 102,
    N = 78, n = 110,
    Q = 81, q = 113,
    X = 88, x = 120,
    Z = 90, z = 122,
  
    _0 = 48, _1 = 49, _9 = 57,
}

const kwmap = new Map([
    [[
        "??", "?:",
        "=", "is",
        "!=", "is not",
        "==",
        "?=", "*=",
        "~", "!~", "?~", "*~",
        "in", "not in",
        "contains", "∋",
        "containsnot", "∌",
        "containsall", "⊇",
        "containsany", "⊃",
        "containsnone", "⊅",
        "inside", "∈",
        "notinside", "not in", "∉",
        "allinside", "⊆",
        "anyinside", "⊂",
        "noneinside", "⊄",
        "outside",
        "intersects",
        "<", ">", "<=", ">=",
        "@@", "@"
    ], Comparison],
    [["&&", "and"], And],
    [["||", "or"], Or],

    [["as"], As],
    [["since"], Since],
    [["limit"], Limit],
    [["collate"], Collate],
    [["numeric"], Numeric],
    [["asc"], Asc],
    [["desc"], Desc],
    [["with"], With],
    [["order"], Order],
    [["omit"], Omit],
    [["where"], Where],
    [["from"], From],
    [["split"], Split],
    [["group"], Group],
    [["start"], Start],
    [["timeout"], Timeout],
    [["parallel"], Parallel],
    [["explain"], Explain],
    [["in"], In],
    [["then"], Then],
    [["else"], Else],
    [["end"], End],
]);
let allkws = [...kwmap.keys()].reduce((a, b) => a.concat(b), [])
const specmap = new Map([
    ["return", Return],
    ["transaction", Transaction],
    ["begin", Begin],
    ["break", Break],
    ["cancel", Cancel],
    ["commit", Commit],
    ["continue", Continue],
    ["use", Use],
    ["ns", Ns],
    ["db", Db],
    ["throw", Throw],
    ["sleep", Sleep],
    ["show", Show],
    ["for", For],
    ["let", Let],
    ["info", Info],
    ["for", For],
    ["root", Root],
    ["namespace", Namespace],
    ["database", Database],
    ["scope", Scope],
    ["value", Value],
    ["at", At],
    ["by", By],
    ["noindex", Noindex],
    ["index", Index],
    ["only", Only],
    ["full", Full],
    ["if", If],
    ["true", True],
    ["false", False],
    ["none", None],
    ["null", Null],
    ["comparison", Comparison],
    ["and", And],
    ["or", Or],
    ["select", Select]
]);
const cspecmap = new Map([
    ["changes", Changes],
    ["table", Table],
]);

function isAlpha(ch: number) {
    return ch >= Ch.A && ch <= Ch.Z || ch >= Ch.a && ch <= Ch.z || ch == Ch.Underscore
}
function isAlphaNum(ch: number) {
    return ch >= Ch.A && ch <= Ch.Z || ch >= Ch.a && ch <= Ch.z || ch >= Ch._0 && ch <= Ch._9 || ch == Ch.Underscore
}

function readWord(input: InputStream, result?: string) {
    for (;;) {
        if (input.next != Ch.Underscore && !isAlphaNum(input.next)) break
        if (result != null) result += String.fromCharCode(input.next)
        input.advance()
    }
    return result
}
function skipSpaces(input: InputStream) {
    for (;;) {
        if (input.next != Ch.Space && input.next != Ch.Newline) break
        input.advance()
    }
}

export const tokens = new ExternalTokenizer((input, stack) => {
    let {next} = input;
    if(isAlpha(next)) {
        input.advance()
        let word = readWord(input, String.fromCharCode(next))
        let word2: string | undefined = undefined
        if (word != null) {
            word = word.toLowerCase()
            if(["is", "not"].includes(word)) {
                // needs another word
                skipSpaces(input)
                word2 = readWord(input)
                if(!word2) return;
                word = word + " " + word2.toLowerCase()
            }
            for(let [kws, token] of kwmap) {
                if(kws.includes(word)) {
                    input.acceptToken(token)
                    return
                }
            }
        }
    }
}, {contextual: false})

export const specializeIdent = (text, stack) => {
    if(specmap.has(text)) {
        return specmap.get(text)
    }
    return -1
}
export const extendIdent = (text, stack) => {
    if(cspecmap.has(text)) {
        return cspecmap.get(text)
    }
    return -1
}