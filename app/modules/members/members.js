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
            this.options.collection.on('reset', function(coll) {
                App.vent.queueTrigger('members:fetched', coll);
            });
            this.bindTo(App.vent, 'keywords:period', this.setPeriod, this);
        },

        period: function(from, to)
        {
            this.collection = this.options.collection = new this.options.collection.constructor();

            this.options.collection.fetch({
                data: { from: from, to: to },
                success: _.bind(function() {
                    this.collection = this.options.collection.filter(this.filters);
                    this.showTable(this.collection.sortBy(this.sortColumn, this.sortReverse));
                }, this)
            });
        },

        setPeriod: function(from, to)
        {
            _.extend(this.filters, { from: from, to: to });

            this.collection = new this.options.collection.constructor();
            return this.collection.fetch({ data: this.filters });
        },

        onShow: function()
        {
            if (!_.isEmpty(this.filters)) {
                // restore existing filters
                this.collection = this.options.collection.filter(this.filters);
            }

            this.sidebar.filters.show(new Views.FiltersView());
            this.sidebar.period.show(this.periodView);
        },

        filter: function(filters)
        {
            this.filters = filters;
            // filter on original collection
            this.showTable(this.options.collection.filter(filters).sortBy(this.sortColumn, this.sortReverse));
        },

        clearFilters: function()
        {
            this.filters = {};
            this.showTable(this.options.collection);
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