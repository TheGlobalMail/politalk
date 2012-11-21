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
            });
        });
    });

}());