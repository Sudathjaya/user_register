var express = require('express');
var app = express();
var storage = require('node-persist');

// app.get('/', function(req, res) {
// 	// render to views/index.ejs template file
// 	res.render('user/login', {title: 'My Node.js Application'})
// });
app.get('/', function(req, res, next){	
	// render to views/user/add.ejs
	
	res.render('user/login', {
		title: '',
		email: ''	,
		password: ''
			
	})
});
app.get('/logout', function(req, res, next) {
	storage.initSync();
	storage.removeItemSync('adminId');
		

});
// app.get('/signup', function(req, res, next){	
// 	// render to views/user/add.ejs
// 	res.render('user/signup', {
// 		title: '',
// 		email: ''	,
// 		password: ''
			
// 	})
// })
app.post('/', function(req, res, next){	
	var post=req.body
	console.log("req.body",req.body.email);
	req.getConnection(function(error, conn) {
	conn.query("select id from users WHERE email='"+post.email+"' and password='"+post.password+"' and identifiar='8'",function(err, rows, fields) {
		//if(err) throw err
		storage.initSync();
		if (err) {
			console.log(err)
			res.render('user/login', {
				title: '',
				email: ''	,
				password: ''
					
			});
		} else if(rows.length <= 0) {
			res.render('user/login', {
				title: '',
				email: ''	,
				password: '',
				error:'Not Register'
					
			});
		}else{
	// render to views/user/list.ejs template file
	storage.setItemSync('adminId',rows[0].id);
	// var admin_id=storage.getItemSync('adminId');
	
	res.render('user/list', {
		title: 'User List', 
		data: rows
	});
		}
	})

})
})
app.get('/signup', function(req, res, next){	
	// render to views/user/add.ejs
	
	res.render('user/signup', {
		title: '',
		fname: '',
		lname: '',
		address: ''	,
		city: '',
		state: ''	,
		zip: '',
		designation: ''	,
		company: '',
		phone: ''	,
		email: '',
		password: ''
			
	})
});
app.post('/register', function(req, res, next){	
	var post=req.body
	console.log("req.body",req.body);
    
	req.getConnection(function(error, conn) {
	conn.query("select * from users WHERE email='"+post.email+"' and identifiar='8'",function(err, rows, fields) {
		console.log("olkkk",rows.length);
		
		if (err) {
			console.log(err)
			res.render('user/signup', {
				title: '',
				email: ''	,
				password: ''
					
			});
		} else if(rows.length <= 0) {
			// console.log("olkkk",rows.count);
			req.getConnection(function(error, conn) {
				conn.query("INSERT INTO users(fname,lname,address,city,state,zip,designation,company,phone,email,identifiar,password) VALUES ('"+post.fname+"','"+post.lname+"','"+post.address+"','"+post.city+"','"+post.state+"','"+post.zip+"','"+post.designation+"','"+post.company+"','"+post.phone+"','"+post.email+"','"+"8"+"','"+post.password+"')",function(err, rows, fields) {
					//if(err) throw err
					if (err) {
						console.log(err)
						res.render('user/signup', {
							title: '',
							fname: '',
							lname: '',
							address: ''	,
							city: '',
							state: ''	,
							zip: '',
							designation: ''	,
							company: '',
							phone: ''	,
							email: '',
							password: ''
								
						});
					} else{
				// render to views/user/list.ejs template file
				res.render('user/login', {
					title: '',
					email: ''	,
					password: ''
						
				});
					}
				})
			
			})
		}else if(rows.length > 0){
	// render to views/user/list.ejs template file
	res.render('user/login', {
		title: '',
		email: ''	,
		password: ''
			
	});
		}
	})

})
})

module.exports = app;
