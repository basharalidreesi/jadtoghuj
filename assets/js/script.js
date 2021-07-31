"use strict";

// begin
// global purpose functions
	let t;
	function debounce(fn, delay) {
		clearTimeout(t);
		return t = setTimeout(fn, delay);
	}

	function pluralise(singular, number, suffix) {
		if (!suffix) {
			suffix = "s";
		}
		if (number === 1) {
			return number + " " + singular;
		} else {
			return number + " " + singular + suffix;
		}
	}

// begin
// general purpose functions

	function checkUrl(redirect) {
		if (redirect) {
			let unchecked_url = window.location.href;
			let checked_url = unchecked_url.replace(/^(.+?)\/*?$/, "$1");
			if (checked_url !== unchecked_url && !home) {
				window.location.replace(checked_url);
			}
		}
	}

	function setVh() {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		console.log("--vh set to " + `${vh}px` + ".");
	}

	let vh_pre = window.outerHeight;
	function updateVh() {
		let vh = window.innerHeight * 0.01;
		let vh_post = window.outerHeight;
		if (vh_post != vh_pre) {
			vh_pre = vh_post;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
			console.log("--vh updated to " + `${vh}px` + ".");
		}
	}

	function reticulateSplines() {
		window.addEventListener("DOMContentLoaded", () => {
			console.log("Reticulated...");
		});
		window.addEventListener("load", () => {
			console.log("...splines");
		});
	}

	function initialListen() {
		window.addEventListener("load", header);
		window.addEventListener("resize", () => {
			debounce(updateVh, 350);
		});
		if (central) {
			window.addEventListener("scroll", hasScrolled, {passive: false});
			window.addEventListener("DOMContentLoaded", (event) => {
				document.getElementById("arrow_wrapper").addEventListener("click", (event) => {
					toArrow(event);
					unarrow();
				});
			});
			window.addEventListener("load", () => {
				if (!has_scrolled) {
					arrow();
					if(cascade) {
						document.getElementById("bodyalt").addEventListener("scroll", unarrow, {passive:true});
					} else {
						window.addEventListener("scroll", unarrow, {passive:true});
					}
				} else {
					document.getElementById("arrow_wrapper").remove();
					console.log("Dearrowed.");
				}
			});
		}
		if (contact) {
			window.addEventListener("DOMContentLoaded", () => {
				const textareas = document.querySelectorAll("textarea");
				textareas.forEach((textarea) => {
					textarea.addEventListener("input", () => {
						textarea.style.height = "calc(var(--quadruple) * 2)";
						textarea.style.height = textarea.scrollHeight + "px";
					});
				});
			});
		}
		if (list) {
			window.addEventListener("DOMContentLoaded", () => {
				const tags = document.querySelectorAll(".item_description-item_tag");
				const untags = document.querySelectorAll(".--untag");
				const matches_above = document.querySelectorAll(".--match_above");
				const matches_below = document.querySelectorAll(".--match_below");
				tags.forEach((tag) => {
					tag.addEventListener("click", filter);
				});
				untags.forEach((untag) => {
					untag.addEventListener("click", filter);
				});
				matches_above.forEach((match) => {
					match.addEventListener("click", seek);
				});
				matches_below.forEach((match) => {
					match.addEventListener("click", seek);
				});
			});
		}
		if (cascade) {
			window.addEventListener("DOMContentLoaded", (event) => {
				redirectWheel();
				redirectTouch();
				fixIframeScroll();
			});
		}
	}

// begin
// init

	function initialise() {
		checkUrl(true);
		setVh();
		reticulateSplines();
		initialListen();
		console.log(document.title);
		window.addEventListener("beforeunload", () => {
			window.scrollTo(0, 0);
		});
	}

	initialise();

// begin
// special purpose functions

	function header() {
		const header_container = document.getElementById("header_container");
		const header_graphic = document.getElementById("header_graphic");
		var header;
		if (!override) {
			let x = (Math.floor(Math.random() * headers.length));
			header = (headers[x]); // array initialised in script.js.html
			header_graphic.src = header;
			console.log("Headered " + header + " from a total number of " + headers.length + " header graphics.");
		} else {
			header = header_graphic.src;
		}
		let extension = header.split(".").pop();
		if (extension === "svg") {
			SVGInject(header_graphic);
			console.log("SVG header injected.");
		} else {
			console.log("No SVG header detected. Injection has not occured.");
		}
		document.getElementById("loader").style.animation = "none";
		document.getElementById("loader").style.width = "100%";
		setTimeout(() => {
			document.getElementById("loader_wrapper").style.display = "none";
			document.getElementById("loader_wrapper").remove();
			header_container.style.opacity = "1";
		}, 250);
		if (central) {
			const observer = new IntersectionObserver(([entry]) => {
				if (entry.intersectionRatio < 1) {
					entry.target.children[0].classList.add("--sticky_header");
					entry.target.children[0].children[0].removeAttribute("style");
				} else {
					entry.target.children[0].classList.remove("--sticky_header");
					entry.target.children[0].children[0].style.width = "100%";
				}
			}, {
				rootMargin: "0px 100px 0px 100px",
				threshold: 1
			});
			observer.observe(header_container);
		}
	}

	var has_scrolled = false;
	function hasScrolled() {
		has_scrolled = true;
		window.removeEventListener("scroll", hasScrolled, {passive: true});
	}

	function arrow() {
		document.getElementById("arrow_wrapper").style.display = "block";
		console.log("Arrowed.");
	}
	function unarrow() {
		document.getElementById("arrow_wrapper").style.opacity = "0";
		console.log("Arrow hid.");
		setTimeout(() => { document.getElementById("arrow_wrapper").remove(); }, 1250);
		setTimeout(() => { console.log("Unarrowed."); }, 1250);
		if (cascade) {
			document.getElementById("bodyalt").removeEventListener("scroll", unarrow, {passive: true});
		} else {
			window.removeEventListener("scroll", unarrow, {passive: true});
		}
	}
	function toArrow(event) {
		var scroll_to = event.target;
		scroll_to.scrollIntoView({
			behavior: "auto",
			block: "center",
			inline: "center"
		});
	}

	let filter_index = [];
	function filter(event) {
		var target;
		var origin;
		if (event.target.classList.contains("--untag") || event.target.classList.contains("--untag_click")) {
			origin = 1;
			event.stopPropagation();
			if (event.target.classList.contains("--untag")) {
				target = event.target.parentElement;
			} else if (event.target.classList.contains("--untag_click")) {
				target = event.target.parentElement.parentElement;
			}
			const unfilter_index = filter_index.indexOf(target.textContent.trim());
			if (unfilter_index != -1) {
				filter_index.splice(unfilter_index, 1);
				console.log("Unfiltered " + target.textContent.trim() + ".");
			}
		} else {
			origin = 2;
			target = event.target;
			if (!filter_index.includes(target.textContent.trim())) {
				filter_index.push(target.textContent.trim());
				console.log("Filtered " + target.textContent.trim() + ".");
			} else {
				return;
			}
		}
		var failures = 0;
		const items = document.querySelectorAll(".list_wrapper-list_item");
		items.forEach((item) => {
			let tag_index = [];
			let tags = item.querySelectorAll(":scope .item_description-item_tag");
			tags.forEach((tag) => {
				tag_index.push(tag.textContent.trim());
				tag.style.cursor = "cell";
			});
			if (filter_index.length > 0 && filter_index.every(key => tag_index.includes(key))) {
				seeker.observe(item);
				item.classList.add("--highlighted_list_item");
				tags.forEach((tag) => {
					if (filter_index.includes(tag.textContent.trim())) {
						tag.style.cursor = "default";
						tag.classList.add("--highlighted_tag");
						tag.children[0].style.display = "block";
					} else {
						tag.classList.remove("--highlighted_tag");
						tag.children[0].removeAttribute("style");
					}
				});
			} else {
				failures++;
				seeker.unobserve(item);
				item.classList.remove("--highlighted_list_item");
				item.previousElementSibling.classList.remove("--active_match");
				item.nextElementSibling.classList.remove("--active_match");
				setTimeout(() => { item.previousElementSibling.removeAttribute("style"); }, 125);
				setTimeout(() => { item.nextElementSibling.removeAttribute("style"); }, 125);
				tags.forEach((tag) => {
					tag.classList.remove("--highlighted_tag");
					tag.children[0].removeAttribute("style");
				});
			}
		});
		if (failures === items.length) {
			if (origin === 2) {
				console.log("No matches found.");
			}
			filter_index = [];
			seeker.disconnect();
			console.log("Unfiltered all.");
			const tags = document.querySelectorAll(".item_description-item_tag");
			tags.forEach((tag) => {
				tag.removeAttribute("style");
			});
		} else {
			let successes = document.querySelectorAll(".--highlighted_list_item").length;
			console.log(pluralise("match", successes, "es") + " found.");
		}
	}

	const seeker = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			let end = window.innerHeight;
			let top = entry.boundingClientRect.top;
			let bottom = entry.boundingClientRect.bottom;
			if (entry.intersectionRatio >= 0.5) {
				entry.target.previousElementSibling.classList.remove("--active_match");
				entry.target.nextElementSibling.classList.remove("--active_match");
				setTimeout(() => { entry.target.previousElementSibling.removeAttribute("style"); }, 125);
				setTimeout(() => { entry.target.nextElementSibling.removeAttribute("style"); }, 125);
			}
			if (entry.intersectionRatio < 0.5) {
				if (top < 0) {
					entry.target.previousElementSibling.style.display = "block";
					setTimeout(() => { entry.target.previousElementSibling.classList.add("--active_match"); }, 125);
				}
				if (bottom > end) {
					entry.target.nextElementSibling.style.display = "block";
					setTimeout(() => { entry.target.nextElementSibling.classList.add("--active_match"); }, 125);
				}
			}
		});
	}, {
		root: null,
		rootMargin: "0px 100px 0px 100px",
		threshold: 0.5
	});

	function seek(event) {
		if (event.target.classList.contains("--match_above")) {
			event.target.nextElementSibling.scrollIntoView({
				behavior: "auto",
				block: "center",
				inline: "center"
			});
		} else if (event.target.classList.contains("--match_below")) {
			const belows = document.querySelectorAll(".--match_below.--active_match");
			belows[0].previousElementSibling.scrollIntoView({
				behavior: "auto",
				block: "center",
				inline: "center"
			});
		}
	}

	function redirectWheel() {
		let customDeltaX;
		let customDeltaY;
		window.addEventListener("wheel", () => {
			if (event.deltaX != null || event.deltaY != null) {
				customDeltaX = event.deltaX;
				customDeltaY = event.deltaY;
			} else {
				customDeltaX = 0;
				customDeltaY = redirectTouchY / -5;
			}
			if (window.innerWidth < document.getElementById("article_wrapper").scrollWidth) { // if cascade is overflowing
				if (window.innerHeight + document.getElementById("bodyalt").scrollTop >= document.getElementById("bodyalt").scrollHeight) { // if at bottom of bodyalt
					if (customDeltaY > 0 || customDeltaX > 0) { // if going down or right
						event.preventDefault();
						document.getElementById("article_wrapper").scrollLeft += (customDeltaY + customDeltaX);
					} else if (customDeltaY < 0 || customDeltaX < 0) { // if going up or left
						if (document.getElementById("article_wrapper").scrollLeft <= 0) {
						} else if (document.getElementById("article_wrapper").scrollLeft > 0) {
							event.preventDefault();
							document.getElementById("article_wrapper").scrollLeft += (customDeltaY + customDeltaX);
						}
					}
				}
			}
		}, {passive:false});
	}

	let redirectTouchX;
	let redirectTouchY;
	function redirectTouch(event) {
		let touchX;
		let touchY;
		window.addEventListener("touchstart", (event) => {
			touchX = event.touches[0].clientX;
			touchY = event.touches[0].clientY;
		}, {passive: true});
		window.addEventListener("touchmove", (event) => {
			if (window.innerHeight + document.getElementById("bodyalt").scrollTop >= document.getElementById("bodyalt").scrollHeight) { // if bottom of bodyalt
				redirectTouchX = event.changedTouches[0].clientX - touchX;
				redirectTouchY = event.changedTouches[0].clientY - touchY;
				if (Math.abs(redirectTouchY) > Math.abs(redirectTouchX)) { // if going up or down
					if (document.getElementById("article_wrapper").scrollLeft <= 0 && redirectTouchY > 0) { // if going up and cascade is at its beginning
						// do nothing
					} else {
						event.preventDefault();
						let wheel = new Event("wheel");
						window.dispatchEvent(wheel);
					}
				}
			}
		}, {passive: false});
	}

	function fixIframeScroll() {
	//	const iframes = document.querySelectorAll(".--iframe");
	//	const barrier = document.createElement("div");
	//	barrier.classList.add("--barrier");
	//	iframes.forEach((iframe) => {
	//		iframe.appendChild(barrier);
	//	});
	}
