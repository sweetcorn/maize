var Backbone = require('backbone');

var Files = require('../../collections/files');



module.exports = Backbone.View.extend({

  el: ('.js-container')

, initialize: function(options) {
    var _this = this;

    if (!this.collection) this.collection = new Files();

    this.listenToOnce(this.collection, 'sync', function(collection){
      _this.model = collection.get(options.id);

      _this.listenTo(_this.model, 'github:get', _this.render);

      _this.model.fetch();
    });

    this.collection.fetch();

    this.on('foo', this.test, this);
  }

, test: function(values){
    this.model.saveContents(values);
  }

, render: function() {
    var _this = this;
    var template = JST.file_show;
    var html = template(this.model.toJSON());

    $('.js-file-show').html(html);

    $('form').jsonForm({
      schema: {
        name: {
          type: 'string',
          title: 'Name',
          required: true
        },
        age: {
          type: 'number',
          title: 'Age'
        },
        gender: {
          type: 'select',
          title: 'gender',
          enum: [
            "male",
            "female"
          ]
        }
      },
      value: this.model.content(),
      onSubmit: function(err, values){
        _this.trigger('foo', values);
      }
    });
  }

})