/* 
	jhp_builds.js
	version = 20241211 - 20h00
*/ 

const bttnWdthPerc = 0.82;
const bttnHghtPerc = 0.68;

console.log("jhp_builds.js.load currentState:", currentState("jhp_builds-ON-LOAD") );

selectCell = ( pos )=>{
	// console.log("selectCell called with: ", pos.toString(),"count:", $("#pageContainer .pageDial[pgidx="+pos[0].toString()+"] .pageTable").length );
	if( $( "#pageContainer .pageDial[pgidx=" + pos[0].toString() + "] .pageTable").length == 1 ){

		let jqTable  = $( "#pageContainer .pageDial[pgidx=" + pos[0].toString() + "] .pageTable tbody") ;
		let tblRows  = $( jqTable ).find( "tr" ).eq( pos[1] ) ; 
		let tblRCell = $( tblRows ).find( "td" ).eq( pos[2] ) ;
		if( tblRCell.length == 1 ){ 
			return tblRCell; 
		}

	}else{
		console.log( "selectCell non existing table" ) ;
	}
}

const selectPage 	= ( pgIndex )=>{ return $( "#pageContainer .pageDial[pgidx="+pgIndex.toString()+"]"); }
const selectTable 	= ( pgIndex )=>{ return $( "#linkContainer .pageTable[pgidx='"+pgIndex.toString()+"'] tbody"); }

removePage 	= ( pgIndex )=>{
	$( "#pageContainer .pageDial[pgidx="+pgIndex.toString()+"]").remove() ;
	//console.log( "removed Page", pgIndex ); 
}

removeTab 	= ( pgIndex )=>{ 
	$( "#linkContainer .pageTab[pgidx="+ pgIndex.toString()+"]").remove() 
	//console.log( "removed Tab ", pgIndex ); 
}


makePlaceholder = ( pgIndex, rowIndex, columnIndex )=>{
	let plcHldrArr 	= [ 
		"<button class='dialPlaceholder'",
		" onClick='openDialDialog(", pgIndex, "," , rowIndex, "," , columnIndex, ")'",
		" pgidx=", pgIndex,
		" rwidx=", rowIndex,
		" clmidx=", columnIndex,
		" ><span>add dial</span></button>"
	].join("") ; 
	
	let jqPlchldr 	= $( plcHldrArr ) ; 
	$(jqPlchldr).css("backgroundColor", "#000033" ) ;
	$(jqPlchldr).css("color", "#808080" ) ;
	$(jqPlchldr).css("width",  parseInt((screen.width * bttnWdthPerc ) / appSettings.pages[ pgIndex ]["matrix"][1] ) ) ;
	$(jqPlchldr).css("height", parseInt((screen.height* bttnHghtPerc ) / appSettings.pages[ pgIndex ]["matrix"][0] ) ) ;
	return $( jqPlchldr ) ;
}

buildPages = ( pgArray )=>{
	for( let pgi = 0; pgi < pgArray.length; pgi++ ){
		let newPage = buildPage( pgi ) 	; 
		let newTab 	= buildTab( pgi ) 	;
		$( "#pageContainer" ).append( $( newPage )) ;
		$( "#linkContainer" ).append( $( newTab  )) ;
	}
}

buildTab = ( pgIndex )=>{
	removeTab(pgIndex) ;
	let linkArray = [ 
		"<li class='pageTab' pgidx=", pgIndex.toString(), 
		" onClick='showPage(", pgIndex.toString(), ")' >",
		"<h3 style='background-color:", appSettings.pages[ pgIndex ]['color'], "' >", 
		"<img class='editPageImg' src='img/edit_50x50_tp.jpg' width='24px' height='24px' alt='edit' ",
		" onClick='openPageDialog(", pgIndex.toString() , ")' ></img>", appSettings.pages[ pgIndex ]["name"], 
		"</h3></li>"].join("") ;
	return $( linkArray ) ;
}

