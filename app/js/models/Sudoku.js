'use strict';
(function(global) {
function Sudoku(dim, rowDiv, colDiv) {
  colDiv = colDiv || rowDiv;
  if (dim !== rowDiv * colDiv) { throw new Error("Sudoku ErRoR bLeRgH"); }
  this.dim = dim;
  this.rowDiv = rowDiv;
  this.colDiv = colDiv;
  var length = this.length  = dim * dim;
  var indices = this.indices = _.range(length);
  var values = this.values = [];
  var domains = this.domains = [];
  var locked = this.locked = [];
  for (var i = 0; i < length; i++) {
    values.push(null);
    domains.push(Bitmask.create(dim));
    locked.push(false);
  }

  function i2row(i) { return Math.floor(i / dim); }
  function i2col(i) { return i % dim; }
  function i2box(i) {
    var row = Math.floor(i2row(i) / rowDiv);
    var col = Math.floor(i2col(i) / colDiv);
    return row * (dim - 1) + col;
  }
  var units = (function() {
    var
      rowUnits = _.values(_.groupBy(indices, i2row)),
      colUnits = _.values(_.groupBy(indices, i2col)),
      boxUnits = _.values(_.groupBy(indices, i2box));
    return rowUnits.concat(colUnits, boxUnits);
  })();
  var unitMap = _.object(indices, _.map(indices, function(i) {
    return _.filter(units, function(unit) { return _.contains(unit, i); });
  }));
  var peerMap = _.object(indices, _.map(indices, function(i) {
    return _.without(_.uniq(_.flatten(unitMap[i])), i);
  }));
  this.getUnits = function(c) { return unitMap[c]; }
  this.getPeers = function(c) { return peerMap[c]; }
}

//TODO: soft reset
Sudoku.prototype.reset = function() {
  for (var i = 0; i < this.length; i++) {
    this.values[i] = null;
    this.domains[i] = Bitmask.create(this.dim);
    this.locked[i] = false;
  }
};

Sudoku.prototype.setAt = function(c) { return this.values[c] !== null; };
Sudoku.prototype.validAt = function(c) {
  return !this.setAt(c) || Bitmask.test(this.domains[c], this.values[c]);
};
Sudoku.prototype.invalidAt = function(c) { return !this.validAt(c); };
Sudoku.prototype.brokenAt = function(c) { return !this.domains[c]; };
Sudoku.prototype.singleAt = function(c) {
  return Bitmask.isFlag(this.domains[c]);
};
Sudoku.prototype.lockedAt = function(c) { return this.locked[c]; };
Sudoku.prototype.isSolved = function() {
  for (var i = 0, l = this.length; i < l; i++) {
    if (!this.setAt(i) || !this.validAt(i)) return false; 
  }
  return true;
};
Sudoku.prototype.get = function(c) { return this.values[c]; };
Sudoku.prototype.set = function(c, val) {
  var prev = this.values[c];
  this.values[c] = val;
  if (!this.validAt(c)) return false;
  var peers = this.getPeers(c);
  for (var i = 0, l = peers.length; i < l; i++) {
    var p = peers[i];
    if (val !== null) this.domains[p] = Bitmask.clear(this.domains[p], val);
    if (prev !== null) this.check(p, prev);
    if (this.brokenAt(p)) return false;
  }
  return true;
};
Sudoku.prototype.assign = function(c, val) {
  this.values[c] = val;
  if (!this.validAt(c)) return false;
  var peers = this.getPeers(c);
  for (var i = 0, l = peers.length; i < l; i++) {
    if (!this.eliminate(peers[i], val)) return false;
  }
  return true;
};
Sudoku.prototype.eliminate = function(c, val) {
  this.domains[c] = Bitmask.clear(this.domains[c], val);
  var domain = this.domains[c];
  if (domain === 0) return false;
  if (Bitmask.isFlag(domain) && !this.setAt(c)) {
    if (!this.assign(c, Bitmask.toVal(domain))) return false;
  }
  return true;
};
Sudoku.prototype.getVariables = function() {
  return this.indices;
};
Sudoku.prototype.getDomain = function(c) {
  return Bitmask.toValues(this.domains[c]);
};
Sudoku.prototype.getDomainLength = function(c) {
  return Bitmask.count(this.domains[c]);
};
Sudoku.prototype.check = function(c, val) {
  var constrained = _.any(this.getPeers(c), function(p) {
    return val === this.values[p];
  }, this);
  if (constrained) this.domains[c] = Bitmask.clear(this.domains[c], val);
  else this.domains[c] = Bitmask.set(this.domains[c], val);
};
Sudoku.prototype.lock = function(c) {
  this.locked[c] = true;
};
Sudoku.prototype.unlock = function(c) { this.locked[c] = false; };
Sudoku.prototype.save = function() {
  this.stateStack = this.stateStack || [];
  this.stateStack.push([this.values.slice(), this.domains.slice()]);
};
Sudoku.prototype.restore = function() {
  var state = this.stateStack.pop();
  this.values = state[0];
  this.domains = state[1];
};
global.Sudoku = Sudoku;
})(this);
