/* =====================================================
   MAIN_CODE — main.m file er code. Website khulle playground-e
   prothome eita-i dekhay. main.m bodlale ekhaneo same bodlao.
   ===================================================== */
const MAIN_CODE = `ayen vai
  // Bogura-r vasai te hello
  dhor re naam = "Bogura";
  bol na "Ki khobor", naam;

  dhor re i = 0;
  jotokkhon dekh (i < 5) {
    i += 1;
    bol na i;
  }
ashi vai`;

/* =====================================================
   EXAMPLES — playground er upor-er button gulor code
   notun example jog korte shudhu ekta { name, code } jog koro
   ===================================================== */
const EXAMPLES = [
  { name: 'Hello', code: `ayen vai
  bol na "Assalamu Alaikum, Bogura!";
ashi vai` },

  { name: 'Variable', code: `ayen vai
  dhor re naam = "Munna";
  dhor re boyosh = 20;
  boyosh += 1;
  bol na naam, boyosh;
ashi vai` },

  { name: 'Shorto', code: `ayen vai
  dhor re number = 15;
  jodi dekh (number % 2 == 0) {
    bol na number, "jor shonkhya";
  } nahoy dekh {
    bol na number, "bijor shonkhya";
  }
ashi vai` },

  { name: 'Loop', code: `ayen vai
  // Bogura-r vasai te hello
  dhor re naam = "Bogura";
  bol na "Ki khobor", naam;

  dhor re i = 0;
  jotokkhon dekh (i < 10) {
    i += 1;
    jodi dekh (i == 3) {
      porer ta dekh;
    }
    jodi dekh (i == 7) {
      thama re;
    }
    bol na i;
  }
ashi vai` },

  { name: 'Do-while', code: `ayen vai
  dhor re i = 10;
  age kor {
    bol na "i =", i;
    i += 1;
  } jotokkhon dekh (i < 5);
ashi vai` },

  { name: 'For loop', code: `ayen vai
  dhor re jog = 0;
  ghur re (dhor re i = 1; i <= 5; i++) {
    jog += i;
  }
  bol na "1 theke 5 er jog:", jog;
ashi vai` },

  { name: 'Function', code: `ayen vai
  kaj kor jog(a, b) {
    ferot de a + b;
  }
  bol na "2 + 3 =", jog(2, 3);
  bol na "10 + 25 =", jog(10, 25);
ashi vai` },

  { name: 'Namota', code: `ayen vai
  dhor re n = 7;
  dhor re i = 1;
  jotokkhon dekh (i <= 10) {
    bol na n, "x", i, "=", n * i;
    i += 1;
  }
ashi vai` },

  { name: 'Fibonacci', code: `ayen vai
  dhor re a = 0;
  dhor re b = 1;
  dhor re i = 0;
  jotokkhon dekh (i < 10) {
    bol na a;
    dhor re t = a + b;
    a = b;
    b = t;
    i += 1;
  }
ashi vai` },

  { name: 'Mool shonkhya', code: `ayen vai
  dhor re n = 29;
  dhor re i = 2;
  dhor re mool = thik;
  jotokkhon dekh (i * i <= n) {
    jodi dekh (n % i == 0) {
      mool = bhul;
      thama re;
    }
    i += 1;
  }
  jodi dekh (mool) {
    bol na n, "ekta mool shonkhya";
  } nahoy dekh {
    bol na n, "mool shonkhya na";
  }
ashi vai` },

  { name: 'Bhul dekho', code: `ayen vai
  dhor re a = 10;
  bol na "shuru";
  bol na a + b;
ashi vai` }
];
