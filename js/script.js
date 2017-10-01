var rhymeWords = [];
var selectIndex = [];
var count = 0;
var beatSrc = "beats/0.mp3";
window.onload = function() {
    document.getElementById("generate").onclick = startGenerating;
    document.getElementById("saveInput").onclick = produceCheckbox;
    document.getElementById("save").onclick = saveRhyme;
    document.getElementById("saveSong").onclick = saveSong;
    document.getElementById("dropTheBeat").onclick = playRandomTrack;
    document.getElementById("ins").style.display = "none";
    document.getElementById("generate").style.display = "none";
    document.getElementById("save").style.display = "none";
    document.getElementById("more").style.display = "none";
    document.getElementById("result").style.display = "none";
    document.getElementById("saving").style.display = "none";
};


function startGenerating() {
    rhymeWords = [];
    document.getElementById("main").innerHTML = "";
    document.getElementById("ins").style.display = "none";
    document.getElementById("showDef").innerHTML = "";

    var allWords = document.getElementsByClassName("cb");
    var selectWords = [];
    selectIndex = [];
    for (var i = 0; i < allWords.length; i ++) {
        if (allWords[i].checked) {
            selectWords.push(allWords[i].value);
            selectIndex.push(i);
        }
    }

    for (var i = 0; i < selectWords.length; i ++) {
        fetchData(selectWords[i]);
    }

    console.log(rhymeWords);
    if (selectIndex.length != 0) {
        if (selectIndex[0] != 0) {
            var textfield = document.createElement("input");
            textfield.type = "text";
            textfield.classList.add("tb");
            document.getElementById("main").innerHTML += " ";
            document.getElementById("main").appendChild(textfield);
            document.getElementById("main").innerHTML += " ";
        }
        
        //document.getElementById("main").innerHTML += " " + rhymeWords[0];
        setRhymeWords(rhymeWords[0]);
        for (var i = 1; i < selectIndex.length; i ++) {
            if (selectIndex[i] != selectIndex[i - 1] + 1) {
                var textfield = document.createElement("input");
                textfield.type = "text";
                textfield.classList.add("tb");
                document.getElementById("main").innerHTML += " ";
                document.getElementById("main").appendChild(textfield);
                document.getElementById("main").innerHTML += " ";
            }
            //document.getElementById("main").innerHTML += " " + rhymeWords[i];
            setRhymeWords(rhymeWords[i]);
        }
        if (selectIndex[selectIndex.length - 1] != allWords.length - 1) {
            var textfield = document.createElement("input");
            textfield.type = "text";
            textfield.classList.add("tb");
            document.getElementById("main").innerHTML += " ";
            document.getElementById("main").appendChild(textfield);
        }

        if (allWords.length != selectIndex.length) {
            document.getElementById("ins").innerHTML = "Please fill in the rest of this sentence.<br />(Click on each generated rhyme work to see definition)";
            document.getElementById("ins").style.display = "block";
        }
    } else {
        document.getElementById("ins").innerHTML = "Please select words you want to rhyme with!";
        document.getElementById("ins").style.display = "block";
    }
    
    document.getElementById("save").style.display = "block";

}

function setRhymeWords(word) {
    var p = document.createElement("p");
    p.innerHTML = word;
    p.onclick = getDef;
    p.style.display = "inline";
    document.getElementById("main").appendChild(p);
}
function produceCheckbox() {
    document.getElementById("result").style.display = "block";
    document.getElementById("saving").style.display = "block";
    document.getElementById("words").innerHTML = "";
    document.getElementById("main").innerHTML = "";
    document.getElementById("ins").style.display = "none";
    var msg = document.createElement('p');
    msg.innerHTML = "Please select the words you want to rhyme with!";
    document.getElementById("words").appendChild(msg);
    var str = document.getElementById("userInput").value.trim().toLowerCase();
    var tokens = str.split(" ");
    for (var i = 0; i < tokens.length; i ++) {
        var checkbox = document.createElement("input");
        checkbox.classList.add("cb");
        var desc = document.createElement("p");
        checkbox.type = "checkbox";
        desc.innerHTML = tokens[i];
        checkbox.value = tokens[i];
        desc.style.display = "inline";
        document.getElementById("words").appendChild(checkbox);
        document.getElementById("words").appendChild(desc);
    }

    document.getElementById("generate").style.display = "block";
    addStrToResult(str);
}

