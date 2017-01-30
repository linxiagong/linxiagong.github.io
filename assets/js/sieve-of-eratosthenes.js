function sieveOfErathosthenes(max) {
  var flags = [];
  //var primes = [];
  var count = 0;
  var prime = 2;

  var n = max;
  while(n--) {
    flags[max-n] = true;
  }

  for (prime = 2; prime < Math.sqrt(max); prime++) {
    if (flags[prime]) {
      for (var j = prime + prime; j < max; j += prime) {
        flags[j] = false;
      }
    }
  }

    for (var i = 2; i < max; i++) {
      if (flags[i]) {
        //primes.push(i);
        count ++;
      }
    }

  //return primes;
  return count;
}