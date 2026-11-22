/* =====================================================
   1) LANGUAGE DESIGN — keyword table (nijer moto bodlao)
   [bogura shobdo, internal token, mane]
   ===================================================== */
const ENTRY = 'ayen vai', EXIT = 'ashi vai';
const KEYWORDS = [
  ['dhor re',          'DECL',     'variable banano (let)'],
  ['bol na',           'PRINT',    'output dekhano (print)'],
  ['jodi dekh',        'IF',       'jodi (if)'],
  ['nahoy jodi dekh',  'ELIF',     'na hole jodi (else if)'],
  ['nahoy dekh',       'ELSE',     'na hole (else)'],
  ['jotokkhon dekh',   'WHILE',    'loop (while)'],
  ['age kor',          'DO',       'age ekbar koro, tarpor condition dekho (do-while)'],
  ['ghur re',          'FOR',      'ginti-r loop (for)'],
  ['kaj kor',          'FUNC',     'function banano'],
  ['ferot de',         'RETURN',   'function theke fol ferot (return)'],
  ['thama re',         'BREAK',    'loop theke berono (break)'],
  ['porer ta dekh',    'CONTINUE', 'porer ghurte jao (continue)'],
  ['thik',             'TRUE',     'true'],
  ['bhul',             'FALSE',    'false'],
  ['faka',             'NULL',     'null']
];
const KW_BY_PHRASE = Object.fromEntries(KEYWORDS.map(k => [k[0], k[1]]));
const KW_NAME = Object.fromEntries(KEYWORDS.map(k => [k[1], k[0]]));

class BograError extends Error { constructor(msg, line) { super(msg); this.line = line; } }
const fail = (msg, line) => { throw new BograError(msg, line); };
