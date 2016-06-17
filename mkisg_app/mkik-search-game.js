/*
  
  MKI Search Game
  Copyright (C) 2013  Marcin Kik mki1967@gmail.com


  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/




var rotXYcounter = 0;

function rotateXZ(traveler, angle)
{
    traveler.rotXZ=(traveler.rotXZ+angle+360)%360;
    if(traveler.rotXZ % 90 == 0) rotXYcounter++;
    if(rotXYcounter == 5) {
	rotXYcounter = 0;
	stopIntervalAction();
    }
}

function rotateYZ(traveler, angle)
{
    if(Math.abs(angle+traveler.rotYZ) <= maxYZAngle)
	traveler.rotYZ += angle;
    else stopIntervalAction();
}

function move(traveler, vector)
{
    var v=worldRotatedVector( traveler, vector );

    v[0]+= traveler.x;
    v[1]+= traveler.y;
    v[2]+= traveler.z;

    if( traveler.vMin[0]-XMargin <= v[0] && v[0] <= traveler.vMax[0]+XMargin &&
	traveler.vMin[1]-YMargin <= v[1] && v[1] <= traveler.vMax[1]+YMargin &&
	traveler.vMin[2]-ZMargin <= v[2] && v[2] <= traveler.vMax[2]+ZMargin )
    {
	traveler.x = v[0];
	traveler.y = v[1];
	traveler.z = v[2];
	checkTokens();
    }
    else {
	stopIntervalAction();
	setAction(ACTION_ROTATE);
    }
}


function maxDistance(v1,v2)
{
    dx=Math.abs(v1[0]-v2[0]);
    dy=Math.abs(v1[1]-v2[1]);
    dz=Math.abs(v1[2]-v2[2]);

    return Math.max(dx,dy,dz); 
}

function checkTokens()
{
    var i;
    var vTraveler=[traveler.x,traveler.y,traveler.z];
    for(i=0; i<tokenPositions.length; i++)
    {
	if(!tokenPositions[i].collected && maxDistance(vTraveler, tokenPositions[i])<1) {
            stopIntervalAction();
            tokenPositions[i].collected= true;
            tokenPositions.remaining--;
            collectedAlert= true;
	}
    }
    if(tokenPositions.remaining===0) {
	/*
	  alert("CONGRATULATIONS !!!\n YOU HAVE COLLECTED ALL TOKENS.\n"+
          "Time: "+((new Date()).getTime()-startTime)+" milliseconds" );
	*/

	/* hold on callbacks */
	window.onresize=null;
	window.onkeydown=null;
	window.onmousedown=null;

	withSkyBox= (visitedStages%2 == 1); // tmp

	if(withSkyBox) {
	    var fun=sbx_fun;

	    var r=Math.floor( Math.random()* fun.length );
	    var g=Math.floor( Math.random()* fun.length );
	    var b=Math.floor( Math.random()* fun.length );
	    skyboxRGB=[r,g,b];
	    skyboxStep=0;
	    // canvas.style.display="none";
	    canvasTexDiv.style.display="block";
	    skyboxRequestId = window.requestAnimationFrame(skyboxCallback);
	} else startGame();
    }
}

var skyboxXYZ= [ 
    sbx_xyzXPlus , sbx_xyzXMinus,
    sbx_xyzYPlus , sbx_xyzYMinus,
 //   sbx_xyzYMinus , sbx_xyzYPlus,
    sbx_xyzZPlus , sbx_xyzZMinus
];

var skyboxRGB;
var skyboxStep;
var skyboxRequestId=0;

var skyboxCallback= function(time){
    if(skyboxStep<6){
	var r=skyboxRGB[0];
	var g=skyboxRGB[1];
	var b=skyboxRGB[2];
	var fun=sbx_fun;
	sbx_fillCanvasUpsideDown( canvasTex, sbx_createFunctionRGB( fun[r], fun[g], fun[b], skyboxXYZ[skyboxStep] ) );
	// sbx_loadCubeFaceFromCanvas(gl, canvasTex, (gl.TEXTURE_CUBE_MAP_POSITIVE_X)+skyboxStep);
	sbx_loadCubeFaceFromCanvas(gl, canvasTex, cubeFace[skyboxStep]);
	skyboxStep++;
	skyboxRequestId = window.requestAnimationFrame(skyboxCallback);
    } else {
	window.cancelAnimationFrame(skyboxRequestId);
	skyboxRequestId =0;
	canvas.style.display="block";
	canvasTexDiv.style.display="none";
/*
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbx_textureId);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
*/
	startGame();
    }
}





