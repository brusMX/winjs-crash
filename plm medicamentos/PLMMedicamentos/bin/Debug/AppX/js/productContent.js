// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/productContent.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.

            getProductDetail();

            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != '') {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displayProductContent(items.getContentsByProductResult);
                    } else {
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se pudo encontrar el detalle del producto.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar el detalle del producto.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getProductDetail() {
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.ClinicalAnalyzesEngine + '/getContentsByProduct?code=' + globalVars.code + "&ISBN=" + globalVars.clinicalAnalyzesISBN + "&productId=" + productDetail.productId,
                            type: 'GET'
                        };
                        WinJS.xhr(options).done(
                            function (result) {
                                callback(result.responseText, result.status);
                            },
                            function (result) {
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
            
            function displayProductContent(productDetails) {
                if (productDetails != null && productDetails != 'undefined') {
                    document.body.querySelector("#productName").innerHTML = productDetails.ProductName;
                    if (productDetails.HTMLContent != '') {
                        document.body.querySelector('#productContents').innerHTML =productDetails.HTMLContent;
                    } else {
                        document.body.querySelector('#productContents').innerHTML = '<p class="alignCenter">Detalle del producto no disponible.</p>';
                    }
                } else {
                    document.body.querySelector('#productContents').innerHTML = '<p class="alignCenter">Detalle del producto no disponible.</p>';
                }
                Orientation.onChange();
                Loader.hide();
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
