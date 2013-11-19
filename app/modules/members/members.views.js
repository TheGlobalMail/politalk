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
        avatarUrl: "/modules/members/img/avatar.png",

        events: {
            'click': 'showMember'
        },

        initialize: function()
        {
            _.bindAll(this);
        },

        serializeData: function(){
          var data = this.model ? this.model.toJSON() : {};
          data.imageUrl = App.config.memberImageDomain;
          data.imageUrl += data.image ?
              '/modules/members/members-img/mpsL/' + data.person_id + '.jpg' :
               this.avatarUrl;
          return data;
        },

        showMember: function()
        {
            Backbone.history.navigate('person/' + this.model.get('person_id'), { trigger: true });
        }

    });

    Views.MemberList = Politalk.TableView.extend({

        itemView: Views.MemberListItem,
        template: 'members/templates/members-table',
        moduleName: 'members',
        app: App

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
                format: 'd/m/yyyy',
                autoclose: true
            };

            App.vent.on('dates:fetch', this.setDates, this);
            this.bindTo(App.vent, 'keywords:periodFiltered', this.updateDates, this);
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

            if (!this.fromDate && !this.toDate){
                this.fromDate = _.first(this.dates);
                this.toDate = _.last(this.dates);
            }

            var fromDate = this.formatMoment(this.fromDate);
            var toDate   = this.formatMoment(this.toDate);
            var fromRangeDate = this.formatMoment(_.first(this.dates));
            var toRangeDate   = this.formatMoment(_.last(this.dates));

            this.undelegateEvents();
            this.$fromDate.val(fromDate);
            this.$toDate.val(toDate);

            this.$('input[name*=Date]')
                    .datepicker('setStartDate', fromRangeDate)
                    .datepicker('setEndDate', toRangeDate);
            this.delegateEvents();
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
        },

        updateDates: function(from, to)
        {
            this.fromDate = from;
            this.toDate = to;
            this.refreshDates();
        }

    });

});
