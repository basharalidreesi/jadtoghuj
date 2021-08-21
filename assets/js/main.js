---
layout: null
---

"use strict";

var initialOuterHeight = window.outerHeight;

const jad = {

        lexicon: {
                root: document.documentElement,
                header: document.querySelector("#header"),
                logo: document.querySelector("#header__logo"),
                sentinel: document.querySelector("#headerSentinel"),
                carousel: document.querySelector(".project__carousel"),
        },

        initAllScripts: function() {
                jad.viewport.initViewportScripts();
                jad.header.initHeaderScripts();
                jad.scroll.initScrollScripts();
        },

        viewport: {

                initViewportScripts: function() {
                        jad.viewport.reportViewportHeight();
                        window.addEventListener("resize", () => {
        			jad.util.debounce(jad.viewport.updateViewportHeight, 350);
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
                        jad.header.observeSentinel();
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
                observeSentinel: function() {
                        if (!jad.lexicon.sentinel) { return; }
                        let observer = new IntersectionObserver(([e]) => {
                                jad.lexicon.header.classList.toggle('header--smol', e.intersectionRatio < 1),
                                { threshold: [1] }
                        });
                        observer.observe(jad.lexicon.sentinel);
                }

        },

        scroll: {

                initScrollScripts: function() {
                        if (!jad.lexicon.carousel) { return; }
                        window.addEventListener("wheel", jad.scroll.transformScroll);
                        // window.addEventListener("touchmove", jad.scroll.transformTouchToWheel, { passive: false });
                },
                transformScroll: function(event) {
                        if (!event.deltaY) { return; }
                        jad.lexicon.carousel.scrollLeft += event.deltaY;
                },
                transformTouchToWheel: function(event) {
                        event.preventDefault();
                        let wheel = new Event("wheel");
                        window.dispatchEvent(wheel);
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
