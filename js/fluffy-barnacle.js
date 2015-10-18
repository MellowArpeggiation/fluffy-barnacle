/*jslint browser: true, devel: true*/

/*global $, requestAnimationFrame, cancelAnimationFrame,
clearIntervals*/

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

var intervals = [];

function init() {
	'use strict';
	// Called on initial page load and after every page transition
	
	clearIntervals();
    
    $(".ui-star-submit").hide();
	
	$(".ui-star-rating .fa-star-o").on("click", function () {
		$(this).parent().children().each(function () {
			$(this).removeClass("active");
		});
		$(this).addClass("active");
        
        $(".ui-star-submit").show(400);
	});
}

function clearIntervals() {
	'use strict';
	// Remove all intervals on page change, prevent buildup of empty fired functions
	
	var i;
	for (i = 0; i < intervals.length; i += 1) {
		window.clearInterval(intervals[i]);
	}
	
	intervals = [];
}

function clearStars() {
    'use strict';
    $(".ui-star-rating .fa-star-o").each(function () {
        $(this).removeClass("active");
    });
}

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
    intervals.push(setInterval(function () {
        element.fadeOut(500, function () {
            element.html(getRandomSubtitle(element.html()));
        });
        element.fadeIn(500);
    }, interval));
}

$(document).ready(function () {
	'use strict';
	
	init();
	$("body").on("pagecontainerchange", init);
});

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