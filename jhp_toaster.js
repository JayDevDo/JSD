/* 
	jhp_toaster.js 
	version = 20241211-20h00	
*/

let toastIndexer = 0 ;

newToastId = ()=>{ return toastIndexer++; } ;


/* 	toast messages */
myToaster = ( msg )=>{
	let thisToastId = newToastId() ; 

	let newToast = $( 	[ 	"<div class='toast' toastnr='", thisToastId.toString(), "' >","<span>", msg, "</span>", 
							"<button onClick='delToast(", thisToastId.toString() ,")' >close</button>","</div>" 
						].join("")
					);

	// console.log( "toast", $( newToast ) ) ;
	toastManagerAdd( $( newToast ) ) ; 
}

delToast = ( toastID )=>{ 
	let tstCrit = ["div.toast[toastnr='" , toastID.toString(), "']" ].join("") ;
	let tstTD = $( tstCrit ).get() ;
	if( tstTD.length == 1 ){$( tstTD ).hide() ;}
}

toastManagerPop = ()=>{ 
	let currentToastStack = $("#toastContainer div.toast" ).get() ; 
	
	// console.log( "toastManagerPop", currentToastStack.length ) ;
	/* 
		$.each(
			currentToastStack,
			function(i,t){
				console.log("i",i, "t", t );
			}
		);

	*/
	if( currentToastStack.length>4){ currentToastStack[4].remove(); }
	// console.log( "toastManagerPop", currentToastStack.length ) ;
}

toastManagerAdd = ( toast )=>{
	// console.info( "toastManagerAdd before-> max#", appSettings.maxToasts, " current#", $( "#toastContainer div.toast" ).length );
	if( appSettings.maxToasts == $( "#toastContainer div.toast ").length ){ toastManagerPop() ; }
	$( "#toastContainer" ).prepend( toast ) ;
	// console.info("toastManagerAdd after-> max#", appSettings.maxToasts, " current#", $( "#toastContainer div.toast" ).length );
}
