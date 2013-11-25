PolitalkApp.module('Keywords', function(Keywords, App) {
    'use strict';

    var Views = Keywords.Views;
    var Models = Keywords.Models;

    Keywords.Router = Marionette.AppRouter.extend({
        appRoutes: {
            '':   'showDefault',
            'phrases':   'showDefault',
            'speaker/:id': 'showSpeaker',
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
            'sort': 'sort',
            'period': 'period'
        },

        typeToParam: {
            'speaker': 'speaker_id',
            'party': 'party'
        },

        initialize: function()
        {
            _.bindAll(this, '_showFiltered');
            this.bindTo(App.vent, 'dates:fetch', this.recordDateRange, this);
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

        recordDateRange: function(dates){
            this.fromDateRange = moment(_.first(dates)).format('YYYY-MM-DD');
            this.toDateRange = moment(_.last(dates)).format('YYYY-MM-DD');
        },

        isDefaultDateRange: function(from, to){
            return from === this.fromDateRange && to === this.toDateRange;
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
            App.vent.trigger('phrases:data:loading');
            var _this = this;
            this.collection.fetch({ data: this.filters }).done(function(){
              App.vent.trigger('phrases:data:loaded');
              _this._showFiltered();
            });
        },

        ensureSpeakerRoute: function(id)
        {
            this._ensureRoute("speaker/" + id);
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

        showDefault: function(){
            window.scroll(0,0);
            this.showLayout();
        },

        showSpeaker: function(id)
        {
            App.vent.trigger('phrases:loaded', 'speaker', id);
            this.filter('speaker', id);
            window.scroll(0, 0);
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
            if (this.isDefaultDateRange(from, to)){
              delete this.filters.from;
              delete this.filters.to;
            }else{
              _.extend(this.filters, { from: from, to: to });
            }

            this.collection = new this.options.collection.constructor();
            App.vent.trigger('phrases:data:loading');
            var dfd = this.collection.fetch({ data: this.filters });
            dfd.done(function() {
                App.vent.trigger('phrases:data:loaded');
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

            var model;
            _.each(this.filters, function(value, filterName) {
                filterName = mapInvert[filterName] || filterName;
                if (filterName === 'speaker'){
                  model = App.Members.collection.find(function(member){
                      return member.get('speaker_id') === parseInt(value, 10);
                  });
                }
                App.vent.trigger('phrases:filtered', filterName, value, model);
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
