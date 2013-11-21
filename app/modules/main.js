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
          // Bit of hack to make this run after all other member:fetched
          // handlers have run 
          setTimeout(function(){
            Backbone.history.start();
          }, 0);
        });
    });

    PolitalkApp.start();
}());
