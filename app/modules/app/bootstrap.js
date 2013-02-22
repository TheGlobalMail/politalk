PolitalkApp = new Backbone.Marionette.Application({
    config: {
      apiHost: 'http://staging-partylines-api.theglobalmail.org'
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
