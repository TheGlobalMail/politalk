(function() {
    'use strict';
    PolitalkApp.addInitializer(function() {
        var Nav = PolitalkApp.module('Nav');
        PolitalkApp.navbar.show(Nav.navbar);
    });

    PolitalkApp.addInitializer(function() {
        var Dates = PolitalkApp.module('Dates');
        var dm = new Dates.DateManager();
        dm.fetch();
    });

    PolitalkApp.on("initialize:after", function() {
        PolitalkApp.vent.once('members:fetched', function(){
          Backbone.history.start();
        });
    });

    PolitalkApp.start();
}());
