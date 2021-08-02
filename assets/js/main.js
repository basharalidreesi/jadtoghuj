---
layout: null
---

"use strict";

const jad = {

        lexicon: {
                root: document.documentElement,
                logo: document.querySelector("#header__logo"),
                previousOuterHeight: window.outerHeight,
        },

        initAllScripts: function() {
                jad.viewport.initViewportScripts();
                jad.header.initHeaderScripts();
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
                        if (outerHeight == jad.lexicon.previousOuterHeight) { return; }
                        outerHeight = previousOuterHeight;
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
                        jad.header.pickRandomLogo();
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
