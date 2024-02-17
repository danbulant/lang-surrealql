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
            "StringPrefix as asc desc": t.keyword,
            Escape: t.escape,
            Bool: t.bool,
            "DivideOrMultiply AddOrSubtract": t.arithmeticOperator,
            "let <future>": t.definitionKeyword,
            Namespace: t.namespace,
            FunctionName: t.function(t.variableName),
            Variable: t.variableName,
            "*": t.atom,
            Integer: t.integer,
            "Decimal Float": t.float,
            Duration: t.number,
            LineComment: t.lineComment,
            BlockComment: t.blockComment,
            String: t.string,
            "return break ForStatement/for if else then": t.controlKeyword,
            "DurationUnit": t.unit,
            "None Null": t.null,
            "RecordID": t.special(t.variableName),
            "Comparison @": t.compareOperator,
            "And Or": t.logicOperator,
            "BinaryExpression/. ->": t.derefOperator,
            ": :: ..=": t.punctuation,
            "Column Property": t.propertyName,
            "Semi Comma": t.separator,
            "( )": t.paren,
            "{ }": t.brace,
            "[ ]": t.squareBracket
        })
    ]
});

export const language = LRLanguage.define({
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