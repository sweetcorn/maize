var $ = require('jQuery');
var Backbone = require('backbone');

var AppRouter = require('./backbone/routers/app');




Backbone.$ = $;

module.exports = (function (options) {
  options = options || {};

  var router = new AppRouter();

  // start listening for path changes
  options.pushState = true;
  $(document).ready(function(){
    Backbone.history.start(options);
  });
})();