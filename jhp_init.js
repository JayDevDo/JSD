/* 
	jhp_init.js
	version = 20241211 - 20h00
*/ 

console.log("jhp_init.js -> on_load:  currentState: ", currentState("jhp_init-ON-LOAD") ) ;

/* 	first build	 */

loadInit = ()=>{

	console.log("jhp_init.js -> loadInit.start:  currentState: ", currentState("jhp_init-loadInit-START") ) ;

	if( $("#pageContainer") ){

		// Add pages
		console.log("jhp_init-loadInit--> appSettings.pages before buildPages: ", appSettings.pages.length ) ;
		buildPages( appSettings.pages ) ;
		console.log( "we have", $( "table.pageTable" ).length , "pages" ) ;

		for( let nt = 0; nt < appTiles.length; nt++ ){
			// newMakeButton
			// let newButton 	= makeButton( appTiles[nt].pos[0], nt, appTiles[nt], false ) ; 
			// Re-index the appTiles.
			appTiles[nt].index = nt ;
			let newButton 	= 	newMakeButton( appTiles[nt].pos[0], nt, appTiles[nt] ) ; 
			let trgtCell 	= selectCell( appTiles[nt].pos ) ;
			$(trgtCell).text( "" ) ;
			newButton.appendTo( trgtCell ) ;
		}

		// Add placeholders for empty slots
		let allCells = $( "tr td" ) ;
		console.log( "allCells: ", allCells.length ) ;

		$.each(
			allCells,
			function( i, tcell ){ 

				if( $( tcell ).text() == "new dial" ){

					let thisPageIdx = $( tcell ).closest( ".pageDial" ).attr( "pgidx" ) ;
					let thisRowIdx 	= $( tcell ).closest("tr").index() ;
					let thisCellIdx = $( tcell ).index() ;
					// console.log("allCells: tcell->",i, $(tcell).text(), "thisPageIdx", thisPageIdx, "thisRowIdx", thisRowIdx, "thisCellIdx", thisCellIdx ); 
					let placeHolder = makePlaceholder( thisPageIdx, thisRowIdx, thisCellIdx ) ;
					$( tcell ).text("") ;
					$( tcell ).append( placeHolder ) ; 
				}

			}
		);

		if( validAppTabPos( appSettings.pages.length + 1 ) ){
			$( "#pageAddOption" ).show() ;
		}else{
			$( "#pageAddOption" ).hide() ;
		}


		if( appSettings.nav == "Hori" ){
			$( "#navi" ).removeClass( "navVert" );
			$( "#pageContainer" ).removeClass( "pcVert" );
		}else{
			$( "#navi" ).removeClass( "navHori" );
			$( "#pageContainer" ).removeClass( "pcHori" );
		}

		$( "#navi" ).addClass( "nav" + appSettings.nav );
		$( "#pageContainer" ).addClass( "pc" + appSettings.nav ) ;

		showPage( appSettings.activePage ) ;
	}

}


loadInit();
