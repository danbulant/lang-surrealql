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
            "StringPrefix As Asc Desc Collate Numeric": t.keyword,
            "Select From Where Group By Having Order Limit Return Transaction Begin Break Cancel Commit Continue Use Db Ns Sleep Show Changes For Table Since Info Namespace Database Scope Table Value At With Noindex Index Only Omit Split Start Timeout Parallel Explain Full In": t.keyword,
            Escape: t.escape,
            Bool: t.bool,
            "DivideOrMultiply AddOrSubtract": t.arithmeticOperator,
            "let <future>": t.definitionKeyword,
            NamespaceId: t.namespace,
            FunctionName: t.function(t.variableName),
            Variable: t.variableName,
            Star: t.atom,
            Integer: t.integer,
            "Decimal Float": t.float,
            Duration: t.number,
            LineComment: t.lineComment,
            BlockComment: t.blockComment,
            String: t.string,
            Constant: t.constant(t.variableName),
            "Return Break ForStatement/For If Else Then": t.controlKeyword,
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
            "[ ]": t.squareBracket,
            "< >": t.angleBracket,
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