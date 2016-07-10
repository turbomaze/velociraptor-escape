/* Creates grid
 * @author Claire
 * @version 0.1
 * @date 2016/07/10
 * @edit 2016/07/10
 */

var Grid = (function() {
  var exports = {};
  var mappings = {};
	// config, helper functions, etc here
	var m = prompt("number of rows (m) = ", 6);
	var n = prompt("number of cols (n) = ", 6);
	
	exports.EMPTY = 0;
	exports.FULL = 1;
  mappings[exports.FULL] = "fullClass";
  mappings[exports.EMPTY] = "emptyClass";

	function isValid(x,y){
		var ok = false;
		x = parseInt(x);
		y = parseInt(y);
		if(x<this.cols && x>= 0 && y<this.rows && y>= 0){
			ok = true;
		}
		return ok;
	}
  
  // meat and potatoes
  function GridObject(x, y) {
		this.cols = x;
		this.rows = y;

		var grid = new Array(cols);
		for (var i=0; i<cols; i++){
			grid[i] = new Array(rows);
			for(var j=0; j<rows; j++){
				grid[i][j] = exports.EMPTY;
			}
		}
  }

	GridObject.prototype.getState = function(x, y) {
		if(this.isValid(x,y)){
			return grid[x][y]; //0, 1, etc.
		}
		else{
			return "not ok state"
		}
	}

  GridObject.prototype.setState = function(x, y, state) {
		if(this.isValid(x,y) && this.getState(x,y) != state){
			//needs more validation that state is an acceptable state
			grid[x][y] = state;
      var cell = document.getElementById("elt-" +x+ "-" +y);
      cell.classList[1] = mapping[state];
		}
		else{
			return "not ok state"
		}
  };

	GridObject.prototype.render = function(){
    gridHtml = document.getElementById("grid");
		gridHtml.classList.add("width-" + n);
    gridHtml.classList.add("height-" + m);
		var div = "";
		for(var i=0; i<this.cols; i++){
			div += "<div class=\"row\">";
			for(var j=0; j<this.rows; j++){
        var classes = "\"elt " +mappings[grid[i][j]]+ "\"";
        var ids = "\"elt-" + (i*n + j) + " elt-" + i + "-" + j + "\";
        var p = "<p>blah" + (i*n + j) + "</p>";
        div += "<div class=" +classes+ " id=" +ids+ ">" +p+ "</div>";
			}
		div += "</div>";
		}
		gridHtml.innerHTML = div;

		elts = document.getElementsByClassName("elt");
		var width = 100/n + "%";
		for(var k=0; k< elts.length; k++){
			styles = elts[k].style;
			styles.width = width;
			styles.paddingBottom = width;
		}
	}

  GridObject.prototype.clear = function(x, y) {
    if(x === undefined || y===undefined){
      this.clearAll();
    }
    else{
      this.setState(x,y,exports.EMPTY);
    }
  }

  GridObject.prototype.clearAll = function(){
    for (var i=0; i<cols; i++){
			grid[i] = new Array(rows);
			for(var j=0; j<rows; j++){
			  grid[i][j] = exports.EMPTY;
			}
		}
  }

  return GridObject;
})();





