PolitalkApp.module('App.Views', function(Views, App) {

    Views.Footer = Backbone.Marionette.Layout.extend({

        template: 'app/templates/footer'

    });

    App.addInitializer(function() {
        App.footer.show(new Views.Footer());
    });

});