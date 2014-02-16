'use strict';
(function(global) {
function Solver() {
}

Solver.prototype = {
  constructor: Solver
  ,solve: function(model) {
    console.time("solve");
    var time = new Date().getTime();
    var getVariable = this.getVariable;
    var variables = model.getVariables();
    (function solve() {
      if (model.isSolved()) {
        return true;
      }
      var v = getVariable(model, variables);
      var domain = model.getDomain(v);
      for (var i = 0, l = domain.length; i < l; i++) {
        model.save();
        if (model.assign(v, domain[i]) && solve()) return true;
        else model.restore();
      }
      return false;
    })();
    console.timeEnd("solve");
    return new Date().getTime() - time;
  }
  ,getVariable: function(model, variables) {
    var v, vLength, min = Infinity, minArg = [], smaller;
    for (var i = 0, l = variables.length; i < l; i++) {
      v = variables[i];
      if (!model.setAt(v)) {
        vLength = model.getDomainLength(v);
        if (vLength < min) {
          min = vLength;
          minArg.length = 0;
          minArg.push(v);
        } else if (vLength === min) {
          minArg.push(v);
        }
      }
    }
    return _.shuffle(minArg)[0];
  }
};

global.Solver = Solver;
})(this);
