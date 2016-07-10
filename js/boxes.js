//create grid

var m = prompt("number of rows (m) = ", 6);
var n = prompt("number of cols (n) = ", 6);
var div = "";
if(!isNaN(parseInt(m)) && !isNaN(parseInt(n))){
	for(var i=0; i<m; i++){
		div += "<div class=\"row row-" + i + "\">"
		for(var j=0; j<n; j++){
			div += "<div class=\"elt col col-" + j + " div-" + (i*n + j) + "\"><p>blah" + (i*n + j) + "</p></div>";
		}
		div += "</div>";
	}
}

document.getElementById("grid").innerHTML = div;

elts = document.getElementsByClassName("elt");
//if(screen.width > screen.height){
//	var height = 100/m + "%";
//	for(var k=0; k<elts.length; k++){
//		elts[k].style.height = height;
//		elts[k].style.paddingRight = height;
//	}
//}
//else{
	var width = 100/n + "%";
	for(var k=0; k< elts.length; k++){
		elts[k].style.width = width;
		elts[k].style.paddingBottom = width;
	}
//}



