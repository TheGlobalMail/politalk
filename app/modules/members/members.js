PolitalkApp.module('Members', function(Members, App, Backbone, Marionette) {

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

    Members.Member = Backbone.Model.extend({

        houseNames: [
            null,
            'House of Rep.',
            'Senate'
        ],

        parties: {
            'Australian Greens': 'Greens',
            'Australian Labor Party': 'ALP',
            'Liberal Party': 'LP',
            'Independent': 'Ind.',
            'National Party': 'NP',
            'Country Liberal Party': 'CLP',
            'Democratic Labor Party': 'DLP'
        },

        speakerParties: [
            'PRES',
            'DPRES',
            'CWM'
        ],

        mutators: {
            houseName: function() {
                return this.house === 1 ? 'House of Rep.' : 'Senate';
            },

            partyAbbreviation: function() {
                var parties = Members.Member.prototype.parties;
                return parties[this.party] || this.party;
            },

            durationString: function() {
                var hours = Math.floor(this.duration / 60 / 60);
                var minutes = (this.duration / 60) % 60;

                return hours + "h " + minutes + "m";
            }
        }

    });

    Members.MemberList = Backbone.Collection.extend({
        model: Members.Member,
        url: App.config.apiHost + '/api/members',
        cache: true,

        filter: function(filters)
        {
            var members = _.filter(this.models, function(member) {
                return _.include(filters.party, member.get('party')) || _.include(filters.house, member.get('house'));
            });

            if (filters.noSpeakers) {
                members = _.filter(this.models, function(member) {
                    return !_.include(Members.Member.prototype.speakerParties, member.get('party'));
                });
            }

            return new this.constructor(members);
        },

        sortBy: function(attr, reverse)
        {
            var models = this.models.sort(function(member1, member2) {
                var val1 = member1.get(attr),
                    val2 = member2.get(attr);

                if (_.isString(val1)) {
                    return val1.localeCompare(val2);
                }

                if (val1 > val2) {
                    return 1;
                }

                if (val1 < val2) {
                    return -1;
                }

                return 0;
            });

            if (reverse) {
                models.reverse();
            }

            return new this.constructor(models);
        }

    });

    Members.memberList = new Members.MemberList();

    Members.addInitializer(function() {
        App.vent.trigger('nav:addItem', 'People', '#people');
    });

    Members.addInitializer(function() {
        var controller = new Members.Controller({ collection: Members.memberList });
        Members.router = new Members.Router({ controller: controller });
        Members.memberList.fetch();
    });

});