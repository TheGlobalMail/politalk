PolitalkApp.module('Members.Views', function(Views, App) {
    'use strict';

    var Members = App.module('Members');

    Views.Layout = Politalk.ModuleLayout.extend({
        template: 'members/templates/members-layout',
        className: 'module-layout members-layout',

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
        template: 'members/templates/member-item',

        events: {
            'click': 'showMember'
        },

        initialize: function()
        {
            _.bindAll(this);
        },

        showMember: function()
        {
            Backbone.history.navigate('person/' + this.model.get('speaker_id'), { trigger: true });
        }

    });

    Views.MemberList = Politalk.TableView.extend({

        itemView: Views.MemberListItem,
        template: 'members/templates/members-table',
        moduleName: 'members',
        app: App,

        onRender: function()
        {
            this.$('img[data-fallback-src]').imgFallback();
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
                autoclose: true
            };

            App.vent.on('dates:fetch', this.setDates, this);
        },

        onRender: function()
        {
            this.$fromDate = this.$('input[name=fromDate]');
            this.$toDate   = this.$('input[name=toDate]');

            this.$('input[name*=Date]').datepicker(this.datePickerDefaults);
            this.refreshDates();
        },

        setDates: function(dates)
        {
            // allow calling with setDates(fromDate, toDate)
            if (arguments.length === 2) {
                dates = arguments;
            }

            this.dates = dates;
            this.refreshDates();
        },

        refreshDates: function()
        {
            if (!this.dates || !this.$fromDate || !this.$toDate) {
                return false;
            }

            var fromDate = this.formatMoment(_.first(this.dates));
            var toDate   = this.formatMoment(_.last(this.dates));

            this.$fromDate.val(fromDate);
            this.$toDate.val(toDate);

            this.$('input[name*=Date]')
                    .datepicker('setStartDate', fromDate)
                    .datepicker('setEndDate', toDate);
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
            return moment(m).format('D/M/YYYY');
        }

    });

});