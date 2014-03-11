
var mongoose = require('mongoose');
 
var UserSchema = mongoose.Schema({
      username : String,
      password : String,
      email    : String
	});

mongoose.connect('mongodb://localhost/users');
var User = mongoose.model('users', UserSchema);


  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
     console.log("Connection OK!");
     var User = mongoose.model('users', UserSchema);
     var myuser =  new User ({ username : "reinier", password : "123qwe", email : "reiniergs@gmail.com"});
     myuser.save(function (err,user){
     	if (err) console.error(err);
         console.log(user.username);
     });
     User.find(function(err,users) {
     	if (err) console.error(err);
     	console.log(users);
     });
  });


/*function findUser (username,password, done) {
  User.find({ username : username, password : password},function (err,users) {
  	if (err) console.error(err);
  	//console.log(users);
  	console.log(users);
  });
  return done;
}

console.log(findUser('reinier','123qwe'));*/
