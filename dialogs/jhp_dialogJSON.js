/* 
	jhp_dialogJSON.js
	
	Handles both import and export of json data into the current dataset (then saved to local storage)
	
	Valid structures:
	json object with dials in an array
		- example of 1 dial { "index":999, "name":"new dial", "url":"https://", "bgClr":"#000000", "fgClr":"#FFFFFF", "pos":[p,r,c,false], "lstVst":"", "thumbUri":"" }
	json object with pages {}
		- example of 1 page { "name":"new page", "color":"#FF00FF", "matrix":[r,c] }

	json object with dials and pages.
		{
			[ { dial }, { dial }, { dial }  ],
			[ { page }, { page }, { page }  ]
		}

	This module will try and match the found objects against the page- and dial templates.
	The module will in anyway, harvest URL's from any given file, and add them to the appTiles,

*/
let tmpTiles 	= [] ; 
let tmpPages 	= [] ; 
let exportDialog = $( "#JSONDetailsContainer" ) ;
let edInfo 		 = $( "#xprtInfoSpan" ) ;


let closeExportDialog = ()=>{ $( exportDialog ).dialog( "close" ); }


let openExportDialog = ()=>{ 
	
	// jsonXprtPre <pre> interaction via  .text WORKS 
	/*
	$( "#jsonXprtPre" ).removeData() ; 
	$( "#jsonXprtPre" ).attr("hasdata", false ) ; 
	$( "#jsonXprtPre" ).text( "replace this text" ) ; 
	$( "#jsonXprtPreLen" ).text(  $( "#jsonXprtPre" ).text().length ) ; 
	*/

	// jsonXprtTxt <input> interaction via .val WORKS
	/*
	$( "#jsonXprtTxt" ).removeData() ; 
	$( "#jsonXprtTxt" ).attr("hasdata", false ) ; 
	$( "#jsonXprtTxt" ).val( "replace this text" ) ; 
	$( "#jsonXprtTxtLen" ).text(  $( "#jsonXprtTxt" ).val().length ) ; 
	*/

	// jsonXprtTA
	$( "#jsonXprtTA" ).removeData() ; 
	$( "#jsonXprtTA" ).attr("hasdata", false ) ; 
	$( "#jsonXprtTA" ).val("replace this text") ;
	updateImportDlgLen() ;

	$( exportDialog ).dialog( "option", "title", "Export dials" ) ; 
	$( exportDialog ).dialog( "open" ) ; 

}


updateImportDlgLen = ()=>{ 
	console.log("updateImportDlgLen fired"); 
	$( "#xprtInfoTALen" ).text(  $("#jsonXprtTA").val().length ) ; 
}


