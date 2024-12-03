/* 
	jhp_actionsDials.js

	version = 202404281500
	
*/

openDial = ( tileIdx )=>{
	console.log("opening dial appSettings.newtab =", appSettings.newtab )
	window.open( appTiles[tileIdx].url , target=appSettings.newtab );
	set_LS_LastVisit(tileIdx) ;
}
