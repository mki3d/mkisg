/* TEST */

function inputHandler( input ) {
    console.log(input)
}


function testLoading( path ) {    
    errorHandler=function(err){
	console.log('ERROR');
	console.log(err);
    }

    try{
	chrome.runtime.getPackageDirectoryEntry(function (dirEntry){
 	    console.log(dirEntry);
	    dirEntry.getFile('mki3d/tokens/item.mki3d', {},
			     function (fileEntry ){
				 console.log(fileEntry);
				 fileEntry.file(function(file) {
				     var reader = new FileReader();
				     reader.onloadend = function(e) {
					 // console.log(this.result);
					 inputHandler( this.result );
				     };
				     reader.readAsText(file);
				 }, 
						errorHandler);
			     },
			     errorHandler);
	}
					       );

    } catch( err ) {
	console.log( err );
	console.log( 'Trying: XMLHttpRequest() ');
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
		// Typical action to be performed when the document is ready:
		// console.log( xhttp.responseText );
		inputHandler( xhttp.responseText );
	    }
	};
	xhttp.open("GET", path, true);
	xhttp.send();
    }
    
}