checkJSON = ()=>{

	console.log("checkJSON #jsonXprtTA.val=", $("#jsonXprtTA").val() ) ; 
	let tmpArray = JSON.parse( $( "#jsonXprtTA" ).val() ) || [] ; 

	console.log("checkJSON is Array", Array.isArray(tmpArray), " tmpArray-len:\t", 	tmpArray.length ) ; 

	$( "#dlgXprtBttnDials" ).hide() ;
	$( "#dlgXprtBttnPages" ).hide() ;
	$( "#dlgXprtBttnBoth" ).hide() ;

	let vResult 	= [] ;
	let edinfoTxt 	= "edInfo: " ;
	let edinfoBrdr 	= "black" ;

	switch( tmpArray.length ){

		case 0: 	console.error("switch(tmpArray.length)= 0") ; 
					edinfoTxt 	= "No valid array found in import field ( length = 0 )"
					edinfoBrdr 	= "red" ;
					$( edInfo ).append( ["<span>", edinfoTxt, "</span>"].join("") ) ; 
					break;

		case 1: 	
					vResult = itemValidator( tmpArray ) ; 
					if( vResult[0] > 0 ){
						$( "#dlgXprtBttnDials" ).text( updateBttntxt( "dlgXprtBttnDials", vResult[0] ) ) ;
						$( "#dlgXprtBttnDials" ).show() ;
						edinfoTxt 	= ["Found", vResult[0], "dials in import field (length=1)"].join(" ") ;
						edinfoBrdr 	= "lime" ;
						tmpTiles = tmpArray ;
						$( edInfo ).append( ["<span>", edinfoTxt, "</span>"].join("") ) ; 
					}

					if( vResult[1] > 0){
						$( "#dlgXprtBttnPages" ).text( updateBttntxt( "dlgXprtBttnPages", vResult[1] ) ) ;
						$( "#dlgXprtBttnPages" ).show() ;
						edinfoTxt 	= ["Found", vResult[1], "pages in import field (length=1)"].join(" ") ;
						edinfoBrdr 	= "lime" ;
						tmpPages = tmpArray ;
						$( edInfo ).append( ["<span>", edinfoTxt, "</span>"].join("") ) ; 
					}

					if( vResult[2] > 0){
						edinfoTxt 	= ["Found", vResult[2], "errors in import field (length=1)"].join(" ") ;
						edinfoBrdr 	= "orange" ;
						$( edInfo ).append( ["<span>", edinfoTxt, "</span>"].join("") ) ; 
					}
					
					break;

		case 2: 	
					vResult = itemValidator( tmpArray[0] );
					let vResult2 = itemValidator( tmpArray[1] );
					console.info(
						"vResult=", vResult.toString() ,
						"vResult2=", vResult2.toString() 
					) ; 

					vResult[0] = vResult[0] + vResult2[0]
					vResult[1] = vResult[1] + vResult2[1]
					vResult[2] = vResult[2] + vResult2[2]
					console.info( "updated vResult=", vResult.toString() ) ; 

					if( vResult[0] > 0 ){
						$( "#dlgXprtBttnDials" ).text( updateBttntxt( "dlgXprtBttnDials", vResult[0] ) ) ;
						$( "#dlgXprtBttnDials" ).show() ;
						edinfoTxt 	= ["Found", vResult[0], "dials in import field (length=2)"].join(" ") ;
						edinfoBrdr 	= "lime" ;
						tmpTiles 	= tmpArray[0] ;
						$( edInfo ).append( ["<span>", edinfoTxt,"</span>"].join("") ) ; 
					}

					if( vResult[1] > 0 ){
						$( "#dlgXprtBttnPages" ).text( updateBttntxt( "dlgXprtBttnPages", vResult[1] ) ) ;
						$( "#dlgXprtBttnPages" ).show() ;
						edinfoTxt 	= ["Found", vResult[1], "pages in import field (length=2)"].join(" ") ;
						edinfoBrdr 	= "lime" ;
						tmpPages 	= tmpArray[1] ;
						$( edInfo ).append( ["<span>", edinfoTxt, "</span>"].join("") ) ; 
					}

					if( vResult[2] > 0 ){
						edinfoTxt 	= ["Found", vResult[2], "errors in import field (length=2)"].join(" ") ;
						edinfoBrdr 	= "orange" ;
						$( edInfo ).append( ["<span>",edinfoTxt,"</span>"].join("") ) ; 
					}

					if( ( vResult[0] > 0 ) && ( vResult[1] > 0 ) ){
						$( "#dlgXprtBttnBoth" ).text( updateBttntxt( "dlgXprtBttnBoth", vResult[0] ) ) ;
						$( "#dlgXprtBttnBoth" ).text( updateBttntxt( "dlgXprtBttnBoth", vResult[1] ) ) ;
						$( "#dlgXprtBttnBoth" ).show() ;
						edinfoTxt 	= "Found both in import field (length=2)"
						edinfoBrdr 	= "lime" ;
						tmpTiles 	= tmpArray[0] ;
						tmpPages 	= tmpArray[1] ;
						$( edInfo ).append( ["<span>",edinfoTxt,"</span>"].join("") ) ; 
					}

					break;

		default: 	console.log("switch(tmpArray.length) > 2" ) ; 
					console.log("tmpArray", tmpArray ) ;
					vResult = itemValidator( tmpArray ) ; 

					if( vResult[0] > 0 ){
						$( "#dlgXprtBttnDials" ).show() ;
						edinfoTxt 	= ["Found", vResult[0], "dials in import field (length>2)"].join(" ") ;
						edinfoBrdr 	= "lime" ;
						tmpTiles 	= tmpArray ;
						$( edInfo ).append( ["<span>", edinfoTxt, "</span>"].join("") ) ; 
					}

					if( vResult[1] > 0){
						$( "#dlgXprtBttnPages" ).show() ;
						edinfoTxt 	= ["Found", vResult[1], "pages in import field (length>2)"].join(" ") ;
						edinfoBrdr 	= "lime" ;
						tmpPages 	= tmpArray ;
						$( edInfo ).append( ["<span>", edinfoTxt, "</span>"].join("") ) ; 
					}

					if( vResult[2] > 0){
						edinfoTxt 	= ["Found", vResult[2], "errors in import field (length>2)"].join(" ") ;
						edinfoBrdr 	= "orange" ;
						$( edInfo ).append( ["<span>", edinfoTxt, "</span>"].join("") ) ; 
					}

					break;
	}

	$( "#jsonXprtTA" ).css("border", "5px solid " + edinfoBrdr ) ;
	$("#jsonXprtDialsLen").text( vResult[0] ) ;
	$("#jsonXprtPagesLen").text( vResult[1] ) ;
	$("#jsonXprtErrorsLen").text( vResult[2] ) ;

}

updateBttntxt = (bttnId,found)=>{
	let ogBttnTxt = $( "#" + bttnId ).text() ;
	let newBttnTxt = [ ogBttnTxt, "(", found, ")" ].join(" " ) ;
	return newBttnTxt ;
}


itemIsPage = ( item )=>{
	try {
		/*
			console.log(
					"itemIsPage item=", item, 
					"\nhas name-key", 	( 	item.name.length > 	3 ),	item.name,
					"has color-key", 	( 	item.color.length == 7 ),	item.color,
					"has matrix-key",  	(	item.matrix.length == 2 ),	item.matrix
			)
		*/	
		return ( 
			( item.name.length > 0 ) && 
			( item.color.length == 7 ) && 
			( item.matrix.length == 2 ) 
		) ;

	} catch (error){
		// console.log("error while check if page", error ) ; 
		//, "item:", item ) ; 
		return false ; 
	}
}


