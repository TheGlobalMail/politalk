(function() {

    var m = function(data) {
        return new Backbone.Model(data);
    };

    describe('Helpers', function() {
        describe('TableCollection', function() {
            var models = [
                m({ party: 'a', house: 'b' }),
                m({ party: 'b', house: 's' }),
                m({ party: 'c', house: 'q' }),
                m({ party: 'd', house: 'f' })
            ];

            var collection = new Politalk.TableCollection(models);

            describe('#sortBy', function() {
                it('should sort by attribute', function() {
                    var sc = collection.sortBy('house');

                    expect(sc).to.be.an.instanceof(Politalk.TableCollection);
                    expect(sc).to.have.length(4);
                    expect(sc.at(0)).to.have.attribute('party', 'a');
                    expect(sc.at(3)).to.have.attribute('party', 'b');
                });

                it('should sort by attribute in reverse order', function() {
                    var sc = collection.sortBy('house', true);

                    expect(sc).to.be.an.instanceof(Politalk.TableCollection);
                    expect(sc).to.have.length(4);
                    expect(sc.at(0)).to.have.attribute('party', 'b');
                    expect(sc.at(3)).to.have.attribute('party', 'a');
                });
            });

            describe('#fetch', function() {
                it('should emit a fetching event immediately', function() {
                    var fetch = sinon.stub(Backbone.Collection.prototype, "fetch");
                    var spy = sinon.spy();

                    collection.on('fetching', spy);
                    collection.fetch();

                    expect(spy).to.have.been.calledOnce;
                    expect(fetch).to.have.been.calledOnce;
                    expect(spy).to.have.been.calledBefore(fetch);

                    fetch.restore();
                });
            });
        });
    });

}());