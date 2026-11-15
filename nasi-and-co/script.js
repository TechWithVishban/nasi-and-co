/* ==========================================================================
   NASI & CO. | script.js
   Stage 5: Mobile navigation behaviour
   --------------------------------------------------------------------------
   Works with the existing HTML and CSS:
   - The CSS shows the mobile dropdown when the toggle button has
     aria-expanded="true", so this script only needs to update that attribute.
   - Elements used: .navbar (the <nav>), .navbar__toggle (the button),
     #nav-menu (the <ul class="navbar__list">) and .navbar__link (the links).
   ========================================================================== */

(function () {
    "use strict";

    /* ----------------------------------------------------------------------
       Configuration
       Must match the CSS breakpoint: the desktop layout starts at 48em
       (768px), where the toggle button is hidden and the links sit in a row.
       ---------------------------------------------------------------------- */
    var DESKTOP_QUERY = "(min-width: 48em)";

    /**
     * Sets up the mobile navigation once the page structure is available.
     */
    function initNavigation() {

        /* ----- Find the elements we need ----- */
        var nav       = document.querySelector(".navbar");
        var toggle    = document.querySelector(".navbar__toggle");
        var menu      = document.getElementById("nav-menu");
        var navLinks  = document.querySelectorAll(".navbar__link");

        /* ----- Basic error protection: stop quietly if anything is missing ----- */
        if (!nav || !toggle || !menu) {
            console.warn(
                "Nasi & Co.: navigation script not started. " +
                "Expected .navbar, .navbar__toggle and #nav-menu in the HTML."
            );
            return;
        }

        /* ------------------------------------------------------------------
           Helpers
           ------------------------------------------------------------------ */

        /** Returns true when the menu is currently open. */
        function isMenuOpen() {
            return toggle.getAttribute("aria-expanded") === "true";
        }

        /**
         * Opens or closes the menu by updating aria-expanded.
         * The CSS does the rest (it shows/hides the dropdown and turns the
         * hamburger icon into an X based on this attribute).
         * @param {boolean} open - true to open, false to close
         */
        function setMenuState(open) {
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        }

        /**
         * Closes the menu if it is open.
         * @param {boolean} returnFocus - move keyboard focus back to the toggle
         */
        function closeMenu(returnFocus) {
            if (!isMenuOpen()) {
                return;
            }
            setMenuState(false);
            if (returnFocus) {
                toggle.focus();
            }
        }

        /* ------------------------------------------------------------------
           1. Initial state
           Make sure the page always starts with the menu closed.
           ------------------------------------------------------------------ */
        setMenuState(false);

        /* ------------------------------------------------------------------
           2. Toggle button: open or close the menu on click
           (Works with mouse, touch, Enter and Space, since it is a <button>.)
           ------------------------------------------------------------------ */
        toggle.addEventListener("click", function () {
            setMenuState(!isMenuOpen());
        });

        /* ------------------------------------------------------------------
           3. Close the menu after a link is selected
           The link still works normally (the page scrolls to its section);
           we only close the dropdown so it doesn't cover the content.
           Focus is not moved, because the user is navigating to a section.
           ------------------------------------------------------------------ */
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                closeMenu(false);
            });
        });

        /* ------------------------------------------------------------------
           4. Escape key: close the menu and return focus to the toggle
           Only acts when the menu is open, so it never affects desktop use
           (the desktop menu never enters the "open" state).
           ------------------------------------------------------------------ */
        document.addEventListener("keydown", function (event) {
            if ((event.key === "Escape" || event.key === "Esc") && isMenuOpen()) {
                closeMenu(true);
            }
        });

        /* ------------------------------------------------------------------
           5. Click outside the navigation: close the menu
           Clicks inside .navbar (the button, the links, the dropdown) are
           ignored here, because they are handled above.
           ------------------------------------------------------------------ */
        document.addEventListener("click", function (event) {
            if (isMenuOpen() && !nav.contains(event.target)) {
                closeMenu(false);
            }
        });

        /* ------------------------------------------------------------------
           6. Responsive behaviour
           If the screen grows to desktop width while the menu is open, reset
           it so it can't be left in an "open" state that no longer applies.
           matchMedia fires only when the breakpoint is crossed, which is
           lighter than listening to every window resize.

           Compatibility: window.matchMedia is checked before use. If it is
           unavailable, this section is skipped and the navigation still
           works normally; only the automatic breakpoint reset is lost.
           ------------------------------------------------------------------ */
        if (typeof window.matchMedia === "function") {
            var desktopMedia = window.matchMedia(DESKTOP_QUERY);

            var handleBreakpointChange = function (event) {
                if (event.matches) {
                    setMenuState(false);   // switched to desktop: reset
                }
            };

            if (desktopMedia.addEventListener) {
                desktopMedia.addEventListener("change", handleBreakpointChange);
            } else if (desktopMedia.addListener) {
                desktopMedia.addListener(handleBreakpointChange);   // older Safari
            }
        }
    }

    /* ----------------------------------------------------------------------
       Start-up
       The script is loaded with "defer", so the HTML is already parsed, but
       this also works if the script tag is ever moved or the defer removed.
       ---------------------------------------------------------------------- */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initNavigation);
    } else {
        initNavigation();
    }
})();