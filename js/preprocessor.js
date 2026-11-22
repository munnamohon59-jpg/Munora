/* =====================================================
   2) PREPROCESSOR
   - ayen vai ... ashi vai er baire ja ase fele dey
   - comment (//) soray
   - multi-word keyword ke ek token ($DECL) banay
   ===================================================== */
function preprocess(src) {
  const sm = new RegExp('\\b' + ENTRY.replace(' ', '\\s+') + '\\b').exec(src);
  if (!sm) fail("'" + ENTRY + "' khuje pailam na", 1);
  const ends = [...src.matchAll(new RegExp('\\b' + EXIT.replace(' ', '\\s+') + '\\b', 'g'))];
  if (!ends.length) fail("'" + EXIT + "' khuje pailam na", 1);
  const start = sm.index + sm[0].length;
  const end = ends[ends.length - 1].index;
  if (end < start) fail("'" + EXIT + "' ta '" + ENTRY + "' er age", 1);
  const lead = (src.slice(0, start).match(/\n/g) || []).join('');   // line number thik rakhte
  const body = lead + src.slice(start, end);

  const phrases = Object.keys(KW_BY_PHRASE).sort((a, b) => b.length - a.length);
  const strRe = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/.source;
  const cmRe = /\/\/[^\n]*|\/\*[\s\S]*?\*\//.source;
  const kwRe = '\\b(?:' + phrases.map(p => p.split(' ').join('\\s+')).join('|') + ')\\b';
  const re = new RegExp('(' + strRe + ')|(' + cmRe + ')|(' + kwRe + ')', 'g');
  return body.replace(re, (m, s, c, k) => {
    if (s) return s;
    if (c) return (c.match(/\n/g) || []).join('');
    const name = KW_BY_PHRASE[k.replace(/\s+/g, ' ')];
    return '$' + name + (k.match(/\n/g) || []).join('');
  });
}
