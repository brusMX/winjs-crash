﻿
(function () {
    "use strict";

    WinJS.UI.Pages
        .define("/pages/main/main.html", {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                console.log("Main loaded.");
            },
        });
})();