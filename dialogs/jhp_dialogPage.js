/* 
	jhp_dialogPage.js 
*/

let pageDialog = $("#pageDetailsContainer") ;

let closePageDialog = ()=>{ $( pageDialog ).dialog( "close" ); }

$( pageDialog ).dialog({
	autoOpen: false,
	show:{ effect:"blind",   duration: 500 },
	hide:{ effect:"explode", duration: 400 },
	buttons: [
		{ 	text: "OK",
			click: function(){

				let pgIndex =  parseInt( $( "#pageNameSelect" ).attr("pgindex") ) || 99 ;
				let newTab = {
						"name":  $( "#pageNameSelect" ).val(),
						"color": $("#pageBGCSelect").val(),
						"matrix": [ parseInt( $("#pageRowSelect").val() ), parseInt( $("#pageClmnSelect").val() )]
				}

				if( pgIndex == 99 ){
					appSettings.pages.push( newTab ) ;
				}else{
					appSettings.pages[pgIndex] = newTab ;
					/* Add validator for shrinking size */
				}

				set_LS_Pages( appSettings.pages ) ;
				loadInit() ;
				$( this ).dialog( "close" );
			}
		},
		{ 	text: "Delete", 
			click: function(){ 
				let pgIndex =  parseInt( $( "#pageNameSelect" ).attr("pgindex") ) ;
				appSettings.pages.splice( pgIndex, 1 );
				set_LS_Pages( appSettings.pages ) ;
				loadInit() ;
				$( this ).dialog( "close" ); 
			} 
		},
		{	text: "Cancel", click: function(){ $( this ).dialog( "close" ); } }
	]
});



let openPageDialog 	= ( pg )=>{ 
	
	let chosenPage = {} ;
	let title = "Add Page (" + pg.toString() + ")" ;
	
	if( pg == 99 ){
		/* New Page */
		chosenPage = { "name": "new page", "color": "#000000", "matrix": [4,4] } ;
	}else{
		/* Existing Page */
		chosenPage = appSettings.pages[ pg ] ;
		title = "Edit Page[" + pg.toString() + "]-" + chosenPage.name ;
	}

	$( "#pageNameSelect" ).attr("placeholder", chosenPage.name) ;
	$( "#pageNameSelect" ).attr("pgindex", pg ) ;
	$( "#pageNameSelect" ).text( chosenPage.name ) ; 
	$( "#pageNameSelect" ).val( chosenPage.name ) ; 

	$( "#pageRowSelect option[value=" +chosenPage.matrix[0].toString()+"]").prop("selected" , true ) ;
	$( "#pageClmnSelect option[value="+chosenPage.matrix[1].toString()+"]").prop("selected" , true ) ;

	$( "#pageBGCSelect").value = chosenPage.color ; 

	$( pageDialog ).dialog( "option", "title", title ) ; 
	$( pageDialog ).dialog( "open" ) ; 
}




