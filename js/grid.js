/* Creates grid
 * @author Claire
 * @version 0.1
 * @date 2016/07/10
 * @edit 2016/07/10
 */

var Grid = (function() {
  var exports = {};
	// config, helper functions, etc here
	var m = prompt("number of rows (m) = ", 6);
	var n = prompt("number of cols (n) = ", 6);

	
	exports.EMPTY = 0;
	exports.FULL = 1;

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
			//for(var j=0; j<rows; j++){
				//can do stuff here to set each element
			//}
		}
  }

	GridObject.prototype.getState = function(x, y) {
		if(isValid(x,y)){
			return grid[x][y];
		}
		else{
			return "not ok state"
		}
	}

  GridObject.prototype.setState = function(x, y, state) {
		if(isValid(x,y) && getState(x,y) != state){
			//needs more validation that state is an acceptable state
			grid[x][y] = state;
		}
		else{
			return "not ok state"
		}
  };

	GridObject.prototype.render = function(){
		var div = "";
		for(var i=0; i<this.cols; i++){
			div += "<div class=\"row row-" + i + "\">"
			for(var j=0; j<this.rows; j++){
				div += "<div class=\"elt col col-" + j + " div-" + (i*n + j) + "\"><p>blah" + (i*n + j) + "</p></div>";
			}
		div += "</div>";
		}
		grid = document.getElementById("grid");
		grid.classList += "width-" + n + " height-" + m;
		grid.innerHTML = div;
		elts = document.getElementsByClassName("elt");
		var width = 100/n + "%";
		for(var k=0; k< elts.length; k++){
			styles = elts[k].style;
			styles.width = width;
			styles.paddingBottom = width;
		}
	}

  return GridObject;
})();





