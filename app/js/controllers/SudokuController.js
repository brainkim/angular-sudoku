'use strict';
app.controller('SudokuController', [
  'Parser',
  '$scope',
  '$timeout',
  '$http',
function(Parser, $scope, $timeout, $http) {
  var domain = $scope.domain = ['1','2','3','4','5','6','7','8','9'];
  var dim = $scope.dim = 9;
  var rowDiv = $scope.rowDiv = 3;
  var colDiv = $scope.colDiv = 3;
  var indices = $scope.indices = _.range(dim * dim);
  $scope.rows = _.inGroupsOf(indices, dim);
  var grid = $scope.grid = new Sudoku(dim, rowDiv, colDiv);
  var solver = $scope.solver = new Solver();
  var parser = $scope.parser = new Parser(domain, "0.");
  var puzzles = [];
  $http.get('data/easy50.txt').success(function(data) {
  });
  $http.get('data/hard20.txt').success(function(data) {
  });
  $http.get('data/hard95.txt').success(function(data) {
    puzzles = puzzles.concat(data.split("\n").slice(1, -1));
  });
  $scope.next = function() { parser.parse(puzzles.unshift(), grid); }
  $scope.highlight = function(i) {
    $scope.selectedIndex = i;
    $scope.selectedRow = Math.floor(i / dim);
    $scope.selectedCol = i % dim;
  }
  $scope.unhighlight = function() {
    $scope.selectedIndex = null;
    $scope.selectedRow = null;
    $scope.selectedCol = null;
  }
  $scope.nextPuzzle = function() {
    parser.parse(puzzles.pop(), grid);
    solver.solve(grid);
  }
  $scope.getAverage = function() {
    var i = 0;
    var total = puzzles.length;
    var count = 0, time, timeEnd;
    var max = 0;
    (function solve() {
      parser.parse(puzzles[i % total], grid);
      time = new Date().getTime();
      solver.solve(grid);
      timeEnd = new Date().getTime() - time;
      if (timeEnd > max) {
        max = timeEnd;
      }
      count += timeEnd;
      i++
      if (i < total * 5) $timeout(solve);
      else $timeout(function() {
        console.log("average: ", (count/(total * 5)) + "ms");
        console.log("max: ", max + "ms");
      });
    })();
  }
}
]);