itemIsDial = ( item )=>{
	try {
		/*
			console.log(
				"itemIsDial item=", item, 
				"\nhas name-key", 	( 	item.name.length > 	3 ),		item.name,
				"has index-key", 	( 	parseInt( item.index ) > -1 ),	item.index,
				"has url-key", 		( 	item.url.length > 20 ),			item.url,
				"has pos-key",  	(	item.pos.length == 4 ),			item.pos
			)
		 	We could do more checks, but these are the least we need to create a dial 
		 */
		return ( 
			( item.name.length >= 3 ) 		&& 
			( parseInt( item.index ) > -1 ) && 
			( item.url.length > 10 ) 		&&
			( item.pos.length == 4 ) 
		) ;

	} catch (error){
		// console.log("error while check if dial", error ) ; 
		//, "item:", item ) ; 
		return false ; 
	}
}

importIntoPagesClick = ()=>{ openWarning(1) ; }
importIntoDialsClick = ()=>{ openWarning(2) ; }
importBothClick		 = ()=>{ openWarning(3) ; }

importIntoPages = ( pagesObj )=>{
	appSettings.pages = [];
	for( let p = 0; p < pagesObj.length; p++ ){ 
		if( itemIsPage(pagesObj[p]) && (appSettings.pages.length<=appSettings.maxTabs)){ 
			appSettings.pages.push( pagesObj[p] ); 
		} 
	}
	console.info("appSettings.pages now has ", appSettings.pages.length, "pages")
	set_LS_Pages(appSettings.pages) ;
}

importIntoDials = ( dialsObj )=>{
	appTiles = [];
	let maxTotalDials = parseInt( appSettings.maxTabs * appSettings.maxColumns * appSettings.maxRows ) ;	
	for(let d = 0; d < dialsObj.length; d++ ){
		if( itemIsDial( dialsObj[d] ) && ( appTiles.length <= maxTotalDials ) ){ 
			appTiles.push( dialsObj[d] ) ; 
		}
	} 
	console.info("appTiles now has ", appTiles.length, "dials")
	set_LS_Dials(appTiles) ;
}


itemValidator = ( arrayObj )=>{
	// [ dials, pages, errors ]
	let objVldtr = [0,0,0] ; 
	
	for( let i=0; i < arrayObj.length; i++ ){ 
	
		if( itemIsDial( arrayObj[i] ) ){ 
			objVldtr[0] = objVldtr[0] + 1 ;
		}else if( itemIsPage( arrayObj[i] ) ){
			objVldtr[1] = objVldtr[1] + 1 ;
		}else{
			console.error("itemValidator neither", arrayObj[i] )
			objVldtr[2] = objVldtr[2] + 1 ;
		} 
	} 
	return objVldtr ; 
}


generateJSON = ()=>{
	let allExport 	= [ appTiles, appSettings.pages ] ;
	let allInfo 	= JSON.stringify( allExport, null, 2 ) ;
	$( "#jsonXprtTA"  ).val( JSON.stringify( allExport, null, 2 ) ); 
	updateImportDlgLen() ; 
	$( "#jsonXprtTA"  ).data = allExport ;
	$( "#jsonXprtTA" ).css("background-color","#FFFFFF") ; 
	$( "#jsonXprtTA" ).css("color","#000000") ;
}


$( exportDialog ).dialog({
	autoOpen: false,
	position: { my: "left top", at: "left top", of: "#pageContainer" },
	width: parseInt( screen.width * 0.50 ) ,
	show:{ effect:"blind",   duration: 500 },
	hide:{ effect:"explode", duration: 400 },
	buttons: [
		{ 	text: "Cancel", 
			click: function(){ $( this ).dialog( "close" ) ; }
		}
	]
});


openWarning = (choice)=>{
	$( "#importWarning" ).dialog( "option", "title", "Import and Replace" ) ; 
	$( "#importWarning" ).dialog( "open" ) ; 
}

$( "#importWarning" ).dialog({
	autoOpen: false,
	position: { my: "middle", at: "middle", of: "#JSONDetailsContainer" },
	width: parseInt( screen.width * 0.50 ) ,
	show:{ effect:"blind",   duration: 500 },
	hide:{ effect:"explode", duration: 400 },
	buttons: [
				{ 	text: "Cancel", 
					click: function(){ $( this ).dialog( "close" ) ; }
				},
				{ 	text: "Replace existing dials", 
					click: function(){ importIntoDials(tmpTiles) ; }
				},
				{ 	text: "Replace existing pages", 
					click: function(){ importIntoPages(tmpPages) ; }
				},		
				{ 	text: "Replace both existing pages and dials", 
					click: function(){ importIntoPages(tmpPages) ; importIntoDials(tmpTiles) ; }
				},
				{	text: "Apply (save)",
					click: function(){ 	
						loadInit() ; 
						closeExportDialog() ;
						$( this ).dialog( "close" ) ; 
					}
				}
	]
});
