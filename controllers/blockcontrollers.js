const crypto = require('crypto')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const fs = require('fs')
const blockmodel = require('./../model/BlockModel')
const md5 = require('md5');
// const key = ec.genKeyPair()
// const publicKey = key.getPublic('hex')
// const privateKey1 = key.getPrivate('hex')
// const privateKey2 = key.getPrivate('hex')
// console.log('public key' + publicKey)
// console.log('privateKey '+ privateKey1)




class Transaction{
	constructor(fromAddress,toAddress,amount){
		this.fromAddress = fromAddress
		this.toAddress = toAddress
		this.amount = amount
	}
	calculateHash(){
		return crypto.createHmac('sha256','12312321')
                   .update(this.fromAddress + this.toAddress + this.amount)
                   .digest('hex')
	}
	signTransaction(signingKey){
		if(signingKey.getPublic('hex') !== this.fromAddress)
			throw new Error('You cannot sign transactions for other wallets')
		const hashTx = this.calculateHash()
		const sig = signingKey.sign(hashTx,'base64')
		this.signature = sig.toDER('hex')
	}
	isValid(){
		if(this.fromAddress === null) return true;
		if(!this.signature|| this.signature.length === 0)
			throw new Error('No signature in this transaction')
		const publicKey = ec.keyFromPublic(this.fromAddress,'hex')
		return publicKey.verify(this.calculateHash(),this.signature)
	}
}
class Block{
	constructor(id,timetamp,transaction,preHash =""){
		this.index = id
		this.timetamp = timetamp
		this.preHash = preHash
		this.transaction = transaction
		this.hash = this.calculateHash()
		this.nonce = 0
		
	}
	calculateHash(){
		return crypto.createHmac('sha256','12312321')
                   .update(this.index + this.preHash + this.timetamp + JSON.stringify(this.transaction) + this.nonce)
                   .digest('hex')
	}
	mineBlock(difficulty){
		while(String(this.hash).substring(0,difficulty) !== Array(difficulty + 1).join('0')){
			this.nonce++
			this.hash = this.calculateHash()
		}
		if(blockmodel.myfunc().saveBlock(this.index, this.preHash, this.timetamp , this.nonce , this.hash))
			console.log("Block mined: "+ this.hash)
		else console.log('Errors')
	}
	hashValidTransaction(){
		for(const tx of this.transaction){
			if(!tx.isValid()) return false
		}
	return true
	}
}
class Blockchain{
	constructor(){
		this.index = 0;
		this.chain = [this.createGenesisBlock()]
		this.difficulty = 4
		this.pendingTransaction = []
		this.miningReward = 100;
	}
	createGenesisBlock(){
		return new Block(this.index++ ,'01/01/2017','Geneis block',"0")
	}
	getLastestBlock(){
		return this.chain[this.chain.length -1]
	}
	// addBlock(newBlock){
	// 	newBlock.preHash = this.getLastestBlock().hash
	// 	newBlock.mineBlock(this.difficulty)
	// 	this.chain.push(newBlock)
	// }
	isChainValid(){
		for(var i = 1; i < this.chain.length; i++){
			const curBlock = this.chain[i]
			const preBlock = this.chain[i-1]
			if(!curBlock.hashValidTransaction()) return false
			if(curBlock.hash !== curBlock.calculateHash())
			{
				return false;
			}
			if(curBlock.preHash !== preBlock.hash)
				return false
		}
		return true
	}
	minePendingTransactions(fromadd=null,miningRewardAddress,money,key){
		const tx1 = new Transaction(fromadd,miningRewardAddress,money)
		if(fromadd !== null){
			tx1.signTransaction(keyprivate)
		}
		let block = new Block(this.index++ ,Date.now(),)
		block.preHash = this.getLastestBlock().hash
		block.mineBlock(this.difficulty)
		console.log("Block successfull mined :!!")
		this.chain.push(block)
	}
	addsTransaction(transaction){
		if(!transaction.fromAddress || !transaction.toAddress)
			throw new Error('Transaction must include from and to address')
		if(!transaction.isValid())
			throw new Error('Cannot add invalid transaction to chain')
		this.pendingTransaction.push(transaction)
	}
	getBalanceOfAddress(address){
		let balance = 0 
		for(const block of this.chain){
			for(const trans of block.transaction){
				if(trans.fromAddress === address)
					balance -= trans.amount
				if(trans.toAddress === address)
					balance += trans.amount
			}
		}
		return balance;
	}
}
const coin = new Blockchain()
module.exports = {
	NapTien:(wallets,money)=>{
		coin.minePendingTransactions(wallets,money)
		var data = JSON.stringify(coin,null,4)
		console.log(data)
		fs.writeFile('temp.txt',data,(error) => {
			if(error) console.log(error)
			console.log("successfull")
		})
	},
	GiaoDich:(from , to , money) => {
		
	}


}

  const keyprivate = ec.keyFromPrivate(md5("cuongnguyen07081997@gmail.com"+"Cu@ng123"))
  const wallet = keyprivate.getPublic('hex')

// const tx1 = new Transaction(wallet,'public key goes here',10)
// tx1.signTransaction(keyprivate)
// let coin = new Blockchain()
// coin.addsTransaction(tx1)
// console.log("\n Starting the miner ....")
// coin.minePendingTransactions(wallet)
// coin.minePendingTransactions(wallet)
// coin.minePendingTransactions(wallet)
// coin.minePendingTransactions(wallet)
// console.log("\n Starting the miner ....")
// coin.minePendingTransactions(myWalletAddress)
// console.log(coin.chain)

// fs.writeFile('temp.txt',data,(error) => {
// 	if(error) console.log(error)
// 	console.log("successfull")
// })