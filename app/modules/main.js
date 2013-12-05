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
            $('#initial-loader').remove();
            Backbone.history.start();
          }, 0);
        });
    });

    PolitalkApp.on("initialize:after", function() {
      if (document.cookie.indexOf('intro') === -1){
        var expiration = new Date();
        var cookie = '';
        expiration.setFullYear(expiration.getFullYear() + 1);
        cookie= 'intro=true; path=/; expires=' + expiration.toGMTString();
        document.cookie = cookie;
        $('#about-tool-modal').modal('show');
      }
    });

    PolitalkApp.start();
}());
