# SurrealQL lezer and codemirror 6 support

This packages provides a lezer parser as well as CM6 language support for SurrealQL.
Parser may not be complete as the documentation for SurrealQL is incomplete, but it should be good enough for general code highlight.

Also note that not all statements are supported yet, `SELECT` was the one I focused on the most.

## Installation

```bash
npm install lezer-lang-surrealql
```

## Usage

There are no options for the parser (for now), and both ES imports and CommonJS require are supported. Typescript is also supported.

```javascript
// ES import
import { surrealql } from 'lezer-lang-surrealql';

// CommonJS require
const { surrealql } = require('lezer-lang-surrealql');

// you can then use it as an extension in codemirror

const editor = new EditorView({
    state: EditorState.create({
        doc: '',
        extensions: [
            basicSetup,
            surrealql(),
        ],
    }),
    parent
});
```

```typescript
function surrealql(): LanguageSupport;
```
