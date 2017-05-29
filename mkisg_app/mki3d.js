/* handling mki3d data */

mki3dStage={}

mki3dToken={}

function loadTokenHandler( input ) {
    mki3dToken=JSON.parse( input );
    console.log( mki3dToken ); // test
}

function loadStageHandler( input ) {
    mki3dStage=JSON.parse( input );
    console.log( mki3dToken ); // test
}



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
    return Math.sqrt(mki3d.scalarProduct(a,a));
};

vectorNormalized = function (v) { 
    var len= mki3d.vectorLength(v);
    if(len==0) return [0,0,0]; // normalized zero vector :-(
    var vn= mki3d.vectorClone(v);
    var s =1/len; 
    mki3d.vectorScale(vn,  s,s,s);
    return vn;
};

normalToPlane = function ( a, b, c ) { // a,b,c are three points of the plane
    var v1 = [ b[0]-a[0], b[1]-a[1], b[2]-a[2] ];
    var v2 = [ c[0]-a[0], c[1]-a[1], c[2]-a[2] ];
    return mki3d.vectorNormalized( mki3d.vectorProduct( v1, v2 ) );
};

/* shadeFactor is computed for triangles */
/* Color of the triangle is scaled by the shade factor before placing it into buffer of colors */
/* light parameter can be mki3d.data.light  */
shadeFactor= function ( triangle, light) {
    var normal= mki3d.normalToPlane(triangle[0].position,triangle[1].position,triangle[2].position);
    var sp= mki3d.scalarProduct(light.vector, normal);
    return light.ambientFraction+(1-light.ambientFraction)*Math.abs(sp);  
}

/* load model to its GL buffer */
// TO DO ...
mki3d_loadModel= function (mki3dData, light){

    mki3d.tmpRefreshDisplayModel();
    // var model = mki3d.data.model;
    var model = mki3dData.model;

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

    // load segments and colors to GL buffers

    gl.bindBuffer(gl.ARRAY_BUFFER, buf.segments);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( elements ), gl.DYNAMIC_DRAW );
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buf.segmentsColors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( elementsColors ), gl.DYNAMIC_DRAW );

    buf.nrOfSegments =  elements.length/(2*MKI3D_VERTEX_POSITION_SIZE); // + ... markers


    // TO DO: triangles

    elements = [];
    elementsColors = [];

    /* scale down red and blue coefficients */
    red= red/3;
    blue=blue/3;
    
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

    // load triangles and colors to GL buffers

    gl.bindBuffer(gl.ARRAY_BUFFER, buf.triangles);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( elements ), gl.DYNAMIC_DRAW );
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buf.trianglesColors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( elementsColors ), gl.DYNAMIC_DRAW );

    buf.nrOfTriangles =  elements.length/(3*MKI3D_VERTEX_POSITION_SIZE); 
}

