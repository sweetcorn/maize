module.exports = function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["server.templates.index"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!DOCTYPE html>\n<html>\n  <head>\n    <title>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</title>\n    <link rel='stylesheet' href='/stylesheets/style.css' />\n  </head>\n  <body>\n    <h1>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n    <p>"
    + escapeExpression(((stack1 = ((stack1 = depth0.params),stack1 == null || stack1 === false ? stack1 : stack1.edition_id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n    <p>"
    + escapeExpression(((stack1 = ((stack1 = depth0.params),stack1 == null || stack1 === false ? stack1 : stack1.container_id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n    <p>"
    + escapeExpression(((stack1 = ((stack1 = depth0.params),stack1 == null || stack1 === false ? stack1 : stack1.page_id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n  </body>\n</html>";
  return buffer;
  });

this["JST"]["containers.a1"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n      <figure class=\"figure\">\n        <h2 class=\"figure__stat\" style=\"color: rgba("
    + escapeExpression(((stack1 = ((stack1 = depth0.color),stack1 == null || stack1 === false ? stack1 : stack1['r'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ", "
    + escapeExpression(((stack1 = ((stack1 = depth0.color),stack1 == null || stack1 === false ? stack1 : stack1['g'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ", "
    + escapeExpression(((stack1 = ((stack1 = depth0.color),stack1 == null || stack1 === false ? stack1 : stack1['b'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ", 1);\">";
  if (stack2 = helpers.highlight) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.highlight; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</h2>\n        <p class=\"figure__text\">";
  if (stack2 = helpers.text) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.text; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</p>\n      </figure>\n    ";
  return buffer;
  }

  buffer += "<section class=\"t a1\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <h1 class=\"a1__title\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n  <p class=\"a1__deck\">";
  if (stack1 = helpers.deck) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.deck; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n  <article class=\"figures\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.items, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </article>\n</section>";
  return buffer;
  });

this["JST"]["nav"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n      <li><a href=\"editions/"
    + escapeExpression(((stack1 = depth1.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/containers/";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">";
  if (stack2 = helpers.number) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.number; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "<b>";
  if (stack2 = helpers.title) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.title; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</b></a></li>\n    ";
  return buffer;
  }

  buffer += "<nav class=\"site-nav\">\n  <h1 class=\"site-nav__ke-title\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n  <ul class=\"site-nav__links\" role=\"navigation\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.containers, {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n</nav>\n\n<!-- Site's Header-->\n<header class=\"site-header\" role=\"banner\">\n  <button class=\"site-nav__button js-toggle-nav\"><i class=\"ss-icon\">=</i></button>\n  <h1 class=\"site-nav__title\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n</header>\n";
  return buffer;
  });

return this["JST"];

};