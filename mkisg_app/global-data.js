/* GLOBAL VARIABLES */


/*jshint multistr: true */
var VERTEX_SHADER_STRING = " \
attribute vec3 aVertexPosition; \
attribute vec4 aVertexColor; \
uniform mat4 uMVMatrix; \
uniform mat4 uPMatrix; \
uniform vec3 mov; \
varying vec4 vColor; \
void main(void) { \
gl_Position = uPMatrix * uMVMatrix * vec4(mov+aVertexPosition, 1.0); \
vColor = aVertexColor; \
}";

var FRAGMENT_SHADER_STRING = " \
precision mediump float; \
varying vec4 vColor; \
void main(void) { \
gl_FragColor = vColor; \
}";

// SHADERS
var shaderProgram;

// parameters for shaders
var vertexPositionSize=3; // x,y,z -- three components of the position
var vertexColorSize=3;    // RGB   -- three components of the color
var mvMatrix; // model-view matrix -- uniform 
var pMatrix; // projection matrix  -- uniform
var mov; //  movement              -- uniform

/* GL CONTEXT */
var gl;


/* array of stages */
var stageArray = [];

// STAGE PARAMETERS
var scene={} // the graph of stage
var token={}  // token graph for the stage
var traveler= {}; // traveler position and orientation
var bgColor=[0,0,0]; // background color
var frameBox = {};  // framebox for better orientation 

// projection parameters -- recomputed in  onWindowResize() callback
var projection = {}; 
projection.zNear = 0.25;
projection.zFar  = 300;
projection.zoomY = 3.0;
projection.screenX=640;
projection.screenY=400;



// ACTION PARAMETERS
var rotXZStep=2.5;
var rotYZStep=2.5;
var maxYZAngle=90; 
var moveStep=0.5;
var XMargin = 30;
var YMargin = 30;
var ZMargin = 30;


/* TOKENS */
 var MAX_TOKENS=10; // for real game
// var MAX_TOKENS=2; // for tests
var tokenPositions=[];

/* TIMING */
var startTime;

/* Alerts used for redrawing */
var collectedAlert = false;
var alertAction = false;

/** ACTIONS **/

var ACTION_MOVE=0;
var ACTION_ROTATE=1;
var NR_OF_ACTIONS=2;

var currentAction=ACTION_ROTATE;

/// CALLBACKS

var intervalAction=null;

/* STATS */

var visitedStages=0;

/* SKY-BOX */

var withSkyBox=false;
var canvasTex;
var canvasTexDiv;

/* MAIN CANVAS */
var canvas;
