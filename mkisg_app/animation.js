/* Frame animation */


animation={}
animation.requestId=0
animation.startTime=0 // global starting time
animation.lastTime=0  // time of last animation
animation.deltaTime=0 // delta between the last and this animation

/* callback(animation) -- performs callbacks using animation parameters */
animation.start= function( callback ) {

    var animate = function() {
	if( animation.requestId == 0 ) return; // animation was cancelled
	var time=window.performance.now();
	animation.deltaTime=time-animation.lastTime
	animation.lastTime=time;
	callback( animation )
	requestId = window.requestAnimationFrame(animate); // ask for next animation
    }
    animation.startTime = window.performance.now();
    animation.lastTime = animation.startTime;
    requestId = window.requestAnimationFrame(animate);
}


animation.stop = function() {
    if (requestId)
	window.cancelAnimationFrame(animation.requestId);
    animation.requestId = 0;
}
