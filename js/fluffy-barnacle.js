/*jslint browser: true, devel: true*/

/*global $, requestAnimationFrame, cancelAnimationFrame*/

var scrollAnimation,
	scrollElement;

var subtitles = [
    "Let them eat cake",
    "I want that cake",
    "Love is like a good cake",
    "Cake as a way of life",
    "I made you a cake",
    "A cake for all",
    "Oh my god, regret cake?"
];

function scrollImage(timestamp) {
	'use strict';
	scrollAnimation = requestAnimationFrame(scrollImage);
	
	console.log(timestamp);
	
	if ($(window).scrollTop() > 10) {
		scrollElement.removeClass("top");
		scrollElement.addClass("affix");
	} else {
		scrollElement.removeClass("affix");
		scrollElement.addClass("top");
	}
}

function getRandomSubtitle(current) {
    'use strict';
    var newTitle = current;
    while (newTitle === current) {
        newTitle = subtitles[Math.floor(Math.random() * subtitles.length)];
    }
    return newTitle;
}

function setSubtitle(element, interval) {
    'use strict';
    element.html(getRandomSubtitle());
    setInterval(function () {
        element.fadeOut(500, function () {
            element.html(getRandomSubtitle(element.html()));
        });
        element.fadeIn(500);
    }, interval);
}

/*$(document).on("scrollstart", function (event) {
	'use strict';
	scrollElement = $(".scroll-element");
	console.log(event);
	scrollAnimation = requestAnimationFrame(scrollImage);
});

$(document).on("scrollstop", function (event) {
	'use strict';
	console.log(event);
	cancelAnimationFrame(scrollAnimation);
});*/