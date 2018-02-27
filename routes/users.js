var express = require('express')
var app = express();
var storage = require('node-persist');

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
	storage.initSync();
	var ident=storage.getItemSync('adminId');
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users where identifiar='+ident,function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('user/list', {
					title: 'User List', 
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('user/list', {
					title: 'User List', 
					data: rows
				})
			}
		})
	})
});


// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
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


// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	// req.assert('fname', 'Name is required').notEmpty()  
	// req.assert('lname', 'Name is required').notEmpty()             //Validate name
	req.assert('password', 'Password is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		storage.initSync();
		var identy=storage.getItemSync('adminId');
		var user = {
			fname: req.sanitize('fname').escape().trim(),
			lname: req.sanitize('lname').escape().trim(),
			address: req.sanitize('address').escape().trim(),
			city: req.sanitize('city').escape().trim(),
			state: req.sanitize('state').escape().trim(),
			zip: req.sanitize('zip').escape().trim(),
			designation: req.sanitize('designation').escape().trim(),
			company: req.sanitize('company').escape().trim(),
			phone: req.sanitize('phone').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			identifiar:identy,
			password: req.sanitize('password').escape().trim(),
	
			
		}
		
		req.getConnection(function(error, conn) {
			
				conn.query("INSERT INTO users(fname,lname,address,city,state,zip,designation,company,phone,email,identifiar,password) VALUES ('"+user.fname+"','"+user.lname+"','"+user.address+"','"+user.city+"','"+user.state+"','"+user.zip+"','"+user.designation+"','"+user.company+"','"+user.phone+"','"+user.email+"','"+user.identifiar+"','"+user.password+"')",function(err, rows, fields) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/add', {
						title: 'Add New User',
						fname: user.fname,
						lname: user.lname,
						address: user.address,
						city: user.city,
						state: user.state,
						zip: user.zip,
						designation: user.designation,
						company: user.company,
						phone: user.phone,
						email: user.email,
						password: user.password				
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					res.render('user/add', {
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
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/add', { 
            title: '',
			fname: req.body.fname,
			lname: req.body.lname,
			address: req.body.address,
			city: req.body.city,
			state: req.body.state,
			zip: req.body.zip,
			designation: req.body.designation,
			company: req.body.company,
			phone: req.body.phone,
			email: req.body.email,
			password: req.body.password
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users WHERE id = ' + req.params.id, function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'User not found with id = ' + req.params.id)
				res.redirect('/users')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('user/edit', {
					title: 'Edit User', 
					//data: rows[0],
					id: rows[0].id,
					fname: rows[0].fname,
					lname: rows[0].lname,
					designation:rows[0].designation,
					email: rows[0].email					
				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('fname', 'First Name is required').notEmpty()           //Validate name
	req.assert('lname', 'Last Name is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			fname: req.sanitize('fname').escape().trim(),
			lname: req.sanitize('lname').escape().trim(),
			designation:req.sanitize('designation').escape().trim(),
			email: req.sanitize('email').escape().trim()
			
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						fname: req.body.fname,
						lname: req.body.lname,
						designation:req.body.designation,
						email: req.body.email
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						fname: req.body.fname,
						lname: req.body.lname,
						designation:req.body.designation,
						email: req.body.email
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id,
			fname: req.body.fname,
			lname: req.body.lname,
			designation:req.body.designation,
			email: req.body.email
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM users WHERE id = ' + req.params.id, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/users')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/users')
			}
		})
	})
})

module.exports = app
