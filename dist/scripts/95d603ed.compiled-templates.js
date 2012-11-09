this["PolitalkApp"] = this["PolitalkApp"] || {};
this["PolitalkApp"]["Templates"] = this["PolitalkApp"]["Templates"] || {};

this["PolitalkApp"]["Templates"]["templates/application"] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<p>Your content here.</p>\n\n";};

this["PolitalkApp"]["Templates"]["members/templates/member-item"] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td>";
  foundHelper = helpers.speaker;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.speaker; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</td>\n<td>";
  foundHelper = helpers.partyAbbreviation;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.partyAbbreviation; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</td>\n<td>";
  foundHelper = helpers.houseName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.houseName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</td>\n<td>";
  foundHelper = helpers.durationString;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.durationString; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</td>\n<td>";
  foundHelper = helpers.speeches;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.speeches; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</td>\n<td>";
  foundHelper = helpers.interjections;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.interjections; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</td>";
  return buffer;};

this["PolitalkApp"]["Templates"]["members/templates/members-layout"] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"span12\">\n    <div class=\"hero-unit\">\n        <h1>People</h1>\n    </div>\n\n    <div class=\"row\">\n        <aside class=\"span3\">\n        </aside>\n\n        <div class=\"span9 members-list\">\n        </div>\n    </div>\n</div>";};

this["PolitalkApp"]["Templates"]["members/templates/members-sidebar"] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n    <label><input type=\"checkbox\" name=\"party\" value=\"";
  depth0 = typeof depth0 === functionType ? depth0() : depth0;
  buffer += escapeExpression(depth0) + "\"> ";
  depth0 = typeof depth0 === functionType ? depth0() : depth0;
  buffer += escapeExpression(depth0) + "</label>\n    ";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n    <label><input type=\"checkbox\" name=\"house\" value=\"";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\"> ";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</label>\n    ";
  return buffer;}

  buffer += "<h3>Refine</h3>\n\n<div class=\"parties filter-group\">\n    <h4>By Party</h4>\n\n    ";
  stack1 = depth0.parties;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n<div class=\"houses filter-group\">\n    <h4>By House</h4>\n\n    ";
  stack1 = depth0.houses;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n<div class=\"filter-group no-speakers\">\n    <h4>Speakers</h4>\n\n    <label><input type=\"checkbox\" name=\"noSpeakers\" value=\"true\"> Hide Speakers</label>\n</div>";
  return buffer;};

this["PolitalkApp"]["Templates"]["members/templates/members-table"] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<table class=\"table table-striped table-bordered table-hover table-sortable\">\n    <thead>\n        <tr>\n            <th data-sortable=\"speaker\">Name</th>\n            <th>Party</th>\n            <th>House</th>\n            <th data-sortable=\"duration\">Duration</th>\n            <th data-sortable=\"speeches\">Speeches</th>\n            <th data-sortable=\"interjections\">Interjections</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr class=\"loading\">\n            <td colspan=\"7\">Loading...</td>\n        </tr>\n    </tbody>\n</table>";};

this["PolitalkApp"]["Templates"]["nav/templates/nav-item"] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li>\n    <a href=\"";
  foundHelper = helpers.href;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.href; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</a>\n</li>";
  return buffer;};

this["PolitalkApp"]["Templates"]["nav/templates/navbar"] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"navbar-inner\">\n    <div class=\"container\">\n        <a href=\"/\" class=\"brand\">Politalk</a>\n        <div class=\"nav-collapse collapse\">\n            <ul class=\"nav\"></ul>\n        </div>\n    </div>\n</div>";};