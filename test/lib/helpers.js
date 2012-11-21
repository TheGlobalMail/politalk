chai.use(function(c, utils) {
  var flag = utils.flag;

  chai.Assertion.addMethod('attribute', function (attr, val, msg) {
    if (msg) flag(this, 'message', msg);

    var negate = flag(this, 'negate')
      , obj = flag(this, 'object')
      , value = obj.get(attr)
      , modelName = obj.constructor.name + '(' + JSON.stringify(obj.attributes) + ')';

    if (negate && undefined !== val) {
      if (!obj.has(attr)) {
        msg = (msg != null) ? msg + ': ' : '';
        throw new Error(msg + utils.inspect(obj) + ' has no attribute ' + utils.inspect(attr));
      }
    } else {
      this.assert(
          obj.has(attr)
        , 'expected ' + modelName + ' to have an attribute ' + utils.inspect(attr)
        , 'expected ' + modelName + ' to not have an attribute ' + utils.inspect(attr));
    }

    if (undefined !== val) {
      this.assert(
          val === value
        , 'expected ' + modelName + ' to have an attribute ' + utils.inspect(attr) + ' of #{exp}, but got #{act}'
        , 'expected ' + modelName + ' to not have an attribute ' + utils.inspect(attr) + ' of #{act}'
        , val
        , value
      );
    }

    flag(this, 'object', value);
  });
});