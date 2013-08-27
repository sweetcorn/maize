var $ = require('jQuery');
var Backbone = require('backbone');
Backbone.$ = $;

var AppRouter = require('./backbone/routers/app');

require('templates')(require('handlebars'));

module.exports = (function (options) {
  options = options || {};

  var router = new AppRouter();

  // start listening for path changes
  options.pushState = true;
  $(document).ready(function(){
    Backbone.history.start(options);
  });
})();