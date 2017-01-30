/**
   A primesieve, full implementation.
   @namespace primesieve
*/
var primesieve = (function() {
    "use strict";
    /**
       Basket for the easier return of the functions of this module
       @memberof primesieve
       @private
    */
    var Primesieve = {};
    /**
       Real size of the sieve in bits.
       @memberof primesieve
       @private
    */
    var primelimit = 0;
    /**
       Buffer for the <code>ArrayBuffer</code>
       @memberof primesieve
       @private
    */
    var buffer;
    /**
       The actual sieve.
       @memberof primesieve
       @private
    */
    var primesieve;
    /**
       The guard limit of the primesieve.<br>
       Currently set to one megabibyte, which can hold more than half a million
       primes.
       @memberof primesieve
       @constant  {number}
       @default
       @see primesieve.raiseLimit
    */
    var primesizelimit = 0x100000000; // ? megabyte
    /**
       A [2, 3, 5, 7, 11] wheel for factoring
       @memberof primesieve
       @private
    */
    var wheel = [
        1, 2, 2, 4, 2, 4, 2, 6, 4, 2, 4, 6, 6, 2, 6, 4, 2, 6, 4, 6, 8, 4, 2,
        4, 2, 4, 14, 4, 6, 2, 10, 2, 6, 6, 4, 2, 4, 6, 2, 10, 2, 4, 2, 12,
        10, 2, 4, 2, 4, 6, 2, 6, 4, 6, 6, 6, 2, 6, 4, 2, 6, 4, 6, 8, 4, 2,
        4, 6, 8, 6, 10, 2, 4, 6, 2, 6, 6, 4, 2, 4, 6, 2, 6, 4, 2, 6, 10, 2,
        10, 2, 4, 2, 4, 6, 8, 4, 2, 4, 12, 2, 6, 4, 2, 6, 4, 6, 12, 2, 4, 2,
        4, 8, 6, 4, 6, 2, 4, 6, 2, 6, 10, 2, 4, 6, 2, 6, 4, 2, 4, 2, 10, 2,
        10, 2, 4, 6, 6, 2, 6, 6, 4, 6, 6, 2, 6, 4, 2, 6, 4, 6, 8, 4, 2, 6,
        4, 8, 6, 4, 6, 2, 4, 6, 8, 6, 4, 2, 10, 2, 6, 4, 2, 4, 2, 10, 2, 10,
        2, 4, 2, 4, 8, 6, 4, 2, 4, 6, 6, 2, 6, 4, 8, 4, 6, 8, 4, 2, 4, 2, 4,
        8, 6, 4, 6, 6, 6, 2, 6, 6, 4, 2, 4, 6, 2, 6, 4, 2, 4, 2, 10, 2, 10,
        2, 6, 4, 6, 2, 6, 4, 2, 4, 6, 6, 8, 4, 2, 6, 10, 8, 4, 2, 4, 2, 4,
        8, 10, 6, 2, 4, 8, 6, 6, 4, 2, 4, 6, 2, 6, 4, 6, 2, 10, 2, 10, 2, 4,
        2, 4, 6, 2, 6, 4, 2, 4, 6, 6, 2, 6, 6, 6, 4, 6, 8, 4, 2, 4, 2, 4, 8,
        6, 4, 8, 4, 6, 2, 6, 6, 4, 2, 4, 6, 8, 4, 2, 4, 2, 10, 2, 10, 2, 4,
        2, 4, 6, 2, 10, 2, 4, 6, 8, 6, 4, 2, 6, 4, 6, 8, 4, 6, 2, 4, 8, 6,
        4, 6, 2, 4, 6, 2, 6, 6, 4, 6, 6, 2, 6, 6, 4, 2, 10, 2, 10, 2, 4, 2,
        4, 6, 2, 6, 4, 2, 10, 6, 2, 6, 4, 2, 6, 4, 6, 8, 4, 2, 4, 2, 12, 6,
        4, 6, 2, 4, 6, 2, 12, 4, 2, 4, 8, 6, 4, 2, 4, 2, 10, 2, 10, 6, 2, 4,
        6, 2, 6, 4, 2, 4, 6, 6, 2, 6, 4, 2, 10, 6, 8, 6, 4, 2, 4, 8, 6, 4,
        6, 2, 4, 6, 2, 6, 6, 6, 4, 6, 2, 6, 4, 2, 4, 2, 10, 12, 2, 4, 2, 10,
        2, 6, 4, 2, 4, 6, 6, 2, 10, 2, 6, 4, 14, 4, 2, 4, 2, 4, 8, 6, 4, 6,
        2, 4, 6, 2, 6, 6, 4, 2, 4, 6, 2, 6, 4, 2, 4, 12
    ];
    /**
       This sieve works with normal Arrays, too
       @memberof primesieve
       @private
    */
    if (typeof Uint32Array === 'undefined') {
        Uint32Array = Array;
        ArrayBuffer = function() {
            return 0;
        };
    }
    /**
       30*log(113)/113 see also {@link http://oeis.org/A209883 }
       @memberof primesieve
       @private
    */
    var LN_113 = 1.25505871293247979696870747618124469168920275806274;
    /**
       Rosser, J. B. and Schoenfeld, L. <i>Approximate Formulas for Some
       Functions of Prime Numbers.</i> Illinois J. Math. 6, 64-97, 1962
       {@link http://projecteuclid.org/DPubS?service=UI&version=1.0&verb=Display&handle=euclid.ijm/1255631807 }
       @memberof primesieve
       @param {number} limit upper limit of search
       @return {number} Approximation of p(limit)
       @see primesieve.approx_limit
       @private
    */
    var approx_pi = function(limit) {
        //return Math.ceil(5*x/(4*Math.log(x))); // would be more exact for large x
        return Math.ceil( Number(limit)/ (Math.log(limit)-Number(1)) );
        //return Math.ceil( (LN_113 * Number(limit)) / (Number(Math.log(limit))) + Number(2));
    };
    /**
       Upper limit of pi(x). Uses expansion of li(x)-li(2)
       @param {number} limit upper limit of search
       @return {number} Approximation of p(limit)
       @see primesieve.approx_pi
       @memberof primesieve
       @private
    */
    var approx_limit = function(prime_pi) {
        if (prime_pi < 10) {
            return 30;
        }
        // see first term of expansion of li(x)-li(2)
        return Math.ceil(prime_pi * (Math.log(prime_pi * Math.log(
            prime_pi))));
    };
    /**
       Checks if the given argument is a fitting integer
       @memberof primesieve
       @param {number} x an ECMAScript conforming number
       @return {bool}
       @private
    */
    var isInt = function(x) {
        if (isNaN(x)) {
            return false;
        }
        if (x > -9007199254740992 && x <= 9007199254740992 && Math.floor(
                x) == x) {
            return true;
        }
    };
    /**
       Clear bit (set to zero) at given position
       @memberof primesieve
       @param {number} where position of the bit
       @private
    */
    var clear = function(where) {
        primesieve[where >>> 5] &= ~((1 << (31 - (where & 31))));
    };
    /**
       Get value of bit at given position
       @memberof primesieve
       @param {number} where position of the bit
       @return {number} value of bit at given position
       @private
    */
    var get = function(where) {
        return ((primesieve[where >>> 5] >>> ((31 - (where & 31)))) &
            1);
    };
    /**
       Get value next set (value = 1) bit from given position
       @memberof primesieve
       @param {number} where position of the start
       @return {number} position of next set bit or -1
       @private
    */
    var nextset = function(from) {
        while (from < primelimit && !get(from)) {
            from++;
        }
        if (from === primelimit && !get(from)) {
            return -1;
        }
        return from;
    };
    /**
       Get value previous set (value = 1) bit from given position
       @memberof primesieve
       @param {number} where position of the start
       @return {number} position of previous set bit or -1
       @private
    */
    var prevset = function(from) {
        while (from >= 0 && !get(from)) {
            from--;
        }
        if (from == 0 && !get(from)) {
            return -1;
        }
        return from;
    };
    /**
       Fill the primesieve.
       @memberof primesieve
       @param {number} n length of sieve. Maximum available prime is smaller or
                         equal to this argument
       @private
    */
    var fillsieve = function(n) {
        var k, r, j;
        n = n + 1;
        primelimit = n - 1;
        k = Math.ceil(n / 32);
        if (typeof ArrayBuffer !== "function") {
            buffer = new ArrayBuffer(k * 4);
        } else {
            buffer = k;
        }
        primesieve = new Uint32Array(buffer);
        while (k--) {
            primesieve[k] = 0xffffffff;
        }
        clear(0);
        clear(1);
        for (k = 4; k < n; k += 2) {
            clear(k);
        }
        r = Math.floor(Math.sqrt(n));
        k = 0;
        while (k < n) {
            k = nextset(k + 1);
            if (k > r || k < 0) {
                break;
            }
            for (j = k * k; j < n; j += 2 * k) {
                clear(j);
            }
        }
    };
    /**
       Error value for success/no error
       @memberof primesieve
       @constant {number}
       @default
       @private
    */
    var E_SUCCESS = 0;
    /**
       Error value for "not an integer"
       @memberof primesieve
       @constant {number}
       @default
       @private
    */
    var E_ARG_NO_INT = 1;
    /**
       Error value for "Argument given is too low"
       @memberof primesieve
       @constant {number}
       @default
       @private
    */
    var E_ARG_TOO_LOW = 2;
    /**
       Error value for "Argument given is too high"
       @memberof primesieve
       @constant {number}
       @default
       @private
    */
    var E_ARG_TOO_HIGH = 3;
    /**
       Error value for "above guard limit"
       @memberof primesieve
       @constant {number}
       @default
       @private
       @see primesieve.raiseLimit
    */
    var E_ABOVE_LIMIT = 4;
    /**
       Variable to hold error number
       @alias error
       @memberof primesieve
       @constant {number}
       @default
    */
    Primesieve.error = 0;
    /**
       Function to convert an error number into a human readable string
       @alias strerror
       @memberof primesieve
       @return {string} Summary of the error
    */
    Primesieve.strerror = function() {
        var strerrors = [
            "Success",
            "Argument not an integer",
            "Argument too low",
            "Argument too high",
            "Prime wanted is higher than the limit ",
            "Unknown error"
        ];
        var e = Primesieve.error;
        if (e == 0) {
            return strerrors[0];
        }
        if (e < 0 || e > strerrors.length - 1) {
            return strerrors[strerrors.length - 1];
        }
        if (e == E_ABOVE_LIMIT) {
            return strerrors[E_ABOVE_LIMIT] + primesizelimit;
        } else {
            return strerrors[e];
        }
    };
    /**
       Checks if the given number is a small prime (must be in the sieve)<br>
       For larger numbers see {@link primesieve.isPrime}
       @alias isSmallPrime
       @memberof primesieve
       @param {number} prime positive small integer
       @return {bool} or undefined in case of an error
       @see primesieve.isPrime
    */
    Primesieve.isSmallPrime = function(prime) {
        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (prime < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }
        if (prime > primelimit) {
            Primesieve.grow(prime + 100);
            if (Primesieve.error == E_ABOVE_LIMIT) {
                return undefined;
            }
        }
        Primesieve.error = E_SUCCESS;
        if (get(prime) == 1) {
            return true;
        }
        return false;
    };
    /**
       Checks if the given number is a prime.<br>
       Might need a couple of seconds for larger primes.
       @alias isPrime
       @memberof primesieve
       @param {number} prime positive integer &lt; 2<sup><i>53</i></sup>
       @return {bool} or undefined in case of an error
    */
    Primesieve.isPrime = function(n) {
        var length = wheel.length;
        // length of lead of wheel/start of cycle
        var roundstart = 3;
        // first prime
        var factor = 2;
        // cycling index into the wheel
        var next = 0;
        var sqrtn;
        if (!isInt(n)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (n < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }
        Primesieve.error = E_SUCCESS;
        if (n & 1 == 0) {
            return false;
        }
        sqrtn = Math.floor(Math.sqrt(n));
        // check for perfect squares.
        if (sqrtn * sqrtn == n) {
            return false;
        }
        while (factor < sqrtn) {
            if (n % factor == 0) {
                return false;
            }
            factor += wheel[next];
            next++;
            if (next == length) {
                next = roundstart;
            }
        }
        return true;
    };
    /**
       Returns factors of argument<br>
       Returns all factors in an array, for a different format
       {@link primesieve.primeDecomposition}
       @alias factor
       @memberof primesieve
       @param {number} prime positive integer &lt; 2<sup><i>53</i></sup>
       @return {array} list of all factors in increasing order or undefined in
                      case of an error
       @see primesieve.primeDecomposition
    */
    Primesieve.factor = function(n) {
        var length = wheel.length;
        var roundstart = 3;
        var factor = 2;
        var next = 0;
        var result = [];
        if (!isInt(n)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (n < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }
        Primesieve.error = E_SUCCESS;
        while (factor * factor <= n) {
            while (n % factor == 0) {
                result.push(factor);
                n /= factor;
            }
            factor += wheel[next];
            next++;
            if (next == length) {
                next = roundstart;
            }
        }
        if (n > 1) {
            result.push(n);
        }
        return result;
    };
    /**
       Returns factors of argument as tuples (prime, exponent)<br>
       For a different format  see {@link primesieve.factor}
       @alias primeDecomposition
       @memberof primesieve
       @param {number} prime positive integer &lt; 2<sup><i>53</i></sup>
       @return {array} list of all factors in increasing order as tuples of the
                      form (prime, exponent) packed into an array or undefined
                      in case of an error
       @see primesieve.factor
    */
    Primesieve.primeDecomposition = function(n) {
        var length = wheel.length;
        var roundstart = 3;
        var factor = 2;
        var next = 0;
        var result = [];
        // a short array, because p(41) = max. primorial < 2^53
        var counter = [];
        var idx;
        if (!isInt(n)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (n < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }
        Primesieve.error = E_SUCCESS;
        while (factor * factor <= n) {
            while (n % factor == 0) {
                idx = counter.indexOf(factor);
                if (idx < 0) {
                    counter.push(factor);
                    result.push([factor, 1]);
                } else {
                    result[idx][1] ++;
                }
                n /= factor;
            }
            factor += wheel[next];
            next++;
            if (next == length) {
                next = roundstart;
            }
        }
        if (n > 1) {
            idx = counter.indexOf(n);
            if (idx < 0) {
                result.push([n, 1]);
            } else {
                result[idx] ++;
            }
        }
        return result;
    };
    /**
       Returns prime greater than argument
       @alias nextPrime
       @memberof primesieve
       @param {number} prime positive small integer
       @return {number} Next prime or undefined in case of an error
    */
    Primesieve.nextPrime = function(prime) {
        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        }
        if (prime < 0) {
            return 2;
        }
        if (prime > primelimit) {
            Primesieve.grow(prime + 100);
            if (Primesieve.error == E_ABOVE_LIMIT) {
                return undefined;
            }
        }
        Primesieve.error = E_SUCCESS;
        return nextset(prime);
    };
    /**
       Returns prime greater than argument
       @alias precPrime
       @memberof primesieve
       @param {number} prime positive small integer
       @return {number} Preceding prime or undefined in case of an error
    */
    Primesieve.precPrime = function(prime) {
        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (prime < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }
        if (prime > primelimit) {
            Primesieve.grow(prime + 100);
            if (Primesieve.error == E_ABOVE_LIMIT) {
                return undefined;
            }
        }
        Primesieve.error = E_SUCCESS;
        return prevset(prime);
    };
    /**
       Number of primes up to argument (counts primes in sieve)
       @alias primePi
       @memberof primesieve
       @param {number} prime positive small integer
       @return {number} Number of primes or undefined in case of an error
    */
    Primesieve.primePi = function(prime) {
        var k = 0;
        var ct = 0;
        var _to_grow;

        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (prime < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }

        if (prime > primelimit) {
            _to_grow = Number(prime)+Number(100);
            Primesieve.grow(_to_grow);
            if (Primesieve.error == E_ABOVE_LIMIT) {
                alert('Ooops...Your number is too large, please try number less than ' + (Number(primesizelimit)-Number(100)));
                return undefined;
            }
        }

        while (k < prime) {
            k = nextset(k + 1);
            if (k > primelimit || k < 0 || k > prime) {
                break;
            }
            ct++;
        }
        Primesieve.error = E_SUCCESS;
        return ct;
    };
    /**
       Number of primes up to argument (approximation independant of sieve)
       @alias primePiApprox
       @memberof primesieve
       @param {number} prime positive small integer
       @return {number} Number of primes or undefined in case of an error
    */
    Primesieve.primePiApprox = function(prime) {
        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (prime < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }
        Primesieve.error = E_SUCCESS;
        return approx_pi(prime);
    };
    /**
       Produces an Array holding all primes between <code>low</code> and <code>high</code>
       @alias primeRange
       @memberof primesieve
       @param {number} low positive small integer
       @param {number} high positive small integer
       @return {array} Primes between <code>low</code> and <code>high</code> or
                       undefined in case of an error
    */
    Primesieve.primeRange = function(low, high) {
        var down = 0,
            up = 0,
            ret = [],
            i = 1;

        if (!isInt(low) || !isInt(high)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (low < 0) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        } else if (low > high) {
            /* try again, maybe just a fluke */
            return Primesieve.primeRange(high, low);
        }

        if (primelimit < high) {
            Primesieve.grow(high + 100);
            if (Primesieve.error == E_ABOVE_LIMIT) {
                return undefined;
            }
        }
        down = nextset(low);
        up = prevset(high);
        ret[0] = down;
        if (down == up) {
            return ret;
        }
        while (down < up) {
            down = nextset(down + 1);
            if (down > high || down < 0) {
                break;
            }
            ret[i++] = down;
        }
        Primesieve.error = E_SUCCESS;
        return ret;
    };
    /**
       Produces an Array with the primes between zero and the given argument
       @alias primes
       @memberof primesieve
       @param {number} prime positive small integer
       @return {array} Primes between zero and the given argument
    */
    Primesieve.primes = function(prime) {
        var ret, k, count, limit, i;
        limit = approx_limit(prime);

        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (prime < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }

        if (primelimit < limit) {
            Primesieve.grow(limit);
            if (Primesieve.error == E_ABOVE_LIMIT) {
                return undefined;
            }
        }
        ret = [];
        k = 0;
        i = 0;
        count = prime;
        while (count--) {
            k = nextset(k + 1);
            if (k > primelimit || k < 0) {
                break;
            }
            ret[i++] = k;
        }
        Primesieve.error = E_SUCCESS;
        return ret;
    };
    /**
       Grows the sieve to the size given by the argument. Does not reduce the size
       or increment the sieve, it just produces a new sieve of the given size.
       @alias grow
       @memberof primesieve
       @param {number} alot positive small integer
       @return {bool} undefined in case of an error
       @see primesieve.raiseLimit
    */
    Primesieve.grow = function(alot) {
        if (!isInt(alot)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (alot < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        } else if (alot > primesizelimit) {
            //alert('primesizelimit = '+primesizelimit+' alot now= '+alot);
            Primesieve.error = E_ABOVE_LIMIT;
            return undefined;
        } else if (alot > primelimit) {
            Primesieve.error = E_SUCCESS;
            fillsieve(alot);
        }
        /* else {
                   Do nothing for now
                }*/
    };
    /**
       Grows the sieve to the size given by the argument. Does not reduce the size
       or increment the sieve, it just produces a new sieve of the given size.
       @alias fill
       @memberof primesieve
       @param {number} alot positive small integer
       @return {bool} or undefined in case of an error
       @see primesieve.raiseLimit
       @see primesieve.grow
    */
    Primesieve.fill = Primesieve.grow;
    /**
       To avoid unexpected surprises this primesieve has an in-build limit for
       the size of the primesieve of one megabyte. Does not lower the limit.
       @alias raiseLimit
       @memberof primesieve
       @param {number} raise size of the new maximum in bits
       @return {bool} undefined in case of an error
    */
    Primesieve.raiseLimit = function(raise) {
        if (!isInt(raise)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (raise < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        } else if (raise > primesizelimit) {
            Primesieve.error = E_SUCCESS;
            primesizelimit = raise;
        }
    };
    /**
       Returns the raw prime-sieve. It might be an <code>Array</code> or a
       <code>TypedArray</code>, so please check before use.
       @alias sieve
       @memberof primesieve
       @return {primesieve} the raw primesieve
    */
    Primesieve.sieve = function() {
        return primesieve;
    };
    return Primesieve;
})( /* You may place a start-size here */ );

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = primesieve;
} else {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return primesieve;
        });
    } else {
        window.primesieve = primesieve;
    }
}
