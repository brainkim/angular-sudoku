'use strict';
app.filter('value', function() { return function(input, domain) {
  if (angular.isNumber(input)) return domain[input];
  else return "";
}; })
app.filter('values', function() { return function(domain) {
  var str = "", val;
  for (var i = 0; i < domain.length; i++) {
    val = domain[i];
    str += val;
  }
  return str;
}; });
