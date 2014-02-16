(function(_) {
  _.mixin({
    //Same as map except the result is flattened at the end. Defaults to shallow
    //flatten by default but can be changed by setting shallow to false. Useful
    //for nesting maps.
    flatMap: function(obj, iterator, context, shallow) {
      if (typeof shallow === "undefined") shallow = true;
      return _.chain(obj).map(iterator, context).flatten(shallow).value();
    }

    //Returns the cross-product of the values of the first and second arguments.
    //If a function is provided, product passes the result of the product to the
    //function instead.
    //TODO: Product of more than two collections?
    ,product: function(obj1, obj2, func) {
      if (typeof func === "undefined") func = function(x, y) { return x+y };
      return _.flatMap(obj1, function(x) {
        return _.map(obj2, function(y) {
          return func(x, y);
        });
      });
    }

    //Returns an array in groups of n. It doesn't matter if the length of the
    //is not evenly divisible by n.
    ,inGroupsOf: function(array, n) {
      var results = [], i, j;
      for (i = 0; i < array.length; i += n) {
        j = i + n;
        results.push(Array.prototype.slice.call(array, i, j));
      }
      return results;
    }

    //Allows _.object to accept a function and function context as its second
    //and third argument. Default behavior is preserved. It hurts my head to
    //step through wrapped functions.
    ,object: _.wrap(_.object, function(func, obj, iterator, context) {
      if (_.isFunction(iterator)) {
        return func(obj, _.map(obj, iterator, context));
      } else {
        return func.apply(null, Array.prototype.slice.call(arguments, 1));
      }
    })

    //Filters a nested array or object based on whether a target is contained
    //within its values.
    ,filterContains: function(obj, target) {
      return _.filter(obj, function(value) {return _.contains(value, target);});
    }
  }); 
})(_);
