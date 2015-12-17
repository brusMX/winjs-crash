// Para obtener una introducción a la plantilla En blanco, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var activationKinds = Windows.ApplicationModel.Activation.ActivationKind;
    var splitView;

    /* ISBN: */
    clinicalAnalyzesVars.countryId = 4;     //Change in case of add another country for this section
    globalVars.clinicalAnalyzesISBN = 'DEACI%2029';
    globalVars.healthcareSuppliersISBN = '';

    /* Search Ids: */
    globalVars.InfoSourceId = 8;
    globalVars.PSESourceId = 2;
    globalVars.parametizedSearchId = 1;

    /* Entities for tracking sending: */
    globalVars.attributeEntityId = 27;
    globalVars.newslettersEntityId = 5;

    /* Interactions: */
    globalVars.interactionsLimit = 2;

    WinJS.Namespace.define("App", {
        paneHiddenInitially: false
    });

    function activated(eventObject) {
        Loader.show();

        RESTServices.initialize()
            .then(LocalStorage.initialize)
            .then(XML.load)
            .then(Countries.set)
            .then(
                function () {
                    initialize(eventObject);
                }, function (err) {
                    initialize(eventObject, err, 'pages/error/error.html');
                    
                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                    messageDialog.commands
                        .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                        }));
                    messageDialog.showAsync();
                }
            );
    }

    function initialize(eventObject, err, uri) {
        var activationKind = eventObject.detail.kind;
        var activatedEventArgs = eventObject.detail.detail;

        Navigation.set();

        App.paneHiddenInitially = window.innerWidth <= 768;

        var appPromise = WinJS.UI.processAll()
            .then(function () {
                splitView = document.querySelector('#root').winControl;
                splitView.onbeforeclose = function () { WinJS.Utilities.addClass(splitView.element, 'hiding'); };
                splitView.onafterclose = function () { WinJS.Utilities.removeClass(splitView.element, 'hiding'); };

                window.addEventListener('resize', handleResize);

                handleResize();

                var buttons = document.querySelectorAll(".splitViewButton");

                for (var i = 0, len = buttons.length; i < len; i++) {
                    buttons[i].addEventListener('click', handleSplitViewButton);
                }

                // Navigate to either the first scenario or to the last running scenario
                // before suspension or termination.

                

                var initialState = {};

                if (uri == ''
                    || typeof(uri) == 'undefined') {
                    uri = Navigation.scenarios.getAt(0).uri;

                    var navHistory = app.sessionState.navigationHistory;

                    if (navHistory) {
                        nav.history = navHistory;
                        uri = navHistory.current.location;
                        initialState = navHistory.current.state || initialState;
                    }
                } else {
                    if (typeof(err) != 'undefined') {
                        globalVars.error = err;
                    }
                }

                initialState.activationKind = activationKind;
                initialState.activatedEventArgs = activatedEventArgs;
                nav.history.current.initialPlaceholder = true;

                Loader.hide();

                return nav.navigate(uri, initialState);
            });

        // Calling done on a promise chain allows unhandled exceptions to propagate.
        appPromise.done();

        // Use setPromise to indicate to the system that the splash screen must not be torn down
        // until after processAll and navigate complete asynchronously.
        eventObject.setPromise(appPromise);
    }

    function navigating(eventObject) {
        var url = eventObject.detail.location;
        var host = document.getElementById("contentHost");
        // Call unload and dispose methods on current scenario, if any exist
        if (host.winControl) {
            host.winControl.unload && host.winControl.unload();
            host.winControl.dispose && host.winControl.dispose();
        }
        WinJS.Utilities.disposeSubTree(host);
        WinJS.Utilities.empty(host);
        WinJS.log && WinJS.log("", "", "status");

        var p = WinJS.UI.Pages.render(url, host, eventObject.detail.state).
            then(function () {
                var navHistory = nav.history;
                app.sessionState.navigationHistory = {
                    backStack: navHistory.backStack.slice(0),
                    forwardStack: navHistory.forwardStack.slice(0),
                    current: navHistory.current
                };
                app.sessionState.lastUrl = url;
            });
        p.done();
        eventObject.detail.setPromise(p);
    }

    function handleSplitViewButton() {
        splitView.paneOpened = !splitView.paneOpened;
    }

    function handleResize() {
        if (window.innerWidth > 768) {
            splitView.closedDisplayMode = WinJS.UI.SplitView.ClosedDisplayMode.none;
            splitView.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.inline;
        } else {
            splitView.closedDisplayMode = WinJS.UI.SplitView.ClosedDisplayMode.none;
            splitView.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.overlay;
            splitView.closePane();
        }
    }

    nav.addEventListener('navigating', navigating);
    app.addEventListener('activated', activated, false);
    app.start();
})();

window.onerror = function (E) {
    debugger;
}