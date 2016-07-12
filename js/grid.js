/* Creates grid
 * @author Claire
 * @version 0.1
 * @date 2016/07/10
 * @edit 2016/07/12
 */

var Grid = (function() {
  'use strict';

  var exports = {};
  var mappings = {};

  // config, helper functions, etc here

  // states enum
  exports.EMPTY = 0;
  exports.FULL = 1;

  // mapping from states to CSS classes
  mappings[exports.FULL] = "fullClass";
  mappings[exports.EMPTY] = "emptyClass";

  function isValid(x, y){
    var ok = false;
    x = parseInt(x);
    y = parseInt(y);
    if (x < this.cols && x >= 0 && y < this.rows && y >= 0){
      ok = true;
    }
    return ok;
  }
  
  // meat and potatoes
  function GridObject(m, n) {
    this.cols = m;
    this.rows = n;

    this.grid = new Array(this.cols);
    for (var i = 0; i < this.cols; i++){
      this.grid[i] = new Array(this.rows);
      for(var j = 0; j < this.rows; j++){
        this.grid[i][j] = exports.EMPTY;
      }
    }
  }

  GridObject.prototype.getState = function(x, y) {
    if (this.isValid(x, y)){
      return this.grid[x][y]; //0, 1, etc.
    }
    else{
      return "not ok state";
    }
  }

  GridObject.prototype.setState = function(x, y, state) {
    if (this.isValid(x, y) && this.getState(x, y) != state){
      //needs more validation that state is an acceptable state
      this.grid[x][y] = state;
      var cell = document.getElementById("elt-" + x + "-" + y);
      cell.classList[1] = mapping[state];
    } else {
      return "not ok state";
    }
  };

  GridObject.prototype.render = function() {
    var gridHtml = document.getElementById("grid");
    gridHtml.classList.add("width-" + this.cols);
    gridHtml.classList.add("height-" + this.rows);
    var div = "";
    for(var i = 0; i < this.cols; i++){
      div += "<div class=\"row\">";
      for(var j = 0; j < this.rows; j++){
        var classes = "\"elt " +mappings[this.grid[i][j]]+ "\"";
        var ids = "\"elt-" + (i* + j) + " elt-" + i + "-" + j + "\"";
        var p = "<p>blah" + (i*this.rows + j) + "</p>";
        div += "<div class=" +classes+ " id=" +ids+ ">" +p+ "</div>";
      }
    div += "</div>";
    }
    gridHtml.innerHTML = div;

    var elts = document.getElementsByClassName("elt");
    var width = 100/this.rows + "%";
    for(var k = 0; k < elts.length; k++){
      var styles = elts[k].style;
      styles.width = width;
      styles.paddingBottom = width;
    }
  }

  GridObject.prototype.clear = function(x, y) {
    if (x === undefined || y === undefined) {
      this.clearAll();
    } else {
      this.setState(x, y, exports.EMPTY);
    }
  }

  GridObject.prototype.clearAll = function(){
    for (var i = 0; i < cols; i++){
      this.grid[i] = new Array(rows);
      for(var j = 0; j < rows; j++){
        this.grid[i][j] = exports.EMPTY;
      }
    }
  }

  return GridObject;
})();

