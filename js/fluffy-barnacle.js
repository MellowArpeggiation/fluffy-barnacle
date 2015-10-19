/*jslint browser: true, devel: true*/

/*global $, requestAnimationFrame, cancelAnimationFrame,
clearIntervals, setSubtitle, loadCakes, filterCakes, filterStores*/

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

var cakesXML,
    storesXML;

// retrieve the XML files
$.get("cakes.xml", function (d) {
    'use strict';
    cakesXML = $(d);
    loadCakes($("#explore-cakes main"));
});
$.get("stores.xml", function (d) {
    'use strict';
    storesXML = $(d);
});

function init() {
	'use strict';
	// Called on initial page load and after every page transition
	
	clearIntervals();
    
    setSubtitle($(".random-subtitle"), 4000);
    
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

function loadCakes(pageContent) {
    'use strict';
    pageContent.empty();
    
    cakesXML.find("cake").each(function () {
        var name = $(this).attr("name"),
            imgSrc = $(this).find("img").attr("src"),
            button;
        
        button = $("<a>", {
            "class": "ui-btn ui-btn-img",
            "href": "#cake-detail",
            "onclick": "setCakeDetail(\"" + name + "\")"
        });
        button.append($("<img>", {
            "src": "img/cakes/" + imgSrc
        }));
        button.append($("<span>").append(name));
        pageContent.append(button);
    });
}

function filterCakes(pageContent) {
    'use strict';
    pageContent.empty();
}

function filterStores(pageContent) {
    'use strict';
	pageContent.empty();
}

function setCakeDetail(name) {
    'use strict';
    var header = $("#cake-detail header h1"),
        content = $("#cake-detail main"),
        cake,
        img,
        desc,
        storeList;
    
    cakesXML.find("cake").each(function () {
        if ($(this).attr("name") === name) {
            cake = $(this);
            desc = cake.find("desc").html();
            img = cake.find("img").attr("src");
        }
    });
    
    header.html(name);
    content.empty();
    
    content.append($("<img>", {
        "class": "header-img header-img-attach",
        "src": "img/cakes/" + img
    }));
    content.append(desc);
    content.append("<h4>Available at:</h4>");
    
    storeList = $("<ul>");
    cake.find("store").each(function () {
        var item = $("<li>").html($(this).attr("name"));
        
        storeList.append(item);
    });
    content.append(storeList);
}

function setStoreDetail(name) {
    'use strict';
    var header = $("#store-detail header h1"),
        content = $("#store-detail main"),
        store,
        img,
        desc,
        storeList;
    
    storesXML.find("store").each(function () {
        if ($(this).attr("name") === name) {
            store = $(this);
            desc = store.find("desc").html();
            img = store.find("img").attr("src");
        }
    });
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