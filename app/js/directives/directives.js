'use strict';
app.directive('ngFocus', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngFocus']);
    element.bind('focus', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  }
}])
.directive('ngBlur', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngBlur']);
    element.bind('blur', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  }
}])
.directive('cell', [function() { return {
  link: function(scope, elem, attrs) {
    var cellIndex = scope.cellIndex;
    var grid = scope.grid;
    elem.bind('click', function(e) {
      scope.$apply(function() {
        var val = grid.values[cellIndex];
        if (val === scope.dim - 1) grid.set(cellIndex, null);
        else if (val === null) grid.set(cellIndex, 0);
        else grid.set(cellIndex, val + 1);
      });
    });
  }
}; }]);