function generateTokenPositions(){
    var i;
    for(i=0; i<MAX_TOKENS; i++){
	tokenPositions[i]=[ 
	    traveler.vMin[0]+Math.random()*(traveler.vMax[0]-traveler.vMin[0]),
	    traveler.vMin[1]+Math.random()*(traveler.vMax[1]-traveler.vMin[1]),
	    traveler.vMin[2]+Math.random()*(traveler.vMax[2]-traveler.vMin[2])
        ];
	tokenPositions[i].collected=false;
    }

    tokenPositions.remaining=MAX_TOKENS;
}


function up()
{
    switch(currentAction)
    {
    case ACTION_MOVE:
	move( traveler, [0,moveStep,0] ); 
	break;
    case ACTION_ROTATE:
	rotateYZ(traveler, -rotYZStep );
	break;
    }
    drawScene();  
}

function down()
{
    switch(currentAction)
    {
    case ACTION_MOVE: 
	move( traveler, [0,-moveStep,0] ); 
	break;
    case ACTION_ROTATE:
	rotateYZ(traveler, rotYZStep );
	break;
    }  
    drawScene();  
}

function left()
{
    switch(currentAction)
    {
    case ACTION_MOVE:
	move( traveler, [-moveStep,0,0] ); 
	break;
    case ACTION_ROTATE:
	rotateXZ(traveler, rotXZStep );
	break;
    }  
    drawScene();  
}

function right()
{
    switch(currentAction)
    {
    case ACTION_MOVE: 
	move( traveler, [moveStep,0,0] ); 
	break;
    case ACTION_ROTATE:
	rotateXZ(traveler, -rotXZStep );
	break;
    }  
    drawScene();  
}

function forward()
{
    switch(currentAction)
    {
    case ACTION_MOVE:
    case ACTION_ROTATE:
	move( traveler, [0,0,moveStep] ); 
	break;
    }  
    drawScene();  
}

function back()
{
    switch(currentAction)
    {
    case ACTION_MOVE: 
    case ACTION_ROTATE:
	move( traveler, [0,0,-moveStep] ); 
	break;
    }  
    drawScene();  
}




function glVector3( x,y,z ){
    return new Float32Array(x,y,z);
}

function glMatrix4(  xx, yx, zx, wx,
		     xy, yy, zy, wy,
		     xz, yz, zz, wz,
		     xw, yw, zw, ww )
{
    // sequence of concatenated columns
    return new Float32Array( [ xx, xy, xz, xw,
			       yx, yy, yz, yw,
			       zx, zy, zz, zw,
			       wx, wy, wz, ww ] );
}

var IdMatrix = glMatrix4(1,   0,   0,   0,
			 0,   1,   0,   0,
			 0,   0,   1,   0,
			 0,   0,   0,   1);



function projectionMatrix(projection)
{
    var xx=  projection.zoomY*projection.screenY/projection.screenX;
    var yy=  projection.zoomY;
    var zz=  (projection.zFar+projection.zNear)/(projection.zFar-projection.zNear);
    var zw= 1;
    var wz= -2*projection.zFar*projection.zNear/(projection.zFar-projection.zNear);


    return glMatrix4( xx,  0,  0,  0,
		      0, yy,  0,  0,
		      0,  0, zz, wz,
		      0,  0, zw,  0 );
}



function worldRotatedVector( viewer, vector )
{
    var degToRadians= Math.PI/180;
    var c1= Math.cos(viewer.rotXZ*degToRadians);
    var s1= Math.sin(viewer.rotXZ*degToRadians);
    var c2= Math.cos(viewer.rotYZ*degToRadians);
    var s2= Math.sin(viewer.rotYZ*degToRadians);

    return [    c1*vector[0]-s1*s2*vector[1]-s1*c2*vector[2],
                c2*vector[1]   -s2*vector[2],
		s1*vector[0]+c1*s2*vector[1]+c1*c2*vector[2] 
	   ];
}


