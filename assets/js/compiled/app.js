;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./backbone/routers/app":6}],2:[function(require,module,exports){
var Backbone = require('backbone');

var Container = require('../models/container');
var Containers;



Containers = module.exports = Backbone.Collection.extend({

  model: Container

})
},{"../models/container":3}],3:[function(require,module,exports){
var Backbone = require('backbone');

var data = require('./data.json');
var Container;




Container = module.exports = Backbone.Model.extend({

  fetch: function() {
    this.set(data);
    this.trigger('sync');
  }

});
},{"./data.json":4}],4:[function(require,module,exports){
module.exports={
    "id": "0af17960-db7a-4551-a6f0-e6ed5145d9e8",
    "number": "01",
    "title": "Ideas on a page",
    "pages": [
        {
            "id": "4edbc75e-4568-410a-a94f-ef396d15a453",
            "template": "I1",
            "body": "What you and your clients should be thinking about cloud, and where to start",
            "background": {
                "url": "image.jpg",
                "url@2x": "image@2x.jpg"
            }
        },
        {
            "id": "3b60e3d3-8e64-42c7-9fcb-75a99e433467",
            "template": "T1",
            "title": "Cloud is a business growth engine. Beyond rethinking IT, it is a path to reinventing business."
        },
        {
            "id": "16147468-959e-495f-92f5-43fba5c8a1c2",
            "template": "A1",
            "title": "Innovate continuously",
            "body": "Cloud is more than just apps made easy. It enables organizations to compose apps that generate and use data to rapidly evolve new services. Innovations can now be rapid, personal and continuous.",
            "items": [
                {
                    "color": {
                        "r": "0",
                        "g": "0",
                        "b": "0"
                    },
                    "highlight": "200",
                    "text": "billion intermittently connected devices by 2020."
                },
                {
                    "color": {
                        "r": "0",
                        "g": "0",
                        "b": "0"
                    },
                    "highlight": "76%",
                    "text": "of IT decision makers are concerned or very concerned by the rising pressure to reduce costs"
                }
            ]
        },
        {
            "id": "0d40e813-f913-43b8-8d17-c85b2248f0a9",
            "template": "A1",
            "title": "Drive growth through hybrid cloud",
            "body": "While some say public clouds are the future, the real opportunity is in a hybrid approach that integrates mobile and social apps on public clouds with transactional capabilities of  private cloud to convert interactions into revenue.",
            "items": [
                {
                    "color": {
                        "r": "0",
                        "g": "0",
                        "b": "0"
                    },
                    "highlight": "89%",
                    "text": "of security professionals feel that more training is needed on how security applies to cloud."
                },
                {
                    "color": {
                        "r": "0",
                        "g": "0",
                        "b": "0"
                    },
                    "highlight": "60-80%",
                    "text": "growth year-over-year in traditional content types in 2012"
                }
            ]
        },
        {
            "id": "4f3d113f-d2f0-4056-b811-a80b78de1853",
            "template": "A1",
            "title": "Spur new collaboration",
            "body": "Maximum advantage doesn’t come through bypassing IT to get cloud services. It happens when IT and LOB come together to more effectively align IT with business strategy, simultaneously reducing cost and delivering results.",
            "items": [
                {
                    "color": {
                        "r": "0",
                        "g": "0",
                        "b": "0"
                    },
                    "highlight": "62%",
                    "text": "of workloads will be cloud-based by 2014"
                }
            ]
        }
    ]
}
},{}],5:[function(require,module,exports){
var Backbone = require('backbone');

var Containers = require('../collections/containers');
var data = require('../../../json/editions/cac2b27c-fa00-400d-a644-ba6408b2566d/edition.json');
var Edition;




Edition = module.exports = Backbone.Model.extend({

  fetch: function() {
    var data = require('../../../json/editions/' + this.get('id') + '/edition.json');
    this.set(data);

    this.containers = new Containers(data.containers);

    this.trigger('sync');
  },

})
},{"../../../json/editions/cac2b27c-fa00-400d-a644-ba6408b2566d/edition.json":10,"../collections/containers":2}],6:[function(require,module,exports){
var Backbone = require('backbone');

var Edition = require('../models/edition');
var Container = require('../models/container');
var PageView = require('../views/page');
var AppRouter;




AppRouter = module.exports = Backbone.Router.extend({

  routes: {
    '': 'index',
    'editions/:id': 'edition',
    'editions/:id/containers/:id': 'container'
  }

, renderView: function(editionId, containerId) {
    var edition = new Edition({id: editionId});

    edition.on('sync', function() {
      var _edition = edition;
      var container = edition.containers.findWhere({id: containerId});

      container.on('sync', function(){
        new PageView({el: $('.js-body'), edition: _edition, container: container});
      });

      container.fetch();
    });

    edition.fetch();
  }

, index: function() {
    this.renderView(1, 1)
  }

, edition: function(editionId) {
    this.renderView(editionId, 1);
  }

, container: function(editionId, containerId) {
    this.renderView(editionId, containerId);
  }

});

},{"../models/container":3,"../models/edition":5,"../views/page":9}],7:[function(require,module,exports){
var Backbone = require('backbone');

var ContainerView;

ContainerView = module.exports = Backbone.View.extend({

  template: function() {
    return
  }

, initialize: function(options) {
    this.render();
  }

, render: function() {

  }

})
},{}],8:[function(require,module,exports){
var Backbone = require('backbone');

var Edition = require('../models/edition.js');
var NavView;



NavView = module.exports = Backbone.View.extend({

  template: function() {
    return JST['nav']();
  }

, initialize: function(options) {
    this.render();
  }

, render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);

    return this;
  }

})
},{"../models/edition.js":5}],9:[function(require,module,exports){
var Backbone = require('backbone');

var NavView = require('./nav');
var ContainerView = require('./container');
var PageView;




PageView = module.exports = Backbone.View.extend({

  initialize: function() {
    this.render();

    new NavView({el: $('.js-nav-container'), model: this.model});
    new ContainerView({el: this.$('.js-main'), model: this.model});
  }

});
},{"./container":7,"./nav":8}],10:[function(require,module,exports){
module.exports={
    "id": "cac2b27c-fa00-400d-a644-ba6408b2566d",
    "title": "Smarter Cloud",
    "containers": [
        {
            "id": "0af17960-db7a-4551-a6f0-e6ed5145d9e8",
            "number": "01",
            "title": "Ideas on a page"
        },
        {
            "id": "d098d935-470e-456d-ae30-294b576f28e0",
            "number": "02",
            "title": "Three important shifts in the world"
        },
        {
            "id": "e9ddaad3-83c6-4662-a461-4be70d765846",
            "number": "03",
            "title": "Three must-reads"
        },
        {
            "id": "95017953-cca4-4d11-acb8-13ec5d657cde",
            "number": "04",
            "title": "The new way forward"
        },
        {
            "id": "49bb146c-f77e-438a-8310-d29c48cfd32f",
            "number": "05",
            "title": "The new outcomes"
        },
        {
            "id": "e81ca67c-e932-428f-b83e-fc1d73cd1f13",
            "number": "06",
            "title": "Three important conversations to have"
        },
        {
            "id": "45713ccf-bfdf-4a76-abe9-1337de360833",
            "number": "07",
            "title": "The IBM industry perspective"
        },
        {
            "id": "fb4a9e17-6665-4d48-a964-a82c50cde47a",
            "number": "08",
            "title": "The new vocabulary"
        },
        {
            "id": "8a18a90e-e55d-4c1c-955c-8ef66e27e4a5",
            "number": "09",
            "title": "Why IBM beats the competition"
        },
        {
            "id": "ccab7c6e-ec15-41d1-abcf-2f4a93c1ede9",
            "number": "10",
            "title": "Why infrastructure matters"
        },
        {
            "id": "e8b0be7b-eebc-4a4c-9824-a78238947eda",
            "number": "11",
            "title": "The system choices"
        },
        {
            "id": "ab2eecc6-a50e-41e9-ba8a-f6cc2e15db6e",
            "number": "12",
            "title": "Partnering options to explore"
        },
        {
            "id": "9b271ebc-7294-47e0-a4a4-efa1bd903e3e",
            "number": "13",
            "title": "Container #13"
        }
    ]
}
},{}]},{},[1,2,3,5,6,7,8,9])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYXBwLmpzIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvYXBwL2JhY2tib25lL2NvbGxlY3Rpb25zL2NvbnRhaW5lcnMuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYmFja2JvbmUvbW9kZWxzL2NvbnRhaW5lci5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2FwcC9iYWNrYm9uZS9tb2RlbHMvZGF0YS5qc29uIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvYXBwL2JhY2tib25lL21vZGVscy9lZGl0aW9uLmpzIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvYXBwL2JhY2tib25lL3JvdXRlcnMvYXBwLmpzIiwiL1VzZXJzL21pY2hhZWxwaGlsbGlwcy9Qcm9qZWN0cy9pYm0ta25vd2xlZGdlLWVkaXRpb25zLWFwcC9hc3NldHMvanMvYXBwL2JhY2tib25lL3ZpZXdzL2NvbnRhaW5lci5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2FwcC9iYWNrYm9uZS92aWV3cy9uYXYuanMiLCIvVXNlcnMvbWljaGFlbHBoaWxsaXBzL1Byb2plY3RzL2libS1rbm93bGVkZ2UtZWRpdGlvbnMtYXBwL2Fzc2V0cy9qcy9hcHAvYmFja2JvbmUvdmlld3MvcGFnZS5qcyIsIi9Vc2Vycy9taWNoYWVscGhpbGxpcHMvUHJvamVjdHMvaWJtLWtub3dsZWRnZS1lZGl0aW9ucy1hcHAvYXNzZXRzL2pzL2pzb24vZWRpdGlvbnMvY2FjMmIyN2MtZmEwMC00MDBkLWE2NDQtYmE2NDA4YjI1NjZkL2VkaXRpb24uanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgJCA9IHJlcXVpcmUoJ2pRdWVyeScpO1xudmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgQXBwUm91dGVyID0gcmVxdWlyZSgnLi9iYWNrYm9uZS9yb3V0ZXJzL2FwcCcpO1xuXG5yZXF1aXJlKCd0ZW1wbGF0ZXMnKShyZXF1aXJlKCdoYW5kbGViYXJzJykpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgcm91dGVyID0gbmV3IEFwcFJvdXRlcigpO1xuXG4gIC8vIHN0YXJ0IGxpc3RlbmluZyBmb3IgcGF0aCBjaGFuZ2VzXG4gIG9wdGlvbnMucHVzaFN0YXRlID0gdHJ1ZTtcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICBCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KG9wdGlvbnMpO1xuICB9KTtcbn0pKCk7IiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxudmFyIENvbnRhaW5lciA9IHJlcXVpcmUoJy4uL21vZGVscy9jb250YWluZXInKTtcbnZhciBDb250YWluZXJzO1xuXG5cblxuQ29udGFpbmVycyA9IG1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuXG4gIG1vZGVsOiBDb250YWluZXJcblxufSkiLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG52YXIgZGF0YSA9IHJlcXVpcmUoJy4vZGF0YS5qc29uJyk7XG52YXIgQ29udGFpbmVyO1xuXG5cblxuXG5Db250YWluZXIgPSBtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cbiAgZmV0Y2g6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0KGRhdGEpO1xuICAgIHRoaXMudHJpZ2dlcignc3luYycpO1xuICB9XG5cbn0pOyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImlkXCI6IFwiMGFmMTc5NjAtZGI3YS00NTUxLWE2ZjAtZTZlZDUxNDVkOWU4XCIsXG4gICAgXCJudW1iZXJcIjogXCIwMVwiLFxuICAgIFwidGl0bGVcIjogXCJJZGVhcyBvbiBhIHBhZ2VcIixcbiAgICBcInBhZ2VzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjRlZGJjNzVlLTQ1NjgtNDEwYS1hOTRmLWVmMzk2ZDE1YTQ1M1wiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkkxXCIsXG4gICAgICAgICAgICBcImJvZHlcIjogXCJXaGF0IHlvdSBhbmQgeW91ciBjbGllbnRzIHNob3VsZCBiZSB0aGlua2luZyBhYm91dCBjbG91ZCwgYW5kIHdoZXJlIHRvIHN0YXJ0XCIsXG4gICAgICAgICAgICBcImJhY2tncm91bmRcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IFwiaW1hZ2UuanBnXCIsXG4gICAgICAgICAgICAgICAgXCJ1cmxAMnhcIjogXCJpbWFnZUAyeC5qcGdcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiM2I2MGUzZDMtOGU2NC00MmM3LTlmY2ItNzVhOTllNDMzNDY3XCIsXG4gICAgICAgICAgICBcInRlbXBsYXRlXCI6IFwiVDFcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJDbG91ZCBpcyBhIGJ1c2luZXNzIGdyb3d0aCBlbmdpbmUuIEJleW9uZCByZXRoaW5raW5nIElULCBpdCBpcyBhIHBhdGggdG8gcmVpbnZlbnRpbmcgYnVzaW5lc3MuXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjE2MTQ3NDY4LTk1OWUtNDk1Zi05MmY1LTQzZmJhNWM4YTFjMlwiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkExXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiSW5ub3ZhdGUgY29udGludW91c2x5XCIsXG4gICAgICAgICAgICBcImJvZHlcIjogXCJDbG91ZCBpcyBtb3JlIHRoYW4ganVzdCBhcHBzIG1hZGUgZWFzeS4gSXQgZW5hYmxlcyBvcmdhbml6YXRpb25zIHRvIGNvbXBvc2UgYXBwcyB0aGF0IGdlbmVyYXRlIGFuZCB1c2UgZGF0YSB0byByYXBpZGx5IGV2b2x2ZSBuZXcgc2VydmljZXMuIElubm92YXRpb25zIGNhbiBub3cgYmUgcmFwaWQsIHBlcnNvbmFsIGFuZCBjb250aW51b3VzLlwiLFxuICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYlwiOiBcIjBcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImhpZ2hsaWdodFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJiaWxsaW9uIGludGVybWl0dGVudGx5IGNvbm5lY3RlZCBkZXZpY2VzIGJ5IDIwMjAuXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJoaWdobGlnaHRcIjogXCI3NiVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwib2YgSVQgZGVjaXNpb24gbWFrZXJzIGFyZSBjb25jZXJuZWQgb3IgdmVyeSBjb25jZXJuZWQgYnkgdGhlIHJpc2luZyBwcmVzc3VyZSB0byByZWR1Y2UgY29zdHNcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjBkNDBlODEzLWY5MTMtNDNiOC04ZDE3LWM4NWIyMjQ4ZjBhOVwiLFxuICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiBcIkExXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiRHJpdmUgZ3Jvd3RoIHRocm91Z2ggaHlicmlkIGNsb3VkXCIsXG4gICAgICAgICAgICBcImJvZHlcIjogXCJXaGlsZSBzb21lIHNheSBwdWJsaWMgY2xvdWRzIGFyZSB0aGUgZnV0dXJlLCB0aGUgcmVhbCBvcHBvcnR1bml0eSBpcyBpbiBhIGh5YnJpZCBhcHByb2FjaCB0aGF0IGludGVncmF0ZXMgbW9iaWxlIGFuZCBzb2NpYWwgYXBwcyBvbiBwdWJsaWMgY2xvdWRzIHdpdGggdHJhbnNhY3Rpb25hbCBjYXBhYmlsaXRpZXMgb2YgIHByaXZhdGUgY2xvdWQgdG8gY29udmVydCBpbnRlcmFjdGlvbnMgaW50byByZXZlbnVlLlwiLFxuICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYlwiOiBcIjBcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImhpZ2hsaWdodFwiOiBcIjg5JVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJvZiBzZWN1cml0eSBwcm9mZXNzaW9uYWxzIGZlZWwgdGhhdCBtb3JlIHRyYWluaW5nIGlzIG5lZWRlZCBvbiBob3cgc2VjdXJpdHkgYXBwbGllcyB0byBjbG91ZC5cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiclwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYlwiOiBcIjBcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImhpZ2hsaWdodFwiOiBcIjYwLTgwJVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJncm93dGggeWVhci1vdmVyLXllYXIgaW4gdHJhZGl0aW9uYWwgY29udGVudCB0eXBlcyBpbiAyMDEyXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI0ZjNkMTEzZi1kMmYwLTQwNTYtYjgxMS1hODBiNzhkZTE4NTNcIixcbiAgICAgICAgICAgIFwidGVtcGxhdGVcIjogXCJBMVwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlNwdXIgbmV3IGNvbGxhYm9yYXRpb25cIixcbiAgICAgICAgICAgIFwiYm9keVwiOiBcIk1heGltdW0gYWR2YW50YWdlIGRvZXNu4oCZdCBjb21lIHRocm91Z2ggYnlwYXNzaW5nIElUIHRvIGdldCBjbG91ZCBzZXJ2aWNlcy4gSXQgaGFwcGVucyB3aGVuIElUIGFuZCBMT0IgY29tZSB0b2dldGhlciB0byBtb3JlIGVmZmVjdGl2ZWx5IGFsaWduIElUIHdpdGggYnVzaW5lc3Mgc3RyYXRlZ3ksIHNpbXVsdGFuZW91c2x5IHJlZHVjaW5nIGNvc3QgYW5kIGRlbGl2ZXJpbmcgcmVzdWx0cy5cIixcbiAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJcIjogXCIwXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJoaWdobGlnaHRcIjogXCI2MiVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwib2Ygd29ya2xvYWRzIHdpbGwgYmUgY2xvdWQtYmFzZWQgYnkgMjAxNFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXVxufSIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbnZhciBDb250YWluZXJzID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvY29udGFpbmVycycpO1xudmFyIGRhdGEgPSByZXF1aXJlKCcuLi8uLi8uLi9qc29uL2VkaXRpb25zL2NhYzJiMjdjLWZhMDAtNDAwZC1hNjQ0LWJhNjQwOGIyNTY2ZC9lZGl0aW9uLmpzb24nKTtcbnZhciBFZGl0aW9uO1xuXG5cblxuXG5FZGl0aW9uID0gbW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuXG4gIGZldGNoOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0YSA9IHJlcXVpcmUoJy4uLy4uLy4uL2pzb24vZWRpdGlvbnMvJyArIHRoaXMuZ2V0KCdpZCcpICsgJy9lZGl0aW9uLmpzb24nKTtcbiAgICB0aGlzLnNldChkYXRhKTtcblxuICAgIHRoaXMuY29udGFpbmVycyA9IG5ldyBDb250YWluZXJzKGRhdGEuY29udGFpbmVycyk7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3N5bmMnKTtcbiAgfSxcblxufSkiLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG52YXIgRWRpdGlvbiA9IHJlcXVpcmUoJy4uL21vZGVscy9lZGl0aW9uJyk7XG52YXIgQ29udGFpbmVyID0gcmVxdWlyZSgnLi4vbW9kZWxzL2NvbnRhaW5lcicpO1xudmFyIFBhZ2VWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvcGFnZScpO1xudmFyIEFwcFJvdXRlcjtcblxuXG5cblxuQXBwUm91dGVyID0gbW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcblxuICByb3V0ZXM6IHtcbiAgICAnJzogJ2luZGV4JyxcbiAgICAnZWRpdGlvbnMvOmlkJzogJ2VkaXRpb24nLFxuICAgICdlZGl0aW9ucy86aWQvY29udGFpbmVycy86aWQnOiAnY29udGFpbmVyJ1xuICB9XG5cbiwgcmVuZGVyVmlldzogZnVuY3Rpb24oZWRpdGlvbklkLCBjb250YWluZXJJZCkge1xuICAgIHZhciBlZGl0aW9uID0gbmV3IEVkaXRpb24oe2lkOiBlZGl0aW9uSWR9KTtcblxuICAgIGVkaXRpb24ub24oJ3N5bmMnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfZWRpdGlvbiA9IGVkaXRpb247XG4gICAgICB2YXIgY29udGFpbmVyID0gZWRpdGlvbi5jb250YWluZXJzLmZpbmRXaGVyZSh7aWQ6IGNvbnRhaW5lcklkfSk7XG5cbiAgICAgIGNvbnRhaW5lci5vbignc3luYycsIGZ1bmN0aW9uKCl7XG4gICAgICAgIG5ldyBQYWdlVmlldyh7ZWw6ICQoJy5qcy1ib2R5JyksIGVkaXRpb246IF9lZGl0aW9uLCBjb250YWluZXI6IGNvbnRhaW5lcn0pO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnRhaW5lci5mZXRjaCgpO1xuICAgIH0pO1xuXG4gICAgZWRpdGlvbi5mZXRjaCgpO1xuICB9XG5cbiwgaW5kZXg6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVuZGVyVmlldygxLCAxKVxuICB9XG5cbiwgZWRpdGlvbjogZnVuY3Rpb24oZWRpdGlvbklkKSB7XG4gICAgdGhpcy5yZW5kZXJWaWV3KGVkaXRpb25JZCwgMSk7XG4gIH1cblxuLCBjb250YWluZXI6IGZ1bmN0aW9uKGVkaXRpb25JZCwgY29udGFpbmVySWQpIHtcbiAgICB0aGlzLnJlbmRlclZpZXcoZWRpdGlvbklkLCBjb250YWluZXJJZCk7XG4gIH1cblxufSk7XG4iLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG52YXIgQ29udGFpbmVyVmlldztcblxuQ29udGFpbmVyVmlldyA9IG1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gIHRlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4sIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiwgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICB9XG5cbn0pIiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxudmFyIEVkaXRpb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvZWRpdGlvbi5qcycpO1xudmFyIE5hdlZpZXc7XG5cblxuXG5OYXZWaWV3ID0gbW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgdGVtcGxhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBKU1RbJ25hdiddKCk7XG4gIH1cblxuLCBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4sIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGh0bWwgPSB0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwudG9KU09OKCkpO1xuICAgIHRoaXMuJGVsLmh0bWwoaHRtbCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59KSIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbnZhciBOYXZWaWV3ID0gcmVxdWlyZSgnLi9uYXYnKTtcbnZhciBDb250YWluZXJWaWV3ID0gcmVxdWlyZSgnLi9jb250YWluZXInKTtcbnZhciBQYWdlVmlldztcblxuXG5cblxuUGFnZVZpZXcgPSBtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgbmV3IE5hdlZpZXcoe2VsOiAkKCcuanMtbmF2LWNvbnRhaW5lcicpLCBtb2RlbDogdGhpcy5tb2RlbH0pO1xuICAgIG5ldyBDb250YWluZXJWaWV3KHtlbDogdGhpcy4kKCcuanMtbWFpbicpLCBtb2RlbDogdGhpcy5tb2RlbH0pO1xuICB9XG5cbn0pOyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImlkXCI6IFwiY2FjMmIyN2MtZmEwMC00MDBkLWE2NDQtYmE2NDA4YjI1NjZkXCIsXG4gICAgXCJ0aXRsZVwiOiBcIlNtYXJ0ZXIgQ2xvdWRcIixcbiAgICBcImNvbnRhaW5lcnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiMGFmMTc5NjAtZGI3YS00NTUxLWE2ZjAtZTZlZDUxNDVkOWU4XCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjAxXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiSWRlYXMgb24gYSBwYWdlXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcImQwOThkOTM1LTQ3MGUtNDU2ZC1hZTMwLTI5NGI1NzZmMjhlMFwiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIwMlwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRocmVlIGltcG9ydGFudCBzaGlmdHMgaW4gdGhlIHdvcmxkXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcImU5ZGRhYWQzLTgzYzYtNDY2Mi1hNDYxLTRiZTcwZDc2NTg0NlwiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIwM1wiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRocmVlIG11c3QtcmVhZHNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiOTUwMTc5NTMtY2NhNC00ZDExLWFjYjgtMTNlYzVkNjU3Y2RlXCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjA0XCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiVGhlIG5ldyB3YXkgZm9yd2FyZFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCI0OWJiMTQ2Yy1mNzdlLTQzOGEtODMxMC1kMjljNDhjZmQzMmZcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCI6IFwiMDVcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJUaGUgbmV3IG91dGNvbWVzXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcImU4MWNhNjdjLWU5MzItNDI4Zi1iODNlLWZjMWQ3M2NkMWYxM1wiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIwNlwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRocmVlIGltcG9ydGFudCBjb252ZXJzYXRpb25zIHRvIGhhdmVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiNDU3MTNjY2YtYmZkZi00YTc2LWFiZTktMTMzN2RlMzYwODMzXCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjA3XCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiVGhlIElCTSBpbmR1c3RyeSBwZXJzcGVjdGl2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogXCJmYjRhOWUxNy02NjY1LTRkNDgtYTk2NC1hODJjNTBjZGU0N2FcIixcbiAgICAgICAgICAgIFwibnVtYmVyXCI6IFwiMDhcIixcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJUaGUgbmV3IHZvY2FidWxhcnlcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiOGExOGE5MGUtZTU1ZC00YzFjLTk1NWMtOGVmNjZlMjdlNGE1XCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjA5XCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiV2h5IElCTSBiZWF0cyB0aGUgY29tcGV0aXRpb25cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiY2NhYjdjNmUtZWMxNS00MWQxLWFiY2YtMmY0YTkzYzFlZGU5XCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjEwXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiV2h5IGluZnJhc3RydWN0dXJlIG1hdHRlcnNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IFwiZThiMGJlN2ItZWViYy00YTRjLTk4MjQtYTc4MjM4OTQ3ZWRhXCIsXG4gICAgICAgICAgICBcIm51bWJlclwiOiBcIjExXCIsXG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiVGhlIHN5c3RlbSBjaG9pY2VzXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcImFiMmVlY2M2LWE1MGUtNDFlOS1iYThhLWY2Y2MyZTE1ZGI2ZVwiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIxMlwiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlBhcnRuZXJpbmcgb3B0aW9ucyB0byBleHBsb3JlXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiBcIjliMjcxZWJjLTcyOTQtNDdlMC1hNGE0LWVmYTFiZDkwM2UzZVwiLFxuICAgICAgICAgICAgXCJudW1iZXJcIjogXCIxM1wiLFxuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkNvbnRhaW5lciAjMTNcIlxuICAgICAgICB9XG4gICAgXVxufSJdfQ==
;