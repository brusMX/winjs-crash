// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/settings/contact.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.

            Orientation.onChange();
            getContact();

            function getContact() {
                console.log("getContact");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.PLMClientsEngine + '/getContact?country=' + globalVars.countryKey,
                            type: 'GET'
                        };

                        WinJS.xhr(options).done(
                            function (result) {
                                //On Success
                                callback(result.responseText, result.status);
                            },
                            function (result) {
                                //On Failure
                                callback(null, result.status);
                            }
                        );
                    }, function (err) { //Connectivity.test error
                        var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                        WinJS.Navigation.back(1);
                        Loader.hide();
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    });
                });
            }

            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log("Results retrieve success", items);
                        displayContact(items.getContactResult);
                    } else {
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron informaci&oacute;n de contacto.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar la informaci&oacute;n de contacto.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function displayContact(contactInfo) {
                console.log(contactInfo);
                var companyElement = document.body.querySelector("#companyName");
                var contactElement = document.body.querySelector("#contactInformation");
                if (contactElement != null && contactElement != undefined) {
                    console.log(companyElement);
                    if (companyElement != null && companyElement != undefined) {
                        console.log("entro");
                        companyElement.innerHTML = contactInfo.CompanyName;
                    }

                    contactElement.innerHTML = '<li>'
			        + '<p class="contactInformation"><b>Direcci&oacute;n:</b><br> ' + contactInfo.Street + '<br>'
				        + contactInfo.Suburb + ' ' + contactInfo.ZipCode + ', ' + contactInfo.CountryName + '<br><br>'
				        + '<b>Tel&eacute;fono:</b><br><a href="tel:' + contactInfo.Lada + ' ' + contactInfo.PhoneOne + '"> ' + contactInfo.Lada + ' ' + contactInfo.PhoneOne + '</a><br><br>'
				        + '<b>Correo: </b><br> <a href="mailto:' + contactInfo.ContactEmail + '" class="ui-link">' + contactInfo.ContactEmail + '</a></p>'
			        + '</li>';
                }
                Loader.hide();
            }

            //Fin de ready
        },

        unload: function () {
            // TODO: Responder a las navegaciones fuera de esta página.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Responder a los cambios en el diseño.
        }
    });
})();
