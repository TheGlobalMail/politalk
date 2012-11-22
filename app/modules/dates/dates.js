PolitalkApp.module('Dates', function(Dates, App) {
    'use strict';

    Dates.DateManager = function(options) {
        this.options = options || {};
        this.dates = [];

        Marionette.addEventBinder(this);
        this.initialize(options);
    };

    _.extend(Dates.DateManager.prototype, {

        url: App.config.apiHost + '/api/dates',

        initialize: function()
        {
            _.bindAll(this, '_processDates');
        },

        fetch: function(options)
        {
            options = options || {};
            this.publish('fetching');
            $.getJSON(this.url, this._processDates);
        },

        _processDates: function(data)
        {
            _.each(data, function(date) {
                this.dates.push(new Date(date));
            }, this);

            this.dates.sort(function(a, b) {
                return a.getTime() - b.getTime();
            });

            this.publish('fetch', this.dates);
        },

        publish: function(eventName)
        {
            this.trigger.apply(this, arguments);
            eventName = "dates:" + eventName;
            App.vent.trigger.apply(App.vent, [eventName].concat(_.rest(arguments)));
        }

    }, Backbone.Events);
});