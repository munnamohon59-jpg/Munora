// Munora CLI — terminal theke chalanor jonno.
//   node run.js                 -> main.m chalay
//   node run.js main.m          -> main.m chalay
//   node run.js main.m --tokens -> tokenizer er result
//   node run.js main.m --ast    -> parser er AST
//   node run.js main.m --js     -> AST theke toiri JavaScript code
// Browser-er ei js/ file gulai ekhane use hoy, alada kono code nai.
const fs = require('fs'), path = require('path'), vm = require('vm');

const files = ['language', 'preprocessor', 'tokenizer', 'parser', 'codegen', 'executor', 'compiler'];
const code = files.map(f => fs.readFileSync(path.join(__dirname, 'js', f + '.js'), 'utf8')).join('\n');
vm.runInThisContext(code + '\n;globalThis.__munora = { compile, execute };');
const { compile, execute } = globalThis.__munora;

const args = process.argv.slice(2);
const flag = args.find(a => a.startsWith('--'));
const file = args.find(a => !a.startsWith('--')) || path.join(__dirname, 'main.m');

try {
  const r = compile(fs.readFileSync(file, 'utf8'));
  if (flag === '--tokens') console.log(r.toks.map(t => t.line + ': ' + t.type + ' ' + JSON.stringify(t.value)).join('\n'));
  else if (flag === '--ast') console.log(JSON.stringify(r.ast, (k, v) => k === 'line' ? undefined : v, 2));
  else if (flag === '--js') console.log(r.js);
  else console.log(execute(r.js));
} catch (e) {
  console.error('Error' + (e.line ? ' (line ' + e.line + ')' : '') + ': ' + e.message);
  process.exit(1);
}
