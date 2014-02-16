(function(global) {
function extend(dest, source) {
  for (var prop in source) { dest[prop] = source[prop]; }
  return dest;
}
function indexOf(ref, elem) {
  for (var i = 0, l = ref.length; i < l; i++) {
    if (ref[i] === elem) return i;
  }
  return -1;
}
function isArray(obj) {
  return Object.prototype.toString.call(obj) == "[object Array]";
}

var
  MAX_BITMASK = -1 >>> 0, //2^32 - 1
  MAX_SHIFT = 31,
  MAX_LENGTH = MAX_SHIFT + 1;

function BM(ref) {
  if (ref.length > MAX_LENGTH) throw new RangeError();
  else if (!(this instanceof BM)) return new BM(ref);
  else this._ref = ref.slice();
}

BM.MAX_SHIFT = MAX_SHIFT;
BM.MAX_BITMASK = MAX_BITMASK;
BM.MAX_LENGTH = MAX_LENGTH;
BM.toFlag = function(i) {
  if (i < 0 || i > MAX_SHIFT) throw new RangeError();
  return 1 << i;
};
function fromArray(array) {
  var bitmask = 0, pos;
  for (var i = 0, l = array.length; i < l; i++) {
    pos = array[i];
    if (pos >= 0 && pos <= MAX_SHIFT) {
      bitmask = BM.set(bitmask, pos);
    }
  }
  return bitmask;
}
BM.create = function(length) {
  if (isArray(length)) return fromArray(length);
  else if (length < 0 || length > MAX_LENGTH) throw new RangeError();
  else return MAX_BITMASK >>> (MAX_LENGTH - length);
};
BM.truncate = function(mask, length) { return mask & BM.create(length); };
BM.set = function(mask, i) { return mask | BM.toFlag(i); };
BM.clear = function(mask, i) { return mask & ~BM.toFlag(i); };
BM.toggle = function(mask, i) { return mask ^ BM.toFlag(i); };
BM.test = function(mask, i) { return !!(mask & BM.toFlag(i)); };
BM.testAll = function(mask, length) {
  if (length) return mask === BM.create(length);
  else return mask > 0 && !(mask & mask + 1);
};
BM.isFlag = function(mask) {
  mask >>>= 0;
  return mask > 0 && !(mask & mask - 1);
};
BM.count = function(mask) {
  for (var c = 0; mask > 0; mask >>>= 1) { if (mask % 2 === 1) c++; }
  return c;
};
BM.union = function(mask, other) { return mask | other; };
BM.intersection = function(mask, other) { return mask & other; };
BM.difference = function(mask, other) { return mask & ~other; };
BM.toVal = function(mask) {
  mask >>>= 0;
  if (!BM.isFlag(mask)) throw new RangeError();
  var s = 0;
  if (mask > 0xffff) { mask >>>= 16; s += 16; }
  if (mask > 0x00ff) { mask >>= 8; s += 8; }
  if (mask > 0x000f) { mask >>= 4; s += 4; }
  if (mask > 0x0003) { mask >>= 2; s += 2; }
  return s + (mask >> 1);
};
BM.toValues = function(mask) {
  var values = [];
  for (var i = 0; mask > 0; mask >>>= 1, i++) {
    if (mask % 2 == 1) values.push(i);
  }
  return values;
};
extend(BM.prototype, {
  toFlag: function(str) {
    var index = indexOf(this._ref, str);
    return index > -1 ? BM.toFlag(index) : 0;
  },
  create: function() {
    return BM.create(this._ref.length);
  },
  set: function(mask, str) {
    return BM.set(mask, indexOf(this._ref, str));
  },
  clear: function(mask, str) {
    return BM.clear(mask, indexOf(this._ref, str));
  },
  toggle: function(mask, str) {
    return BM.toggle(mask, indexOf(this._ref, str));
  },
  test: function(mask, str) {
    return BM.test(mask, indexOf(this._ref, str));
  },
  testAll: function(mask) {
    return BM.testAll(mask, this._ref.length);
  },
  union: function(mask, other) {
    if (isArray(other)) other = this.fromArray(this._ref, other);
    return BM.union(mask, other);
  },
  intersection: function(mask, other) {
    if (isArray(other)) other = this.fromArray(this._ref, other);
    return BM.intersection(mask, other);
  },
  difference: function(mask, other) {
    if (isArray(other)) other = this.fromArray(this._ref, other);
    return BM.difference(mask, other);
  },
  isFlag: BM.isFlag,
  count: BM.count,
  toVal: function(mask) {
    return this._ref[BM.toVal(mask)];
  },
  toValues: function(mask) {
    var array = [];
    var indices = BM.toValues(mask);
    for (var i = 0, l = indices.length; i < l; i++) {
      array.push(this._ref[indices[i]]);
    }
    return array;
  }
});

global.Bitmask = (global.module || {}).exports = BM;
})(this);
