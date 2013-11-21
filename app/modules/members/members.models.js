PolitalkApp.module('Members.Models', function(Models, App) {
    'use strict';

    Models.Member = Backbone.Model.extend({

        houseNames: [
            null,
            'House of Rep.',
            'Senate'
        ],

        parties: {
            'Australian Democrats': 'AD',
            'Australian Greens': 'Greens',
            'Australian Labor Party': 'ALP',
            'Country Liberal Party': 'CLP',
            'Democratic Labor Party': 'DLP',
            'Family First Party': 'FFP',
            'Independent': 'Ind.',
            'Liberal Party': 'LP',
            'National Party': 'NP',
            'Palmer United Party': 'PUP'
        },

        speakerParties: [
            'PRES',
            'DPRES',
            'CWM',
            'SPK',
            'Speaker',
            'Deputy-President',
            'Deputy-Speaker',
            'President'
        ],

        mutators: {

            roleAndTenure: function(){
                var role;
                if (this.party.match(/^(PRES|President)$/)){
                  role = 'President';
                }else if (this.party.match(/^(DPRES|Deputy-President)$/)){
                  role = 'Deputy President';
                }else if (this.party.match(/^(SPK|Speaker)$/)){
                  role = 'Speaker';
                }else if (this.party.match(/^(DSPK|Deputy-Speaker)$/)){
                  role = 'Deputy-Speaker';
                }else if (this.party.match(/^(CWM)$/)){
                  role = 'Chair';
                }
                var roleAndTenure = '(';
                if (role){
                    roleAndTenure += role + ': ';
                }
                roleAndTenure += _.map([moment(this.entered_house), moment(this.left_house)], function(date){
                     return date.years() === 9999 ? 'present' : date.format('YYYY');
                }).join(' – ') + ')';
                return roleAndTenure;
            },

            houseName: function() {
                return this.house === 1 ? 'House of Rep.' : 'Senate';
            },

            partyAbbreviation: function() {
                var parties = Models.Member.prototype.parties;
                return parties[this.party] || this.party;
            },

            durationString: function() {
                var hours = Math.floor(this.duration / 60 / 60);
                var minutes = Math.floor((this.duration / 60) % 60);

                if (hours && minutes) {
                    return hours + 'h ' + minutes + 'm';
                }

                if (minutes) {
                    return minutes + 'm';
                }

                return hours + 'h';
            },

            isSpeaker: function(){
               return _.include(Models.Member.prototype.speakerParties, this.party);
            }
        }

    });

    Models.MemberList = Politalk.TableCollection.extend({
        model: Models.Member,
        url: App.config.apiHost + '/api/members',

        filter: function(filters)
        {
            var members = _.filter(this.models, function(member) {
                return !_.include(filters.party, member.get('party')) && !_.include(filters.house, member.get('house'));
            });

            if (filters.noSpeakers) {
                members = _.filter(members, function(member) {
                    return !_.include(Models.Member.prototype.speakerParties, member.get('party'));
                });
            }

            return new this.constructor(members);
        }

    });

});
