PolitalkApp.module('Members', function(Members, App) {

    var Views  = Members.Views;
    var Models = Members.Models;

    Members.Router = Marionette.AppRouter.extend({
        appRoutes: {
            '':         'showMembers',
            'people':   'showMembers'
        }
    });

    Members.Controller = Marionette.Controller.extend({

        initialize: function()
        {
            this.options.collection.fetch();

            this.layout = new Views.Layout();
            this.sortReverse = true;
            this.filters = {};

            this.bindTo(App.vent, 'members:filter', this.filter, this);
            this.bindTo(App.vent, 'members:clearFilters', this.clearFilters, this);
            this.bindTo(App.vent, 'members:sort', this.sort, this);
            this.bindTo(App.vent, 'members:period', this.period, this);
        },

        showMembers: function()
        {
            var sidebarLayout = new Views.SidebarLayout();

            App.main.show(this.layout);

            this.clearFilters();
            this.layout.sidebar.show(sidebarLayout);

            sidebarLayout.filters.show(new Views.FiltersView());
            sidebarLayout.period.show(new Views.PeriodView());

            App.vent.trigger('nav:activateItem', 'People');

            this.sortColumn = 'duration';
            this.sortReverse = false;
            this.sort('duration');
        },

        filter: function(filters)
        {
            this.filters = filters;
            this.showMemberList(this.options.collection.filter(filters));
        },

        clearFilters: function()
        {
            this.showMemberList(this.options.collection);
        },

        showMemberList: function(collection)
        {
            this.collection = collection;
            this.layout.table.show(new Views.MemberList({ collection: collection }));
            App.vent.trigger('members:sorted', this.sortColumn, this.sortReverse);
        },

        sort: function(column)
        {
            if (!this.collection.length) {
                return this.collection.on('reset', _.bind(this.sort, this, column));
            }

            if (this.sortColumn == column) {
                this.sortReverse = !this.sortReverse;
            } else {
                this.sortReverse = false;
            }

            this.sortColumn = column;
            this.showMemberList(this.collection.sortBy(this.sortColumn, this.sortReverse));
        },

        period: function(from, to)
        {
            this._fullCollection = this.options.collection;
            this.collection = this.options.collection = new this.options.collection.constructor();

            this.options.collection.fetch({
                data: { from: from, to: to },
                success: _.bind(function() {
                    this.collection = this.options.collection.filter(this.filters);
                    this.showMemberList(this.collection.sortBy(this.sortColumn, this.sortReverse));
                }, this)
            });
        }

    });

    Members.addInitializer(function() {
        App.vent.trigger('nav:addItem', 'People', '#people');
    });

    Members.addInitializer(function() {
        var controller = new Members.Controller({ collection: new Models.MemberList() });
        Members.router = new Members.Router({ controller: controller });
    });

});