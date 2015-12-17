// Para obtener una introducción a la plantilla En blanco, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.launch) {
			if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
				// TODO: esta aplicación se ha iniciado recientemente. Inicialice aquí su aplicación.
			} else {
				// TODO: Se ha suspendido y finalizado esta aplicación.
				// Para crear una experiencia de usuario fluida, restaure aquí el estado de la aplicación de forma que parezca que la aplicación no ha dejado de ejecutarse nunca.
			}
			args.setPromise(WinJS.UI.processAll()
                .then(function () {

                    var appInitialize = function () {
                        RESTServices.initialize()
                            .then(LocalStorage.initialize)
                            .then(XML.load)
                            .then(
                                function () {
                                    var mainPage = '';

                                    if (globalVars.code != '') {
                                        mainPage = '/pages/main/main.html';
                                    } else {
                                        mainPage = '/pages/settings/register.html';
                                    }

                                    var url = WinJS.Application.sessionState.lastUrl || mainPage;
                                    return WinJS.Navigation.navigate(url);
                                }, function (err) {
                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                    messageDialog.commands
                                        .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                            setTimeout(function () {
                                                appInitialize();
                                            }, 5000);
                                        }));
                                    messageDialog.showAsync();
                                }
                        );
                    };

                    appInitialize();
                }));
		}
	};

	app.oncheckpoint = function (args) {
		// TODO: esta aplicación está a punto de suspenderse. Guarde aquí cualquier estado que deba conservarse en las suspensiones.
		// Puede utilizar el objeto WinJS.Application.sessionState, que se guarda y se restaura automáticamente en las suspensiones.
		// Si tiene que completar una operación asíncrona antes de que se suspenda su aplicación, llame a args.setPromise().
	};

	WinJS.Navigation.addEventListener("navigated", function (eventObject) {
	    var url = eventObject.detail.location;
	    var host = document.getElementById("contentHost");

	    // Call unload method on current scenario, if there is one
	    host.winControl && host.winControl.unload && host.winControl.unload();

	    WinJS.Utilities.empty(host);

	    eventObject.detail.setPromise(
            WinJS.UI.Pages.render(url, host, eventObject.detail.state).then(function () {
                WinJS.Application.sessionState.lastUrl = url;
            })
        );
	});

	app.start();
})();
