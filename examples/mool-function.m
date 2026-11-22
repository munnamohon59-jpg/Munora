ayen vai
  /* 1 theke 20 er moddhe mool shonkhya khuje ber kore */
  kaj kor mool(n) {
    jodi dekh (n < 2) {
      ferot de bhul;
    }
    ghur re (dhor re i = 2; i * i <= n; i++) {
      jodi dekh (n % i == 0) {
        ferot de bhul;
      }
    }
    ferot de thik;
  }

  ghur re (dhor re n = 1; n <= 20; n++) {
    jodi dekh (mool(n)) {
      bol na n, "mool shonkhya";
    }
  }
ashi vai