function getDef() {
    document.getElementById("showDef").innerHTML = "";
	var ajax = new XMLHttpRequest();
	ajax.onload = displayDef;
	ajax.open("GET", "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + this.innerHTML + "?key=e40c1d53-34b6-4036-a472-516c1b590568", true);
	ajax.send();
}

function displayDef() {
    if (this.status == 200) {
        var parser = new DOMParser();
        var result = parser.parseFromString(this.responseText,"text/xml");
        var word = result.querySelectorAll("entry");
        var defs = word[0].querySelectorAll("dt");
        for (var i = 0; i < defs.length; i++) {
            var def = document.createElement("p");
            def.innerHTML = defs[i].textContent;
            document.getElementById("showDef").appendChild(def);
        }

    } else {
        document.getElementById("showDef").innerHTML = "no definitions!";
    }
}
    
function fetchData(word) {
    var ajax = new XMLHttpRequest();
    ajax.onload = getRhyme;
    ajax.open("GET", "http://rhymebrain.com/talk?function=getRhymes&word=" + word, false);
    ajax.send();
}

function getRhyme() {
    var results = JSON.parse(this.responseText);
    var words = [];
    var hi = results[0]["score"];
    for (var i = 0; i < results.length; i++) {
        if (results[i]["score"] >= hi - 50) {
            if (results[i]["freq"] >= 18) {
                words.push(results[i]["word"]);
            }
        } else {
            break;
        }
    }
    console.log(words);
    var random = Math.floor((Math.random() * (words.length - 1)) + 0);
    rhymeWords.push(words[random]);
}

function addStrToResult(str) {
    count += 1;
    var ele = document.createElement("p");
    ele.classList.add("sent");
    ele.innerHTML = str;
    ele.id = "p" + count;
    var delButton = document.createElement("button");
    delButton.innerHTML = "delete";
    delButton.value = "p" + count;
    delButton.onclick = deleteSentence;
    ele.appendChild(delButton);
    document.getElementById("result").appendChild(ele);
}

function deleteSentence() {
    document.getElementById("result").removeChild(document.getElementById(this.value));
}

function saveRhyme() {
    document.getElementById("more").style.display = "block";
    var allWords = document.getElementsByClassName("tb");
    var ptr = 0;
    var str = "";
    if (selectIndex[0] != 0) {
        str += allWords[ptr].value + " ";
        ptr += 1;
    }
    str += rhymeWords[0] + " ";
    for (var i = 1; i < selectIndex.length; i ++) {
        if (selectIndex[i] != selectIndex[i - 1] + 1) {
            str += allWords[ptr].value + " ";
            ptr += 1;
        }
        str += rhymeWords[i] + " ";
    }
    if (ptr == allWords.length - 1) {
        str += allWords[ptr].value;
    }
    addStrToResult(str.trim());
}

function saveSong() {
    document.getElementById("b").pause();
    var w = window.open();
    w.document.write("<link href=\"css/style.css\" type=\"text/css\" rel=\"stylesheet\" />");
    w.document.write("<h1>" + document.getElementById("nameField").value + "</h1>");
    w.document.write("<h2>" + document.getElementById("artist").value + "</h2>");
    w.document.write("<p>");

    var sents = document.getElementsByClassName("sent");
    for (var i = 0; i < sents.length; i ++) {
        var innerContent = sents[i].innerHTML.substring(0, sents[i].innerHTML.indexOf("<button"));
        w.document.write(innerContent + "<br />");
    }

    w.document.write("</p>");
    w.document.write(document.getElementById("beats").innerHTML);
    w.document.getElementById("audioSource").src = beatSrc;
    w.document.getElementById("dropTheBeat").style.display = "none";
    w.document.getElementById("b").load();
    w.document.getElementById("b").play();
}

function playRandomTrack() {
    var audioCount = 5;
    var random = Math.floor((Math.random() * (audioCount)) + 0);
    var b = document.getElementById("b");
    var source = document.getElementById("audioSource");

    beatSrc = "beats/" + random + ".mp3";
    source.src = beatSrc;
    b.load();
    b.play();
}