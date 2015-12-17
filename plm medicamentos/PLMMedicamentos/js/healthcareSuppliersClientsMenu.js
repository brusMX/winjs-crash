// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersClientsMenu.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.

            var lettersArray = new WinJS.Binding.List([]);
            var clientsData;
            var clientTypeId = 2;
            healthcareSuppliersVars.productsItems = null;

            var tradenmarkElement = document.body.querySelector("#trademarkIndex");
            var lettersElement = document.body.querySelector("#lettersIndex");
            var indexElement = document.body.querySelector("#letterIndex");
            if (healthcareSuppliersVars.brandsItems != null || healthcareSuppliersVars.productsItems != null ||
                healthcareSuppliersVars.clientsItems != null || healthcareSuppliersVars.categoriesItems != null) {
                if (tradenmarkElement != null && tradenmarkElement != undefined &&
                    lettersElement != null && lettersElement != undefined &&
                    indexElement != null && indexElement != undefined) {

                    indexElement.style.display = "none";
                    tradenmarkElement.style.display = "none";
                    lettersElement.style.display = "none";
                    HealthcareSearch.displayList();
                }
            } else {
                var searchHealthcareElement = document.body.querySelector("#searchHealthcareList");
                if (searchHealthcareElement != null && searchHealthcareElement != undefined) {
                    searchHealthcareElement.style.display = "none";
                }
            }

            getClientsByText(healthcareSuppliersVars.letter);

            for (var i = 0; i < 26; i++) {
                lettersArray.push({ letter: String.fromCharCode(65 + i) })
            }

            var lettersIndex = document.getElementById("lettersIndex");
            if (lettersIndex != null && lettersIndex != undefined) {
                lettersIndex = lettersIndex.winControl;
                lettersIndex.itemDataSource = lettersArray.dataSource;
                lettersIndex.oniteminvoked = indexNavigate;
            }

            function indexNavigate(args) {
                Loader.show();
                console.log(lettersArray.getAt(args.detail.itemIndex).letter);
                getClientsByText(lettersArray.getAt(args.detail.itemIndex).letter);
            }


            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displayClientsByText(items.getClientsByTextResult);
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

            function getClientsByText(letter) {
                console.log("getClientsByText");
                if (letter == '') {
                    letter = 'A';
                }
                var letterElement = document.body.querySelector("#letterIndex");
                if (letterElement != null && letterElement != undefined) {
                    letterElement.innerHTML = letter;
                }
                Orientation.onChange();

                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        healthcareSuppliersVars.letter = letter;
                        var options = {
                            url: RESTServices.HealthcareSuppliersEngine + '/getClientsByText?code=' + globalVars.code + "&editionId=" + healthcareSuppliersVars.editionId
                                + "&clientTypeId=" + clientTypeId + "&searchText=" + letter,
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

            function displayClientsByText(clientsList) {
                if (document.body.querySelector("#emptyList")) {
                    if (clientsList.length > 0 && clientsList != null && clientsList != 'undefined') {
                        console.log(clientsList);
                        document.body.querySelector("#emptyList").style.display = "none";
                    } else {
                        if (document.body.querySelector("#emptyList")) {
                            document.body.querySelector("#emptyList").style.display = "block";
                        }
                    }
                }
                
                clientsData = new WinJS.Binding.List(clientsList);

                var trademarkIndex = document.getElementById("trademarkIndex");
                if (trademarkIndex != undefined && trademarkIndex != null) {
                    trademarkIndex = trademarkIndex.winControl;
                    trademarkIndex.itemDataSource = clientsData.dataSource;
                    trademarkIndex.oniteminvoked = displayClientDetail;
                }
                Loader.hide();
            }


            function displayClientDetail(args) {
                Loader.show();
                healthcareSuppliersVars.clientId = clientsData.getAt(args.detail.itemIndex).ClientId;
                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersClientDetail.html');
            }

            //Search Button
            var searchButton = document.body.querySelector("#search");
            if (searchButton != null && searchButton != undefined) {
                searchButton.addEventListener("click", function () {
                    HealthcareSearch.searchText();
                }, false);
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
