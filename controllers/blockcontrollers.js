const crypto = require('crypto')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const key = ec.genKeyPair()
const publicKey = key.getPublic('hex')
const privateKey1 = key.getPrivate('hex')
const privateKey2 = key.getPrivate('hex')
console.log('public key' + publicKey)
console.log('privateKey '+ privateKey1)
console.log('privateKey '+ privateKey2)
class Transaction{
	constructor(fromAddress,toAddress,amount){
		this.fromAddress = fromAddress
		this.toAddress = toAddress
		this.amount = this.amount
	}
}
class Block{
	constructor(index, timetamp,data,preHash =""){
		this.index = index
		this.timetamp = timetamp
		this.data =data
		this.preHash = preHash
		this.hash = this.calculateHash()
		this.nonce = 0
		
	}
	calculateHash(){
		return crypto.createHmac('sha256','12312321')
                   .update(this.index + this.preHash + this.timetamp + JSON.stringify(this.data) + this.nonce)
                   .digest('hex')
	}
	mineBlock(difficulty){
		while(String(this.hash).substring(0,difficulty) !== Array(difficulty + 1).join('0')){
			this.nonce++
			this.hash = this.calculateHash()
		}
		console.log("Block mined: "+ this.hash)
	}
}
class Blockchain{
	constructor(){
		this.chain = [this.createGenesisBlock()]
		this.difficulty = 4
	}
	createGenesisBlock(){
		return new Block(0,'01/01/2017','Geneis block',"0")
	}
	getLastestBlock(){
		return this.chain[this.chain.length -1]
	}
	addBlock(newBlock){
		newBlock.preHash = this.getLastestBlock().hash
		newBlock.mineBlock(this.difficulty)
		this.chain.push(newBlock)
	}
	isChainValid(){
		for(var i = 1; i < this.chain.length; i++){
			const curBlock = this.chain[i]
			const preBlock = this.chain[i-1]
			if(curBlock.hash !== curBlock.calculateHash())
			{
				return false;
			}
			if(curBlock.preHash !== preBlock.hash)
				return false
		}
		return true
	}
}

let coin = new Blockchain()
coin.addBlock(new Block(1,'10/12/2017',{amount:4}))
