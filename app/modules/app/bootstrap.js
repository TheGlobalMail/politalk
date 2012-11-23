PolitalkApp = new Backbone.Marionette.Application({
    config: {
        apiHost: 'http://politalk-api.herokuapp.com'
    }
});

PolitalkApp.addRegions({
    main: {
        selector: '#main',
        regionType: Politalk.SwappableRegion
    },
    navbar: '.navbar',
    footer: '.footer'
});