/* =====================================================
   COMPILER — shob step ek jaygay jora
   source -> preprocess -> tokenize -> parse -> generate
   (execute alada, executor.js e)
   ===================================================== */
function compile(src) {
  const pre = preprocess(src), toks = tokenize(pre), ast = parse(toks), js = generate(ast);
  return { pre, toks, ast, js };
}
