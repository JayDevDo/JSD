/* 
	jhp_dialogDial.js 
*/

let activeDial = ""

let dialDialog = $("#dialDetailsContainer") ;

let closeDialDialog = ()=>{ $( dialDialog ).dialog( "close" ); }

let openDialDialog 	= (p,r,c)=>{ 
	activeDial = tileLocator( p, r, c ) ;
	let chosenDial 	= tileLocator( p, r, c ) ;
	let editOrAdd 	= (chosenDial.name == "new dial")? "Add new dial":"Edit: " + chosenDial.name ;
	let urlWidth 	= parseInt( 250 + (chosenDial.url.length * 4) ) ;

	dialDialog.attr("dlgdialidx", chosenDial.index ) ; 

	console.log(
		"opening dialog for dial ", [p, r, c], 
		"editOrAdd: ", editOrAdd,
		"tileLocator gives:\n", chosenDial,
		"dlgdialidx",  chosenDial.index ,
		"\nurl len:", chosenDial.url.length,
		"predict: ", urlWidth
	 ) ;

	$( "#dialNameSelect" ).attr("placeholder", chosenDial.name) ;
	$( "#dialNameSelect" ).attr("dlIndex", chosenDial.index) ;
	$( "#dialNameSelect" ).text( chosenDial.name ) ; 
	$( "#dialNameSelect" ).val( chosenDial.name ) ; 

	$( "#dialRowSelect option[value="+chosenDial.pos[1]+"]").prop("selected" , true ) ;
	$( "#dialClmnSelect option[value="+chosenDial.pos[2]+"]").prop("selected" , true ) ;

	$( "#dialURLSelect"  ).attr("placeholder", chosenDial.url ) ; 
	$( "#dialURLSelect"  ).text( chosenDial.url ) ; 
	$( "#dialURLSelect"  ).val( chosenDial.url ) ; 
	$( "#dialURLSelect"  ).css( "width", urlWidth ) ; 

	$( "#dialBGClrSelect").val( chosenDial.bgClr ) ; 
	$( "#dialBGClrSelect").attr("placeholder", chosenDial.bgClr ) ; 

	$( "#dialFGClrSelect").val( chosenDial.fgClr ) ; 
	$( "#dialFGClrSelect").attr("placeholder", chosenDial.fgClr ) ; 

	if( chosenDial.name == "new dial"  ){

	}

	$( dialDialog ).dialog( "option", "title", editOrAdd ) ; 
	$( dialDialog ).dialog( "open" ); 
}



$( dialDialog ).dialog({
	autoOpen: false,
	position: { my: "left top", at: "left top", of: "#pageContainer" },
	width: parseInt( screen.width * 0.50 ) ,
	show:{ effect:"blind",duration:500 },
	hide:{ effect:"explode",duration:500 },
	buttons: [
		{	
			text: "Apply",
			click: function(){

				let dialIndex = parseInt( $( "#dialNameSelect" ).attr("dlindex") ) || 999 ;
				let newDial = 	{
					"index": 	dialIndex,
					"name": 	$( "#dialNameSelect" ).val(),
					"url": 		$( "#dialURLSelect"  ).val(),
					"bgClr": 	$( "#dialBGClrSelect").val(),
					"fgClr":  	$( "#dialFGClrSelect").val(),
					"pos": [ 
						appSettings.activePage,
						parseInt( $( "#dialRowSelect").val() ),
						parseInt( $( "#dialClmnSelect").val() ),
						( $("#dialPinnedSelect:checked").length == 1 )
					],
					"lstVst": 	"" + new Date().toISOString() 
				}

				if( dialIndex == 999 ){
					console.log("Adding a new dial") ;
					newDial.index = appTiles.length ;
					appTiles.push( newDial ) ;
				}else{
					console.log("Editing existing dial ", dialIndex) ;
					appTiles[dialIndex] = newDial ;
				}

				console.log( 
					"dialDialog -APPLY: ", 
					"dlIndex", dialIndex, 
					"activePage", appSettings.activePage, 
					"newDial ", newDial
				) ;

				set_LS_Dials( appTiles ) ; 
				loadInit() ;
				$( this ).dialog( "close" ) ; 
			}
		},{
			text: "Delete", 
			click: function(){ 
				let dialIndexDel = parseInt( $( "#dialNameSelect" ).attr("dlindex") ) || 999 ;				
				console.log("deleting idx", dialIndexDel );
				console.log("deleting dial ", appTiles[dialIndexDel] ) ;
				$( this ).dialog( "close" ) ; 
				handleDelete( dialIndexDel ) ;
			} 
		},{ 
			text: "Cancel", 
			click: function(){ 
				$( this ).dialog( "close" ) ; 
			} 
		}
	]
});

// https://duckduckgo.com/?q=entersearchstringhere&df=y&ia=web