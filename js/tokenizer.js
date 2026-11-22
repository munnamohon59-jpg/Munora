/* =====================================================
   3) TOKENIZER
   ===================================================== */
function tokenize(src) {
  const toks = []; let i = 0, line = 1;
  const push = (type, value) => toks.push({ type, value, line });
  const two = ['==', '!=', '<=', '>=', '&&', '||', '+=', '-=', '*=', '/=', '%=', '++', '--'];
  const one = '+-*/%<>=!(){};,';
  while (i < src.length) {
    const ch = src[i], rest = src.slice(i);
    if (ch === '\n') { line++; i++; continue; }
    if (/\s/.test(ch)) { i++; continue; }
    let m;
    if (ch === '$' && (m = /^\$[A-Z]+/.exec(rest))) { push('KEYWORD', m[0].slice(1)); i += m[0].length; continue; }
    if ((m = /^(\d+\.?\d*|\.\d+)/.exec(rest))) { push('NUMBER', parseFloat(m[0])); i += m[0].length; continue; }
    if ((m = /^[\p{L}_][\p{L}\p{N}_]*/u.exec(rest))) { push('IDENT', m[0]); i += m[0].length; continue; }
    if (ch === '"' || ch === "'") {
      let j = i + 1, out = '';
      const esc = { n: '\n', t: '\t', '\\': '\\', '"': '"', "'": "'" };
      while (j < src.length && src[j] !== ch && src[j] !== '\n') {
        if (src[j] === '\\') { j++; out += esc[src[j]] ?? src[j]; } else out += src[j];
        j++;
      }
      if (src[j] !== ch) fail('string bondho kora hoy nai', line);
      push('STRING', out); i = j + 1; continue;
    }
    if (two.includes(src.substr(i, 2))) { push('OP', src.substr(i, 2)); i += 2; continue; }
    if (one.includes(ch)) { push('OP', ch); i++; continue; }
    fail("chinte parlam na: '" + ch + "'", line);
  }
  push('EOF', '');
  return toks;
}
