import { LanguageSupport } from "@codemirror/language"
import {parser as baseParser} from "./surrealql.grammar"
import { LRLanguage } from "@codemirror/language"
import { foldNodeProp } from "@codemirror/language";
import { indentNodeProp } from "@codemirror/language";
import { continuedIndent } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

export { baseParser }

export let parser = baseParser.configure({
    props: [
        foldNodeProp.add({
            BlockComment(tree) { return { from: tree.from + 2, to: tree.to - 2 }}
        }),
        indentNodeProp.add({
            Statement: continuedIndent()
        }),
        styleTags({
            Keyword: t.keyword,
            Type: t.typeName,
            Builtin: t.standard(t.name),
            Bits: t.number,
            Bytes: t.string,
            Bool: t.bool,
            Null: t.null,
            Number: t.number,
            String: t.string,
            Identifier: t.name,
            QuotedIdentifier: t.special(t.string),
            SpecialVar: t.special(t.name),
            LineComment: t.lineComment,
            BlockComment: t.blockComment,
            Operator: t.operator,
            "Semi Punctuation": t.punctuation,
            "( )": t.paren,
            "{ }": t.brace,
            "[ ]": t.squareBracket
        })
    ]
});

const language = LRLanguage.define({
    name: "surrealql",
    parser: parser,
    languageData: {
        commentTokens: {line: "//", block: {open: "/*", close: "*/"}},
        closeBrackets: {
            brackets: ["(", "[", "{", "'", '"', "`"]
        }
    }
});

export function surrealql() {
    return new LanguageSupport(
        language,
        []
    );
};