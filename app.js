
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

    var accounts = db.collection('accounts');
    var profile = profile._json;
    var matchObj = {email: profile.email};

    accounts.findOne(matchObj, function(err, account){
      if (err) { return done(err); }
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

      // update the existing record with the Github information or create a new one
      if (account){
        accounts.update(matchObj, attributes, function (err) {
          if (err) { return done(err) }
          accounts.findOne(matchObj, function(err, account){
            if (err) { return done(err); }
            return done(null, account);
          });
        });
      } else {
        accounts.insert(attributes, function (err) {
          if (err) { return done(err); }
          accounts.findOne(matchObj, function(err, account){
            if (err) { return done(err); }
            return done(null, account);
          });
        });

      }

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
      res.locals.user = JSON.stringify(req.user);
      res.render('file_index', { title: 'Express', files: files});
    });
  });
});

app.get('/files/:id', function(req, res){
  ensureAuthenticated(req, res, function(){
    db.collection('files').findById(req.params.id, function(err, file){
      res.locals.user = JSON.stringify(req.user);
      res.render('file_show', {file: file})
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
    db.collection('files').updateById(id, {$set: req.body}, function(err){
      db.collection('files').findById(id, function(err, file){
        res.send(file);
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

app.get('/api/files', function(req, res){
  ensureAuthenticated(req, res, function(){
    db.collection('files').findItems({account_id: req.user._id}, function(err, files){
      res.send(files);
    });
  });
});

// create a new account
// arguments: {email: 'test@test.com', file_id: '1234'}
// should not be tied to an administrator, but to a file
// argument should be a file id and an email address
// the account record will be created with the email and the email will be sent for verification
// the file record will have an 'accounts' array and will include the new account
app.post('/api/accounts', function(req, res){
  ensureAuthenticated(req, res, function(){
    db.collection('files').insert(_.extend({account_id: req.user._id}, req.body), function(err, file){
      res.send(file[0]);
    });
  });
});

// update an account
app.patch('/api/accounts/:id', function(req, res){
  ensureAuthenticated(req, res, function(){
    var id = req.params.id;
    db.collection('files').updateById(id, {$set: req.body}, function(err){
      db.collection('files').findById(id, function(err, file){
        res.send(file);
      });
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
