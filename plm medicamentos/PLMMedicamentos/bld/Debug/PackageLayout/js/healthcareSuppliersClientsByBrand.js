// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersClientsByBrand.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var clientsData = {};

            getDetailByBrand();
            var categoryNameElement = document.querySelector("#brandName");
            if (categoryNameElement != undefined && categoryNameElement != null) {
                categoryNameElement.innerHTML = healthcareSuppliersVars.brandName;
            }


            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displayClients(items.getDetailByBrandResult);
                    } else {
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron empresas.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar las empresas.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getDetailByBrand() {
                console.log("getDetailByBrand");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.HealthcareSuppliersEngine + '/getDetailByBrand?code=' + globalVars.code + "&editionId=" + healthcareSuppliersVars.editionId
                                + "&brandId=" + healthcareSuppliersVars.brandId,
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

            function displayClients(detailByBrand) {
                Orientation.onChange();
                var clients = detailByBrand.Client;
                if (clients.length > 0 && clients != null && clients != 'undefined') {
                    clientsData = new WinJS.Binding.List(clients);

                    var clientsList = document.getElementById("clientsByBrand");
                    if (clientsList != undefined && clientsList != null) {
                        clientsList = clientsList.winControl;
                        clientsList.itemDataSource = clientsData.dataSource;
                        clientsList.oniteminvoked = displayClientDetail;
                    }
                } else {
                    if (document.body.querySelector("#emptyList")) {
                        document.body.querySelector("#emptyList").style.display = "block";
                    }
                }
                Loader.hide();
            }

            function displayClientDetail(args) {
                Loader.show();
                healthcareSuppliersVars.clientId = clientsData.getAt(args.detail.itemIndex).ClientId;
                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersClientDetail.html');
            }

            WinJS.UI.processAll();
            //FIn de ready
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
