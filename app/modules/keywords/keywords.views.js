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

        initialize: function()
        {
            _.bindAll(this);
            this.bindTo(App.vent, 'phrases:filtered', this.updateFilters, this);
            this.datesLoaded = false;
        },

        updateFilters: function(key, value, speaker)
        {
            if ('speaker' === key) {
                this.currentSpeaker = speaker;
            }
            this.render();
        },

        url: function()
        {
            var searchTerm = this.model.get('terms').split(',')[0];
            return 'http://partylines.theglobalmail.org/search/' + searchTerm.replace(/\s/g, '+');
        },

        OAurl: function(){
          var searchTerm = _.map(this.model.get('terms').split(','), function(word){
              return '"' + word + '"';
          }).join(" ");
          var url = 'http://www.openaustralia.org/search/?s=' + encodeURIComponent(searchTerm);

          if (this.currentSpeaker) {
            url += "&pid=" + this.currentSpeaker.get('person_id');
          }
          return url;
        },

        serializeData: function()
        {
            var data = this.model.toJSON();
            data.url = this.url();
            data.OAurl = this.OAurl();
            data.shortText = _.first(_.sortBy(data.terms.split(','), 'length'));
            return data;
        }

    });

    Views.KeywordsList = Politalk.TableView.extend({
        itemView: Views.KeywordListItem,
        template: 'keywords/templates/keywords-table',
        moduleName: 'phrases',
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
            this.bindTo(App.vent, 'phrases:filtered', this.updateSelectedFilters, this);
            this.bindTo(App.vent, 'phrases:periodFiltered', this.updateDates, this);
            this.bindTo(App.vent, 'phrases:loaded', this.updateFromLoad, this);
        },

        serializeData: function()
        {
            var speakers = this.speakers.map(function(speaker){
              var data = speaker.toJSON();
              // mixin the yearsInHouse attribute
              return _.extend(data, {
                yearsInHouse : this.yearsInHouse(data),
                isSpeaker : !!speaker.get('isSpeaker')
              });
            }, this);
            // non speakers here refer to people who aren't the president etc
            var nonSpeakers = _.select(speakers, function(speaker){
              return !speaker.isSpeaker;
            });
            return {
                speakers: speakers,
                parties: _.unique(_.pluck(nonSpeakers, 'party')).sort()
            };
        },

        yearsInHouse: function(speaker){
            var leftYear = moment(speaker.left_house).years();
            if (leftYear !== 9999){
               return ' (' + moment(speaker.entered_house).years() + '–' + leftYear + ')';
            }
        },

        updateSpeakers: function(speakers)
        {
            this.speakers = new speakers.constructor(speakers.models.sort(function(speaker1, speaker2){
              // sort by last_name, first_name and then year left
              var compare = function(speaker){
                return _.map(['last_name', 'first_name', 'left_house'], speaker.get, speaker).join(' ');
              };
              return compare(speaker1).localeCompare(compare(speaker2));
            }));
            this.render();

            if (this.shown && !this.chosen) {
                this.onShow();
            }
            // Call this after members have been fetched
            this.updateStatus();
        },

        filterBySpeaker: function()
        {
            var speakerId = parseInt(this.ui.speaker.val(), 10);
            this.setSelectWithoutChangeEvent('party', '');
            this.updateFilterState('speaker', speakerId);
            this.updateStatus();
            App.vent.trigger('phrases:filter', 'speaker', speakerId);
        },

        filterByParty: function()
        {
            var party = this.ui.party.val();
            this.setSelectWithoutChangeEvent('speaker', '');
            this.updateFilterState('party', party);
            this.updateStatus();
            App.vent.trigger('phrases:filter', 'party', party);
        },

        updateDates: function(from, to){
          this.fromDate = from;
          this.toDate = to;
          this.updateStatus();
        },

        updateStatus: function(){
            if (this.currentSpeakerId){
              var currentSpeakerId = this.currentSpeakerId;
              this.currentSpeaker = this.speakers.find(function(speaker){
                return speaker.get('speaker_id') === currentSpeakerId;
              });
            }else{
              this.currentSpeaker = null;
            }
            if (this.currentSpeaker){
              var speakerImage = this.currentSpeaker.get('image') 
              this.imageUrl = speakerImage ? '/modules/members/members-img/mpsL/' + this.currentSpeaker.get('person_id') + '.jpg' : '/modules/members/img/avatar.png'
              this.currentSpeakerName = this.currentSpeaker.get('first_name') + ' ' + this.currentSpeaker.get('last_name');
              this.currentSpeakerRole = this.currentSpeaker.get('roleAndTenure');
              this.currentSpeaker = this.currentSpeakerName + ' ' + this.currentSpeakerRole;
            }
            var entity = this.currentSpeaker || this.currentParty;
            var html = '';
            if (entity === 'Independent'){
              html += 'Phrases frequently used by <strong>Independents</strong> ';
            }else if (entity) {
                if (this.currentSpeaker) {
                    html += 'Phrases frequently used by <strong>' + entity + '</strong> ';
                } else {
                    html += 'Phrases frequently used by the <strong>' + entity + '</strong> ';
                }
            }else{
              html += 'Phrases frequently used in Australian Federal Parliament';
            }
            if (this.fromDate && this.toDate){
              html += ' from ' +
                _.map([this.fromDate, this.toDate], function(date){
                  return '<strong>' +date + '</strong>';
                }).join(' to ');
            }
            $('.keywords-status').html(html);

            if (!this.currentSpeaker) {
                $('.member-info-container').html(thumbnailHtml).removeClass('open');
            }else{
                var thumbnailHtml = '<div class="member-thumb"><img alt="' + this.currentSpeaker + '" src="' + this.imageUrl + '" /></div><div class="member-name">' + this.currentSpeakerName + ' ' + this.currentSpeakerRole + '</div>';
                $('.member-info-container').html(thumbnailHtml).addClass('open');
            };
        },

        updateFromLoad: function(key, value){
            if (this.ui && key in this.ui) {
                this.setSelectWithoutChangeEvent(key, value);
            }
        },

        updateSelectedFilters: function(key, value)
        {
            if (this.ui && key in this.ui) {
                this.setSelectWithoutChangeEvent(key, value);
            }
            this.updateFilterState(key, value);
            this.updateStatus();
        },

        updateFilterState: function(key, value){
            if (key === 'speaker'){
              this.currentSpeakerId = value && parseInt(value, 10);
              this.currentParty = null;
            }else if (key === 'party'){
              this.currentParty = value;
              this.currentSpeakerId = null;
            }
        },

        updateLoadedFilters: function(key, value)
        {
            if (this.ui && key in this.ui) {
                this.setSelectWithoutChangeEvent(key, value);
            }
        },


        onShow: function()
        {
            this.shown = true;

            if (this.speakers.length && !this.chosen) {
                this.chosen = true;
                if (!Modernizr.touch){
                  this.ui.speaker.select2({ allowClear: true, width: '220px', dropdownAutoWidth: true });
                  this.ui.party.select2({ allowClear: true, width: '220px', dropdownAutoWidth: true });
                }
            }
        },

        setSelectWithoutChangeEvent: function(key, value, options){
          this.undelegateEvents();
          this.setSelect(key, value);
          this.delegateEvents();
        },

        setSelect: function(key, value)
        {
          if (Modernizr.touch){
            this.ui[key].val(value);
          }else{
            this.ui[key].select2('val', value);
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
                format: 'yyyy',
                viewMode: 'years',
                minViewMode: 'years',
                autoclose: true
            };

            App.vent.on('dates:fetch', this.setDates, this);
            this.bindTo(App.vent, 'phrases:periodFiltered', this.updateDates, this);
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
            this.datesLoaded = true;
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
            var from   = this.$fromDate.val();
            var to     = this.$toDate.val();

            if (this.datesLoaded){
              App.vent.trigger('phrases:period', from, to);
            }
        },

        formatMoment: function(m)
        {
            return moment(m).format('YYYY');
        },

        updateDates: function(from, to)
        {
            this.fromDate = from;
            this.toDate = to;
            this.refreshDates();
        }

    });

});
