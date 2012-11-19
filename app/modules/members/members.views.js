PolitalkApp.module('Members.Views', function(Views, App) {
    'use strict';

    var Members = App.module('Members');

    Views.Layout = Marionette.Layout.extend({
        template: 'members/templates/members-layout',

        regions: {
            sidebar: 'aside',
            table: '.members-list'
        }
    });

    Views.SidebarLayout = Marionette.Layout.extend({
        template: 'members/templates/members-sidebar',

        regions: {
            period: '.period-container',
            filters: '.filters-container'
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

    Views.FiltersView = Marionette.ItemView.extend({

        template: 'members/templates/members-filters',
        className: 'members-filters',

        events: {
            'change .filter-group input:checkbox': 'filter'
        },

        serializeData: function()
        {
            return {
                parties: _.keys(Members.Models.Member.prototype.parties),
                houses: [
                    { id: 1, name: 'House of Rep.' },
                    { id: 2, name: 'Senate' }
                ]
            };
        },

        filter: function()
        {
            var unchecked = this.$('.filter-group input:checkbox:not(:checked)');
            var filters = { "party": [], "house": [], noSpeakers: false };

            if (unchecked.length === 0) {
                return App.vent.trigger('members:clearFilters');
            }

            _.each(unchecked, function(checkbox) {
                if (checkbox.name in filters) {
                    var val = checkbox.value;

                    if (checkbox.name === "house") {
                        val = parseInt(val, 10);
                    }

                    if (checkbox.name === "noSpeakers") {
                        filters.noSpeakers = true;
                        return;
                    }

                    filters[checkbox.name].push(val);
                }
            });

            App.vent.trigger('members:filter', filters);
        }

    });

    Views.PeriodView = Marionette.ItemView.extend({

        template: 'members/templates/members-period',
        className: 'members-period',

        events: {
            'changeDate input[name=fromDate]': 'fromDateChange',
            'changeDate input[name=toDate]': 'toDateChange'
        },

        initialize: function()
        {
            _.bindAll(this);
            this.datePickerDefaults = {
                format: 'dd/mm/yyyy',
                startDate: this.formatMoment(moment('2007-01-01')),
                endDate: this.formatMoment(moment()),
                autoclose: true
            };
        },

        onRender: function()
        {
            var $fromDate = this.$fromDate = this.$('input[name=fromDate]');
            var $toDate   = this.$toDate   = this.$('input[name=toDate]');

            $fromDate.val(this.formatMoment(moment().subtract('months', 2)));
            $toDate.val(this.formatMoment(moment()));

            $([$fromDate, $toDate]).datepicker(this.datePickerDefaults);
        },

        fromDateChange: function()
        {
            this.onDateChange();
        },

        toDateChange: function()
        {
            this.onDateChange();
        },

        onDateChange: function()
        {
            var format = this.datePickerDefaults.format.toUpperCase();
            var from   = moment(this.$fromDate.val(), format);
            var to     = moment(this.$toDate.val(), format);

            App.vent.trigger('members:period', from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'));
        },

        formatMoment: function(m)
        {
            return m.format('D/M/YYYY');
        }

    });

});