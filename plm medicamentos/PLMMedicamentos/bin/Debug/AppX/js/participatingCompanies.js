// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var participantCompanies = new Array;

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/participatingCompanies.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            clinicalAnalyzesVars.companyTypeId = 1;
            var description = "";
            productsVars.ProductByEditionInfoItems = null;
            Orientation.onChange();

            getCompanies();
           
            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        participantCompanies = items.getCompaniesResult;
                        console.log("Results retrieve success", participantCompanies);
                        displayCompanies(participantCompanies);
                    } else {
                        console.log("No se encontraron resultados");
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron compañias participantes.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar las compañias.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }
            

            function getCompanies() {
                Connectivity.test()
                    .then(
                    // Conexión exitosa.
                        function () {

                            var options = {
                                url: RESTServices.ClinicalAnalyzesEngine + '/getCompanies?code=' + globalVars.code + "&ISBN=" + globalVars.clinicalAnalyzesISBN + "&companyTypeId="
                                    + clinicalAnalyzesVars.companyTypeId + "&description=" + description,
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
                            // Error de conexión.
                        }, function (err) {
                            var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                            WinJS.Navigation.back(1);
                            Loader.hide();
                            messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                            messageDialog.showAsync();
                        }
                    );
            }

            function displayCompanies(companies) {
                console.log("display companies", companies);
                if (companies != null && companies != 'undefined') {
                    document.body.querySelector('#companiesList').style.display = "none";
                    var companiesList = new WinJS.Binding.List(companies);  //Se asocia la lista de elementos que desplegaremos a una enlazada con el control ListView
                    var list2 = document.getElementById("participatingCompanies").winControl;    //Lista a la que hacemos referencia
                    list2.itemDataSource = companiesList.dataSource;    //Objetos que serviran de fuente para llenar la lista
                    list2.oniteminvoked = getCompanyDetail;   //Llama a la funcion fnNavigate cuando se selecciona un elemento
                } else {
                    document.body.querySelector('#companiesList').style.display = "block";
                }
                Loader.hide();
            }

            function getCompanyDetail(args) {
                Loader.show();
                clinicalAnalyzesVars.companyId = participantCompanies[args.detail.itemIndex].CompanyId;
                console.log(clinicalAnalyzesVars.companyId);
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/companyDetail.html');
            }

            WinJS.UI.processAll();
            // TODO: Fin de la Inicializacion la página aquí.
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
