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
        className: 'keywords-filters',

        ui: {
            speaker: 'select[name=speaker]'
        },

        events: {
            'change select[name=speaker]': 'filterBySpeaker'
        },

        initialize: function()
        {
            this.speakers = new Backbone.Collection();
            App.vent.on('members:fetched', this.updateSpeakers, this);
        },

        serializeData: function()
        {
            return {
                speakers: this.speakers.toJSON()
            };
        },

        updateSpeakers: function(speakers)
        {
            this.speakers = speakers.sortBy('first_name');
            this.render();
        },

        filterBySpeaker: function()
        {
            var speakerId = parseInt(this.ui.speaker.val(), 10);
            if (speakerId !== -1) {
                App.vent.trigger('keywords:filter', 'speaker', speakerId);
            }
        },

        onRender: function()
        {
            if (this.speakers.length) {
                this.ui.speaker.chosen();
            }
        }

    });

});