function sieveOfAtkin(max){
   var limitSqrt = Math.sqrt(max);
   var sieve = [];
   var n;
   var count = 0;

   //prime start from 2, and 3
   sieve[2] = true;
   sieve[3] = true;

   for (var x = 1; x <= limitSqrt; x++) {
       var xx = x*x;
       for (var y = 1; y <= limitSqrt; y++) {
           var yy = y*y;
           if (xx + yy >= max) {
             break;
           }
           // first quadratic using m = 12 and r in R1 = {r : 1, 5}
           n = (4 * xx) + (yy);
           if (n <= max && (n % 12 == 1 || n % 12 == 5)) {
               sieve[n] = !sieve[n];
           }
           // second quadratic using m = 12 and r in R2 = {r : 7}
           n = (3 * xx) + (yy);
           if (n <= max && (n % 12 == 7)) {
               sieve[n] = !sieve[n];
           }
           // third quadratic using m = 12 and r in R3 = {r : 11}
           n = (3 * xx) - (yy);
           if (x > y && n <= max && (n % 12 == 11)) {
               sieve[n] = !sieve[n];
           }
       }
   }

   // false each primes multiples
   for (n = 5; n <= limitSqrt; n++) {
       if (sieve[n]) {
           x = n * n;
           for (i = x; i <= max; i += x) {
               sieve[i] = false;
           }
       }
   }

   for (var i = 2; i < max; i++) {
      if (flags[i]) {
        //primes.push(i);
        count ++;
      }
    }
   //primes values are the one which sieve[x] = true
   return count;
}