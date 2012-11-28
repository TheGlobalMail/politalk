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
            'filter': 'filter'
        },

        typeToParam: {
            'speaker': 'speaker_id'
        },

        onShow: function()
        {
            this.sidebar.filters.show(new Views.FiltersView());
        },

        clearFilters: function()
        {
            this.filters = {};
            this._ensureRoute("keywords");
            this.showTable(this.options.collection);
        },

        filter: function(type, id)
        {
            if (!id) {
                return this.clearFilters();
            }

            this.collection = new this.options.collection.constructor();

            var data = this.filters = {};
            data[this.typeToParam[type] || type] = id;

            this.collection.fetch({
                data: data,
                success: _.bind(function() {
                    this.showLayout();
                    this.showTable(this.collection.sortBy(this.sortColumn, this.sortReverse));
                    App.vent.trigger('keywords:filtered', type, id);

                    if (type === 'speaker') {
                        this.ensureSpeakerRoute(id);
                    } else {
                        this._ensureRoute('keywords');
                    }
                }, this)
            });
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