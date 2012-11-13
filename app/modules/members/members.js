PolitalkApp.module('Members', function(Members, App) {

    var Views = App.module('Members.Views');

    Members.Router = Marionette.AppRouter.extend({
        appRoutes: {
            '':         'showMembers',
            'people':   'showMembers'
        }
    });

    Members.Controller = Marionette.Controller.extend({

        initialize: function()
        {
            this.layout = new Views.Layout();
            this.sortReverse = true;

            this.bindTo(App.vent, 'members:filter', this.filter, this);
            this.bindTo(App.vent, 'members:clearFilters', this.clearFilters, this);
            this.bindTo(App.vent, 'members:sort', this.sort, this);
        },

        showMembers: function()
        {
            var sidebarView = new Views.SidebarView();

            App.main.show(this.layout);

            this.clearFilters();
            this.layout.sidebar.show(sidebarView);

            App.vent.trigger('nav:activateItem', 'People');

            this.sortColumn = 'duration';
            this.sortReverse = false;
            this.sort('duration');
        },

        filter: function(filters)
        {
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
        }

    });

    Members.addInitializer(function() {
        App.vent.trigger('nav:addItem', 'People', '#people');
    });

    Members.addInitializer(function() {
        var controller = new Members.Controller({ collection: Members.memberList });
        Members.router = new Members.Router({ controller: controller });
        Members.memberList.fetch();
    });

});