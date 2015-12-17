// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/productsBySection.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var productsData = {};

            document.querySelector("#sectionName").innerHTML = clinicalAnalyzesVars.sectionName;

            Orientation.onChange();
            getProductsBySection();

            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displayProductsBySection(items.getProductsBySectionResult);
                    } else {
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        messageDialog.showAsync();
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron productos en esta secci&oacute;n.");
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

            function getProductsBySection() {
                console.log("getProductsBySection");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.ClinicalAnalyzesEngine + '/getProductsBySection?code=' + globalVars.code + "&ISBN=" + globalVars.clinicalAnalyzesISBN + "&sectionId=" + clinicalAnalyzesVars.sectionId,
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

            function displayProductsBySection(products) {
                if (products.length > 0 && products != null && products != 'undefined') {
                    document.body.querySelector("#emptyList").style.display = "none";

                    productsData = new WinJS.Binding.List(products);

                    var productsList = document.getElementById("productsBySection").winControl;
                    productsList.itemDataSource = productsData.dataSource;
                    productsList.oniteminvoked = getProductContent;
                } else {
                    document.body.querySelector("#emptyList").style.display = "block";
                }
                Loader.hide();
            }

            function getProductContent(args) {
                Loader.show();
                console.log(productsData.getAt(args.detail.itemIndex).ProductId);
                productDetail.productId = productsData.getAt(args.detail.itemIndex).ProductId;
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/productContent.html');
            }

            WinJS.UI.processAll();
            //Fin de Ready
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
