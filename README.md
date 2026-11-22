# Munora

A toy programming language written in JavaScript, based on the Bogura dialect.

Made by [@munnamohon59-jpg](https://github.com/munnamohon59-jpg) · © 2026, Mohon Munna

```
ayen vai
  dhor re naam = "Bogura";
  bol na "Ki khobor", naam;
ashi vai
```

## Language-e ja ja ache

variable (`dhor re`), print (`bol na`), `jodi dekh` / `nahoy jodi dekh` / `nahoy dekh`, `jotokkhon dekh` (while), `age kor ... jotokkhon dekh` (do-while), `ghur re` (for), function (`kaj kor`, `ferot de`, recursion shoho), `thama re` (break), `porer ta dekh` (continue), `a++` / `a--`, `// comment` ar `/* comment */`.

**Ja nai:** array, user input, string-er method, switch, function-er bhitore function.

## Website kemne khulbe

1. Repo download kore **extract** koro.
2. **VS Code**-e `File → Open Folder` diye `Munora` folder kholo (Trust chaile **Yes** dao).
3. Ekta kore koro:
   - `Ctrl+Shift+B` chapo, default browser-e website khulbe.
   - ba `F5` chapo (Chrome ba Edge selection dibe), website khulbe.
   - ba `index.html`-e right-click kore **Open with Live Server** (extension lagbe).
   - ba folder theke `run.bat` double-click koro.

Internet lagbe na, kono install lagbe na.

## Terminal-e (optional, Node.js lagbe)

```
node run.js              # main.m chalay
node run.js main.m --tokens
node run.js main.m --ast
node run.js main.m --js
```

## File list

| File | Kaj |
|---|---|
| `index.html` | website er page |
| `css/style.css` | design |
| `js/language.js` | Step 1: language design (keyword table) |
| `js/preprocessor.js` | Step 2: preprocessor |
| `js/tokenizer.js` | Step 3: tokenizer |
| `js/parser.js` | Step 4: parser (AST toiri) |
| `js/codegen.js` | Step 5: AST mapping (AST theke JavaScript) |
| `js/executor.js` | Step 6: JavaScript engine diye execute |
| `js/compiler.js` | shob step ek sathe jora |
| `js/examples.js` | playground er example button gulor code |
| `js/app.js` | website er button, editor, highlight (UI) |
| `main.m` | Munora program |
| `examples/*.m` | alada example program (ulta-ginti, factorial, grade, recursion, mool-function) |
| `run.js` | terminal theke chalanor CLI |
| `.vscode/` | VS Code-e F5 / Ctrl+Shift+B diye website khola |

Keyword bodlate `js/language.js` er `KEYWORDS` table edit koro.

## Sir-ke dekhanor niyom

1. **VS Code:** Explorer-e file gulo dekhao. `js/` folder-e 6 step-er 6 ta file ache (language, preprocessor, tokenizer, parser, codegen, executor).
2. **Website:** `Ctrl+Shift+B` chapo. Playground-e example button (Hello, Loop, Namota...) click kore code ar output dekhao. "Bhul dekho" button-e error message dekhay.
3. **Terminal:** `` Ctrl+` `` chapo. Ekta example-er shob step dekhao:
   ```
   node run.js examples/factorial.m            # chalay
   node run.js examples/factorial.m --tokens   # Step 3: tokenizer
   node run.js examples/factorial.m --ast      # Step 4: parser (AST)
   node run.js examples/factorial.m --js       # Step 5: AST theke JavaScript
   ```
4. **Keyword bodlano:** `js/language.js`-e ekta keyword bodle save koro, browser refresh korle notun keyword kaj korbe.
