
/*
 * GET users listing.
 */

var mongoose = require('mongoose');
 
var UserSchema = mongoose.Schema({
      username : String,
      password : String,
      email : String
	});
//ar User = mongoose.model('myusers', UserSchema);


exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function (req, res) {
	if (req.isAuthenticated()) {
       res.redirect('/');
     } else 
     res.render('login', { title: 'My Test App!!' });
};

exports.register = function (req, res) {
	 if (req.isAuthenticated()) {
       res.redirect('/');
     } else 
     res.render('register', { title: 'My Test App!!' });
};

exports.users = function (req, res) {
	 if (req.isAuthenticated()) {
	 var User = mongoose.model('users');	
     User.find(function (err,users) {
           res.render('users', { title: 'My Test App!!' , user :req.user, userlist : users});
       });
     } else 
     res.redirect('/login');
};

exports.logout = function (req, res) {
	  req.logout();
      res.redirect('/');
};