/* 
	jhp_localStorage.js
	
	version = 202404281500

	Loads or creates localstorage objects.
	If existing LS, then LS will be used.
	No LS available (incl. errors on loading values)?
	Check for json files. -> 	
		Y: load json (user_dials.json and/or user_pages.json) into LS.
		N: load defaults (jhp_defaults.js) into LS.
*/

// console.log("jhp_localStorage.js -> on_load:  currentState: ", currentState() ) ;

/* 
#############
# 	GLOBAL	#
#############
*/

hasLclStrg = ()=>{ return ( localStorage.length > 0 ) ; }

del_LS_All = ()=>{ console.log("del_LS_All ALL");localStorage.clear();}

set_LS_Base = ()=>{
	/* Check for json here */
	localStorage.pages = JSON.stringify([]) ;
	localStorage.dials = JSON.stringify([]) ;
	localStorage.actPg = JSON.stringify(0)  ;
}


/* 
#############
# 	PAGES 	#
#############
*/

hasLclStrgPgs = ()=>{ 

	if( hasLclStrg() ){
		try {
			console.log("hasLclStrgPgs localStorage.pages ", localStorage.pages );
			return true ;
		} catch (error) {
			console.error("hasLclStrg error",error,"\nappSettings.pages",appSettings.pages);
			/* Check for json here */
			set_LS_Pages(appSettings.pages);
		}
	}
}

del_LS_Pages = ()=>{console.log("del_LS_All PAGES");localStorage.removeItem["pages"];}

set_LS_Pages = (pagesArray)=>{ 
	del_LS_Pages();
	localStorage.pages = JSON.stringify( pagesArray );
}

get_LS_Pages = ()=>{
	if( hasLclStrgPgs() ){
		return JSON.parse( localStorage.pages ) ; 
	}else{
		console.log("get_LS_Pages no LS pages appSettings.pages:", appSettings.pages.length ); 
		if(appSettings.pages>0){ set_LS_Pages( appSettings.pages ) ; }
		return appSettings.pages ; 
	}
}


/* 
#########################
# 	DIALS 		Global 	#
#########################
*/
hasLclStrgDls = ()=>{ return ( localStorage.dials.length > 0 ) ; }

del_LS_Dials = ()=>{
	console.log("del_LS_All DIALS") ;
	localStorage.removeItem["dials"] ;
}

set_LS_Dials = ( dialArray )=>{
	del_LS_Dials() ;
	localStorage.dials = JSON.stringify(  dialArray ) ;	
}

get_LS_Dials = ()=>{
	if(  hasLclStrgDls() ){
		return JSON.parse( localStorage.dials );
	}else{
		console.log("No LS Dials ", appTiles.length ) ;
		if(appTiles.length>0){ set_LS_Dials( appTiles ); }
		return appTiles ;
	}
}


/* 
#########################
# 	DIALS 	individual 	#
#########################
*/
del_LS_DialX = ( dialIdx )=>{
	let tempDials = get_LS_Dials()
	console.log( "del_LS_All DIALX", dialIdx, "before len tempDials=", tempDials.length );
	console.log("del_LS_All DIALX",  tempDials[dialIdx] ) ;
	let deletedDial = tempDials.splice( dialIdx, 1);
	console.log( "del_LS_All DIALX", dialIdx, "after len newDials = ", deletedDial.length , " tempDials=", tempDials.length );
	set_LS_Dials(tempDials)
	loadInit()
}



/* 
#################
#	activePage	#
#################
*/

hasLclStrgActPg = ()=>{ return ( localStorage.actPg != "undefined" ) ; }

del_LS_ActPg = ()=>{
	console.log("del_LS_actPg") ;
	localStorage.removeItem["actPg"] ;
}

set_LS_ActPg = ( pgIndex )=>{
	localStorage.actPg = JSON.stringify( pgIndex ) ;
}

get_LS_ActPg = ()=>{
	return parseInt(JSON.parse(localStorage.actPg)) || 0;
}


/*
#################
# 	lastVisit 	#
#################
*/
set_LS_LastVisit = (dialIndex)=>{

// "lstVst": 	"" + new Date().toISOString() 

	if( hasLclStrgDls() ){
		let vstDate = "" + new Date().toISOString() ;
		try {

			console.log(
				"set_LS_LastVisit dial# ", dialIndex, 
				"lastVisit was", appTiles[dialIndex].lstVst , 
				" becomes: ", vstDate 
			);

			appTiles[dialIndex].lstVst = vstDate ;
			localStorage.dials[dialIndex] = JSON.stringify( appTiles[dialIndex] ) ;

		} catch (error) {
			console.error("set_LS_LastVisit", error );
			appTiles[dialIndex].lstVst = vstDate ;
			set_LS_Dials(appTiles);
		}
	}
}


/* 
#############
#	Init	#
#############
*/

jhp_LS_init = ()=>{

	//console.log("jhp_localStorage.js -> jhp_LS_init.start:  currentState: ", currentState() ) ;
	console.log("jhp_localStorage.js.jhp_LS_init -> hasLclStrg: ", hasLclStrg() ) ;

	if( hasLclStrg() ){

		console.log("has Lcl Strg Base! hasLclStrgPgs: " , hasLclStrgPgs(), "\nhasLclStrgDls: ", hasLclStrgDls() ) ;

		if( hasLclStrgPgs() ){
			console.log("has Lcl Strg Pgs", hasLclStrgPgs(), "ls=", get_LS_Pages() ) ;
			appSettings.pages = get_LS_Pages() ;
		}else{
			console.log("NO Lcl Strg Pgs") ;
			set_LS_Pages( appSettings.pages );
			console.log("has Lcl Strg Pgs", hasLclStrgPgs(), "ls=", get_LS_Pages() ) ;
		}


		if( hasLclStrgDls() ){
			console.log("has Lcl Strg Dls", hasLclStrgDls(), "ls=", get_LS_Dials()  ) ;
			appTiles = get_LS_Dials() ;
		}else{
			console.log("NO Lcl Strg Dls") ;
			if( !hasLclStrgPgs() ){ set_LS_Pages( appSettings.pages ); }
			set_LS_Dials( appTiles ) ;
			console.log("has Lcl Strg Dls", hasLclStrgDls(), "ls=", get_LS_Dials()  ) ;
		}


		if( hasLclStrgActPg() ){
			console.log("has Lcl Strg actPg: ", hasLclStrgActPg(), "actPg= ", get_LS_ActPg() ) ;
			appSettings.activePage = get_LS_ActPg() ;
		}else{
			console.log("NO Lcl Strg actPg") ;
			set_LS_ActPg( appSettings.activePage ) ;
			console.log("has Lcl Strg actPg", hasLclStrgActPg(), "ls=", get_LS_ActPg()  ) ;
		}


	}else{
		console.log("NO Lcl Strg") ;
		set_LS_Base() ;
		set_LS_Pages( appSettings.pages );
		set_LS_Dials( appTiles ) ;
		set_LS_ActPg( 0 ) ;
	}

	console.log(
		"jhp_localStorage.js -> jhp_LS_init.end:",
		"currentState: ", currentState() , 
		"\n\nNext up --> jhp_init.js"
	);
}

jhp_LS_init() ;
