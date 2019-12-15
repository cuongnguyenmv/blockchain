const sql = require('mssql')
const db = {
        user: 'sa',
        password: 'Cu@ng123',
        server: '127.0.0.1', 
        database: 'Blockchain',
        port: 1433
    }
const connection = sql.connect(db, function (err) {
        if (err) console.log(err);
    });
module.exports = {
	getUser: async (user) => {
		var request = sql.connect(db).then((pool) => {
			pool.request().input('user',sql.VarChar(100),user)
			.query("select * FROM Users where email = @user")
		}).then((result ) => {
			 if (result)
   				return true;
   			else return false;
		})
		// console.log(request.recordset)
	},
	regisUser: (name, email, password, wallet, prehash  ) => {
		var request =  new  sql.ConnectionPool(db).connect().then((pool) => {
			pool.request().input('email',sql.VarChar(100),email)
			.input('name',sql.NVarChar(100),name)
			.input('pass',sql.VarChar(100),password)
			.input('wallet',sql.VarChar(100),wallet)
			.input('prehash',sql.VarChar(100),prehash)
			.query("insert into Users(name,email,pass,wallet,prehash,created_at,updated_at) values(@name,@email,@pass,@wallet,@prehash,getdate(),getdate())")
		}).then((res) => {
			if(res)
				console.log('successfull')
		}).catch(function (err) {
                    console.log(err);
                });	
	}


}