(function() {
    'use strict';

    describe('Helpers', function() {
        describe('ModuleController', function() {
            describe('#constructor', function() {
                var collection, fetch, app, Controller;

                beforeEach(function() {
                    collection = new Backbone.Collection();
                    fetch = sinon.stub(collection, "fetch");
                    app = new Marionette.Application();

                    app.addRegions({
                        main: {
                            selector: '#main',
                            regionType: Politalk.SwappableRegion
                        },
                        navbar: '.navbar',
                        footer: '.footer'
                    });

                    Controller = Politalk.ModuleController.extend({
                        app: app,
                        layoutView: Politalk.ModuleLayout,
                        sidebarView: Marionette.ItemView,
                        moduleName: 'test'
                    });
                });

                it('should fetch the collection', function() {
                    var controller = new Controller({ collection: collection });
                    expect(fetch).to.have.been.calledOnce;
                });

                it('should add the modules main layout to the region', function() {
                    var addView = sinon.stub(app.main, 'addView');
                    var controller = new Controller({ collection: collection });
                    expect(addView).to.have.been.calledWith('test', controller.layout);
                    addView.restore();
                });

                it('should invoke initialize() if it exists', function() {
                    var spy = Controller.prototype.initialize = sinon.spy();
                    new Controller({ collection: collection });
                    expect(spy).to.have.been.calledOnce
                               .and.to.have.been.calledWith({ collection: collection });
                    delete Controller.prototype.initialize;
                });
            });

            describe('delegateAppVents', function() {
                beforeEach(function() {});

                it.skip('should do nothing if no appVents are set', function() {
                    var mock = sinon.mock(new Controller);
                    //var delegate = mock.
                    expect(delegate).to.be.false;
                    expect(bindStub).not.to.have.been.called;
                });
            });
        });
    });
}());