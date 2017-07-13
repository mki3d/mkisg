// CALLBACKS

function setViewportProjections() {
    var wth = parseInt(window.innerWidth)-30;
    var hth = parseInt(window.innerHeight)-30;
    var canvas = document.getElementById("canvasId");

    canvas.setAttribute("width", ''+wth);
    canvas.setAttribute("height", ''+hth);
    gl.viewportWidth = wth;
    gl.viewportHeight = hth;
    projection.screenX=wth;
    projection.screenY=hth;

    pMatrix= projectionMatrix(projection);

    gl.viewport(0,0,wth,hth);
    // gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
}


function onWindowResize() {

    // stopIntervalAction();
    animation.stop();
    setViewportProjections()
    drawScene();

}

function onKeyUp(e){
    animation.stop();
    animation.keyAction=false;
}

function onKeyDown(e){

    // stopIntervalAction();
    // animation.stop();
    if( animation.keyAction ) return; // already set action
    animation.keyAction=true;
    
    // var code=e.keyCode? e.keyCode : e.charCode;
    var code= e.which || e.keyCode;
    switch(code)
    {
	case 38: // up
	case 73: // I
	animation.start( animation.up[currentAction] )
	break;
	case 40: // down
	case 75: // K
	animation.start( animation.down[currentAction] )
	break;
	case 37: // left
	case 74:// J
	animation.start( animation.left[currentAction] )
	break;
	case 39:// right
	case 76: // L
	animation.start( animation.right[currentAction] )
	break;
	case 70: // F
	case 13: // Enter
	animation.start( animation.movForward )
	break;
	case 66: // B
	case 86: // V
	case 8: // Backspace
	animation.start( animation.movBack )
	break;
	case 32: // space
	traveler.rotYZ=0; drawScene();
	break;
	case 77: // M
	// currentAction = ACTION_MOVE;
	setAction(ACTION_MOVE);
	break;
	case 82: // R
	// currentAction = ACTION_ROTATE;
	setAction(ACTION_ROTATE);
	break;
	case 81: // Q
	showAndHideMessage("REMAINING TOKENS: "+tokenPositions.remaining,  MESSAGE_DELAY);
	break;
	case 83: // S
	// toggle skybox
	withSkyBox=!withSkyBox;	
	drawScene();
	break;
	case 78: // N
	// next random skybox
	sbx_renderRandomCube(gl);
	withSkyBox=true;	
	drawScene();
	break;
	
	case 84: // T
	animation.MouseUpStopAction =  !animation.MouseUpStopAction;
	showAndHideMessage( "INERTIA: "+(!animation.MouseUpStopAction), 1000 );
	break;
	
	case 88: // X
	// restarting stage
	withSkyBox=true;	
	startGame();
	break;
	
	case 27: // escape
	hideMessage();
	break;
	
	case 72: // H
	showMessage(helpMessage);
	break;
    }
}



function sectorAction(xSector, ySector){
   var sectorString = ""+xSector+","+ySector;

    switch(sectorString)
    {
	case "0,1":
	// intervalAction=window.setInterval(left,50);
	animation.start( animation.left[currentAction] )
	break;
	case "2,1":
	// intervalAction=window.setInterval(right,50);
	animation.start( animation.right[currentAction] )
	break;
	case "1,0":
	// intervalAction=window.setInterval(up,50);
	animation.start( animation.up[currentAction] )
	break;
	case "1,2":
	// intervalAction=window.setInterval(down,50);
	animation.start( animation.down[currentAction] )
	break;
	case "2,0":
	// intervalAction=window.setInterval(forward,50);
	animation.start( animation.movForward )
	break;
	case "2,2":
	// intervalAction=window.setInterval(back,50);
	animation.start( animation.movBack )
	break;
	case "1,1":
	traveler.rotYZ=0; drawScene();
	break;
	case "0,0":
	// currentAction = ACTION_MOVE;
	setAction(ACTION_MOVE);
	break;
	case "0,2":
	// currentAction = ACTION_ROTATE;
	setAction(ACTION_ROTATE);
	break;

    }
}

function onMouseDown(evt){

    // console.log(evt); // test
    
    if( animation.requestId != 0 ) {
	animation.stop();
	return;
    }
    
    var wth = parseInt(window.innerWidth);
    var hth = parseInt(window.innerHeight);
    var xSector= Math.floor(3*evt.clientX/wth);
    var ySector= Math.floor(3*evt.clientY/hth);

    sectorAction(xSector, ySector);
 }

function onMouseUp(evt){
    if( animation.MouseUpStopAction ) {
	animation.stop();
    }
}

function onTouchDown(evt){
    evt.preventDefault();
    // console.log(evt); // test
    
    if( animation.requestId != 0 ) {
	animation.stop();
	return;
    }
    
    var wth = parseInt(window.innerWidth);
    var hth = parseInt(window.innerHeight);
    var xSector= Math.floor(3*evt.touches[0].clientX/wth);
    var ySector= Math.floor(3*evt.touches[0].clientY/hth);

    sectorAction(xSector, ySector);
 }

function onTouchUp(evt){
    evt.preventDefault();
    animation.stop();
}

/* set game callbacks */
function setCallbacks(){
    canvas = document.getElementById("canvasId");
    canvas.addEventListener("touchstart", onTouchDown, false);
    canvas.addEventListener("touchend", onTouchUp, false);
    window.onresize=onWindowResize;
    window.onkeydown=onKeyDown;
    window.onmousedown=onMouseDown;
    window.onmouseup=onMouseUp;
    window.onkeyup=onKeyUp; // cancelling action 
}

/* hold on callbacks */
function cancelCallbacks() {
    window.onresize=null;
    window.onkeydown=null;
    window.onmousedown=null;
    window.onmouseup=null;
    animation.stop(); 
}
