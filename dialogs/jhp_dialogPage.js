/* 
	jhp_dialogPage.js 
*/

let pageDialog = $("#pageDetailsContainer") ;

let closePageDialog = ()=>{ $( pageDialog ).dialog( "close" ); }

$( pageDialog ).dialog({
	autoOpen: false,
	width: parseInt( screen.width * 0.50 ), 
	show:{ effect:"blind",   duration: 500 },
	hide:{ effect:"explode", duration: 400 },
	buttons: [
		{ 	text: "OK",
			click: function(){

				console.log("$( pageDialog ).dialog -> appSettings.activePage: ", appSettings.activePage , "\nparseInt( $( #pageNameSelect ).attr(pgindex)): ", $( "#pageNameSelect" ).attr("pgindex")  ) ;

				let pgIndex =  parseInt( $( "#pageNameSelect" ).attr("pgindex") ) || appSettings.activePage ;
				let newTab = {
						"name":  $( "#pageNameSelect" ).val(),
						"color": $("#pageBGCSelect").val(),
						"matrix": [ parseInt( $("#pageRowSelect").val() ), parseInt( $("#pageClmnSelect").val() )]
				}

				if( appSettings.pages[pgIndex] ){
					appSettings.pages[pgIndex] = newTab ;
				}else{
					appSettings.pages.push( newTab ) ;					
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
	let title = "Add Page (" + (pg+1).toString() + ")" ;
	
	if( pg == 99 ){
		/* New Page */
		chosenPage = { "name": "newPage", "color": "#D0D0D0", "matrix": [4,4] } ;
	}else{
		/* Existing Page */
		chosenPage = appSettings.pages[ pg ] ;
		title = "Edit Page[" + (pg+1).toString() + "]-" + chosenPage.name ;
	}

	$( "#pageNameSelect" ).attr("placeholder", chosenPage.name) ;
	$( "#pageNameSelect" ).attr("pgindex", pg.toString() ) ;
	$( "#pageNameSelect" ).text( chosenPage.name ) ; 
	$( "#pageNameSelect" ).val( chosenPage.name ) ; 

	$( "#pageRowSelect option[value=" +chosenPage.matrix[0].toString()+"]").prop("selected" , true ) ;
	$( "#pageClmnSelect option[value="+chosenPage.matrix[1].toString()+"]").prop("selected" , true ) ;

	$( "#pageBGCSelect").value = chosenPage.color;
	$( "#pageBGCSelect").placeholder = chosenPage.color;

	$( pageDialog ).dialog( "option", "title", title ) ; 
	$( pageDialog ).dialog( "open" ) ; 
}

