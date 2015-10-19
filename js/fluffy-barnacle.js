/*jslint browser: true, devel: true, eqeq: true*/

/*global $, google, requestAnimationFrame, cancelAnimationFrame,
clearIntervals, setSubtitle, loadCakes, filterFavourites, filterStores,
addFavourite, removeFavourite, getFavourites, setFavourites, checkFavourite*/

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
    filterFavourites($("#favourite-cakes main"));
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
	
    $(".ui-star-rating .fa-star-o").unbind("click");
	$(".ui-star-rating .fa-star-o").on("click", function () {
		$(this).parent().children().each(function () {
			$(this).removeClass("active");
		});
		$(this).addClass("active");
        
        $(".ui-star-submit").show(400);
	});
    
    $(".ui-fav").unbind("click");
    $(".ui-fav").on("click", function () {
		if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            removeFavourite($(this).attr("data-name"));
        } else {
            $(this).addClass("active");
            addFavourite($(this).attr("data-name"));
        }
        filterFavourites($("#favourite-cakes main"));
	});
    
    if (localStorage.getItem("fav") == undefined) {
        // Create an empty array as string
        localStorage.setItem("fav", JSON.stringify([]));
    }
    
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        scrollwheel: false,
        zoom: 8
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

function filterFavourites(pageContent) {
    'use strict';
    var favourites = getFavourites();
    
    pageContent.empty();
    
    cakesXML.find("cake").each(function () {
        var name = $(this).attr("name"),
            imgSrc = $(this).find("img").attr("src"),
            button;
        
        if (favourites.indexOf(name) !== -1) {
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
        }
    });
}

function filterStores(pageContent) {
    'use strict';
	pageContent.empty();
}

function setCakeDetail(name) {
    'use strict';
    var header = $("#cake-detail header h1"),
        content = $("#cake-detail main .content"),
        cake,
        img,
        desc,
        storeList,
        favHeart;
    
    cakesXML.find("cake").each(function () {
        if ($(this).attr("name") === name) {
            cake = $(this);
            desc = cake.find("description").html();
            img = cake.find("img").attr("src");
        }
    });
    
    header.html(name);
    content.empty();
    
    
    content.append($("<img>", {
        "class": "header-img header-img-attach",
        "src": "img/cakes/" + img
    }));
    
    favHeart = $("<i>", {
        "class": "fa fa-heart-o ui-fav",
        "data-name": name
    });
    if (checkFavourite(name)) {
        favHeart.addClass("active");
    }
    content.append(favHeart);
    
    content.append(desc);
    content.append("<h4>Available at:</h4>");
    
    console.log(cake.find("store"));
    
    storeList = $("<ul>");
    if (cake.find("store").length === 0) {
        storeList.append($("<li>").html("This cake is unavailable in stores."));
    } else {
        cake.find("store").each(function () {
            var item = $("<li>"),
                storeName = $(this).attr("name");
            item.append($("<a>", {
                "href": "#store-detail",
                "onclick": "setStoreDetail(\"" + storeName + "\")"
            }).html(storeName));

            storeList.append(item);
        });
    }
    content.append(storeList);
}

function setStoreDetail(name) {
    'use strict';
    var header = $("#store-detail header h1"),
        content = $("#store-detail main .content"),
        store,
        img,
        desc,
        storeList;
    
    storesXML.find("store").each(function () {
        if ($(this).attr("name") === name) {
            store = $(this);
            desc = store.find("description").html();
            img = store.find("img").attr("src");
        }
    });
    
    header.html(name);
    content.empty();
    
    content.append($("<img>", {
        "class": "header-img header-img-attach",
        "src": "img/stores/" + img
    }));
    
    content.append(desc);
}

function addFavourite(name) {
    'use strict';
    var favourites = getFavourites();
    
    favourites.push(name);
    
    setFavourites(favourites);
}

function removeFavourite(name) {
    'use strict';
    var favourites = getFavourites(),
        i;
    
    for (i = favourites.length - 1; i >= 0; i -= 1) {
        if (favourites[i] === name) {
            favourites.splice(i, 1);
        }
    }
    
    setFavourites(favourites);
}

function checkFavourite(name) {
    'use strict';
    var favourites = getFavourites();
    
    if (favourites.indexOf(name) !== -1) {
        return true;
    }
    return false;
}

function getFavourites() {
    'use strict';
    return JSON.parse(localStorage.getItem("fav"));
}

function setFavourites(array) {
    'use strict';
    localStorage.setItem("fav", JSON.stringify(array));
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