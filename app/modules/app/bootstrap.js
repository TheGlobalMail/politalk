PolitalkApp = new Backbone.Marionette.Application({
    config: {
      apiHost: 'http://partylines-api.theglobalmail.org',
      memberImageDomain: 'http://politalk-assets.theglobalmail.org'
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
