// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/clinicalAnalyzesCompaniesByCity.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var companiesData = {};

            var cityElement = document.querySelector("#city");
            if(cityElement != null && cityElement != undefined){
                cityElement.innerHTML = clinicalAnalyzesVars.cityName;
            }
            Orientation.onChange();

            getCompaniesByCity();

            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displayCompaniesByCity(items.getCompaniesByCityByCompanyTypeResult);
                    } else {
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron compa&ntilde;ias.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar las compa&ntilde;ias.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getCompaniesByCity() {
                console.log("getCompaniesByCity");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.ClinicalAnalyzesEngine + '/getCompaniesByCityBySection?code=' + globalVars.code + "&ISBN=" + globalVars.clinicalAnalyzesISBN + "&cityId=" + clinicalAnalyzesVars.cityId
                                 + "&companyTypeId=" + clinicalAnalyzesVars.companyTypeId,
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

            function displayCompaniesByCity(companies) {
                if (companies.length > 0 && companies != null && companies != 'undefined') {
                    companiesData = new WinJS.Binding.List(companies);

                    var companiesList = document.getElementById("companies");
                    if (companiesList != null && companiesList != undefined) {
                        companiesList = companiesList.winControl;
                        companiesList.itemDataSource = companiesData.dataSource;
                        companiesList.oniteminvoked = getcompanyDetail;
                    }
                } else {
                    if (document.body.querySelector('#emptyList')) {
                        document.body.querySelector('#emptyList').style.display = "block";
                    }
                }
                Loader.hide();
            }

            function getcompanyDetail(args) {
                Loader.show();
                clinicalAnalyzesVars.companyId = companiesData.getAt(args.detail.itemIndex).CompanyId;
                console.log(clinicalAnalyzesVars.companyId);
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/clinicalAnalyzesCompanyDetail.html');
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
