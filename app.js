
/**
 * Module dependencies.
 */

var express = require('express');
var exphbs  = require('express3-handlebars');
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var hbs = exphbs.create({defaultLayout: 'main'});
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var _ = require('underscore');
var db = require('./database');


var GITHUB_CLIENT_ID = "daf9934c647fd6330d34"
var GITHUB_CLIENT_SECRET = "bd39f3c59ed6d2bf7cb7299988ca2bad9c806ab1";

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  db.collection('accounts').findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new GithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    scope: ['repo']
  },
  function(accessToken, refreshToken, profile, done) {
    var _profile = profile;
    var _done = done;

    var accounts = db.collection('accounts');
    var profile = profile._json;
    var matchObj = {email: profile.email};

    accounts.findOne(matchObj, function(err, account){

      var attributes = {
        name: profile.name,
        administrator: true,
        email: profile.email,
        github: {
          id: profile.id,
          username: profile.login,
          profileUrl: profile.url,
          accessToken: accessToken
        }
      }

      if (account){
        accounts.update(matchObj, attributes);
      } else {
        account = accounts.insert(attributes);
      }

      return _done(null, account);

    })
  }
));






var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(express.session({ secret: 'foobarbaz' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}




app.get('/', routes.index);
app.get('/login', routes.login);

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/files');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/files', function(req, res){
  ensureAuthenticated(req, res, function(){
    db.collection('files').find({account_id: req.user._id}).toArray(function(err, files){
      res.render('files', { title: 'Express', files: files, user: req.user});
    });
  });
});

app.get('/files/:id', function(req, res){
  ensureAuthenticated(req, res, function(){
    db.collection('files').findById(req.params.id, function(err, file){
      res.render('fileshow', {file: file, user: req.user})
    });
  });
});

app.get('/api/files/:id', function(req, res){
  ensureAuthenticated(req, res, function(){
    db.collection('files').findById(req.params.id, function(err, file){
      res.send(file);
    });
  });
});

app.patch('/api/files/:id', function(req, res){
  ensureAuthenticated(req, res, function(){
    var id = req.params.id;
    var _res = res;
    console.log({$set: req.body});
    db.collection('files').updateById(id, {$set: req.body}, function(err){
      console.log(err);
      db.collection('files').findById(id, function(err, file){
        _res.send(file);
      });
    });
  });
});

app.post('/api/files', function(req, res){
  ensureAuthenticated(req, res, function(){
    db.collection('files').insert(_.extend({account_id: req.user._id}, req.body), function(err, file){
      res.send(file[0]);
    });
  });
});






if (process.env.NODE_ENV === 'production') {
  http.createServer(app).listen(app.get('port'), function(){
     console.log('Express server listening on port ' + app.get('port'));
  });
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


module.exports = app;
