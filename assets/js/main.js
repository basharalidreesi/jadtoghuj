"use strict";

const jad = {

        lexicon: {
                root: document.documentElement,
        },

        initAllScripts: function() {
                jad.viewport.reportViewportHeight();
        },

        viewport: {

                reportViewportHeight: function() {
                        let height = window.innerHeight * 0.01;
                        jad.viewport.setViewportHeight(height);
                },
                setViewportHeight: function(height) {
                        jad.lexicon.root.style.setProperty("--vh", `${vh}px`);
                },

        },


}

jad.initAllScripts();
