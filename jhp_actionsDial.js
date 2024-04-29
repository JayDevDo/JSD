/* 
	jhp_actionsDials.js

	version = 202404281500
	
*/


/* 	re-order pages/dials */
dragButton = ()=>{

	$( "button" ).draggable();
	
	$( ".pageTable" ).droppable(
		{	drop: 	function( event, ui ) {
						$( this )
							.addClass( "ui-state-highlight" )
							.find( "p" )
							.html( "Dropped!" );
					}
		}
	)

}


openDial = ( tileIdx )=>{
	window.open( appTiles[tileIdx].url , target=appSettings.newtab );
	set_LS_LastVisit(tileIdx) ;
}
