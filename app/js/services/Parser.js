'use strict';
app.factory('Parser', [function() {
  function Parser(domain, nullChar) { 
    this.domain = domain;
    this.nullChar = nullChar;
  }
  Parser.prototype = {
    constructor: Parser
    ,parse: function(str, grid) {
      grid.reset(true);
      str = this.strip(str);
      var i, c, val;
      for (i = 0; i < grid.length; i++) {
        c = str[i];
        val = this.domain.indexOf(c);
        if (!(val < 0)) {
          grid.set(i, val);
          grid.domains[i] = (1 << val);
        }
      }
      if (str.length !== grid.length) return false;
      console.log(str);
    }
    ,strip: function(str) {
      var chars = "", i, c;
      for (i = 0; i < str.length; i++) {
        c = str[i];
        if (this.domain.indexOf(c) >= 0 || this.nullChar.indexOf(c) >= 0) {
          chars += c;
        }
      }
      return chars;
    }
  }

  return Parser;
}]);
