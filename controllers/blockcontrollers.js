const crypto = require('crypto')


function ValidHashDifficulty(hash,difficulty = 4){
	console.log(hash)
	for(var i= 0 ; i < 1000 ; i++){
		if(hash[i] !== '0'){
			break;
		}
	}
	return i >= difficulty ;
}

exports.pow = function(){
	var data = '200000'
	var nonce =  0;
	var hash;
	var input;
	var index
	var preHash;
	var timetamp;
	while(!ValidHashDifficulty(hash)){
		nonce = nonce + 1
		input = input + preHash + timetamp + data + nonce
		hash = crypto.createHmac('sha256','12312321')
                   .update(input)
                   .digest('hex')
	}
	console.log(hash)
	return hash;
}
