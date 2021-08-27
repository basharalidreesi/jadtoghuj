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
                        // jad.header.reportHeaderDelta();
                },
                pickRandomLogo: function() {
                        let logos = new Array(
                                {%- for logo in site.data.logos.logo_images %}
                                "{{ logo }}" {%- unless forloop.last %}, {% endunless %}
                                {%- endfor %}
                        );
                        let randomLogo = (Math.floor(Math.random() * logos.length));
                        jad.header.setRandomLogo(logos[randomLogo]);
                },
                setRandomLogo: function(randomLogo) {
                        jad.lexicon.logo.src = randomLogo;
                        SVGInject(jad.lexicon.logo);
                },
                reportHeaderDelta: function() {
                        if (!document.querySelector(".homepageShowcase")) { return; }
                        window.addEventListener("scroll", () => {
                                let headerBottom = jad.lexicon.header.getBoundingClientRect().bottom;
                                let navTop = jad.lexicon.nav.getBoundingClientRect().top;
                                let deltaRatio = jad.util.clamp(0, (navTop - headerBottom - 15) / ((window.innerHeight - 30 - jad.lexicon.header.getBoundingClientRect().height) / 2), 1);
                                jad.header.scaleHeader(deltaRatio);
                                console.log(deltaRatio);
                        });
                },
                scaleHeader: function(deltaRatio) {
                        var modifier = 0;
                        var initialHeight = 0;
                        if (jad.util.queryMedia("(max-width: 512px)")) {
                                modifier = 15;
                                initialHeight = 60;
                        } else {
                                modifier = 30;
                                initialHeight = 75;
                        }
                        let height = (initialHeight - modifier) + (deltaRatio * modifier);
                        let margin = "calc(var(--vh, 1vh) * 50 - 1rem - " + (height / 2) + "px) 1rem";
                        jad.lexicon.header.style.setProperty("height", `${height}px`);
                        jad.lexicon.header.style.setProperty("margin", margin);
                },

        },

        nav: {
                uncheckNavToggleOnWidthIncrease: function() {
                        if (!jad.lexicon.navToggle) { return; }
                        if (window.innerWidth >= 768 && jad.lexicon.navToggle.checked) {
                                let change = new Event("change");
                                jad.lexicon.navToggle.checked = false;
                                jad.lexicon.navToggle.dispatchEvent(change);
                        }
                },
        },

        carousel: {

                initCarouselScripts: function() {
                        if (!jad.lexicon.carousel) { return; }
                        window.addEventListener("wheel", jad.carousel.transformScroll);
                        jad.carousel.activateTitleScroll();
                        jad.carousel.displayCpAndConsole();
                        jad.carousel.activateCpScroll();
                        jad.carousel.observeIntersections();
                        jad.carousel.listenToConsoleChange();
                },
                transformScroll: function(event) {
                        if (!event.deltaY) { return; }
                        jad.lexicon.carousel.scrollLeft += event.deltaY;
                },
                activateTitleScroll: function() {
                        jad.lexicon.projectTitle.addEventListener("click", () => {
                                jad.lexicon.carousel.scrollLeft = (jad.lexicon.carouselItems[0].getBoundingClientRect().width / 2) + (jad.lexicon.carouselItems[1].getBoundingClientRect().width / 2);
                        });
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
                                jad.lexicon.carousel.scrollLeft = jad.carousel.currentIntersection.previousElementSibling.offsetLeft + 15 - (window.innerWidth / 2) + (jad.carousel.currentIntersection.previousElementSibling.getBoundingClientRect().width / 2);
                        });
                        jad.lexicon.carouselRight.addEventListener("click", () => {
                                jad.lexicon.carousel.scrollLeft = jad.carousel.currentIntersection.nextElementSibling.offsetLeft + 15 - (window.innerWidth / 2) + (jad.carousel.currentIntersection.nextElementSibling.getBoundingClientRect().width / 2);
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
                                jad.lexicon.carouselConsole.classList.remove("project__console--active");
                                // let change = new Event("change");
                                // jad.lexicon.carouselConsolePanel.innerHTML = "";
                                // jad.lexicon.carouselConsoleToggle.checked = false;
                                // jad.lexicon.carouselConsoleToggle.dispatchEvent(change);
                        }
                        if (jad.lexicon.carouselConsoleToggle.checked) {
                                jad.lexicon.carouselConsole.classList.add("generic--halfOpacity");
                        } else {
                                jad.lexicon.carouselConsole.classList.remove("generic--halfOpacity");
                        }
                },
                listenToConsoleChange: function() {
                        jad.lexicon.carouselConsole.addEventListener("change", () => {
                                if (jad.lexicon.carouselConsoleToggle.checked) {
                                        jad.lexicon.carouselConsole.classList.add("project__console--active");
                                } else {
                                        jad.lexicon.carouselConsole.classList.remove("project__console--active");
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
