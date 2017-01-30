function Primesieve(max, smallNum) {
  var p = primesieve;
  var primepi;
  //alert(smallNum);

  if( smallNum ) {
  	//alert('smallNum');
  	primepi = p.primePi(max);
  	return primepi;
  } else {
  	primepi = p.primePiApprox(max);
  	return primepi;
  }
  
}