;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./backbone/routers/app":2}],2:[function(require,module,exports){
var Backbone = require('backbone');

var AppRouter;



AppRouter = module.exports = Backbone.Router.extend({

  routes: {
    '': 'test'
  },

  test: function() {

  }

});
},{}]},{},[1,2])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYXBwLmpzIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvYXBwL2JhY2tib25lL3JvdXRlcnMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgJCA9IHJlcXVpcmUoJ2pRdWVyeScpO1xudmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxudmFyIEFwcFJvdXRlciA9IHJlcXVpcmUoJy4vYmFja2JvbmUvcm91dGVycy9hcHAnKTtcblxuXG5cblxuQmFja2JvbmUuJCA9ICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciByb3V0ZXIgPSBuZXcgQXBwUm91dGVyKCk7XG5cbiAgLy8gc3RhcnQgbGlzdGVuaW5nIGZvciBwYXRoIGNoYW5nZXNcbiAgb3B0aW9ucy5wdXNoU3RhdGUgPSB0cnVlO1xuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgIEJhY2tib25lLmhpc3Rvcnkuc3RhcnQob3B0aW9ucyk7XG4gIH0pO1xufSkoKTsiLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG52YXIgQXBwUm91dGVyO1xuXG5cblxuQXBwUm91dGVyID0gbW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcblxuICByb3V0ZXM6IHtcbiAgICAnJzogJ3Rlc3QnXG4gIH0sXG5cbiAgdGVzdDogZnVuY3Rpb24oKSB7XG5cbiAgfVxuXG59KTsiXX0=
;