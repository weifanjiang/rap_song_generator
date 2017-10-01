// Reads data from a web service and display it
(function() {
	"use strict";
	

	// Setup the pages and attaches event handler
	window.onload = function() {
		document.getElementById("def").onclick = getDef;
	};

	// Uses ajax to fetch data from server with given url
	// Calls given return function once get the data
	function getDef() {
		var word = document.getElementById("def").innerHTML;
		var ajax = new XMLHttpRequest();
		ajax.onload = displayDef;
		ajax.open("GET", "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + word + "?key=e40c1d53-34b6-4036-a472-516c1b590568", true);
		ajax.send();
	}


	// process returned XML data to show city's data
	// has error handling such as 410 and 404
	function displayDef() {
		if (this.status == 410) {
			document.getElementById("nodata").style.display = "block";
		} else if (this.status == 200) {
			console.log(this.responseText);
			var parser = new DOMParser();

			var result = parser.parseFromString(this.responseText,"text/xml");
			//var words = result.querySelector("entry_list");
			var word = result.querySelectorAll("entry");
			var defs = word[0].querySelectorAll("dt");

			for (var i = 0; i < defs.length; i++) {
				var def = document.createElement("p");
				def.innerHTML = defs[i].textContent;
				document.getElementById("showDef").appendChild(def);
			}

		}
	}


})();