var Backbone = require('backbone');

var Files = require('../../collections/files');



module.exports = Backbone.View.extend({

  el: ('.js-container')

, events: {
    'click [type=submit]': 'submit'
  }

, initialize: function(options) {
    var _this = this;

    if (!this.collection) this.collection = new Files();

    this.listenToOnce(this.collection, 'sync', function(collection){
      _this.model = collection.get(options.id);

      _this.listenTo(_this.model, 'github:get', _this.render);

      _this.model.fetch();
    });

    this.collection.fetch();
  }

, submit: function(e) {
    e.preventDefault();
    this.model.saveContents(this.$('textarea').val());
  }

, render: function() {
    var template = JST.file_show;
    var html = template(this.model.toJSON());

    $('.js-file-show').html(html);
  }

})