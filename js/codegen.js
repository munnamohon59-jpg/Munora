/* =====================================================
   5) AST MAPPING -> JavaScript code
   (scope check shoho: declare na kora variable / kaj dhorbe)
   ===================================================== */
function generate(ast) {
  const RESERVED = new Set('break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield let static await async eval arguments undefined NaN Infinity'.split(' '));
  const OP = { '==': '===', '!=': '!==' };
  const scopes = [new Set()];
  let inFunc = 0;

  // shurute shob kaj (function) er naam ar top-level variable er naam jene nei
  const funcs = new Map(), globals = new Set();
  const bad = (name, line) => { if (RESERVED.has(name) || name.startsWith('__')) fail("'" + name + "' naam ta use kora jabe na", line); };
  ast.body.forEach(n => {
    if (n.type === 'FuncDecl') {
      bad(n.name, n.line);
      if (funcs.has(n.name)) fail("'" + n.name + "' naam-er kaj agei banano hoyeche", n.line);
      funcs.set(n.name, n.params.length);
    }
    if (n.type === 'VarDecl') globals.add(n.name);
  });
  const declared = n => scopes.some(s => s.has(n)) || (inFunc > 0 && globals.has(n));
  const undeclared = (name, line) => fail("'" + name + "' age 'dhor re' diye declare kora hoy nai", line);

  const ex = n => {
    switch (n.type) {
      case 'Literal': return typeof n.value === 'string' ? JSON.stringify(n.value) : String(n.value);
      case 'Identifier': if (!declared(n.name)) undeclared(n.name, n.line); return n.name;
      case 'Unary': return '(' + n.op + ex(n.arg) + ')';
      case 'Binary': return '(' + ex(n.left) + ' ' + (OP[n.op] || n.op) + ' ' + ex(n.right) + ')';
      case 'Call': {
        if (!funcs.has(n.name)) fail("'" + n.name + "' naam-er kono kaj (function) nai", n.line);
        if (funcs.get(n.name) !== n.args.length) fail("'" + n.name + "' kaj-e " + funcs.get(n.name) + " ta jinis lage, tumi " + n.args.length + " ta diyecho", n.line);
        return n.name + '(' + n.args.map(ex).join(', ') + ')';
      }
    }
  };
  const decl = n => {
    bad(n.name, n.line);
    if (funcs.has(n.name)) fail("'" + n.name + "' naam-e age kaj (function) ache", n.line);
    const init = n.init ? ' = ' + ex(n.init) : '';   // age init, tarpor naam jog (dhor re a = a; dhorbe)
    const cur = scopes[scopes.length - 1];
    if (cur.has(n.name)) fail("'" + n.name + "' ekhane agei declare kora ase", n.line);
    cur.add(n.name);
    return 'let ' + n.name + init;
  };
  const assign = n => {
    if (!declared(n.name)) undeclared(n.name, n.line);
    return n.name + ' ' + n.op + ' ' + ex(n.value);
  };
  const guard = pad => pad + '  if (++__g > 1000000) throw new Error("loop onek beshi ghurche (infinite loop?)");\n';
  const blk = (b, d, pre = '', params = []) => {
    scopes.push(new Set(params));
    const inner = b.body.map(s => st(s, d + 1)).join('');
    scopes.pop();
    return '{\n' + pre + inner + '  '.repeat(d) + '}';
  };
  const st = (n, d) => {
    const pad = '  '.repeat(d);
    switch (n.type) {
      case 'VarDecl': return pad + decl(n) + ';\n';
      case 'Assign': return pad + assign(n) + ';\n';
      case 'Print': return pad + '__out(' + n.args.map(ex).join(', ') + ');\n';
      case 'ExprStmt': return pad + ex(n.expr) + ';\n';
      case 'Break': return pad + 'break;\n';
      case 'Continue': return pad + 'continue;\n';
      case 'Return': return pad + 'return' + (n.value ? ' ' + ex(n.value) : '') + ';\n';
      case 'Block': return pad + blk(n, d) + '\n';
      case 'If': {
        let s = pad + 'if (' + ex(n.test) + ') ' + blk(n.cons, d);
        if (n.alt) s += ' else ' + (n.alt.type === 'If' ? st(n.alt, d).trimStart().replace(/\n$/, '') : blk(n.alt, d));
        return s + '\n';
      }
      case 'While': return pad + 'while (' + ex(n.test) + ') ' + blk(n.body, d, guard(pad)) + '\n';
      case 'DoWhile': return pad + 'do ' + blk(n.body, d, guard(pad)) + ' while (' + ex(n.test) + ');\n';
      case 'For': {
        scopes.push(new Set());
        const init = n.init ? (n.init.type === 'VarDecl' ? decl(n.init) : assign(n.init)) : '';
        const test = n.test ? ex(n.test) : '';
        const update = n.update ? assign(n.update) : '';
        const s = pad + 'for (' + init + '; ' + test + '; ' + update + ') ' + blk(n.body, d, guard(pad));
        scopes.pop();
        return s + '\n';
      }
      case 'FuncDecl': {
        n.params.forEach((p, i) => {
          bad(p, n.line);
          if (n.params.indexOf(p) !== i) fail("'" + p + "' naam duibar likha hoyeche", n.line);
        });
        inFunc++;
        const s = pad + 'function ' + n.name + '(' + n.params.join(', ') + ') ' + blk(n.body, d, '', n.params) + '\n';
        inFunc--;
        return s;
      }
    }
  };
  return 'let __g = 0;\n' + ast.body.map(s => st(s, 0)).join('');
}
