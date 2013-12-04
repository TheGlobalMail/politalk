this["PolitalkApp"] = this["PolitalkApp"] || {};
this["PolitalkApp"]["Templates"] = this["PolitalkApp"]["Templates"] || {};

this["PolitalkApp"]["Templates"]["app/templates/footer"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\">\n    <div class=\"about\">\n        <a href=\"/\" class=\"brand\">Poli<span>/</span>talk</a>\n        <p>An ongoing analysis of <a href=\"http://www.openaustralia.org\" target=\"_blank\">Hansard transcripts</a> with the aim of making what is said more transparent and (possibly) more entertaining.</p>\n        <a class=\"link\" href=\"#\" data-target=\"#about-tool-modal\" data-toggle=\"modal\">About</a>\n    </div>\n\n    <div class=\"credit\">\n        <p>Designed and developed by <a href=\"http://www.theglobalmail.org\" class=\"tgm\" target=\"_blank\">The Global Mail</a></p>\n\n        <p>Partially based on data from <a href=\"http://www.openaustralia.org\" target=\"_blank\">www.openaustralia.org</a></p>\n    </div>\n</div>\n";
  });

this["PolitalkApp"]["Templates"]["keywords/templates/keyword-item"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td class=\"text\">\n	<span class=\"keyword-text\">";
  if (stack1 = helpers.shortText) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.shortText; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> \n	<div class=\"search-links\">\n		View context on\n		<a title=\"Search for “";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "” on OpenAustralia\" data-bypass target=\"_BLANK\" class=\"openaustralia-link\" href=\"";
  if (stack1 = helpers.OAurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.OAurl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">OpenAustralia</a>\n		or see trends on\n		<a title=\"Search for “";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "” on Party Lines\" data-bypass target=\"_BLANK\" class=\"partylines-link\" href=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">Party Lines</a>\n	</div>\n</td>\n<td class=\"frequency\">";
  if (stack1 = helpers.frequency) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.frequency; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n";
  return buffer;
  });

this["PolitalkApp"]["Templates"]["keywords/templates/keywords-filters"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <option value=\"";
  if (stack1 = helpers.speaker_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.speaker_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.first_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.first_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.last_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.last_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.roleAndTenure) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.roleAndTenure; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "";
  buffer += "\n    <option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n    ";
  return buffer;
  }

  buffer += "<h3>By Speaker</h3>\n\n<select name=\"speaker\" data-placeholder=\"Pick a politician...\" width=\"220\">\n    <option value=\"\"></option>\n    ";
  stack1 = helpers.each.call(depth0, depth0.speakers, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</select>\n\n<h3>By Party</h3>\n\n<select name=\"party\" data-placeholder=\"Pick a party...\" width=\"220\">\n    <option value=\"\"></option>\n    ";
  stack1 = helpers.each.call(depth0, depth0.parties, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</select>\n";
  return buffer;
  });

this["PolitalkApp"]["Templates"]["keywords/templates/keywords-layout"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"hero-unit keywords\">\n    <h1 class=\"container\">Phrases</h1>\n    <h2 class=\"container keywords-status\">Explore by Popular Phrase</h2>\n</div>\n\n<div class=\"da-background\">\n    <div class=\"container keywords\">\n	    <div class=\"loader\">\n            <h1 class=\"loader-text\">\n	            Loading<span>.</span><span>.</span><span>.</span>\n            </h1>\n	    </div>\n        <div class=\"row-fluid\">\n            <aside class=\"span3\"></aside>\n            <div class=\"span9 main-table keywords-list\"></div>\n        </div>\n    </div>\n</div>\n";
  });

this["PolitalkApp"]["Templates"]["keywords/templates/keywords-period"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<label class=\"input-prepend\">\n    <span class=\"add-on\">From:</span>\n    <input type=\"text\" name=\"fromDate\" class=\"date input-small\" placeholder=\"yyyy\">\n</label>\n<label class=\"input-prepend\">\n    <span class=\"add-on\">To:</span>\n    <input type=\"text\" name=\"toDate\" class=\"date input-small\" placeholder=\"yyyy\">\n</label>\n";
  });

this["PolitalkApp"]["Templates"]["keywords/templates/keywords-sidebar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"member-info-container\"></div>\n<div class=\"period-container\"></div>\n<div class=\"filters-container\"></div>";
  });

this["PolitalkApp"]["Templates"]["keywords/templates/keywords-table"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<table class=\"table table-sortable keywords-table table-hover\">\n    <thead>\n        <tr>\n            <th class=\"text\" data-sortable=\"text\">Phrase</th>\n            <th class=\"frequency\" data-sortable=\"frequency\">Frequency</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr class=\"loading\">\n            <td colspan=\"2\">Loading...</td>\n        </tr>\n    </tbody>\n</table>";
  });

