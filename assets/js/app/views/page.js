var Backbone = require('backbone');

var $ = require('jQuery');
var jsonform = require('jsonform');
var Base64 = require('Base64');
var Files = require('../collections/files');



module.exports = Backbone.View.extend({

  events: {
    'click .js-add-file': 'addFile'
  , 'click a.file-update': 'updateFileContents'
  , 'click .js-save-file': 'saveFile'
  }

, el: '.js-body'

, addFile: function(e) {
    if (typeof e === 'object' && typeof e.preventDefault === 'function') e.preventDefault();

    var $e = $(e.target);

    var formData = $('form').serializeObject();

    $.get('https://api.github.com/repos/createbang/' + formData.repoName, function(resp){
      var repo = resp;
      $.get(resp.url + '/contents/' + formData.filePath, function(resp){
        var files = new Files();
        files.create(_.extend(resp, {repo: repo}));
      })
    })


    return false;
  }

, saveFile: function(e){
    e.preventDefault();
    var $e = $(e.target);

    this.model.saveContents($('textarea').val());
  }

, handler: function(e){
    if (typeof e === 'object' && typeof e.preventDefault === 'function') e.preventDefault();

    var $e = $(e.target);
    return false
  }

, handleFileClick: function(e){
    if (typeof e === 'object' && typeof e.preventDefault === 'function') e.preventDefault();

    var $e = $(e.target);
    $.get('https://api.github.com/repos/createbang/testForMaize/contents/bunnies.json', function(resp){
      console.log(Base64.decode(resp.content));
    })
  }

, updateFileContents: function(e){
    console.log('here');
    if (typeof e === 'object' && typeof e.preventDefault === 'function') e.preventDefault();

    var $e = $(e.target);
    $.ajax({
      url: 'https://api.github.com/repos/createbang/testForMaize/contents/bunnies.json',
      type: 'put',
      beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization', 'token ' + '3d169c37a53d743c925182fb8eb7a10d123db239');
      },
      data: JSON.stringify({"message":"foobar","content":Base64.encode("test"),"sha":"e4d3ec48b1faa2789c9db6c443e9774beb26d240"})
    })
  }

, initialize: function(options) {
    options = options || {};

    if (options.model){
      this.model = options.model;
      this.listenTo(this.model, 'github:get', this.showFileContents);
      this.model.fetch();
    }

    $('.js-form-main').jsonForm({
      "schema": {
        "friends": {
          "type": "array",
          "items": {
            "type": "object",
            "title": "Friend",
            "properties": {
              "nick": {
                "type": "string",
                "title": "Nickname"
              },
              "animals": {
                "type": "array",
                "items": {
                  "type": "string",
                  "title": "Animal name"
                }
              }
            }
          }
        }
      },
      "form": [
        {
          "type": "tabarray",
          "items": {
            "type": "section",
            "items": [
              "friends[].nick",
              {
                "type": "array",
                "items": [
                  "friends[].animals[]"
                ]
              }
            ]
          }
        },
        {
          "type": "submit",
          "title": "OK Go - This Too Shall Pass"
        }
      ],
      onSubmit: function (errors, values) {
        console.log(JSON.stringify(values));
      }
    })

    this.delegateEvents();
  }

, showFileContents: function(contents){
    $('textarea').val(contents);
  }

});