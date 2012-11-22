PolitalkApp.module('Members', function(Members, App) {
    'use strict';

    var Views  = Members.Views;
    var Models = Members.Models;

    Members.Router = Marionette.AppRouter.extend({
        appRoutes: {
            '':         'showLayout',
            'people':   'showLayout'
        }
    });

    Members.Controller = Politalk.ModuleController.extend({

        app:            App,
        layoutView:     Views.Layout,
        sidebarView:    Views.SidebarLayout,
        tableView:      Views.MemberList,
        moduleName:     'members',
        navTitle:       'People',

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

    Members.addInitializer(function() {
        App.vent.trigger('nav:addItem', 'People', '#people');
    });

    Members.addInitializer(function() {
        var controller = new Members.Controller({
            collection: new Models.MemberList(),
            defaultSortColumn: 'duration'
        });
        Members.router = new Members.Router({ controller: controller });
    });

});