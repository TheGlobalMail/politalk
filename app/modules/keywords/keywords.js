PolitalkApp.module('Keywords', function(Keywords, App) {
    'use strict';

    var Views = Keywords.Views;
    var Models = Keywords.Models;

    Keywords.Router = Marionette.AppRouter.extend({
        appRoutes: {
            '':   'showLayout',
            'phrases':   'showLayout',
            'person/:id': 'showMember',
            'party/:id': 'showParty'
        }
    });

    Keywords.Controller = Politalk.ModuleController.extend({

        app: App,
        layoutView: Views.Layout,
        sidebarView: Views.SidebarLayout,
        tableView: Views.KeywordsList,
        moduleName: 'phrases',
        navTitle: 'Phrases',

        appVents: {
            'filter': 'filter',
            'period': 'period'
        },

        typeToParam: {
            'speaker': 'person_id',
            'party': 'party'
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
            this._ensureRoute("phrases");
            this.showTable(this.options.collection);
        },

        filter: function(type, id)
        {
            this.filters[this.typeToParam[type] || type] = id;
            if (!id) {
                delete this.filters[this.typeToParam[type] || type];
            }

            // clear the other filters
            _.chain(['party', 'speaker'])
              .select(function(filter){
                return filter !== type;
              }).each(function(filter){
                delete this.filters[this.typeToParam[filter] || filter];
              }, this);

            this.collection = new this.options.collection.constructor();
            this.collection.fetch({ data: this.filters }).done(this._showFiltered);
        },

        ensureSpeakerRoute: function(id)
        {
            this._ensureRoute("person/" + id);
        },

        ensurePartyRoute: function(id)
        {
            this._ensureRoute("party/" + id.replace(/\s/g, '+'));
        },

        _ensureRoute: function(route)
        {
            if (Backbone.history.getFragment() !== route) {
                Backbone.history.navigate(route);
            }
        },

        showMember: function(id)
        {
            App.vent.trigger('phrases:loaded', 'speaker', id);
            this.filter('speaker', id);
        },

        showParty: function(id)
        {
            var party = id.replace(/\+/g, ' ');
            App.vent.trigger('phrases:loaded', 'party', party);
            this.filter('party', party);
        },

        externalPeriod: function(from, to)
        {
            this.filters = {};
            App.vent.trigger('phrases:filtered', 'speaker', '');
            App.vent.trigger('phrases:filtered', 'party', '');
            this.setPeriod(from, to);
        },

        setPeriod: function(from, to)
        {
            _.extend(this.filters, { from: from, to: to });

            this.collection = new this.options.collection.constructor();
            var dfd = this.collection.fetch({ data: this.filters });
            dfd.done(function() {
                App.vent.trigger('phrases:periodFiltered', from, to);
            });
            return dfd;
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
                App.vent.trigger('phrases:filtered', filterName, value);
            });

            if (this.typeToParam['party'] in this.filters) {
                this.ensurePartyRoute(this.filters[this.typeToParam['party']]);
            }else if (this.typeToParam['speaker'] in this.filters) {
                this.ensureSpeakerRoute(this.filters[this.typeToParam['speaker']]);
            } else {
                this._ensureRoute('phrases');
            }
        }

    });

    Keywords.addInitializer(function() {
        App.vent.trigger('nav:addItem', 'Phrases', '#phrases');
    });

    Keywords.addInitializer(function() {
        var controller = new Keywords.Controller({
            collection: new Models.KeywordList(),
            defaultSortColumn: 'frequency'
        });

        new Keywords.Router({ controller: controller });
    });

});
