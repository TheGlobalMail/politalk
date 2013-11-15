(function() {
    'use strict';

    Handlebars.registerHelper('each', function(context, options) {
        var fn = options.fn, inverse = options.inverse;
        var ret = "", data;

        if (options.data) {
            data = Handlebars.createFrame(options.data);
        }

        if (_.isArray(context)) {
            _.forEach(context, function(value, key) {
                if (data) { data.index = key; }
                ret = ret + fn(value, { data: data });
            });
        } else if(context) {
            _.forEach(context, function(value, key) {
                if (data) { data.index = key; }
                ret = ret + fn({ value: value, index: key }, { data: data });
            });
        } else {
            ret = inverse(this);
        }

        return ret;
    });

    _.extend(Marionette.TemplateCache.prototype, {

      loadTemplate: function(templateId)
      {
          var template = PolitalkApp.Templates[templateId];

          if (!template || template.length === 0){
              var msg = "Could not find template: '" + templateId + "'";
              var err = new Error(msg);
              err.name = "NoTemplateError";
              throw err;
          }

          return template;
      },

      compileTemplate: function(rawTemplate)
      {
          return rawTemplate;
      }
    });

    var Politalk = {};

    Politalk.TableCollection = Backbone.Collection.extend({

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
        },

        fetch: function()
        {
            this.trigger('fetching');
            return Backbone.Collection.prototype.fetch.apply(this, arguments);
        }

    });

    Politalk.ModuleController = Marionette.Controller.extend({

        constructor: function(options)
        {
            this.options = options || {};
            this.sortReverse = false;
            this.filters = {};

            options.collection.fetch();
            this.collection = this.options.collection;

            Marionette.addEventBinder(this);

            this.layout = new this.layoutView();
            this.sidebar = new this.sidebarView();

            this.app.main.addView(this.moduleName, this.layout);

            if (_.isFunction(this.initialize)) {
                this.initialize(options);
            }

            this.delegateAppVents();
        },

        showLayout: function()
        {
            this.app.main.show(this.moduleName);

            if (!this.sidebar.isRendered) {
                this.layout.sidebar.show(this.sidebar);
                this.sidebar.isRendered = true;

                if (_.isFunction(this.onShow)) {
                    this.onShow();
                }
            }

            this.app.vent.trigger('nav:activateItem', this.navTitle);

            this.sortColumn = this.sortColumn || this.options.defaultSortColumn;
            this.sortReverse = this.sortColumn === 'last_name';
            this.sort(this.sortColumn);
            $(window).scrollTop(0);
        },

        showTable: function(collection)
        {
            this.collection = collection;
            this.layout.table.show(new this.tableView({ collection: collection }));
            this.app.vent.trigger(this.moduleName + ':sorted', this.sortColumn, this.sortReverse);
        },

        sort: function(column)
        {
            if (!this.collection.length) {
                return this.collection.on('reset', _.bind(this.sort, this, column));
            }

            if (this.sortColumn === column) {
                this.sortReverse = !this.sortReverse;
            } else {
                this.sortReverse = !!this.defaultSortOrder;
            }

            this.sortColumn = column;
            // sort filtered collection
            this.showTable(this.collection.sortBy(this.sortColumn, this.sortReverse));
        },

        delegateAppVents: function()
        {
            if (!this.appVents) {
                return false;
            }

            _.each(this.appVents, function(method, event) {
                if (!_.isFunction(method)) {
                    if (!_.isFunction(this[method])) {
                        throw new Error('Unknown method name' + method);
                    }

                    method = this[method];
                }

                this.bindTo(this.app.vent, this.moduleName + ':' + event, method, this);
            }, this);
        }

    });

    Politalk.TableView = Marionette.CompositeView.extend({

        itemViewContainer: 'tbody',

        events: {
            'click th[data-sortable]': 'sort'
        },

        initialize: function()
        {
            this.bindTo(this.app.vent, this.moduleName + ':sorted', this.onSorted, this);
            this.on('render', this.finishedLoading, this);
        },

        finishedLoading: function()
        {
            this.$('.loading').remove();
        },

        sort: function(e)
        {
            var column = $(e.currentTarget).data('sortable');
            this.app.vent.trigger(this.moduleName + ':sort', column);
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

    Politalk.SwappableRegion = Marionette.Region.extend({

        constructor: function(options) {
            Marionette.Region.prototype.constructor.apply(this, arguments);
            this.views = options.views || {};
        },

        addView: function(name, view)
        {
            this.views[name] = view;
        },

        show: function(name)
        {
            if (!_.has(this.views, name)) {
                throw new Error('No view called ' + name + ' is registered');
            }

            var view = this.views[name];

            if (this.currentView === view) {
                return;
            }

            this.ensureEl();

            if (!view.isRendered) {
                view.render();
                view.isRendered = true;
            }

            if (!this.currentView) {
                this.open(view);
            } else {
                this.hide(function() {
                    this.open(view);
                });
            }

            this.currentView = view;
            this.currentViewName = name;
        },

        hide: function(next, thisArg)
        {
            var view = this.currentView;
            thisArg = thisArg || this;
            if (!view || view.isHidden()) {
                return;
            }

            var end = function() {
                view.$el.addClass('hide');
                next.call(thisArg);
            };

            view.$el.one($.support.transition.end, end);

            view.$el.removeClass('in');
            view.undelegateEvents();
        },

        open: function(view)
        {
            Marionette.triggerMethod.call(view, "beforeOpen");

            this.$el.prepend(view.$el);
            view.$el.removeClass('hide').addClass('fade in');
            view.delegateEvents();

            Marionette.triggerMethod.call(view, "show");
            Marionette.triggerMethod.call(this, "show", view);
        }

    });

    Politalk.ModuleLayout = Marionette.Layout.extend({

        isHidden: function()
        {
            return this.$el.is(':hidden');
        }

    });

    Handlebars.registerHelper('urlencode', function(string) {
        return encodeURIComponent(string);
    });

    window.Politalk = Politalk;

    // prepare image fallback
    $.fn.imgFallback = function() {
        var error = function() {
            this.src = this.getAttribute('data-fallback-src');
        };

        return this.each(function() {
            $(this).one('error', error);
        });
    };

    $(function() { $('img[data-fallback-src]').imgFallback(); });

}());
