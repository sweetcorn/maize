;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Backbone = require('backbone');

var AppRouter = require('./backbone/routers/app');




module.exports = function (options) {

  options = options || {};

  new AppRouter

  // start listening for path changes
  options.pushState = true;
  $(document).ready(function(){Backbone.history.start(options)});

}
},{"./backbone/routers/app":2}],2:[function(require,module,exports){
var Backbone = require('backbone');

var AppRouter;



AppRouter = module.exports = Backbone.Router.extend({

  routes: {
    '/': 'test'
  },

  test: function() {
    alert('yay');
  }

});
},{}]},{},[1,2])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYXBwLmpzIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvYXBwL2JhY2tib25lL3JvdXRlcnMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG52YXIgQXBwUm91dGVyID0gcmVxdWlyZSgnLi9iYWNrYm9uZS9yb3V0ZXJzL2FwcCcpO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgbmV3IEFwcFJvdXRlclxuXG4gIC8vIHN0YXJ0IGxpc3RlbmluZyBmb3IgcGF0aCBjaGFuZ2VzXG4gIG9wdGlvbnMucHVzaFN0YXRlID0gdHJ1ZTtcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KG9wdGlvbnMpfSk7XG5cbn0iLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG52YXIgQXBwUm91dGVyO1xuXG5cblxuQXBwUm91dGVyID0gbW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcblxuICByb3V0ZXM6IHtcbiAgICAnLyc6ICd0ZXN0J1xuICB9LFxuXG4gIHRlc3Q6IGZ1bmN0aW9uKCkge1xuICAgIGFsZXJ0KCd5YXknKTtcbiAgfVxuXG59KTsiXX0=
;