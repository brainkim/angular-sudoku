'use strict';
xdescribe('Grid', function() {
  var Grid, grid;
  beforeEach(module('sudoku'));
  beforeEach(inject(function(_Grid_) {
    Grid = _Grid_;
    grid = new Grid(4, 2);
  }));
  it("should be injected and instantiated", function() {
    expect(Grid).toBeDefined();
    expect(grid).toBeDefined();
    expect(grid.constructor).toBe(Grid);
  });
  it("should get unit from index", function() {
    expect(grid.getUnits(0)).toEqual([
      [0,1,2,3],
      [0,4,8,12],
      [0,1,4,5]
    ]);
  });
  it("should get peer from index", function() {
    expect(grid.getPeers(0)).toEqual([1, 2, 3, 4, 8, 12, 5]);
  });
  it("should be solved", function() {
    grid.set(0,0); grid.set(1,1); grid.set(2,2); grid.set(3,3);
    grid.set(4,2); grid.set(5,3); grid.set(6,0); grid.set(7,1);
    grid.set(8,1); grid.set(9,2); grid.set(10,3); grid.set(11,0);
    grid.set(12,3); grid.set(13,0); grid.set(14,1); grid.set(15,2);
    expect(grid.isSolved()).toBe(true);
  });
  it("should lock peers", function() {
    grid.set(0,2);
    var indices = [1, 2, 3, 4, 8, 12, 5];
    for (var i = 0; i < indices.length; i++) {
      var index = indices[i];
      expect(grid.get(index).domain).toBe(11);
    }
  });
  it("should expand domains", function() {
    grid.set(0,3);
    expect(grid.expandDomain(1)).toEqual([0,1,2]);
  });
});//Grid
