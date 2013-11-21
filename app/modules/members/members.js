PolitalkApp.module('Members', function(Members, App) {
    'use strict';

    var Views  = Members.Views;
    var Models = Members.Models;

    Members.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'people':   'showDefault'
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
            this.defaultSortOrder = true;
            this.sortReverse = true;
        },

        showDefault: function(){
          window.scroll(0,0);
          this.showLayout();
        },

        period: function(from, to)
        {
            this.collection = this.options.collection = new this.options.collection.constructor();

            App.vent.trigger('members:data:loading');
            this.options.collection.fetch({
                data: { from: from, to: to },
                success: _.bind(function() {
                    App.vent.trigger('members:data:loaded');
                    this.collection = this.options.collection.filter(this.filters);
                    this.showTable(this.collection.sortBy(this.sortColumn, this.sortReverse));
                }, this)
            });
        },

        setPeriod: function(from, to)
        {
            _.extend(this.filters, { from: from, to: to });

            this.collection = new this.options.collection.constructor();
            App.vent.trigger('members:data:loading');
            var dfd = this.collection.fetch({ data: this.filters });
            dfd.done(function() {
                App.vent.trigger('members:data:loaded');
                App.vent.trigger('members:periodFiltered', from, to);
            });
            return dfd;
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
        var collection = new Models.MemberList();
        var controller = new Members.Controller({
            collection: collection,
            defaultSortColumn: 'last_name'
        });
        Members.collection = collection;
        Members.router = new Members.Router({ controller: controller });
    });

});
