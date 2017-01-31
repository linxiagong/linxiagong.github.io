'use strict';
var _number_of_user;
var _count_of_prime;
var smallNum = 1;
var largeNum  = 0;
var E_NOT_INT = -1;
var E_TOO_SMALL = -2;

var isInt = function(x) {
	if (isNaN(x)) {
            return false;
        }
        if (x > -9007199254740992 && x <= 9007199254740992 && Math.floor(x) == x) {
            return true;
	}
};

function display_result(state){
	//alert(_number_of_user);
	//alert('prime numbers = ' + _count_of_prime);
	document.getElementById('hidden').style.display = "inline-block";
	if(state == 1) {
		document.getElementById('_count_of_prime').innerHTML = "numbers of primes smaller than "+_number_of_user+" = "+_count_of_prime;
	} else if(state == 0) {
		document.getElementById('_count_of_prime').innerHTML = "number over 1 billion: estimated count for "+_number_of_user+" = "+_count_of_prime;
	} else if (state == E_NOT_INT) {
		document.getElementById('_count_of_prime').innerHTML = " Please enter integers :) ";
	} else if (state == E_TOO_SMALL) {
		document.getElementById('_count_of_prime').innerHTML = "numbers of primes smaller than "+_number_of_user+" = 0";
	}
	
}

function prime_counting(){
	_count_of_prime = 0;
	_number_of_user = document.getElementById('_number_of_user').value;
	//alert(_number_of_user);
	if (!isInt(_number_of_user)) {
		display_result(E_NOT_INT);
	}else if (_number_of_user <= 1) {
		display_result(E_TOO_SMALL);
	}else if (_number_of_user <= 1000000000) {
		_count_of_prime = Primesieve(_number_of_user, smallNum);
		display_result(smallNum);
	} else {
		_count_of_prime = Primesieve(_number_of_user, largeNum);
		display_result(largeNum);
	}
	
	
}