function viewerRotatedVector( viewer, vector )
{
    var degToRadians= Math.PI/180;
    var c1= Math.cos(-viewer.rotXZ*degToRadians);
    var s1= Math.sin(-viewer.rotXZ*degToRadians);
    var c2= Math.cos(-viewer.rotYZ*degToRadians);
    var s2= Math.sin(-viewer.rotYZ*degToRadians);

    return [                         c1*vector[0]-s1*vector[2],
				     -s2*s1*vector[0] + c2*vector[1] - s2*c1*vector[2],
				     c2*s1*vector[0] + s2*vector[1] + c2*c1*vector[2] 
	   ];
}


function modelViewMatrix(viewer)
{
    var degToRadians= Math.PI/180;

    var c1= Math.cos(-viewer.rotXZ*degToRadians);
    var s1= Math.sin(-viewer.rotXZ*degToRadians);

    var c2= Math.cos(-viewer.rotYZ*degToRadians);
    var s2= Math.sin(-viewer.rotYZ*degToRadians);

    var v=viewerRotatedVector(viewer, [-viewer.x, -viewer.y, -viewer.z]);

    return glMatrix4 (   c1,   0,    -s1,  v[0],
			 -s2*s1,  c2, -s2*c1,  v[1],
			 c2*s1,  s2,  c2*c1,  v[2],
			 0,   0,      0,    1  );
}

function skyboxViewMatrix(viewer)
{
    var degToRadians= Math.PI/180;

    var c1= Math.cos(-viewer.rotXZ*degToRadians);
    var s1= Math.sin(-viewer.rotXZ*degToRadians);

    var c2= Math.cos(-viewer.rotYZ*degToRadians);
    var s2= Math.sin(-viewer.rotYZ*degToRadians);

    var v=viewerRotatedVector(viewer, [-viewer.x, -viewer.y, -viewer.z]);

    return glMatrix4 (   c1,   0,    -s1,       0,
			 -s2*s1,  c2, -s2*c1,  0,
			 c2*s1,  s2,  c2*c1,  0,
			 0,   0,      0,    1  );
}

// CALLBACKS

function stopIntervalAction(){
    rotXYcounter=0;
    if(intervalAction !== null) {
	window.clearInterval(intervalAction);
	intervalAction=null;
	drawScene();
    }
}

function onWindowResize() {

    stopIntervalAction();

    var wth = parseInt(window.innerWidth)-10;
    var hth = parseInt(window.innerHeight)-10;
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
    drawScene();

}

function setAction( newAction){
    currentAction = newAction ;
    alertAction = true;
    switch (currentAction) {
    case ACTION_MOVE : 
	drawAlert(moveMsg, 2); 
	break;
    case ACTION_ROTATE : 
	drawAlert(rotateMsg, 2); 
	break;

    };
    
}

function onMouseDown(evt){

    if(intervalAction !== null) {
	stopIntervalAction();
	return;
    }

    var wth = parseInt(window.innerWidth);
    var hth = parseInt(window.innerHeight);
    var xSector= Math.floor(3*evt.clientX/wth);
    var ySector= Math.floor(3*evt.clientY/hth);
    var sectorString = ""+xSector+","+ySector;

    switch(sectorString)
    {
    case "0,1":
	intervalAction=window.setInterval(left,50);
	break;
    case "2,1":
	intervalAction=window.setInterval(right,50);
	break;
    case "1,0":
	intervalAction=window.setInterval(up,50);
	break;
    case "1,2":
	intervalAction=window.setInterval(down,50);
	break;
    case "2,0":
	intervalAction=window.setInterval(forward,50);
	break;
    case "2,2":
	intervalAction=window.setInterval(back,50);
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

function onKeyDown(e){

    stopIntervalAction();

    // var code=e.keyCode? e.keyCode : e.charCode;
    var code= e.which || e.keyCode;
    switch(code)
    {
    case 38: // up
    case 73: // I
	up();
	break;
    case 40: // down
    case 75: // K
	down();
	break;
    case 37: // left
    case 74:// J
	left();
	break;
    case 39:// right
    case 76: // L
	right();
	break;
    case 70: // F
	forward();
	break;
    case 66: // B
    case 86: // V
	back();
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
	// alert("remaining tokens: "+tokenPositions.remaining);
	break;
	/*
	  case 69: // E
	  case 191: // ?
	  case 68: // D
	  case 13: // enter
	  case 187: // +
	  case 27: // escape
	  case 189: // -
	  case 86: // V
	  case 46: // Delete
	  case 51: // #
	  case 83: // S
	  case 65: // A
	  case 56: // *
	  case 88: // X
	  case 74: // J
	  break;
	*/
    }
}




/*** et-webgl.js -- END  ***/

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        console.log("Could not initialise WebGL, sorry :-(");
    }
}




