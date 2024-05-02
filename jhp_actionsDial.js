/* 
	jhp_actionsDials.js

	version = 202404281500
	
*/

openDial = ( tileIdx )=>{
	window.open( appTiles[tileIdx].url , target=appSettings.newtab );
	set_LS_LastVisit(tileIdx) ;
}
