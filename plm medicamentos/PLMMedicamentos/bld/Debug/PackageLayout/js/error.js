
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/error/error.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page methods:
                var _setStyle = function () {
                    var bodies = document.getElementsByTagName('body');

                    if (bodies
                        && bodies.length > 0
                        && typeof (bodies[0]) != 'undefined') {
                        if (bodies[0].className.indexOf('ui-dark') < 0) {
                            WinJS.Utilities.addClass(bodies[0], 'ui-dark');
                        }
                    }
                };
                var _bindEvents = function () {
                    if (document.getElementById('retry')) {
                        document.getElementById('retry').addEventListener('click', _retryInitalization, false);
                    }
                };
                var _unbindEvents = function () {
                    if (document.getElementById('retry')) {
                        document.getElementById('retry').removeEventListener('click', _retryInitalization, false);
                    }
                };
                var _cleanVariables = function () {
                    globalVars.error = null;
                };
                var _retryInitalization = function () {
                    Loader.show();

                    RESTServices.initialize()
                        .then(LocalStorage.initialize)
                        .then(XML.load)
                        .then(Countries.set)
                        .then(
                            function () {
                                Navigation.set();

                                var uri = Navigation.scenarios.getAt(0).uri;
                                var options = {
                                    firstTime: true
                                };

                                Loader.hide();
                                
                                _unbindEvents();
                                _cleanVariables();
                                WinJS.Navigation.navigate(uri, options);
                            }, function (err) {
                                Loader.hide();

                                var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                messageDialog.showAsync();
                            }
                        );
                };

                // Page initialization starts here:

                // Set first time style:
                _setStyle();

                _bindEvents();

                var errorMessage = document.getElementById('errorMessage');

                if (errorMessage) {
                    if (globalVars.error != null
                        && typeof (globalVars.error.Message) != 'undefined') {
                        errorMessage.innerHTML = globalVars.error.Message;
                    } else {
                        errorMessage.innerHTML = "Error desconocido.";
                    }
                }
            }
        });
})();