/*
SOURCE:
https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
*/

function viewport(){
	var e = window, a = 'inner';
	if ( !( 'innerWidth' in window ) ){
		a = 'client';
		e = document.documentElement || document.body;
	}
	return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}