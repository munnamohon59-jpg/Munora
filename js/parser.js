/* =====================================================
   4) PARSER (recursive descent) -> AST
   statement: dhor re, bol na, jodi dekh, jotokkhon dekh,
              age kor (do-while), ghur re (for), kaj kor (function),
              ferot de (return), thama re, porer ta dekh
   ===================================================== */
function parse(toks) {
  let p = 0, loop = 0, func = 0, depth = 0;
  const ASSIGN = ['=', '+=', '-=', '*=', '/=', '%='];
  const peek = () => toks[p], next = () => toks[p++];
  const is = (t, v) => peek().type === t && (v === undefined || peek().value === v);
  const show = t => t.type === 'EOF' ? 'file er shesh' : t.type === 'KEYWORD' ? KW_NAME[t.value] : t.value;
  const want = (t, v) => t === 'KEYWORD' ? KW_NAME[v] : t === 'IDENT' ? 'naam' : (v || t);
  const eat = (t, v) => is(t, v) ? next() : fail("'" + want(t, v) + "' dorkar chilo, pailam '" + show(peek()) + "'", peek().line);
  const semi = () => { if (is('OP', ';')) next(); };

  const bin = (sub, ops) => () => {
    let l = sub();
    while (peek().type === 'OP' && ops.includes(peek().value)) {
      const o = next(); l = { type: 'Binary', op: o.value, left: l, right: sub(), line: o.line };
    }
    return l;
  };
  function args() {
    const list = [];
    if (!is('OP', ')')) { list.push(expr()); while (is('OP', ',')) { next(); list.push(expr()); } }
    eat('OP', ')');
    return list;
  }
  function primary() {
    const t = next();
    if (t.type === 'NUMBER' || t.type === 'STRING') return { type: 'Literal', value: t.value, line: t.line };
    if (t.type === 'IDENT') {
      if (is('OP', '(')) { next(); return { type: 'Call', name: t.value, args: args(), line: t.line }; }
      return { type: 'Identifier', name: t.value, line: t.line };
    }
    if (t.type === 'KEYWORD' && t.value === 'TRUE') return { type: 'Literal', value: true, line: t.line };
    if (t.type === 'KEYWORD' && t.value === 'FALSE') return { type: 'Literal', value: false, line: t.line };
    if (t.type === 'KEYWORD' && t.value === 'NULL') return { type: 'Literal', value: null, line: t.line };
    if (t.type === 'OP' && t.value === '(') { const e = expr(); eat('OP', ')'); return e; }
    fail("expression dorkar chilo, pailam '" + show(t) + "'", t.line);
  }
  function unary() {
    if (is('OP', '-') || is('OP', '!')) { const o = next(); return { type: 'Unary', op: o.value, arg: unary(), line: o.line }; }
    return primary();
  }
  const mul = bin(unary, ['*', '/', '%']);
  const add = bin(mul, ['+', '-']);
  const cmp = bin(add, ['<', '>', '<=', '>=']);
  const eq = bin(cmp, ['==', '!=']);
  const and = bin(eq, ['&&']);
  const or = bin(and, ['||']);
  function expr() { return or(); }

  // a = 5;  a += 1;  a++;  a--;   (semicolon chara)
  const isAssign = () => peek().type === 'IDENT' && toks[p + 1].type === 'OP' &&
    (ASSIGN.includes(toks[p + 1].value) || toks[p + 1].value === '++' || toks[p + 1].value === '--');
  function assignment() {
    const id = next(), op = next().value;
    if (op === '++' || op === '--')
      return { type: 'Assign', name: id.value, op: op === '++' ? '+=' : '-=', value: { type: 'Literal', value: 1, line: id.line }, line: id.line };
    return { type: 'Assign', name: id.value, op, value: expr(), line: id.line };
  }

  function block() {
    const t = eat('OP', '{'); const body = [];
    depth++;
    while (!is('OP', '}')) {
      if (is('EOF')) fail("'}' bondho kora hoy nai", t.line);
      body.push(statement());
    }
    depth--; next();
    return { type: 'Block', body, line: t.line };
  }
  function ifStmt() {
    const t = next(); eat('OP', '('); const test = expr(); eat('OP', ')');
    const cons = block(); let alt = null;
    if (is('KEYWORD', 'ELIF')) alt = ifStmt();
    else if (is('KEYWORD', 'ELSE')) { next(); alt = block(); }
    return { type: 'If', test, cons, alt, line: t.line };
  }
  function loopBody() { loop++; const b = block(); loop--; return b; }

  function statement() {
    const t = peek();
    if (t.type === 'KEYWORD') {
      switch (t.value) {
        case 'DECL': {
          next(); const id = eat('IDENT'); let init = null;
          if (is('OP', '=')) { next(); init = expr(); }
          semi(); return { type: 'VarDecl', name: id.value, init, line: t.line };
        }
        case 'PRINT': {
          next(); const list = [expr()];
          while (is('OP', ',')) { next(); list.push(expr()); }
          semi(); return { type: 'Print', args: list, line: t.line };
        }
        case 'IF': return ifStmt();
        case 'WHILE': {
          next(); eat('OP', '('); const test = expr(); eat('OP', ')');
          return { type: 'While', test, body: loopBody(), line: t.line };
        }
        case 'DO': {
          next(); const body = loopBody();
          eat('KEYWORD', 'WHILE'); eat('OP', '('); const test = expr(); eat('OP', ')'); semi();
          return { type: 'DoWhile', body, test, line: t.line };
        }
        case 'FOR': {
          next(); eat('OP', '(');
          let init = null;
          if (is('KEYWORD', 'DECL')) {
            const d = next(), id = eat('IDENT'); let v = null;
            if (is('OP', '=')) { next(); v = expr(); }
            init = { type: 'VarDecl', name: id.value, init: v, line: d.line };
          } else if (isAssign()) init = assignment();
          eat('OP', ';');
          const test = is('OP', ';') ? null : expr();
          eat('OP', ';');
          let update = null;
          if (!is('OP', ')')) {
            if (!isAssign()) fail("update-er jaygay 'i++' ba 'i += 1' moto likho", peek().line);
            update = assignment();
          }
          eat('OP', ')');
          return { type: 'For', init, test, update, body: loopBody(), line: t.line };
        }
        case 'FUNC': {
          if (depth > 0 || func > 0) fail("'" + KW_NAME.FUNC + "' shudhu program-er shurute likhte hobe, kono { } er bhitore na", t.line);
          next(); const name = eat('IDENT'); eat('OP', '(');
          const params = [];
          if (!is('OP', ')')) { params.push(eat('IDENT').value); while (is('OP', ',')) { next(); params.push(eat('IDENT').value); } }
          eat('OP', ')');
          const savedLoop = loop; loop = 0; func++;
          const body = block();
          func--; loop = savedLoop;
          return { type: 'FuncDecl', name: name.value, params, body, line: t.line };
        }
        case 'RETURN': {
          if (!func) fail("'" + KW_NAME.RETURN + "' khali kaj-er bhitore cholbe", t.line);
          next(); let value = null;
          if (!is('OP', ';') && !is('OP', '}')) value = expr();
          semi(); return { type: 'Return', value, line: t.line };
        }
        case 'BREAK': case 'CONTINUE':
          if (!loop) fail("'" + KW_NAME[t.value] + "' khali loop er bhitore cholbe", t.line);
          next(); semi(); return { type: t.value === 'BREAK' ? 'Break' : 'Continue', line: t.line };
        default: fail("'" + KW_NAME[t.value] + "' ekhane cholbe na", t.line);
      }
    }
    if (is('OP', '{')) return block();
    if (isAssign()) { const a = assignment(); semi(); return a; }
    const e = expr(); semi(); return { type: 'ExprStmt', expr: e, line: t.line };
  }

  const body = [];
  while (!is('EOF')) body.push(statement());
  return { type: 'Program', body };
}
