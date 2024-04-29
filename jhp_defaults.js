/* 
	jhp_defaults.js

	version = 202404281500

	Initial and fall-back settings, pages and dials.

	appSettings{
		"newtab":[	_blank	URL is loaded into a new window, or tab. This is the default
					_parent	URL is loaded into the parent frame
					_self	URL replaces the current page
					_top	URL replaces any framesets that may be loaded
				]
		"nav": ["Vert","Hori"] 	
	}

*/

let atDefault = [
	{	
		"index":0,
		"name": "search DDG",
		"url": "https://duckduckgo.com/?q=entersearchstringhere&df=y&ia=web",
		"bgClr": "#000000",
		"fgClr": "#FFFFFF",
		"pos": [0, 1, 0, true ],
		"lstVst": ""
	},{
		"index":1,
		"name": "Jays Speed Dial on github",
		"url": "https://github.com/JayDevDo/JSD",
		"bgClr": "#FF7800",
		"fgClr": "#000000",
		"pos": [0, 0, 0, true ],
		"lstVst": ""
	},{	
		"index":2,
		"name": "about:about",
		"url": "about:about",
		"bgClr": "#000000",
		"fgClr": "#FFFFFF",
		"pos": [0,0,2, true],
		"lstVst": ""
	}
];

sortByPosition = ( dialContainer )=>{

	let retArr = dialContainer.sort(

		( dial1, dial2 )=>{

			let retval = 0 ;
			if( dial1.pos == dial2.pos ){ console.log("identical dial positions for ", dial1, "and ", dial2 ); }

			let d1Pg  = parseInt( dial1.pos[0] ) ;
			let d2Pg  = parseInt( dial2.pos[0] ) ;

			if( d1Pg < d2Pg ){ 			retval = -1 ;
			}else if( d1Pg > d2Pg ){ 	retval = 1 	;
			}else{

				let d1Row = parseInt( dial1.pos[1] ) ;
				let d2Row = parseInt( dial2.pos[1] ) ;

				if( d1Row < d2Row ){ 		retval = -1 ;
				}else if( d1Row > d2Row ){ 	retval = 1 	;
				}else{
					let d1Clm = parseInt( dial1.pos[2] ) ;
					let d2Clm = parseInt( dial2.pos[2] ) ;

					if ( parseInt(d1Clm) < parseInt(d2Clm) ){ retval = -1; }
					if ( parseInt(d1Clm) > parseInt(d2Clm) ){ retval = 1; }
				}
			}

			return retval ;
		}
	) ;

	return retArr;
}


tilesPageFilter = ( pgIndex )=>{

	let pageDials = [];

	for( let d = 0; d < appTiles.length; d++){

		// console.log("tilesPageFilter pg= ", pgIndex, " dial#", d, " name: ", appTiles[d].name , " pinned: ", appTiles[d].pos[3] ) ;

		if( ( appTiles[d].pos[0] == pgIndex ) ){

			pageDials.push( appTiles[d] );

		}

	}

	console.info("returning ", pageDials.length, " dials for page ", pgIndex ) ;
	return pageDials ;

}

appTiles 	= sortByPosition( atDefault ) ;


handleDelete = (dialIndex)=>{

	console.info( "handleDelete (", dialIndex, ") maxDeleted=", appSettings.maxDeleted, "currentState at the start of handleDelete", currentState() ) ;
	console.log("handleDelete appTiles[dialIndex] = ",  appTiles[dialIndex] ) ;

	let toastMsg 	=	[ appTiles[dialIndex].name , " was moved to deletedDials. Reload the page (F5) to see the changes." ].join("") ;
	myToaster( toastMsg ) ;

	let dialPage 	= 	appTiles[dialIndex].pos[0] ; 
	let deletedDial =	appTiles.splice( dialIndex, 1 ) ;
	console.log( "del_LS_All DIALX", dialIndex, "page:", dialPage ," after deletedDial = ", deletedDial , " tempDials=", appTiles.length ) ;

	deletedDials.push( deletedDial ) ;
	set_LS_Dials( appTiles ) ;

	console.info("currentState at the end of handleDelete", currentState() ) ; 
	loadInit() ;
}


currentState = ()=>{
	return {
		"appSettings": 	appSettings,
		"appDials": 	appTiles.length,
		"deleted": 		deletedDials.length
	}
}

const newDialTemplate = (p,r,c)=>{ 
	return {
		"index": 999,
		"name": "new dial",
		"url": "https://",
		"bgClr": "#000000",
		"fgClr": "#FFFFFF",
		"pos": [ p, r, c ],
		"lstVst": "",
		"thumbUri": ""
	}
}

tileLocator = (p,r,c)=>{
	/* 
		requires p=pageIndex, r=rowIndex, c=columnIndex.
		tileLocator returns the dial having the .pos attributes that match the given parameters.
		if no apptile matches the parameters a new dial (newDialTemplate) is returned.
	*/

	for( let d = 0; d < appTiles.length; d++){
		
		if((appTiles[d].pos[0]==p)&&(appTiles[d].pos[1]==r)&&(appTiles[d].pos[2]==c) ){ 
			return appTiles[d]; 
		}
	}

	return newDialTemplate( p, r, c ) ;
}

validAppRowPos 	= (rw)=>{  return (  rw <= appSettings.maxRows ); }
validAppClmnPos = (clm)=>{ return ( clm <= appSettings.maxCols ); }
validAppTabPos 	= (pg)=>{  return (  pg <= appSettings.maxTabs ); }

validPgRowPos 	= (pg, rw )=>{ return (  rw <= appSettings.pages[pg]["matrix"][0] ); }
validPgClmnPos 	= (pg, clm)=>{ return ( clm <= appSettings.pages[pg]["matrix"][1] ); }

console.log(
	"jhp_defaults loaded.", 
	"\ncurrentState: ", currentState(),
	"\n\nNext up --> jhp_localStorage.js"
) ;
