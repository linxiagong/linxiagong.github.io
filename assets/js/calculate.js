'use strict';
var _number_of_user;
var _count_of_prime;
var smallNum = 1;
var largeNum  = 0;

function display_result(smallNum){
	//alert(_number_of_user);
	//alert('prime numbers = ' + _count_of_prime);
	document.getElementById('hidden').style.display = "inline-block";
	if(smallNum) {
		document.getElementById('_count_of_prime').innerHTML = "numbers of primes smaller than "+_number_of_user+" = "+_count_of_prime;
	} else {
		document.getElementById('_count_of_prime').innerHTML = "number over 1 billion: estimated count for "+_number_of_user+" = "+_count_of_prime;
	}
	
}

function prime_counting(){
	_count_of_prime = 0;
	_number_of_user = document.getElementById('_number_of_user').value;
	//alert(_number_of_user);
	
	if (_number_of_user <= 1000000000) {
		alert("small!!")
		_count_of_prime = Primesieve(_number_of_user, smallNum);
		//alert(_count_of_prime);
		display_result(smallNum);
	} else {
		_count_of_prime = Primesieve(_number_of_user, largeNum);
		display_result(largeNum);
	}
	
	
}

