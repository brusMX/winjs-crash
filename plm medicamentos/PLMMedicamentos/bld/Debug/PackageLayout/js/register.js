
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/settings/register.html', {
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
                    if (document.getElementById('registerEmail')) {
                        document.getElementById('registerEmail').addEventListener('click', _getClientDetailByEmail, false);
                    }
                };
                var _unbindEvents = function () {
                    if (document.getElementById('registerEmail')) {
                        document.getElementById('registerEmail').removeEventListener('click', _getClientDetailByEmail, false);
                    }
                };
                var _getClientDetailByEmail = function () {
                    var email = document.getElementById('email').value.toLowerCase();
                    var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    if (email.length != 0) {
                        if (emailReg.test(email)) {
                            globalVars.email = email;

                            _unbindEvents();

                            WinJS.Navigation.navigate('pages/settings/profile.html');
                        } else {
                            var messageDialog = new Windows.UI.Popups.MessageDialog("El correo electr\xF3nico ingresado es inv\xE1lido. Por favor verif\xEDquelo nuevamente.");

                            messageDialog.commands
                                .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                    document.getElementById('email').focus();
                                }));
                            messageDialog.showAsync();
                        }
                    } else {
                        document.getElementById('email').focus();
                    }
                };

                // Page initialization starts here:

                // Set first time style:
                _setStyle();

                _bindEvents();
            }
        });
})();