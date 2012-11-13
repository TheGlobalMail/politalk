PolitalkApp = new Backbone.Marionette.Application({
    config: {
        apiHost: 'http://politalk-api.herokuapp.com'
    }
});

PolitalkApp.addRegions({
    main: '#main',
    navbar: '.navbar'
});