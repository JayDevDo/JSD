/* 
	jhp_localStorage.js
	
	version = 20241126-21h00

	Loads or creates localstorage objects.
	If existing LS, then LS will be used.
	No LS available (incl. errors on loading values)?
	Check for json files. -> 	
		Y: load json (user_dials.json and/or user_pages.json) into LS.
		N: load defaults (jhp_defaults.js) into LS.
*/

// console.log("jhp_localStorage.js -> on_load:  currentState: ", currentState("jhp_localStorage-ON-LOAD") ) ;

/* 
#############
# 	GLOBAL	#
#############
*/

hasLclStrg = ()=>{ 
	try{ 
		
		if( localStorage ){ 

			if( localStorage.length > 0 ){

				if( localStorage.pages && localStorage.dials ){ return true; } 

			} 

		}else{ 
			return false; 
		}

	}catch( error ){ return false; }

}

del_LS_All = ()=>{ 
	console.log("del_LS_All ALL");
	localStorage.removeItem["pages"];
	localStorage.removeItem["dials"];
	localStorage.removeItem["actPg"];
}

set_LS_Base = ()=>{
	/* Check for json here */
	localStorage.jhp.pages = JSON.stringify([]) ;
	localStorage.jhp.dials = JSON.stringify([]) ;
	localStorage.jhp.actPg = JSON.stringify(0)  ;
}


/* 
#############
# 	PAGES 	#
#############
*/

hasLclStrgPgs = ()=>{ 

	if( hasLclStrg() ){
		try {
			console.log("hasLclStrgPgs localStorage.jhp.pages ", localStorage.pages );
			return true ;
		} catch (error) {
			console.error("hasLclStrg pages error", error, "\nappSettings.pages", appSettings.pages);
			/* Check for json here */
			// set_LS_Pages(appSettings.pages);
			return false ;
		}
	}
}

del_LS_Pages = ()=>{ console.log("del_LS_All PAGES");localStorage.removeItem["pages"];}

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
hasLclStrgDls = ()=>{ 

	if( hasLclStrg() ){
		try {
			console.log("hasLclStrgPgs localStorage.jhp.dials ", localStorage.dials );
			return true ;
		} catch (error) {
			console.error("hasLclStrg dials error",error,"\nappTiles", appTiles );
			/* Check for json here */
			return false ;
		}
	}

}

del_LS_Dials = ()=>{
	console.log("del_LS_All DIALS") ;
	localStorage.removeItem["dials"] ;
}

set_LS_Dials = ( dialArray )=>{
	del_LS_Dials() ;
	localStorage.dials = JSON.stringify( dialArray ) ;	
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
del_LS_DialX = ( dialIdx )=>{
	let tempDials = get_LS_Dials()
	console.log( "del_LS_All DIALX", dialIdx, "before len tempDials=", tempDials.length );
	console.log("del_LS_All DIALX",  tempDials[dialIdx] ) ;
	let deletedDial = tempDials.splice( dialIdx, 1);
	console.log( "del_LS_All DIALX", dialIdx, "after len newDials = ", deletedDial.length , " tempDials=", tempDials.length );
	set_LS_Dials(tempDials)
	loadInit()
}
*/



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
#####################
#		JSON 		#
#####################
*/

lsJsonLoaded = ()=>{ return ( localStorage.jsonImported != "undefined" ) ; }

del_LS_jsonImported = ()=>{
	console.log("del_LS_jsonImported") ;
	localStorage.removeItem["jsonImported"] ;
}

set_LS_jsonImported = ()=>{
	impDt = "" + new Date().toISOString() ;
	localStorage.jsonImported = JSON.stringify( impDt ) ;
}

get_LS_jsonImported = ()=>{
	return parseInt(JSON.parse(localStorage.jsonImported)) || 0;
}


jsonData = []

hasJson = ()=>{ return ( jsonData.length == 2); };

getJsonData = async ()=> {
	let jsonPrms = new Promise( ( myJsonResolve )=> {
		let staticXhttp = new XMLHttpRequest();
		staticXhttp.open("GET", "default.json", true ) ; 
		staticXhttp.send() ;
		staticXhttp.onreadystatechange = ()=>{
			if ( (staticXhttp.readyState == 4) && (staticXhttp.status == 200) ){
				let jsonResponse = JSON.parse( staticXhttp.responseText ) ; 
				myJsonResolve( jsonResponse ) ; 
			}
		} 
	});
	return await jsonPrms ;
};


const jsonResp = Promise.all( [ getJsonData(), ] );
jsonResp.then(
	(values) => {
		let allJson = values[0] ; 
		console.log( "allJson --> pages:", allJson[1].length, "dials: ", allJson[0].length ) ;
		if ( allJson[1].length >= 4 && allJson[0].length > 3){ jsonData = allJson; }
	}
)
.catch( (error) => { console.log( error ); });




/* 
#############
#	Init	#
#############
*/

jhp_LS_init = ()=>{

	//console.log("jhp_localStorage.js -> jhp_LS_init.start:  currentState: ", currentState("jhp_localStorage-jhp_LS_init-START") ) ;
	console.log("jhp_localStorage.js.jhp_LS_init -> hasLclStrg: ", hasLclStrg(), "hasJson: ", hasJson() ) ;


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



	}else if( lsJsonLoaded() && hasJson() ){
		appSettings.pages = jsonData[1] ;
		appTiles = jsonData[0] ;
		set_LS_Pages( appSettings.pages );
		set_LS_Dials( appTiles ) ;
		set_LS_jsonImported()

	}else{
		console.log("NO Lcl Strg") ;
		set_LS_Base() ;
		set_LS_Pages( appSettings.pages );
		set_LS_Dials( appTiles ) ;
		set_LS_ActPg( 0 ) ;
	}

	console.log(
		"jhp_localStorage.js -> jhp_LS_init.end:",
		"currentState: ", currentState("jhp_localStorage-jhp_LS_init-END") , 
		"\n\nNext up --> jhp_init.js -loadInit()"
	);
}


// Let's start the init now that any json was loaded and LS was checked
jhp_LS_init() ;
