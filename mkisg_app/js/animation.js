/* Frame animation */


animation={}
animation.requestId=0
animation.startTime=0 // global starting time
animation.lastTime=0  // time of last animation
animation.deltaTime=0 // delta between the last and this animation

animation.movSpeed= 0.016 // move per milisecond
animation.rotSpeed= 0.05 // rotation per milisecond

animation.movUp= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,step,0] );
}

animation.movDown= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,-step,0] );
}

animation.movLeft= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [-step,0,0] );
}

animation.movRight= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [step,0,0] );
}

animation.movForward= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,0,step] );
}

animation.movBack= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,0,-step] );
}

animation.rotUp= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateYZ(traveler, -step );
}
    
animation.rotDown= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateYZ(traveler, step );
}

animation.rotLeft= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateXZ(traveler, step );
    animation.totalRotXZ+=step
    if( Math.abs(animation.totalRotXZ) >= 360 ) animation.stop();
}

animation.rotRight= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateXZ(traveler, -step );
    animation.totalRotXZ+=step
    if( Math.abs(animation.totalRotXZ) >= 360 ) animation.stop();
}

animation.initRotXZ=0;   // initial XZ rotation
animation.totalRotXZ= 0; // total XZ rotation


animation.up=[];
animation.up[ACTION_MOVE]= animation.movUp;
animation.up[ACTION_ROTATE]= animation.rotUp;

animation.down=[];
animation.down[ACTION_MOVE]= animation.movDown;
animation.down[ACTION_ROTATE]= animation.rotDown;

animation.left=[];
animation.left[ACTION_MOVE]= animation.movLeft;
animation.left[ACTION_ROTATE]= animation.rotLeft;

animation.right=[];
animation.right[ACTION_MOVE]= animation.movRight;
animation.right[ACTION_ROTATE]= animation.rotRight;

animation.keyAction=false; // indicates that current animation is caused by key press
animation.KeyUpStopAction = false; // keyUp event stops action

/* callback(animation) -- performs callbacks using animation parameters */
animation.start= function( callback ) {

    var animate = function() {
	if( animation.requestId == 0 ) return; // animation was cancelled
	var time=window.performance.now();
	animation.deltaTime=time-animation.lastTime
	animation.lastTime=time;
	callback();
	drawScene();  
	if( animation.requestId == 0 ) return; // animation was cancelled by the callback ?
	animation.requestId = window.requestAnimationFrame(animate); // ask for next animation
    }

    if( animation.requestId != 0 ) animation.stop(); // cancell old action

    
    animation.initRotXZ= traveler.rotXZ;
    animation.totalRotXZ= 0;
    
    animation.startTime = window.performance.now();
    animation.lastTime = animation.startTime;
    drawScene();  
    animation.requestId = window.requestAnimationFrame(animate);
}


animation.stop = function() {
    if (animation.requestId)
	window.cancelAnimationFrame(animation.requestId);
    animation.requestId = 0;
    drawScene();  
}
