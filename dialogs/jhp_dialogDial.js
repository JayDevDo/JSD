/* 
	jhp_dialogDial.js 
	version = 20241211 - 20h00

	Handles all dialog activity for Dials (aka. tiles, actually buttons )
	The tile locator will check all dials , 
		if the position matches (page/row/column) it will return the dial that is clicked.
		if no match is found in appTiles, a dialTemplate is returned having index 999

*/

const dialIndexInAppTiles = (dialIndexStr)=>{

	if( appTiles.length>0){
		console.log("dialIndexInAppTiles appTiles YES") ;

		for( let t=0; t<appTiles.length; t++ ){
			if( parseInt(appTiles[t].index) == parseInt( dialIndexStr ) ){
				return t;
			}
		}

		return -1;

	}else{

		console.log("dialIndexInAppTiles appTiles NO") ;

	}
}


let activeDial = ""

let dialDialog = $("#dialDetailsContainer") ;

let closeDialDialog = ()=>{ $( dialDialog ).dialog( "close" ); }

let openDialDialog 	= (p,r,c)=>{ 

	activeDial = tileLocator( p, r, c ) ;
	let chosenDial 	= activeDial;
	let editOrAdd 	= (chosenDial.name == "new dial")? "Add new dial":"Edit: " + "#"+chosenDial.index + "-" + chosenDial.name ;
	let urlWidth 	= parseInt( screen.width * 0.40 ) ;

	console.log(
		"opening dialog for dial ", [p, r, c], 
		"editOrAdd: ", editOrAdd,
		"tileLocator gives:\n", chosenDial,
		"urlWidth:", urlWidth
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
					newDial.index = appTiles.length ;
					console.log("Adding a new dial #", newDial.index) ;
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
				activeDial = ""
				$( this ).dialog( "close" ) ; 
			}
		},{
			text: "Delete", 
			click: function(){ 
				let indexOfDial = dialIndexInAppTiles( activeDial.index.toString() ) ;
				console.log("deleting appTiles[", indexOfDial, "] \n", appTiles[indexOfDial ] ) ;
				handleDelete( indexOfDial ) ;
				activeDial = ""
				$( this ).dialog( "close" ) ; 
			} 
		},{ 
			text: "Cancel", 
			click: function(){ 
				activeDial = ""
				$( this ).dialog( "close" ) ; 
			} 
		}
	]
});

// https://duckduckgo.com/?q=entersearchstringhere&df=y&ia=web