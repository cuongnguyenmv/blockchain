const sql = require('mssql')
const db = {
        user: 'sa',
        password: 'Cu@ng123',
        server: '127.0.0.1', 
        database: 'Blockchain',
        port: 1433
    }
module.exports.myfunc = function() {
	return {
		saveBlock: async (id, prehas, timest , nonce , curhas ) => {
		var connect = new  sql.ConnectionPool(db).connect().then((pool) => {
			pool.request()
			.input('id',sql.Int,id)
			.input('prehas',sql.VarChar(100),prehas)
			.input('timest',sql.VarChar(100),timest)
			.input('nonce',sql.Int,nonce)
			.input('curhas',sql.VarChar(100) ,curhas)
			.query("insert into curBlock(id,prehas,timest,nonce,curhas,updated_at,created_at) values(@id,@prehas,@timest,@nonce,@curhas,getdate(),getdate())")

		}).catch(function (err) {
                    console.log(err);
                })
	
	},
	curBlock:  function(callback) {
	 	let pool = sql.connect(db)
	 	var request = new sql.Request()
	 	request.stream = true
	 	request.query("SELECT TOP 1 * FROM curBlock order by id DESC")
	 	request.on('row', row  => {
	 		callback = row.curhas
	 	})
	
	 	return callback
	}
	}

		
		
	
}