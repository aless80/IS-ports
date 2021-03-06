// ==UserScript==
// @name         IS ports
// @namespace    https://github.com/aless80/IS-ports
// @version      0.1
// @description  Add a small div on InterSystems web applications to be able to launch the same URL at a different port number
// @author       Alessandro Marin
// @match
// @include      http://localhost:577*/csp/*
// @grant        none
// @exclude      http*$ZEN_POPUP=1*
// @exclude      http*://localhost:577*/csp/*$ZEN_POPUP=1*
// @exclude      http*://localhost:57772/csp/samples/_DeepSee.UI.Dialog.CubeSave.cls?$ZEN_POPUP=1&$ZEN_SOFTMODAL=1&MODE=savecube&CUBE=NamesUS&CLASS=Ale.NamesUSCube&DESC=Grabs%20the%20data%20in%20http%3A%2F%2Fwww2.census.gov%2Ftopics%2Fgenealogy%2F1990surnames%2Fdist.male.first%0D%0Acantaining%20the%20frequency%20of%20first%20Names%20in%20the%20US%20in%201990%2C%20or%20something%20like%20that*
// ==/UserScript==

if (window.top != window.self)  //don't run on frames or iframes
    return;

function getPort() {
    var url=location.href;
    var port=url.split(":")[2].split("/")[0];
    return port;
}

function setPort(port) {
    var url=location.href;
    console.log("location.href=",url);
    var http=url.split("//",2)[0];
    var afterhttp=url.split("//",2)[1];
    var ip=afterhttp.split(":")[0];
    var afterip=afterhttp.split(":")[1];
    var portinurl=afterip.split("/")[0];
    var afterport=afterip.substr(portinurl.length);
    var newurl=http+"//"+ip+":"+port+afterport;
    console.log(newurl);
    location.href=newurl;
}

console.log("Tampermonkey script running on: "+location.href + " and port is: "+getPort());
var div = document.createElement("DIV");
div.id="Ale_div";
var span = document.createElement("SPAN");
// Create a <button> element
var btnp = document.createElement("BUTTON");
var btnm = document.createElement("BUTTON");
btnp.id="Ale_btnp";
btnm.id="Ale_btnm";
//Create an input field
var input = document.createElement("INPUT");
input.id="Ale_input";
input.value=getPort();
input.style.visibility = "hidden";
input.style.width="4px";

// Create text nodes and append them to the buttons
var tp = document.createTextNode("+");
var tm = document.createTextNode("-");
btnp.appendChild(tp);
btnm.appendChild(tm);
// Append buttons and input to the div
div.appendChild(span);
span.appendChild(btnm);
span.appendChild(btnp);
span.appendChild(input);


// Styles for the div
div.style.position = "absolute";
div.style.left="450px";
div.style.top="2px";
div.style.backgroundColor="lightgrey";
div.style.whiteSpace = "nowrap";
div.style.padding="1px";
//Allow the div to be dragged
div.setAttribute("draggable","true");
//The following is necessary in firefox
div.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("Text", this.id);
  }
);
div.ondragend=function(event){
    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        document.getElementById(event.target.id).style.left = event.screenX-this.offsetWidth-47+"px";
    } else {
        document.getElementById(event.target.id).style.left=event.clientX-47+"px";
    }
};
document.body.appendChild(div);
//Append onclick event
btnp.onclick=function(event){input.showInput();changePort(+1);};
btnm.onclick=function(event){input.showInput();changePort(-1);};


//variable to track the callback
var timeout;
//Launch url with new port number
function changePort(increment){
    //57772 is the minimum
    if (Number(input.value)+increment < 57772) return;
    clearTimeout(timeout);
    input.value=Number(input.value)+increment;
    input.style.visibility='visible';
    timeout=setTimeout(function(){setPort(input.value);},650);
}
//Clicking on div shows the input field
div.onclick=function(event){
    console.log(event.target.id); //Ale_div
    if (event.target.id.slice(0,7) == "Ale_btn") return;
    if (event.target.id == "Ale_input") return;
    if (input.style.visibility=='hidden'){
        input.showInput();
    } else if (input.style.visibility=='visible'){
        input.hideInput();
    }
};
input.showInput=function(){
        input.style.width="40px";
        input.style.visibility = "visible";
};
input.hideInput=function(){
        input.style.width="4px";
        input.style.visibility = "hidden";
};
//Press enter on input
div.onkeyup=function(){
    if (event.keyCode == 13){
        console.log("onkeyup event.keyCode="+event.keyCode);
        var port=document.getElementById('Ale_input').value;
        console.log("onkeyup port="+port);
        if (port>57700 && port<57800){
            console.log("onkeyup inside if="+port);
            setPort(port);}
    }
};
