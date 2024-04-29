/* 
	jhp_actionsPage.js

	version = 202404281500

*/


setActivePage = ( pgIndex )=>{
	appSettings.activePage = pgIndex ;
	set_LS_ActPg( pgIndex )
}


showPage = ( pgIndex )=>{
	
	console.log( 
		"showing page: ", pgIndex ,
		" dials Used: ", tilesPageFilter(pgIndex).length ,
		" max dials: ", (appSettings.pages[pgIndex].matrix[0] * appSettings.pages[pgIndex].matrix[1]).toString()
	) ;

	setActivePage( pgIndex ) ; 

	/* div + table with buttons */
	$("#pageContainer .pageDial").hide() ;
	$("#pageContainer .pageDial[pgidx=" + pgIndex.toString() + "]").show() ;

	/* #navi <li> */
	$("#linkContainer .pageTab").removeClass("active") ;
	$("#linkContainer .pageTab").addClass("inactive") ;
	$("#linkContainer .pageTab[pgidx=" + pgIndex.toString() + "]").removeClass("inactive") ;
	$("#linkContainer .pageTab[pgidx=" + pgIndex.toString() + "]").addClass("active") ;

	let toastMessage = [
		"page ", pgIndex, "-", appSettings.pages[pgIndex].name,
		". Max dials: ", ( appSettings.pages[pgIndex].matrix[0] * appSettings.pages[pgIndex].matrix[1] ).toString()
	].join("") ;

	myToaster(toastMessage) ; 
}
