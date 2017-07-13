
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
