---
layout: null
---

"use strict";

var initialOuterHeight = window.outerHeight;

const jad = {

        lexicon: {
                root: document.documentElement,
                jsOnly: document.querySelectorAll(".generic--jsOnly"),
                header: document.querySelector("#header"),
                logo: document.querySelector("#header__logo"),
                nav: document.querySelector("#nav"),
                navToggle: document.querySelector("#nav__toggle"),
                carousel: document.querySelector(".project__carousel"),
                projectTitle: document.querySelector("#project__title"),
                carouselItems: document.querySelectorAll(".project__carouselItem"),
                carouselCp: document.querySelector("#project__cp"),
                carouselCounter: document.querySelector("#project__cp__counter"),
                carouselLeft: document.querySelector("#project__cp__left"),
                carouselRight: document.querySelector("#project__cp__right"),
                carouselConsole: document.querySelector("#project__console"),
                carouselConsoleToggle: document.querySelector("#project__console__descriptionToggle"),
                carouselConsolePanel: document.querySelector("#project__console__descriptionPanel"),
                carouselConsoleLabel: document.querySelector("#project__console__descriptionLabel"),
        },

        initAllScripts: function() {
                jad.main.initMainScripts();
                jad.viewport.initViewportScripts();
                jad.header.initHeaderScripts();
                jad.carousel.initCarouselScripts();
        },

        main: {
		initMainScripts: function() {
			jad.main.displayJsOnly();
		},
		displayJsOnly: function() {
			if (!jad.lexicon.jsOnly) { return; }
			jad.lexicon.jsOnly.forEach((jsOnly) => {
				jsOnly.classList.remove("generic--jsOnly");
			});
		},
	},

        viewport: {

                initViewportScripts: function() {
                        jad.viewport.reportViewportHeight();
                        window.addEventListener("resize", () => {
        			jad.util.debounce(jad.viewport.updateViewportHeight, 350);
                                jad.nav.uncheckNavToggleOnWidthIncrease();
        		});
                },
                updateViewportHeight: function() {
                        let outerHeight = window.outerHeight;
                        if (outerHeight == initialOuterHeight) { return; }
                        initialOuterHeight = outerHeight;
                        jad.viewport.reportViewportHeight();
                },
                reportViewportHeight: function() {
                        let viewportHeight = window.innerHeight * 0.01;
                        jad.viewport.setViewportHeight(viewportHeight);
                },
                setViewportHeight: function(viewportHeight) {
                        jad.lexicon.root.style.setProperty("--vh", `${viewportHeight}px`);
                },

        },

        header: {

                initHeaderScripts: function() {
                        // jad.header.pickRandomLogo();
                        jad.header.trackHeaderY();
                },
                pickRandomLogo: function() {
                        // let logos = new Array(
                                {%- for logo in site.data.logos.logo_images %}
                                // "{{ logo }}" {%- unless forloop.last %}, {% endunless %}
                                {%- endfor %}
                        // );
                        // let randomLogo = (Math.floor(Math.random() * logos.length));
                        // jad.header.setRandomLogo(logos[randomLogo]);
                },
                setRandomLogo: function(randomLogo) {
                        // jad.lexicon.logo.src = randomLogo;
                        // SVGInject(jad.lexicon.logo);
                },
                trackHeaderY: function() {
                        if (!document.querySelector(".homepageShowcase")) { return; }
                        window.addEventListener("scroll", () => {
                                let headerOffsetTop = jad.lexicon.header.offsetTop;
                                let headerHeight = jad.lexicon.header.getBoundingClientRect().height;
                                let windowHeight = window.innerHeight;
                                let headerYPos = (15 + headerOffsetTop + (headerHeight / 2)) / windowHeight;
                                let headerYRatio = (headerYPos - 0.5) * 2;
                                let clampedHeaderYRatio = jad.util.clamp(0 , headerYRatio, 1);
                                jad.header.processHeaderY(clampedHeaderYRatio);
                        }, { passive: true });
                },
                processHeaderY: function(clampedHeaderYRatio) {
                        var lineSlope = 0;
                        if (jad.util.queryMedia("(max-width: 512px)")) {
                                lineSlope = -0.25;
                        } else {
                                lineSlope = -0.4;
                        }
                        let scaleRatio = jad.util.line(lineSlope, clampedHeaderYRatio, 1);
                        jad.header.scaleHeader(scaleRatio);
                },
                scaleHeader: function(scaleRatio) {
                        jad.lexicon.header.style.setProperty("transform", "scale(" + scaleRatio + ")");
                },

        },

        nav: {
                uncheckNavToggleOnWidthIncrease: function() {
                        if (!jad.lexicon.navToggle) { return; }
                        if (jad.util.queryMedia("(max-width: 768px)") && jad.lexicon.navToggle.checked) {
                                let change = new Event("change");
                                jad.lexicon.navToggle.checked = false;
                                jad.lexicon.navToggle.dispatchEvent(change);
                        }
                },
        },

        carousel: {

                initCarouselScripts: function() {
                        if (!jad.lexicon.carousel) { return; }
                        jad.carousel.trackWheel();
                        jad.carousel.trackTouch();
                        jad.carousel.displayCpAndConsole();
                        jad.carousel.activateCpScroll();
                        jad.carousel.observeIntersections();
                        jad.carousel.listenToConsoleChange();
                        jad.carousel.listenToConsoleClick();
                },
                trackWheel: function() {
                        window.addEventListener("wheel", jad.carousel.transformWheel);
                },
                transformWheel: function(event) {
                        if (!event.deltaY) { return; }
                        if (event.target.id == "project__console__descriptionPanel" && jad.lexicon.carouselConsolePanel.scrollHeight > jad.lexicon.carouselConsolePanel.clientHeight) { return; }
                        jad.lexicon.carousel.scrollLeft += event.deltaY;
                },
                trackTouch: function() {
                        var touchX = 0;
                        var touchY = 0;
                        window.addEventListener("touchstart", (event) => {
                                touchX = event.touches[0].clientX;
                                touchY = event.touches[0].clientY;
                        }, { passive: true });
                        window.addEventListener("touchmove", (event) => {
                                let transformedTouchX = event.changedTouches[0].clientX - touchX;
                                let transformedTouchY = event.changedTouches[0].clientY - touchY;
                                jad.carousel.transformTouch(transformedTouchX, transformedTouchY);
                        }, { passive: false });
                },
                transformTouch: function(transformedTouchX, transformedTouchY, event) {
                        if (Math.abs(transformedTouchX) > Math.abs(transformedTouchY)) { return; }
                        event.preventDefault();
                        let retardationValue = -5;
                        jad.lexicon.carousel.scrollLeft += transformedTouchY / retardationValue;
                },
                displayCpAndConsole: function() {
                        window.addEventListener("load", () => {
                                jad.lexicon.carouselCp.classList.remove("generic--notVisible");
                                jad.lexicon.carouselCp.classList.remove("generic--zeroOpacity");
                                jad.lexicon.carouselConsole.classList.remove("generic--notVisible");
                                jad.lexicon.carouselConsole.classList.remove("generic--zeroOpacity");
                        });
                },
                currentIntersection: null,
                activateCpScroll: function() {
                        jad.lexicon.carouselLeft.addEventListener("click", () => {
                                jad.lexicon.carousel.scrollLeft = jad.carousel.currentIntersection.previousElementSibling.offsetLeft + 30 - (window.innerWidth / 2) + (jad.carousel.currentIntersection.previousElementSibling.getBoundingClientRect().width / 2);
                        });
                        jad.lexicon.carouselRight.addEventListener("click", () => {
                                jad.lexicon.carousel.scrollLeft = jad.carousel.currentIntersection.nextElementSibling.offsetLeft + 30 - (window.innerWidth / 2) + (jad.carousel.currentIntersection.nextElementSibling.getBoundingClientRect().width / 2);
                        });
                },
                observeIntersections: function() {
                        let observer = new IntersectionObserver((entries) => {
                                entries.forEach((entry) => {
                                        if (entry.isIntersecting) {
                                                jad.carousel.reportIntersections(entry.target);
                                                jad.carousel.currentIntersection = entry.target;
                                        }
                                });

                        }, {
                                rootMargin: "0px -50% 0px -50%"
                        });
                        jad.lexicon.carouselItems.forEach((item) => {
                                observer.observe(item);
                        });
                },
                reportIntersections: function(entry) {
                        jad.lexicon.carouselCounter.innerHTML = (Array.prototype.indexOf.call(jad.lexicon.carouselItems, entry) + 1).toLocaleString('en-GB', { minimumIntegerDigits: 2, useGrouping: false }) + " / " + jad.lexicon.carouselItems.length.toLocaleString('en-GB', { minimumIntegerDigits: 2, useGrouping: false }) + "<br />" + entry.getAttribute("data-jad-cp-label");
                        if (Array.prototype.indexOf.call(jad.lexicon.carouselItems, entry) >= 1) {
                                jad.lexicon.carouselLeft.classList.remove("generic--notVisible");
                        } else {
                                jad.lexicon.carouselLeft.classList.add("generic--notVisible");
                        }
                        if (Array.prototype.indexOf.call(jad.lexicon.carouselItems, entry) == (jad.lexicon.carouselItems.length - 1)) {
                                jad.lexicon.carouselRight.classList.add("generic--notVisible");
                        } else {
                                jad.lexicon.carouselRight.classList.remove("generic--notVisible");
                        }
                        if (entry.hasAttribute("data-jad-cp-description")) {
                                jad.lexicon.carouselConsole.classList.remove("generic--displayNone");
                                jad.lexicon.carouselConsolePanel.innerHTML = entry.getAttribute("data-jad-cp-description");
                        } else {
                                jad.lexicon.carouselConsole.classList.add("generic--displayNone");
                        }
                },
                listenToConsoleChange: function() {
                        jad.lexicon.carouselConsole.addEventListener("change", () => {
                                if (jad.lexicon.carouselConsoleToggle.checked) {
                                        jad.lexicon.carouselConsole.classList.add("project__console--active");
                                } else {
                                        jad.lexicon.carouselConsole.classList.remove("project__console--active");
                                        jad.lexicon.carouselConsole.classList.remove("generic--halfOpacity");
                                }
                        });
                },
                listenToConsoleClick: function() {
                        jad.lexicon.carouselConsolePanel.addEventListener("click", () => {
                                if (jad.lexicon.carouselConsole.classList.contains("generic--halfOpacity")) {
                                        jad.lexicon.carouselConsole.classList.remove("generic--halfOpacity");
                                } else {
                                        jad.lexicon.carouselConsole.classList.add("generic--halfOpacity");
                                }
                        });
                },

        },

        util: {
		dTimer: 0,
		debounce: function(callback, delay) {
			clearTimeout(jad.util.dTimer);
			return jad.util.dTimer = setTimeout(callback, delay);
		},
		tTimer: 0,
		throttle: function(callback, delay) {
			if (jad.util.tTimer) { return; }
			return jad.util.tTimer = setTimeout(() => {
				if (callback) {
					callback();
				}
				jad.util.tTimer = 0;
			}, delay);
		},
		clamp: function(min, number, max) {
			return Math.max(min, Math.min(number, max));
		},
		parabola: function(a, x, b, c) {
			/* https://www.desmos.com/calculator */
			return a * (x + b) ** 2 + c;
		},
                line: function(a, x, b) {
                        /* https://www.desmos.com/calculator */
                        return (a * x) + b;
                },
		randomIntBetween: function(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min) + min);
		},
		randomFloatBetween: function(min, max) {
			return Math.random() * (max - min) + min;
		},
		queryMedia: function(query) {
			return window.matchMedia(query).matches;
		},
	},

}

jad.initAllScripts();