// SHADER PROGRAM

function tryToCompileShader(shader)
{
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
    }
}

function compileAndLinkShader( FRAGMENT_SHADER_STRING, VERTEX_SHADER_STRING) {
    var fragmentShader =gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, FRAGMENT_SHADER_STRING);
    tryToCompileShader(fragmentShader);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, VERTEX_SHADER_STRING);
    tryToCompileShader(vertexShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
    }
    return shaderProgram;
}

function initShaders() { // compile and link shader programs and  init their atributes and variables 

    shaderProgram =  compileAndLinkShader( FRAGMENT_SHADER_STRING, VERTEX_SHADER_STRING);
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);


    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.vMov = gl.getUniformLocation(shaderProgram, "mov");
}



function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function initBuffers(graph) {


    graph.linesVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, graph.linesVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, graph.linesVertices, gl.STATIC_DRAW);

    graph.linesColorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, graph.linesColorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, graph.linesColors, gl.STATIC_DRAW);

    graph.trianglesVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, graph.trianglesVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, graph.trianglesVertices, gl.STATIC_DRAW);

    graph.trianglesColorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, graph.trianglesColorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, graph.trianglesColors, gl.STATIC_DRAW);

}


function drawAlert(alertGraph, size) {
    var	myMatrix= glMatrix4(
	1/size,      0,      0,    0,
	0,      1/size,      0,    0,
        0,           0, 1/size,   -1,
        0,           0,      0,    1
    ) ;
    
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, 
			myMatrix
		       );
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, IdMatrix );
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // BLACK	
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawGraph(alertGraph);
    // restore matrices 
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function drawSectors() {
    // draw sectors
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, 
			glMatrix4(
			    1/6,   0,   0,   0,
			    0, 1/6,   0,   0,
			    0,   0, 1/6,  -1,
			    0,   0,   0,   1
			) 
		       );
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, IdMatrix );
    // gl.disable(gl.DEPTH_TEST);
    drawGraph(sectors);
    // restore matrices 
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    // gl.enable(gl.DEPTH_TEST);

}


function drawScene() {
    gl.useProgram(shaderProgram);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.depthFunc(gl.LEQUAL);
    if(collectedAlert) {
	gl.clearColor(1.0, 0.5, 0.5, 1.0); // PINK
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        collectedAlert=false;
        drawSectors();
	return;
    }
    if(alertAction){
        alertAction=false;
	switch (currentAction) {
	case ACTION_MOVE : 
	    drawAlert(moveMsg, 2); 
	    break;
	case ACTION_ROTATE : 
	    drawAlert(rotateMsg, 2); 
	    break;

	};
	return;
    }

    gl.clearColor(bgColor[0], bgColor[1], bgColor[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    mvMatrix= modelViewMatrix(traveler);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);


    // setMatrixUniforms();
    // gl.uniform3fv(shaderProgram.vMov, glVector3( 0,0,0 ) );
    gl.uniform3f(shaderProgram.vMov,  0,0,0  );
    drawGraph(scene);
    drawGraph(frameBox);

    drawTokens();

     if(withSkyBox) sbx_drawSkybox ( gl, skyboxViewMatrix(traveler),  pMatrix);

    gl.useProgram(shaderProgram);
    if(intervalAction === null ) drawSectors();


}




function drawTokens()
{
    var i;
    for(i=0; i<tokenPositions.length; i++) {
	if( ! tokenPositions[i].collected ) {
            gl.uniform3f(shaderProgram.vMov, tokenPositions[i][0],  tokenPositions[i][1],tokenPositions[i][2] );
            drawGraph(token); // test
	} 
    }

    gl.uniform3f(shaderProgram.vMov,  0,0,0  ); // reset mov uniform

}


function drawGraph(graph) {

    /* draw lines */
    gl.bindBuffer(gl.ARRAY_BUFFER, graph.linesVerticesBuffer );
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, graph.linesColorsBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, 2*graph.nrOfLines);
    /* draw triangles */
    gl.bindBuffer(gl.ARRAY_BUFFER, graph.trianglesVerticesBuffer );
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, graph.trianglesColorsBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3*graph.nrOfTriangles);

}




