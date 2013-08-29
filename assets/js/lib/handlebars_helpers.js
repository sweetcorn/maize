var _ = require('underscore');
var Handlebars = require('handlebars');




Handlebars.registerHelper('template', function(template, context, parentContext, options){
  template = template.replace(/\//g, '_');
  var f = Handlebars.partials['pages.' + template.toLowerCase()];
  if (!f) {
    return "Partial not loaded";
  }

  context = _.extend(context, {parent: parentContext});
  return new Handlebars.SafeString(f(context));
});
