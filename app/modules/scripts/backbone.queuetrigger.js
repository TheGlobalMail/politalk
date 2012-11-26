(function(Events) {
    'use strict';
    var eventSplitter = /\s+/, on = Events.on;

    Events.queueTrigger = function(events) {
        Events.trigger.apply(this, arguments);
        events = events.split(eventSplitter);
        var args = _.rest(arguments), event;

        if (!this._queuedTriggers) {
            this._queuedTriggers = {};
        }

        while (event = events.shift()) {
            (this._queuedTriggers[event] || (this._queuedTriggers[event] = [])).push(args);
        }

        return this;
    };

    Events.on = function(events, callback, context) {
        // call original Backbone.Event.on
        on.apply(this, arguments);

        if (!this._queuedTriggers) {
            return;
        }

        events = events.split(eventSplitter);
        var event, qt = this._queuedTriggers;
        var run = function(args) {
            callback.apply(context, args);
        };

        while (event = events.shift()) {
            if (!qt[event]) {
                continue;
            }
            _.each(qt[event], run);
        }
    };
}(Backbone.Events));