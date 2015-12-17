// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/clinicalAnalyzesManufacturersAndDistributors.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var statesData = {};
            clinicalAnalyzesVars.companyTypeId = 1;

            Orientation.onChange();
            getStatesBySection();


            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displayStates(items.getStatesByCompanyTypeResult);
                    } else {
                        console.log("No se encontraron resultados");
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron estados disponibles en tu region.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar los estados.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getStatesBySection() {
                console.log("getStatesBySection");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.ClinicalAnalyzesEngine + '/getStatesBySection?code=' + globalVars.code + "&ISBN=" + globalVars.clinicalAnalyzesISBN + "&countryId=" + clinicalAnalyzesVars.countryId
                                + "&companyTypeId=" + clinicalAnalyzesVars.companyTypeId,
                            type: 'GET'
                        };
                        console.log(options);
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

            function displayStates(states) {
                console.log(states);

                if (states.length > 0 && states != null && states != 'undefined') {
                    statesData = new WinJS.Binding.List(states);

                    var statesList = document.getElementById("states");
                    if (statesList != null && statesList != undefined) {
                        statesList = statesList.winControl;
                        statesList.itemDataSource = statesData.dataSource;
                        statesList.oniteminvoked = getCitiesByStateBySection;
                    }
                } else {
                    if (document.body.querySelector("#emptyList")) {
                        document.body.querySelector("#emptyList").style.display = "block";
                    }
                }
                Loader.hide();
            }

            function getCitiesByStateBySection(args) {
                Loader.show();
                clinicalAnalyzesVars.stateId = statesData.getAt(args.detail.itemIndex).StateId;
                clinicalAnalyzesVars.stateName = statesData.getAt(args.detail.itemIndex).Name;
                console.log(clinicalAnalyzesVars.stateId, clinicalAnalyzesVars.stateName);
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/clinicalAnalyzesCitiesByState.html');
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