buildTable = ( pgIndex )=>{
	let baseTable = [ "<table class='pageTable' >" ] ;
	for( let trnr=0; trnr < appSettings.pages[pgIndex]["matrix"][0]; trnr++){
		baseTable += "<tr>" ;
		for(let tdnr=0;tdnr<appSettings.pages[pgIndex]["matrix"][1];tdnr++){ baseTable += "<td>new dial</td>" ; }
		baseTable += "</tr>" ;
	}
	baseTable += "</table>" ;
	// console.log("returning table", $(baseTable) );
	return baseTable ;
}

buildPage = ( pgIndex )=>{
	removePage( pgIndex ) ;
	let newTable = buildTable( pgIndex ) ;
	let pageArr = [ 
		"<div class='pageDial' pgidx=", pgIndex.toString(), 
		" style='background-color: ", appSettings.pages[ pgIndex ]["color"], 
		"' >", newTable, "</div>"
	].join("") ;
	// console.log("returning page", $(pageArr) ) ;
	return $( pageArr ) ;
}


newMakeButton = ( pgIndex, tileIdx, tile )=>{

	// dialSize = [ w, h ]
	let pgMatrix 	= appSettings.pages[ pgIndex ]["matrix"] ;
	let dialSize 	= [ parseInt( (screen.width * bttnWdthPerc ) / pgMatrix[1] ), parseInt( (screen.height* bttnHghtPerc) / pgMatrix[0] ) ];
	
	let tileDiv = $( [ "<div class='dialDiv' >","</div>" ].join("")  ) ;
	$( tileDiv ).css( "width", dialSize[0] ) ;
	$( tileDiv ).css("height", dialSize[1] ) ;
	$( tileDiv ).css("background-color", tile.bgClr ) ;
	$( tileDiv ).css("color", tile.fgClr ) ;

	let launchBttnArr = $( [
		"<button onClick=openDial(", tileIdx , ") onContextmenu='openDialDialog(", tile.pos, ")' >",
		"<h3 style='color: inherit;' >", tile.name, "</h3></button>"
	].join("") ) ;

	$( launchBttnArr ).css( "width", parseInt( dialSize[0] * 0.95  ) ) ;
	$( launchBttnArr ).css("height", parseInt( dialSize[1] * 0.85  ) ) ;
	$( launchBttnArr ).css("background-color",  "transparent"  ) ; // tile.bgClr 
	$( launchBttnArr ).css("color", tile.fgClr ) ;

	let actnBttnW = parseInt( dialSize[0] * 0.175 ) ;
	let actnBttnH = parseInt( dialSize[1] * 0.125 ) ;

	let editBttnArr = $( [ "<button class='dialActionBttn' onClick='openDialDialog(", tile.pos,")' ><span class='ui-icon ui-icon-pencil'>", "EDIT", "</span>", "</button>"].join("") ) ;
	$( editBttnArr ).css( "width", actnBttnW ) ;
	$( editBttnArr ).css( "height", actnBttnH ) ;
	$( editBttnArr ).css( "background-color", "transparent" ) ; // tile.fgClr  
	$( editBttnArr ).css( "color", tile.fgClr  ) ; // tile.bgClr

	let removeBttnArr = $( [ "<button class='dialActionBttn' onClick='openDialDialog(", tile.pos,")' ><span class='ui-icon ui-icon-trash' >", "DEL", "</span>", "</button>"].join("") ) ;
	$( removeBttnArr ).css( "width", actnBttnW ) ;
	$( removeBttnArr ).css( "height", actnBttnH ) ;
	$( removeBttnArr ).css( "background-color", "transparent" ) ; // tile.fgClr
	$( removeBttnArr ).css( "color", tile.fgClr ) ;

	let tileActionsDiv 	= $( [ "<div class='dialActionDiv' >","</div>" ].join("") ) ;
	$( tileActionsDiv ).css( "display", 	"row" 				) ;
	$( tileActionsDiv ).css( "width", 	dialSize[0] 		) ;

	$( tileActionsDiv ).append( removeBttnArr ) ;
	$( tileActionsDiv ).append( editBttnArr ) ;
	$( tileActionsDiv ).css( "background-color", "transparent" ) ; 	// tile.bgClr
	$( tileActionsDiv ).css( "color", tile.fgClr ) ; 	// tile.fgClr

	$( tileDiv ).append( launchBttnArr ) ;
	$( tileDiv ).append( tileActionsDiv ) ;

	return $( tileDiv );
}

