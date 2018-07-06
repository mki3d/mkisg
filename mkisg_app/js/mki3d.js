/* handling mki3d data */

mki3dIndex={}

mki3dStage={}

mki3dToken={}

loadedStage={}

function loadIndexHandler( input ) {
    mki3dIndex=JSON.parse( input );
    mki3dIndex.newLoaded=true;
    // console.log( mki3dIndex ); // test
    startLoadingToken(); //cascading loading
}

function startLoadingToken() {
    var name= mki3dIndex.tokens[ Math.floor(Math.random()*mki3dIndex.tokens.length) ];
    startLoading('mki3d/tokens/'+name, loadTokenHandler );
}

function loadTokenHandler( input ) {
    mki3dToken=JSON.parse( input );
    mki3dToken.newLoaded=true;
    // console.log("TOKEN");
    // console.log( mki3dToken ); // test
    startLoadingStage(); // cascading loading
}

var LastLoadedStage=-1;  // remember last loaded stage index

function startLoadingStage() {
    /* rewritten from mki3dgame: preventing reloading of the same stage */
    let stages = mki3dIndex.stages.length;
    let n = stages

    if (stages >= 2 && LastLoadedStage >= 0) { // if we have at least 2 stages and at something has been loaded
		n = stages - 1
    }

    let r = (LastLoadedStage + 1 + Math.floor(Math.random()*n) ) % stages // if n==stages-1 then should select any stage different from  the last one

    /// var name= mki3dIndex.stages[ Math.floor(Math.random()*mki3dIndex.stages.length) ];  ///  old
    let  name= mki3dIndex.stages[r]; // new
    startLoading('mki3d/stages/'+name, loadStageHandler );
    
    console.log("r=="+r+" LastLoadedStage=="+LastLoadedStage) /// tests
    if ( r == LastLoadedStage ) console.log("RELOADED THE SAME STAGE: "+r+"!!!") /// tests
    
    LastLoadedStage=r ; // record the index of the loaded stage
    // console.log(name);
}

function loadStageHandler( input ) {
    mki3dStage=JSON.parse( input );
    mki3dStage.newLoaded=true;
    // console.log( mki3dStage ); // test

    if( mki3dToken.newLoaded ) {
	loadedStage =  makeStage(mki3dStage, mki3dToken);
	loadedStage.newLoaded=true;
	// console.log( loadedStage );
    }
}

// from mki3d

vectorClone= function (v){
    return [v[0],v[1],v[2]]; 
};

vectorScale = function(v, sx, sy, sz ) {
    v[0]*= sx;
    v[1]*= sy;
    v[2]*= sz;
};


scalarProduct= function( v, w ) {
    return v[0]*w[0]+v[1]*w[1]+v[2]*w[2];
};

vectorProduct= function( a, b ) { // cross product
    return [ a[1]*b[2]-a[2]*b[1],
             a[2]*b[0]-a[0]*b[2],
             a[0]*b[1]-a[1]*b[0]  ];
};

vectorLength = function (a) {
    return Math.sqrt(scalarProduct(a,a));
};

vectorNormalized = function (v) { 
    var len= vectorLength(v);
    if(len==0) return [0,0,0]; // normalized zero vector :-(
    var vn= vectorClone(v);
    var s =1/len; 
    vectorScale(vn,  s,s,s);
    return vn;
};

normalToPlane = function ( a, b, c ) { // a,b,c are three points of the plane
    var v1 = [ b[0]-a[0], b[1]-a[1], b[2]-a[2] ];
    var v2 = [ c[0]-a[0], c[1]-a[1], c[2]-a[2] ];
    return vectorNormalized( vectorProduct( v1, v2 ) );
};

/* shadeFactor is computed for triangles */
/* Color of the triangle is scaled by the shade factor before placing it into buffer of colors */
/* light parameter can be mki3d.data.light  */
shadeFactor= function ( triangle, light) {
    var normal= normalToPlane(triangle[0].position,triangle[1].position,triangle[2].position);
    var sp= scalarProduct(light.vector, normal);
    return light.ambientFraction+(1-light.ambientFraction)*Math.abs(sp);  
}

