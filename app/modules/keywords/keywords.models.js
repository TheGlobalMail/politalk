PolitalkApp.module('Keywords.Models', function(Models, App) {
    'use strict';

    Models.Keyword = Backbone.Model.extend({});

    Models.KeywordList = Politalk.TableCollection.extend({

        models: Models.Keyword,
        url: App.config.apiHost + '/api/keywords',

        filter: function()
        {

        }

    });
});