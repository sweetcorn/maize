var Backbone = require('backbone');
var _ = require('underscore');

var TemplateView = require('./template');
var ContainerView;

ContainerView = module.exports = Backbone.View.extend({

  initialize: function(options) {
    this.render();
  }

, render: function() {
    var _this = this;

    var edition = this.model.get('edition');
    var container = _.pick(this.model.attributes, 'id', 'title', 'number');

    _.each(this.model.get('pages'), function(page){
      var attributes = _.extend(page, {edition: edition, container: container});
      var model = new Backbone.Model(attributes);
      var view = new TemplateView({model: model});
      _this.$el.append(view.render().el);
    });
  }

})