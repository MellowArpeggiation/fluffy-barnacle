/*jslint browser: true, devel: true*/

/*global $, requestAnimationFrame, cancelAnimationFrame*/

var scrollAnimation,
	scrollElement;

function scrollImage(timestamp) {
	'use strict';
	scrollAnimation = requestAnimationFrame(scrollImage);
	
	console.log(timestamp);
	
//	scrollElement.height(600 - $(window).scrollTop() * 10);
}

$(document).on("scrollstart", function (event) {
	'use strict';
	scrollElement = $(".scroll-element");
	console.log(event);
	scrollAnimation = requestAnimationFrame(scrollImage);
});

$(document).on("scrollstop", function (event) {
	'use strict';
	console.log(event);
	cancelAnimationFrame(scrollAnimation);
});