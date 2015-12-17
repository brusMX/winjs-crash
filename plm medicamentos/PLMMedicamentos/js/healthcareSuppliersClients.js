// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersClients.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var clientsData = {};

            Orientation.onChange();
            displayClients(healthcareSuppliersVars.clientsItems);

            function displayClients(clients) {
                console.log("displayClients");
                if (clients.length > 0 && clients != null && clients != 'undefined') {
                    clientsData = new WinJS.Binding.List(clients);

                    var clientsList = document.getElementById("clientsList");
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
                healthcareSuppliersVars.CompanyName = clientsData.getAt(args.detail.itemIndex).CompanyName;

                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersClientDetail.html');
            }

            WinJS.UI.processAll();
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
