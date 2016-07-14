/* Creates grid
 * @author Claire
 * @version 0.3
 * @date 2016/07/10
 * @edit 2016/07/13
 */

var Grid = (function() {
  'use strict';

  var exports = {};
  var mappings = {};

  // config, helper functions, etc here

  // states enum
  exports.EMPTY = 0;
  exports.FULL = 1;
  exports.AGENT = 2;

  // mapping from states to CSS classes
  mappings[exports.FULL] = "fullClass";
  mappings[exports.EMPTY] = "emptyClass";
  mappings[exports.AGENT] = "agentClass";

  function isValid(x, y, m, n){
    var ok = false;
    x = parseInt(x);
    y = parseInt(y);
    m = parseInt(m);
    n = parseInt(n);

    if(x < m && x >= 0 && y < n && y >= 0){
      ok = true;
    }
    return ok;
  }

  // meat and potatoes
  function GridObject(n, m, start) {
    this.cols = m;
    this.rows = n;

    // set agent location
    this.agentloc = [0, 0];
    if (
      start.length == 2 &&
      !isNaN(parseInt(start[0])) && !isNaN(parseInt(start[1])) &&
      isValid(start[0], start[1], this.cols, this.rows)
    ) {
      this.agentloc = start;
    } else {
      throw '3rd argument is agent\'s location in 2D [x, y]';
    }

    this.grid = new Array(this.cols);
    for (var i = 0; i < this.cols; i++){
      this.grid[i] = new Array(this.rows);
      for(var j = 0; j < this.rows; j++){
        this.grid[i][j] = exports.EMPTY;
      }
    }
    this.grid[this.agentloc[0]][this.agentloc[1]] = exports.AGENT;
  }

  GridObject.prototype.getState = function(x, y) {
    if(isValid(x, y, this.cols, this.rows)){
      return this.grid[x][y]; //0, 1, etc.
    }
    else{
      return {err: "not ok state"};
    }
  }

  GridObject.prototype.setState = function(x, y, state) {
    if (isValid(x, y, this.cols, this.rows) && this.getState(x, y) != state) {
      //needs more validation that state is an acceptable state
      var cell = document.getElementById("elt-" + x + "-" + y);
      cell.classList.remove(mappings[this.getState(x, y)]);
      this.grid[x][y] = state;
      cell.classList.add(mappings[state]);
      if (state == exports.AGENT) {
        this.agentloc = [x, y];
      }
    } else {
      return {err: "not ok state"};
    }
  };

  GridObject.prototype.render = function() {
    var content = document.getElementById("grid");
    content.innerHTML = ''; // empty
    content.classList.add("width-" + this.cols);
    content.classList.add("height-" + this.rows);
    for(var i = 0; i < this.cols; i++){
      var rowDiv = document.createElement('div');
      rowDiv.className = 'row';
      content.appendChild(rowDiv);
      for(var j = 0; j < this.rows; j++){
        var eltDiv = document.createElement('div');
        eltDiv.className = 'elt ' + mappings[this.grid[i][j]];
        eltDiv.id = 'elt-' + i + "-" + j;
        var p = document.createElement('p');
        p.innerHTML = i*this.rows + j;
        eltDiv.appendChild(p);
        rowDiv.appendChild(eltDiv);
      }
    }
    
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
    }
      else{
      this.setState(x, y, exports.EMPTY);
    }
  }

  GridObject.prototype.clearAll = function(){
    for (var i = 0; i < this.cols; i++){
      this.grid[i] = new Array(this.rows);
      for(var j = 0; j < this.rows; j++){
        this.grid[i][j] = exports.EMPTY;
      }
    }
  }

  GridObject.prototype.getAgentLoc = function() {
    return this.agentloc;
  };

  GridObject.prototype.fromFrame = function(frame) {
    for(var i = 0; i < this.cols; i++) {
      for(var j = 0; j < this.rows; j++) {
        if(this.getState(i,j) != exports.AGENT) this.setState(i,j, frame[i][j]);
      }
    }
  };

  exports.Grid = GridObject;

  return exports;
})();
