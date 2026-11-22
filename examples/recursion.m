ayen vai
  // recursion: fibonacci
  kaj kor fib(n) {
    jodi dekh (n < 2) {
      ferot de n;
    }
    ferot de fib(n - 1) + fib(n - 2);
  }

  dhor re i = 0;
  jotokkhon dekh (i < 10) {
    bol na fib(i);
    i++;
  }
ashi vai