function startGame()
{
    restoreStage(stageArray.length-1);
    if(visitedStages==0){
        stageArray.pop(); // use welcome stage only once
    }
    else{
	/* swap the last stage with rangom other for the next time stage */
	/* we assume that there are still at least two stages */
	var idx = Math.floor(Math.random()*(stageArray.length-1));
	var tmp= stageArray[idx];
	stageArray[idx]=stageArray[stageArray.length-1];
	stageArray[stageArray.length-1]=tmp;
    }

    generateTokenPositions();
    if(visitedStages==0){
	// only one token on welcome stage
	var i;
	for(i=0; i<MAX_TOKENS-1; i++) {
            tokenPositions[i].collected= true;
            tokenPositions.remaining--;
	}
        tokenPositions[i]=[4.5,0.5,0]; // hardcoded position :-(
    }
    visitedStages++; // statistics

    /*
      alert("MKI SEARCHING GAME:\n\n"+
      "FIND AND COLLECT "+tokenPositions.remaining+" TOKENS!\n\n"+
      "Use the keys:\n"+
      "     'B','F', Arrow Keys - move/rotate\n"+
      "     'M','R' - moving/rotating mode\n"+
      "      Space - set observer upright\n"+
      "     'Q' - report number of remaing tokens\n"+
      "or touch one of the 3x3 sectors of the window to activate action:\n"+
      "      up-left - switch to moving mode\n"+
      "      down-left - switch to rotating mode\n"+
      "      up-right  - forward\n"+
      "      down-right - backward\n"+
      "      center -  set observer upright\n"+
      "      left/up/right/down-middle - like Arrow Keys\n" 
      );
    */
    drawScene();
    startTime = (new Date()).getTime();

    /* set game callbacks */
    window.onresize=onWindowResize;
    window.onkeydown=onKeyDown;
    window.onmousedown=onMouseDown;

}

function webGLStart() {
    canvas = document.getElementById("canvasId");
    canvasTex = document.getElementById("canvasTexId");
    canvasTexDiv = document.getElementById("canvasTexDiv");
    // ctx = canvas.getContext("2d");
    initGL(canvas);
    initShaders();
    // canvas.setAttribute("onkeypress","onKeyDown(e)");

    // initBuffers(sectorRectangle);
    initBuffers(sectors);
    initBuffers(moveMsg);
    initBuffers(rotateMsg);
    var i;
    for( i = 0; i< stageArray.length; i++) {
        restoreStage(i);
	initBuffers(scene);
	initBuffers(token);
	initBuffers(frameBox);
    }

    gl.clearColor(bgColor[0], bgColor[1], bgColor[2], 1.0);

    gl.enable(gl.DEPTH_TEST);

    /* skybox init */
    cubeFace=[ 
	gl.TEXTURE_CUBE_MAP_POSITIVE_X,
	gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
	gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
	gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
	gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
	gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ];
    var i;

    sbx_makeShaderProgram(gl);

    for(i=0; i<6; i++)
	sbx_loadCubeFaceFromCanvas(gl, canvasTex, cubeFace[i]);

    onWindowResize(); // sets projection an model view matrices and redraws

    /* set callbacks */

    window.onresize=onWindowResize;
    window.onkeydown=onKeyDown;
    window.onmousedown=onMouseDown;
    

    /* TEST */
     
    errorHandler=function(err){
	console.log('ERROR');
	console.log(err);
    }

    chrome.runtime.getPackageDirectoryEntry(function (dirEntry){
	console.log(dirEntry);
	dirEntry.getFile('mki3d/tokens/item.mki3d', {},
			 function (fileEntry ){
			     console.log(fileEntry);
			     fileEntry.file(function(file) {
				 var reader = new FileReader();
				 reader.onloadend = function(e) {
				     //var txtArea = document.createElement('textarea');
				     // txtArea.value = this.result;
				     // document.body.appendChild(txtArea);
				     console.log(this.result);
				 };
				 reader.readAsText(file);
			     }, 
					    errorHandler);
			 },
			 errorHandler);
    }
					   );



    startGame();


}

window.onload = webGLStart;

