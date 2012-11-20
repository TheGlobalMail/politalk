PolitalkApp.module('Keywords.Views', function(Views, App) {
    'use strict';

    Views.Layout = Marionette.Layout.extend({

        template: 'keywords/templates/keywords-layout',

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
        template: 'keywords/templates/keyword-item'
    });

    Views.KeywordsList = Politalk.TableView.extend({
        itemView: Views.KeywordListItem,
        template: 'keywords/templates/keywords-table',
        moduleName: 'keywords',
        app: App
    });

    Views.FiltersView = Marionette.ItemView.extend({

        template: 'keywords/templates/keywords-filters',
        className: 'keywords-filters'

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

            App.vent.trigger('keywords:period', from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'));
        },

        formatMoment: function(m)
        {
            return m.format('D/M/YYYY');
        }

    });

});