/* =====================================================
   6) EXECUTE — JavaScript er V8 engine diye
   ===================================================== */
const fmt = v => (v === null || v === undefined) ? 'faka' : v === true ? 'thik' : v === false ? 'bhul' : String(v);
function execute(js) {
  const out = [];
  try {
    new Function('__out', js)((...a) => out.push(a.map(fmt).join(' ')));
  } catch (e) {
    if (e instanceof RangeError) throw new BograError('onek beshi recursion: kono kaj nijei nijere bar bar dakche, kokhono thamche na');
    throw e;
  }
  return out.join('\n');
}
