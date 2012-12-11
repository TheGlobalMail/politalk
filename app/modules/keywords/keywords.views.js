PolitalkApp.module('Keywords.Views', function(Views, App) {
    'use strict';

    Views.Layout = Politalk.ModuleLayout.extend({

        template: 'keywords/templates/keywords-layout',
        className: 'module-layout keywords-layout',

        regions: {
            sidebar: 'aside',
            table: '.keywords-list'
        }

    });

    Views.SidebarLayout = Marionette.Layout.extend({

        template: 'keywords/templates/keywords-sidebar',

        regions: {
            period: '.period-container',
            filters: '.filters-container'
        }

    });

    Views.KeywordListItem = Marionette.ItemView.extend({
        tagName: 'tr',
        template: 'keywords/templates/keyword-item',

        events: {
            'click': 'search'
        },

        initialize: function()
        {
            _.bindAll(this);
            this.bindTo(App.vent, 'keywords:filtered', this.updateFilters, this);
        },

        updateFilters: function(key, value)
        {
            if ('speaker' === key) {
                this.currentSpeaker = value;
            }
            this.render();
        },

        url: function()
        {
            var url = 'http://www.openaustralia.org/search/?s=' + encodeURIComponent('"' + this.model.get('text') + '"');

            if (this.currentSpeaker) {
                url += "&pid=" + this.currentSpeaker;
            }

            return url;
        },

        search: function(e)
        {
            e.preventDefault();
            window.open(this.url(), '_blank');
            return false;
        },

        serializeData: function()
        {
            var data = this.model.toJSON();
            data.url = this.url();
            return data;
        }

    });

    Views.KeywordsList = Politalk.TableView.extend({
        itemView: Views.KeywordListItem,
        template: 'keywords/templates/keywords-table',
        moduleName: 'keywords',
        app: App
    });

    Views.FiltersView = Marionette.ItemView.extend({

        template: 'keywords/templates/keywords-filters',
        className: 'keywords-filters',

        ui: {
            speaker: 'select[name=speaker]',
            party: 'select[name=party]'
        },

        filterMap: {
            'speaker_id': 'speaker'
        },

        events: {
            'change select[name=speaker]': 'filterBySpeaker',
            'change select[name=party]': 'filterByParty'
        },

        initialize: function()
        {
            this.speakers = new Backbone.Collection();
            this.bindTo(App.vent, 'members:fetched', this.updateSpeakers, this);
            this.bindTo(App.vent, 'keywords:filtered', this.updateSelectedFilters, this);
        },

        serializeData: function()
        {
            return {
                speakers: this.speakers.toJSON(),
                parties: _.unique(this.speakers.pluck('party'))
            };
        },

        updateSpeakers: function(speakers)
        {
            this.speakers = speakers.sortBy('first_name');
            this.render();

            if (this.shown && !this.chosen) {
                this.onShow();
            }
        },

        filterBySpeaker: function()
        {
            var speakerId = parseInt(this.ui.speaker.val(), 10);
            App.vent.trigger('keywords:filter', 'speaker', speakerId);
            this.ui.party.select2('val', '');
        },

        filterByParty: function()
        {
            var party = this.ui.party.val();
            App.vent.trigger('keywords:filter', 'party', party);
            this.ui.speaker.select2('val', '');
        },

        updateSelectedFilters: function(key, value)
        {
            if (this.ui && key in this.ui) {
                this.ui[key].select2('val', value);
            }
        },

        onShow: function()
        {
            this.shown = true;

            if (this.speakers.length && !this.chosen) {
                this.chosen = true;
                this.ui.speaker.select2({ allowClear: true, width: '180px' });
                this.ui.party.select2({ allowClear: true, width: '180px' });
            }
        }

    });

    Views.PeriodView = Marionette.ItemView.extend({

        template: 'keywords/templates/keywords-period',
        className: 'keywords-period',

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

            App.vent.trigger('keywords:period', from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'));
        },

        formatMoment: function(m)
        {
            return moment(m).format('D/M/YYYY');
        },

        updateDates: function(from, to)
        {
          this.dates = [from, to];
          this.refreshDates();
        }

    });

});
