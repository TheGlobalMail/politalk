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
        },

        search: function(e)
        {
            e.preventDefault();
            window.open('http://www.openaustralia.org/search/?s=' + encodeURIComponent(this.model.get('text')), '_blank');
            return false;
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

            if (this.speakers.length) {
                this.chosen = true;

                this.ui.speaker.select2({ allowClear: true, width: 'element' });
                this.ui.party.select2({ allowClear: true, width: 'element' });
            }
        }

    });

});