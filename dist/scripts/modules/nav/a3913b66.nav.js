PolitalkApp.module('Nav', function(Nav, App, Backbone, Marionette, $, _) {

    var render = Marionette.Renderer.render;

    Nav.Navbar = Marionette.Layout.extend({

        template: 'nav/templates/navbar',

        initialize: function()
        {
            this.items = {};
            this._items = [];
            _.bindAll(this, 'onRender');

            App.vent.on('nav:addItem', this.addItem, this);
            App.vent.on('nav:activateItem', this.activateItem, this);
        },

        addItem: function(name, href, props)
        {
            var $item = $(render('nav/templates/nav-item', { name: name, href: href }));
            this.items[name] = $item;
            this._items.push($item);
        },

        activateItem: function(name)
        {
            this.$('li.active').removeClass('active');
            this.items[name].addClass('active');
        },

        onRender: function()
        {
            _.invoke(this._items, 'appendTo', this.$('ul.nav'));
        }

    });

    Nav.navbar = new Nav.Navbar();
});