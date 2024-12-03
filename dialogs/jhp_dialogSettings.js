/* 
	jhp_dialogSettings.js 

	version 20241129-18h00

	Handles all dialog activity for the settings in appSettings
	The tile locator will check all dials , 
		if the position matches (page/row/column) it will return the dial that is clicked.
		if no match is found in appTiles, a dialTemplate is returned having index 999

*/

let settingDialog = $("#settingsDetailsContainer") ;

let closeSettingDialog = ()=>{ $( settingDialog ).dialog( "close" ); }

let openSettingDialog 	= ()=>{ 

	console.log("opening dialog for Settings ", appSettings ) ;

	dialogInputStates()

	$("#dlg-sttngs-maxRows").val( appSettings.maxRows ) ;
	$("#dlg-sttngs-maxRows").attr("placeholder", appSettings.maxRows ) ; 

	$("#dlg-sttngs-maxCols").val( appSettings.maxColumns ) ;
	$("#dlg-sttngs-maxCols").attr("placeholder", appSettings.maxColumns ) ;

	$("#dlg-sttngs-maxTabs").val( appSettings.maxTabs ) ;
	$("#dlg-sttngs-maxTabs").attr("placeholder", appSettings.maxTabs ) ;

	$("#dlg-sttngs-maxToasts").val( appSettings.maxToasts ) ;
	$("#dlg-sttngs-maxToasts").attr("placeholder", appSettings.maxToasts ) ;

	$("#dlg-sttngs-newTab").val( appSettings.newTab ) ;
	$("#dlg-sttngs-newTab").attr("placeholder", appSettings.newTab ) ;

	$("#dlg-sttngs-BGClr").val( appSettings.appBGColor ) ;
	$("#dlg-sttngs-BGClr").attr("placeholder", appSettings.appBGColor ) ;

	$("#dlg-sttngs-FGClr").val( appSettings.appFGColor ) ;
	$("#dlg-sttngs-FGClr").attr("placeholder", appSettings.appFGColor ) ;

	$("#dlg-sttngs-nav").val( appSettings.nav ) ;
	$("#dlg-sttngs-nav").attr("placeholder", appSettings.nav ) ;

	dialogInputStates()
	$( settingDialog ).dialog( "option", "title", "Settings" ) ; 
	$( settingDialog ).dialog( "open" ); 
}


dialogInputStates = ()=>{
	console.log( "dialogInputStates maxRows: ", $("#dlg-sttngs-maxRows").val() ) ;
	console.log( "dialogInputStates maxCols: ", $("#dlg-sttngs-maxCols").val() ) ;
	console.log( "dialogInputStates maxTabs: ", $("#dlg-sttngs-maxTabs").val() ) ;
	console.log( "dialogInputStates maxToasts:",$("#dlg-sttngs-maxToasts").val() ) ;
	console.log( "dialogInputStates newTab: ", 	$("#dlg-sttngs-newTab").val() ) ;
	console.log( "dialogInputStates BGClr: ", 	$("#dlg-sttngs-BGClr").val() ) ;
	console.log( "dialogInputStates FGClr: ", 	$("#dlg-sttngs-FGClr").val() ) ;
	console.log( "dialogInputStates NAV: ", 	$("#dlg-sttngs-nav").val() ) ;
}


$( settingDialog ).dialog({
	autoOpen: false,
	position: { my: "left top", at: "left top", of: "#pageContainer" },
	width: parseInt( screen.width * 0.75 ) ,
	show:{ effect:"blind",duration:500 },
	hide:{ effect:"explode",duration:500 },
	buttons: [
		{	
			text: "Change",
			click: function(){

				console.log( "settingDialog -CHANGE - START: ", "#"*60 ) ;
				console.log( "settingDialog -CHANGE - START formdata: ", dialogInputStates() ) ;

				appSettings.maxRows = parseInt( $("#dlg-sttngs-maxRows").val() ) ;
				appSettings.maxColumns = parseInt( $("#dlg-sttngs-maxCols").val() ) ;
				appSettings.maxTabs = parseInt( $("#dlg-sttngs-maxTabs").val() ) ;
				appSettings.maxToasts 	= parseInt( $("#dlg-sttngs-maxToasts").val() ) ;
				appSettings.newtab 	=  $("#dlg-sttngs-newTab").val().toString() ;
				appSettings.appBGColor 	= $("#dlg-sttngs-BGClr").val() ;
				appSettings.appFGColor 	= $("#dlg-sttngs-FGClr").val() ;
				appSettings.nav 	= $("#dlg-sttngs-nav").val() ;

				console.log( "settingDialog -CHANGE - AFTER appSettings: ", appSettings ) ;
				loadInit() ;
				$( this ).dialog( "close" ) ; 
			}
		},{
			text: "Reset", 
			click: function(){ 
				console.log( "settingDialog -RESET: " ) ;

				$( this ).dialog( "close" ) ; 
			} 
		},{ 
			text: "Cancel", 
			click: function(){ 
				console.log( "settingDialog -CANCEL: " ) ;

				$( this ).dialog( "close" ) ; 
			} 
		}
	]
});


