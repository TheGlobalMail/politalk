PolitalkApp.module('Members.Models', function(Models, App) {
    var Members = App.module('Members');

    Models.Member = Backbone.Model.extend({

        houseNames: [
            null,
            'House of Rep.',
            'Senate'
        ],

        parties: {
            'Australian Greens': 'Greens',
            'Australian Labor Party': 'ALP',
            'Liberal Party': 'LP',
            'Independent': 'Ind.',
            'National Party': 'NP',
            'Country Liberal Party': 'CLP',
            'Democratic Labor Party': 'DLP'
        },

        speakerParties: [
            'PRES',
            'DPRES',
            'CWM'
        ],

        mutators: {
            houseName: function() {
                return this.house === 1 ? 'House of Rep.' : 'Senate';
            },

            partyAbbreviation: function() {
                var parties = Models.Member.prototype.parties;
                return parties[this.party] || this.party;
            },

            durationString: function() {
                var hours = Math.floor(this.duration / 60 / 60);
                var minutes = (this.duration / 60) % 60;

                return hours + "h " + minutes + "m";
            }
        }

    });

    Models.MemberList = Backbone.Collection.extend({
        model: Models.Member,
        url: App.config.apiHost + '/api/members',
        cache: true,

        filter: function(filters)
        {
            var members = _.filter(this.models, function(member) {
                return !_.include(filters.party, member.get('party')) || !_.include(filters.house, member.get('house'));
            });

            if (filters.noSpeakers) {
                members = _.filter(this.models, function(member) {
                    return !_.include(Models.Member.prototype.speakerParties, member.get('party'));
                });
            }

            return new this.constructor(members);
        },

        sortBy: function(attr, reverse)
        {
            var models = this.models.sort(function(member1, member2) {
                var val1 = member1.get(attr),
                    val2 = member2.get(attr);

                if (_.isString(val1)) {
                    return val1.localeCompare(val2);
                }

                if (val1 > val2) {
                    return 1;
                }

                if (val1 < val2) {
                    return -1;
                }

                return 0;
            });

            if (reverse) {
                models.reverse();
            }

            return new this.constructor(models);
        }

    });

    Members.memberList = new Models.MemberList();
});