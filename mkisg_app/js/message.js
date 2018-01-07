
var MESSAGE_DELAY=3000;
var hideTimeout=null;

var showMessage = function( textHTML ){
    var message =document.querySelector('#messageDiv');
    if( message ) {
	// ...
	clearTimeout(hideTimeout);
	message.innerHTML= textHTML;
	message.style.display="block"; // show
    }
}

var hideMessage = function(){
    var message =document.querySelector('#messageDiv');
    if( message ) {
	message.style.display="none"; // hide
    }
}

var showAndHideMessage =  function( textHTML, milliseconds ){
    var message =document.querySelector('#messageDiv');
    if( message ) {
	showMessage(textHTML);
	hideTimeout=setTimeout(hideMessage, milliseconds); // hide afer milliseconds
    }
}


var helpMessage = `
    <h2>HELP SCREEN:</h2>
    <h3>Key bindings:</h3>
    <dl>
    <dt>'H':</dt>
    <dd>Display this help message</dd>
    <dt>Enter,'F' / Backspace, 'B', 'V':</dt>
    <dd>Move forward / backward.</dd>
    <dt>Arrow keys or 'I','J','K','L':</dt>
    <dd>Move/rotate up/down/left/right.</dd>
    <dt>'R':</dt>
    <dd>Switch to ROTATION MODE.</dd>
    <dt>'M':</dt>
    <dd>Switch to MOVE MODE.</dd>   
    <dt>'X':</dt>
    <dd>Change the stage</dd>
    <dt>'S':</dt>
    <dd>Toggle skybox on/off.</dd>
    <dt>'N':</dt>
    <dd>Change the skybox.</dd>
    <dt>'T'</dt>
    <dd>Toggle mouse-click inertia on/off.</dd>
    <dt>'Q':</dt>
    <dd>Query for remaining tokens.</dd>
    <dt>Escape:</dt>
    <dd>Hide the message box</dd>
    </dl>
    `+chromeMessage
