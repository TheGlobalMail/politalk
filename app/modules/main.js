(function() {
    'use strict';
    PolitalkApp.addInitializer(function() {
        var Nav = PolitalkApp.module('Nav');
        PolitalkApp.navbar.show(Nav.navbar);
    });

    PolitalkApp.on("initialize:after", function() {
        Backbone.history.start();
    });

    PolitalkApp.start();
}());