this["PolitalkApp"]["Templates"]["members/templates/member-item"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td class=\"speaker\">\n    <div class=\"avatar-wrapper\">\n        <div class=\"avatar\">\n            <img src=\"";
  if (stack1 = helpers.imageUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.imageUrl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"";
  if (stack1 = helpers.first_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.first_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.last_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.last_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        </div>\n    </div>\n    <div class=\"speaker-info\">\n      ";
  if (stack1 = helpers.first_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.first_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.last_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.last_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n      <span>\n  		";
  if (stack1 = helpers.party) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.party; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (stack1 = helpers.houseName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.houseName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.tenure) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.tenure; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ".\n  		<br/>\n      	<strong>\n  		<a href=\"#speaker/";
  if (stack1 = helpers.speaker_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.speaker_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  			Frequently used phrases »\n		</a>\n  		</strong>\n      </span>\n    </div>\n</td>\n\n<td class=\"speeches\">";
  if (stack1 = helpers.speeches) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.speeches; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td class=\"interjections\">";
  if (stack1 = helpers.interjections) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.interjections; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n";
  return buffer;
  });

this["PolitalkApp"]["Templates"]["members/templates/members-filters"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <label>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " <input type=\"checkbox\" name=\"house\" value=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" checked></label>\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "";
  buffer += "\n    <label>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + " <input type=\"checkbox\" name=\"party\" value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" checked></label>\n    ";
  return buffer;
  }

  buffer += "<h3>Display results from</h3>\n\n<div class=\"houses filter-group\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.houses, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n<div class=\"parties filter-group\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.parties, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <label>Speakers <input type=\"checkbox\" name=\"noSpeakers\" value=\"true\"></label>\n</div>";
  return buffer;
  });

this["PolitalkApp"]["Templates"]["members/templates/members-layout"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"hero-unit people\">\n    <h1 class=\"container\">People</h1>\n    <h2 class=\"container\">Explore Who Says What</h2>\n</div>\n\n\n<div class=\"container people\">\n    <div class=\"loader\">\n        <h1 class=\"loader-text\">\n            Loading<span>.</span><span>.</span><span>.</span>\n        </h1>\n    </div>\n    <div class=\"row-fluid\">\n        <aside class=\"span3\"></aside>\n        <div class=\"span9 members-list main-table\"></div>\n    </div>\n</div>\n";
  });

this["PolitalkApp"]["Templates"]["members/templates/members-period"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<label class=\"input-prepend\">\n    <span class=\"add-on\">From:</span>\n    <input type=\"text\" name=\"fromDate\" class=\"date input-small\" placeholder=\"yyyy\">\n</label>\n<label class=\"input-prepend\">\n    <span class=\"add-on\">To:</span>\n    <input type=\"text\" name=\"toDate\" class=\"date input-small\" placeholder=\"yyyy\">\n</label>\n";
  });

this["PolitalkApp"]["Templates"]["members/templates/members-sidebar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"period-container\"></div>\n<div class=\"filters-container\"></div>";
  });

this["PolitalkApp"]["Templates"]["members/templates/members-table"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<table class=\"table table-sortable members-table table-hover\">\n    <thead>\n        <tr>\n            <th data-sortable=\"last_name\">Name</th>\n            <th class=\"speeches\" data-sortable=\"speeches\">Speeches</th>\n            <th class=\"interjections\" data-sortable=\"interjections\">Interjects</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr class=\"loading\">\n            <td colspan=\"4\">Loading...</td>\n        </tr>\n    </tbody>\n</table>\n";
  });

this["PolitalkApp"]["Templates"]["nav/templates/nav-item"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li>\n    <a href=\"";
  if (stack1 = helpers.href) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.href; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    	<small>Search by</small> \n    	";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </a>\n</li>";
  return buffer;
  });

this["PolitalkApp"]["Templates"]["nav/templates/navbar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"tgm-strip\">\n	<div class=\"container\">\n		<a href=\"http:///www.theglobalmail.org\" class=\"tgm\" title=\"Go to The Global Mail\">The Global Mail</a>\n		<div class=\"icons special-feature-misc\">\n      <div class=\"special-feature-links\">\n        <a class=\"about\" href=\"#\" data-target=\"#about-tool-modal\" data-toggle=\"modal\">About</a>\n      </div>\n      <div class=\"share-button twitter\">\n        <a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-via=\"TheGlobalMail\" data-hashtags=\"auspol\">Tweet</a>\n        <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=\"//platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script>\n      </div>\n      <div class=\"share-button facebook\">\n        <div class=\"fb-like\" data-send=\"false\" data-layout=\"button_count\" data-width=\"45\" data-show-faces=\"false\" data-colorscheme=\"light\" data-action=\"like\"></div>\n      </div>\n    </div>\n	</div>\n</div>\n<div class=\"navbar-inner\">\n    <div class=\"container row-fluid\">\n        <a href=\"/\" class=\"brand span3\">Poli<span>/</span>talk</a>\n        <span class=\"subtitle\">Link politicans to their lines</span>\n        <div class=\"nav-collapse collapse\">\n            <ul class=\"nav\"></ul>\n        </div>\n    </div>\n</div>\n";
  });