// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareProductsMenu.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            console.log("ready");

            var lettersArray = new WinJS.Binding.List([]);
            var categoriesData;
            var indexId = 3;

            Orientation.onChange();
            getParentGenericCategoriesByText(healthcareSuppliersVars.letter);

            for (var i = 0; i < 26; i++) {
                lettersArray.push({ letter: String.fromCharCode(65 + i) })
            }

            var lettersIndex = document.getElementById("lettersIndex").winControl;
            lettersIndex.itemDataSource = lettersArray.dataSource;
            lettersIndex.oniteminvoked = indexNavigate;

            function indexNavigate(args) {
                Loader.show();
                console.log(lettersArray.getAt(args.detail.itemIndex).letter);
                getParentGenericCategoriesByText(lettersArray.getAt(args.detail.itemIndex).letter);
            }


            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displayCategoriesByText(items.getParentGenericCategoriesByTextResult);
                    } else {
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron productos.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar los productos.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getParentGenericCategoriesByText(letter) {
                console.log("getParentGenericCategoriesByText");
                if (letter == '') {
                    letter = 'A';
                }
                document.body.querySelector("#letterIndex").innerHTML = letter;
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        healthcareSuppliersVars.letter = letter;
                        var options = {
                            url: RESTServices.HealthcareSuppliersEngine + '/getParentGenericCategoriesByText?code=' + globalVars.code + "&editionId=" + healthcareSuppliersVars.editionId
                                + "&searchText=" + letter,
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

            function displayCategoriesByText(categoriesList) {
                if (categoriesList.length > 0 && categoriesList != null && categoriesList != 'undefined') {
                    console.log(categoriesList);
                    document.body.querySelector('#categoriesList').style.display = "none";
                } else {
                    document.body.querySelector('#categoriesList').style.display = "block";
                }
                categoriesData = new WinJS.Binding.List(categoriesList);

                var trademarkIndex = document.getElementById("trademarkIndex").winControl;
                trademarkIndex.itemDataSource = categoriesData.dataSource;
                trademarkIndex.oniteminvoked = getCategoriesByParent;
                Loader.hide();
            }

            function getCategoriesByParent(args) {
                Loader.show();
                console.log(categoriesData.getAt(args.detail.itemIndex).SectionId);
                healthcareSuppliersVars.brandId = categoriesData.getAt(args.detail.itemIndex).GenericCategoryId;
                healthcareSuppliersVars.brandName = categoriesData.getAt(args.detail.itemIndex).Description;
                healthcareSuppliersVars.itemType = categoriesData.getAt(args.detail.itemIndex).Type;
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/healthcareCategoriesByParent.html');
            }
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
