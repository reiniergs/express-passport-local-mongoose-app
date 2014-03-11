
/**
 * Module dependencies.
 */
var flash = require('connect-flash');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var exphbs  = require('express3-handlebars');
var helpers = require("./lib/helpers");
var mongoose = require('mongoose');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var UserSchema = mongoose.Schema({
      username : String,
      password : String,
      email : String
	});


mongoose.connect('mongodb://localhost/users');
var User = mongoose.model('users', UserSchema);

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username, password : password }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


 


var app = express();

hbs = exphbs.create({
    defaultLayout: 'main',
    helpers      : helpers,

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'views/templates/',
        'views/partials/'
    ]
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.configure(function() {
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session());
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
});

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));





// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/login', user.login);
app.get('/register', user.register);
app.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login',failureFlash: true })
  );
app.get('/logout',user.logout);
app.get('/users',user.users);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
