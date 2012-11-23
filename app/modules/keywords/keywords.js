PolitalkApp.module('Keywords', function(Keywords, App) {
    'use strict';

    var Views = Keywords.Views;
    var Models = Keywords.Models;

    Keywords.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'keywords': 'showLayout'
        }
    });

    Keywords.Controller = Politalk.ModuleController.extend({

        app: App,
        layoutView: Views.Layout,
        sidebarView: Views.SidebarLayout,
        tableView: Views.KeywordsList,
        moduleName: 'keywords',
        navTitle: 'Keywords',

        appVents: {
            'filter': 'filter',
            'clearFilters': 'clearFilters',
            'sort': 'sort',
            'period': 'period'
        },

        initialize: function()
        {
            this.periodView = new Views.PeriodView();
        },

        onShow: function()
        {
            this.sidebar.filters.show(new Views.FiltersView());
            this.sidebar.period.show(this.periodView);
        }

    });

    Keywords.addInitializer(function() {
        App.vent.trigger('nav:addItem', 'Keywords', '#keywords');
    });

    Keywords.addInitializer(function() {
        var controller = new Keywords.Controller({
            collection: new Models.KeywordList(),
            defaultSortColumn: 'frequency'
        });

        new Keywords.Router({ controller: controller });
    });

});