var _ = require('underscore');
var Backbone = require('backbone');

var Files = require('../../collections/files');




module.exports = Backbone.View.extend({

  el: ('.js-container')

, events: {
    'click [type=submit]': 'submit'
  }

, initialize: function(options) {
    if (!this.collection) this.collection = new Files();

    this.listenTo(this.collection, 'sync', this.render);

    this.collection.fetch();
  }

, submit: function(e) {
    e.preventDefault();
    var attributes = $('form').serializeObject();
    var file = this.collection.create(attributes);

    this.listenTo(file, 'github:get', this.render);
  }

, render: function() {
    var template = JST.file_index;
    var html = template(this.collection.toJSON());

    $('.js-file-index').html(html);

    return this;
  }

})