/* load model to its GL buffer */
// TO DO ...
function makeGraph (mki3dData, light){
    const MKI3D_VERTEX_POSITION_SIZE=3
    var model = mki3dData.model;

    var graph ={}; // to be constructed and returned
    
    var elements = [];
    var elementsColors = [];


    var i,j;
    for(i=0; i<model.segments.length; i++){
	for(j=0; j<2; j++){
	    elements.push(model.segments[i][j].position[0]);
	    elements.push(model.segments[i][j].position[1]);
	    elements.push(model.segments[i][j].position[2]);

	    elementsColors.push(model.segments[i][j].color[0]);
	    elementsColors.push(model.segments[i][j].color[1]);
	    elementsColors.push(model.segments[i][j].color[2]);
	    
	}
    }

    /*
    // load segments and colors to GL buffers

    gl.bindBuffer(gl.ARRAY_BUFFER, buf.segments);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( elements ), gl.DYNAMIC_DRAW );
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buf.segmentsColors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( elementsColors ), gl.DYNAMIC_DRAW );

    buf.nrOfSegments =  elements.length/(2*MKI3D_VERTEX_POSITION_SIZE); // + ... markers
    */

    graph.nrOfLines = elements.length/(2*MKI3D_VERTEX_POSITION_SIZE);
    graph.linesVertices = new Float32Array( elements );
    graph.linesColors = new Float32Array( elementsColors )
    
    // TO DO: triangles

    elements = [];
    elementsColors = [];

    
    for(i=0; i<model.triangles.length; i++){
	var triangle=model.triangles[i];
	if(!triangle.shade) 
	    triangle.shade = shadeFactor( triangle, light);
	for(j=0; j<3; j++){
	    elements.push(triangle[j].position[0]);
	    elements.push(triangle[j].position[1]);
	    elements.push(triangle[j].position[2]);

	    elementsColors.push(triangle[j].color[0]*triangle.shade);
	    elementsColors.push(triangle[j].color[1]*triangle.shade);
	    elementsColors.push(triangle[j].color[2]*triangle.shade);
	    
	}
    }

    /*
    // load triangles and colors to GL buffers

    gl.bindBuffer(gl.ARRAY_BUFFER, buf.triangles);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( elements ), gl.DYNAMIC_DRAW );
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buf.trianglesColors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( elementsColors ), gl.DYNAMIC_DRAW );

    buf.nrOfTriangles =  elements.length/(3*MKI3D_VERTEX_POSITION_SIZE); 
    */
    
    graph.nrOfTriangles = elements.length/(3*MKI3D_VERTEX_POSITION_SIZE);
    graph.trianglesVertices = new Float32Array( elements );
    graph.trianglesColors = new Float32Array( elementsColors )


    ////// 
    return graph;
}




// recompute bounding box  with the BoxMargin  corners of the stage.
function copmuteVMinVMax(mki3dData) {
    var VMax = vectorClone(mki3dData.cursor.position); // cursror position should be included - the starting poin of traveler
    var VMin = vectorClone(VMax);

    for (var s = 0; s< mki3dData.model.segments.length; s++) {
	var seg = mki3dData.model.segments[s];
	for (p= 0; p<seg.length; p++) {
	    var point = seg[p];
	    for (var d =0; d<point.position.length; d++) {
		if (VMax[d] < point.position[d]) {
		    VMax[d] = point.position[d];
		}
		if (VMin[d] > point.position[d]) {
		    VMin[d] = point.position[d];
		}
	    }
	    
	}
    }
    
    for (var t = 0; t< mki3dData.model.triangles.length; t++) {
	var tr = mki3dData.model.triangles[t]
	for(var p= 0; p<tr.length; p++){
	    var point = tr[p];
	    for (var d =0; d<point.position.length; d++) {
		if (VMax[d] < point.position[d]) {
		    VMax[d] = point.position[d];
		}
		if (VMin[d] > point.position[d]) {
		    VMin[d] = point.position[d];
		}
	    }
	    
	}
    }

    return [VMin, VMax];
}

// compute traveler
function makeTraveler(mki3dData) {
    var vbox =  copmuteVMinVMax(mki3dData) ;
    var traveler={}
    traveler.vMin= vbox[0];
    traveler.vMax= vbox[1];

    traveler.x = mki3dData.cursor.position[0]
    traveler.y = mki3dData.cursor.position[1]
    traveler.z = mki3dData.cursor.position[2]

    traveler.rotXZ= 0 ;
    traveler.rotYZ= 0 ;
    return traveler ;
}

function makeStage(mki3dData, mki3dToken) {
    var stage = {}
    stage.traveler = makeTraveler(mki3dData);
    stage.bgColor = mki3dData.backgroundColor;
    var light= mki3dData.light
    stage.scene = makeGraph (mki3dData, light) ////
    stage.token = makeGraph (mki3dToken, light)  ////
    stage.frameBox= makeFrameBox(stage.traveler);


    return stage;
}


