PolitalkApp.module('Members.Views', function(Views, App) {

    var Members = App.module('Members');

    Views.Layout = Marionette.Layout.extend({
        template: 'members/templates/members-layout',

        regions: {
            sidebar: 'aside',
            table: '.members-list'
        }
    });

    Views.MemberListItem = Marionette.ItemView.extend({
        tagName: 'tr',
        template: 'members/templates/member-item'
    });

    Views.MemberList = Marionette.CompositeView.extend({
        itemView: Views.MemberListItem,
        itemViewContainer: 'tbody',
        template: 'members/templates/members-table',

        events: {
            'click th[data-sortable]': 'sort'
        },

        initialize: function()
        {
            this.bindTo(App.vent, 'members:sorted', this.onSorted, this);
        },

        onRender: function()
        {
            if (this.collection.length) {
                this.$('.loading').remove();
            }
        },

        sort: function(e)
        {
            var column = $(e.currentTarget).data('sortable');
            App.vent.trigger('members:sort', column);
        },

        onSorted: function(column, reversed)
        {
            this.$('th.sorted').removeClass('sorted reversed');

            var $th = this.$('th[data-sortable=' + column +']');
            $th.addClass('sorted');

            if (reversed) {
                $th.addClass('reversed');
            }
        }

    });

    Views.SidebarView = Marionette.ItemView.extend({

        template: 'members/templates/members-sidebar',
        className: 'members-filters',

        events: {
            'change .filter-group input:checkbox': 'filter'
        },

        serializeData: function()
        {
            return {
                parties: _.keys(Members.Member.prototype.parties),
                houses: [
                    { id: 1, name: 'House of Rep.' },
                    { id: 2, name: 'Senate' }
                ]
            };
        },

        filter: function()
        {
            var checkedBoxes = this.$('.filter-group input:checkbox:checked');
            var filters = { "party": [], "house": [], noSpeakers: false };

            if (checkedBoxes.length === 0) {
                return App.vent.trigger('members:clearFilters');
            }

            _.each(checkedBoxes, function(checkbox) {
                if (checkbox.name in filters) {
                    var val = checkbox.value;

                    if (checkbox.name == "house") {
                        val = parseInt(val, 10);
                    }

                    if (checkbox.name == "noSpeakers") {
                        filters.noSpeakers = true;
                        return;
                    }

                    filters[checkbox.name].push(val);
                }
            });

            App.vent.trigger('members:filter', filters);
        }

    });

});