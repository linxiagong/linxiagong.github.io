'use strict';
var _number_of_user;
var _count_of_prime;


function display_result(){
	//alert(_number_of_user);
	//alert('prime numbers = ' + _count_of_prime);
	document.getElementById('hidden').style.display = "inline-block";
	document.getElementById('_count_of_prime').innerHTML = "numbers of primes smaller than "+_number_of_user+" = "+_count_of_prime;
}

function prime_counting(){
	_count_of_prime = 0;
	_number_of_user = document.getElementById('_number_of_user').value;

	var start = new Date().getTime();
	
	_count_of_prime = Primesieve(_number_of_user);
	
	display_result();
}

