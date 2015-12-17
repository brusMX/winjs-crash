// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/clinicalAnalyzesCitiesByState.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var citiesData = {};

            var stateNameElement = document.body.querySelector("#stateName");
            if(stateNameElement != null && stateNameElement != undefined){
                stateNameElement.innerHTML = clinicalAnalyzesVars.stateName;
            }

            Orientation.onChange();
            getCitiesByStateBySection();


            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displayCities(items.getCitiesByStateByCompanyTypeResult);
                    } else {
                        console.log("No se encontraron resultados");
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron ciudades participantes en este estado.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar las ciudades.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getCitiesByStateBySection() {
                console.log("getCitiesByStateBySection");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.ClinicalAnalyzesEngine + '/getCitiesByStateBySection?code=' + globalVars.code + "&ISBN=" + globalVars.clinicalAnalyzesISBN + "&stateId="
                                + clinicalAnalyzesVars.stateId + "&countryId=" + clinicalAnalyzesVars.countryId + "&companyTypeId=" + clinicalAnalyzesVars.companyTypeId,
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

            function displayCities(cities) {
                if (cities.length > 0 || cities != null && cities != 'undefined') {
                    citiesData = new WinJS.Binding.List(cities);

                    var citiesList = document.getElementById("cities");
                    if (citiesList != null && citiesList != undefined) {
                        citiesList = citiesList.winControl;
                        citiesList.itemDataSource = citiesData.dataSource;
                        citiesList.oniteminvoked = getCompaniesByCity;
                    }
                } else {
                    if (document.body.querySelector('#emptyList')) {
                        document.body.querySelector("#emptyList").style.display = "block";
                    }
                }
                Loader.hide();
            }

            function getCompaniesByCity(args) {
                Loader.show();
                clinicalAnalyzesVars.cityName = citiesData.getAt(args.detail.itemIndex).Name;
                clinicalAnalyzesVars.cityId = citiesData.getAt(args.detail.itemIndex).CityId;
                console.log(clinicalAnalyzesVars.stateId, clinicalAnalyzesVars.cityName);
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/clinicalAnalyzesCompaniesByCity.html');
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
