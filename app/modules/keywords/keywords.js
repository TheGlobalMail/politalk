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
            'filter': 'filter'
        },

        typeToParam: {
            'speaker': 'speaker_id'
        },

        onShow: function()
        {
            this.sidebar.filters.show(new Views.FiltersView());
        },

        filter: function(type, id)
        {
            this._fullCollection = this.options.collection;
            this.collection = this.options.collection = new this.collection.constructor();

            var data = {};
            data[this.typeToParam[type]] = id;

            this.collection.fetch({
                data: data,
                success: _.bind(function() {
                    this.showTable(this.collection.sortBy(this.sortColumn, this.sortReverse));
                }, this)
            });
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