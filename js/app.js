/* =====================================================
   APP — shudhu screen er UI (compiler er kono logic nai)
   ===================================================== */
const $ = id => document.getElementById(id);
const src = $('src'), view = $('view'), hl = $('hl');
let result = null, error = null, output = '';

// ---- syntax highlight (keyword table language.js theke) ----
function highlight(code) {
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const phrases = [ENTRY, EXIT, ...KEYWORDS.map(k => k[0])].sort((a, b) => b.length - a.length);
  const kw = phrases.map(p => p.split(' ').join('[ \\t]+')).join('|');
  const str = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/.source, cm = /\/\/[^\n]*|\/\*[\s\S]*?\*\//.source, num = /\b\d+\.?\d*\b/.source;
  const re = new RegExp(`(${str})|(${cm})|(\\b(?:${kw})\\b)|(${num})`, 'g');
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    const word = m[3] && m[3].replace(/\s+/g, ' ');
    const cls = m[1] ? 'ts' : m[2] ? 'tc' : m[3] ? (word === ENTRY || word === EXIT ? 'te' : 'tk') : 'tn';
    out += esc(code.slice(last, m.index)) + '<span class="' + cls + '">' + esc(m[0]) + '</span>';
    last = re.lastIndex;
  }
  return out + esc(code.slice(last));
}
function syncEditor() {
  hl.innerHTML = highlight(src.value) + '\n';
  hl.scrollTop = src.scrollTop; hl.scrollLeft = src.scrollLeft;
}
function setCode(code) { src.value = code; syncEditor(); }
src.addEventListener('input', syncEditor);
src.addEventListener('scroll', () => { hl.scrollTop = src.scrollTop; hl.scrollLeft = src.scrollLeft; });

function render() {
  view.className = 'out';
  if (error) { view.classList.add('err'); view.textContent = '❌ ' + error; return; }
  if (!result) { view.textContent = 'Chalao chaple output ekhane ashbe.'; return; }
  view.textContent = output || '(kichu print hoy nai)';
}

function run() {
  result = null; error = null; output = '';
  try { result = compile(src.value); output = execute(result.js); }
  catch (e) { error = (e.line ? 'line ' + e.line + ': ' : '') + e.message; }
  render();
}

// dark / light toggle (browser-e mone rakhe)
$('theme').onclick = () => {
  const t = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('munora-theme', t); } catch (e) {}
};

$('run').onclick = run;
$('clear').onclick = () => { setCode(''); result = null; error = null; render(); };
src.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
  if (e.key === 'Tab') { e.preventDefault(); document.execCommand('insertText', false, '  '); }
});

// docs example gulor pashe "Chalao" button
document.querySelectorAll('pre.ex').forEach(pre => {
  const code = pre.textContent;
  const b = document.createElement('button');
  b.className = 'btn sm'; b.textContent = '▶ Chalao';
  b.onclick = () => { setCode(code); mark(null); run(); $('playground').scrollIntoView(); };
  pre.innerHTML = highlight(code);
  pre.appendChild(b);
});

// keyword table language.js theke toiri (keyword bodlale ekhane auto bodlabe)
$('kw').innerHTML = '<tr><th>Bogura shobdo</th><th>Mane</th></tr>' +
  `<tr><td><code>${ENTRY}</code> / <code>${EXIT}</code></td><td>program shuru / shesh</td></tr>` +
  KEYWORDS.map(k => `<tr><td><code>${k[0]}</code></td><td>${k[2]}</td></tr>`).join('');

// playground er upor-er example button gulo (js/examples.js theke)
const chips = $('chips');
function mark(btn) { chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === btn)); }
EXAMPLES.forEach(ex => {
  const b = document.createElement('button');
  b.className = 'chip'; b.type = 'button'; b.textContent = ex.name;
  b.onclick = () => { setCode(ex.code); mark(b); run(); };
  chips.appendChild(b);
});
src.addEventListener('input', () => mark(null));

// website khulle prothome main.m er code dekhay
setCode(MAIN_CODE);
mark(null);
run();
