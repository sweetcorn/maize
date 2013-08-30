
/**
 * Module dependencies.
 */

var express = require('express');
var exphbs  = require('express3-handlebars');
var hbs = exphbs.create({defaultLayout: 'main'});
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// middleware to make 'connect-assets' work with 'express3-handlebars'
app.use(function (req, res, next) {
  res.locals.css = global.css;
  res.locals.js = global.js;
  next();
});

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('connect-assets')());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/editions/:edition_id', routes.index);
app.get('/editions/:edition_id/containers/:container_id', routes.index);

if (process.env.NODE_ENV === 'production') {
  http.createServer(app).listen(app.get('port'), function(){
     console.log('Express server listening on port ' + app.get('port'));
  });
}

module.exports = app;
