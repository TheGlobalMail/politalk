PolitalkApp.module('Keywords', function(Keywords, App) {
    'use strict';

    var Views = Keywords.Views;
    var Models = Keywords.Models;

    Keywords.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'keywords':   'showLayout',
            'person/:id': 'showMember'
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
            'period': 'period'
        },

        typeToParam: {
            'speaker': 'person_id'
        },

        initialize: function()
        {
            _.bindAll(this, '_showFiltered');
            this.bindTo(App.vent, 'members:period', this.externalPeriod, this);
            this.periodView = new Views.PeriodView();
        },

        onShow: function()
        {
            this.sidebar.filters.show(new Views.FiltersView());
            this.sidebar.period.show(this.periodView);
        },

        clearFilters: function()
        {
            this.filters = {};
            this._ensureRoute("keywords");
            this.showTable(this.options.collection);
        },

        filter: function(type, id)
        {
            this.filters[this.typeToParam[type] || type] = id;

            if (!id) {
                delete this.filters[this.typeToParam[type] || type];
            }

            this.collection = new this.options.collection.constructor();
            this.collection.fetch({ data: this.filters }).done(this._showFiltered);
        },

        ensureSpeakerRoute: function(id)
        {
            this._ensureRoute("person/" + id);
        },

        _ensureRoute: function(route)
        {
            if (Backbone.history.getFragment() !== route) {
                Backbone.history.navigate(route);
            }
        },

        showMember: function(id)
        {
            this.filter('speaker', id);
        },

        externalPeriod: function(from, to)
        {
            this.filters = {};
            App.vent.trigger('keywords:filtered', 'speaker', '');
            App.vent.trigger('keywords:filtered', 'party', '');
            this.setPeriod(from, to);
        },

        setPeriod: function(from, to)
        {
            _.extend(this.filters, { from: from, to: to });

            this.collection = new this.options.collection.constructor();
            var dfd = this.collection.fetch({ data: this.filters });
            dfd.done(function() {
                App.vent.trigger('keywords:periodFiltered', from, to);
            });
        },

        period: function(from, to)
        {
            this.setPeriod(from, to).done(this._showFiltered);
        },

        _showFiltered: function()
        {
            this.showLayout();
            this.showTable(this.collection.sortBy(this.sortColumn, this.sortReverse));

            var mapInvert = _.invert(this.typeToParam);

            _.each(this.filters, function(value, filterName) {
                filterName = mapInvert[filterName] || filterName;
                App.vent.trigger('keywords:filtered', filterName, value);
            });

            if (this.typeToParam['speaker'] in this.filters) {
                this.ensureSpeakerRoute(this.filters[this.typeToParam['speaker']]);
            } else {
                this._ensureRoute('keywords');
            }
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