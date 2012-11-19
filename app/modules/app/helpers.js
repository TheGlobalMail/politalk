(function() {
    'use strict';

    Handlebars.registerHelper('each', function(context, options) {
        var fn = options.fn, inverse = options.inverse;
        var ret = "", data;

        if (options.data) {
            data = Handlebars.createFrame(options.data);
        }

        if (_.isArray(context)) {
            _.forEach(context, function(value, key) {
                if (data) { data.index = key; }
                ret = ret + fn(value, { data: data });
            });
        } else if(context) {
            _.forEach(context, function(value, key) {
                if (data) { data.index = key; }
                ret = ret + fn({ value: value, index: key }, { data: data });
            });
        } else {
            ret = inverse(this);
        }

        return ret;
    });

    _.extend(Marionette.TemplateCache.prototype, {

        loadTemplate: function(templateId)
        {
            var template = PolitalkApp.Templates[templateId];

            if (!template || template.length === 0){
                var msg = "Could not find template: '" + templateId + "'";
                var err = new Error(msg);
                err.name = "NoTemplateError";
                throw err;
            }

            return template;
        },

        compileTemplate: function(rawTemplate)
        {
            return Handlebars.template(rawTemplate);
        }

    });

}());