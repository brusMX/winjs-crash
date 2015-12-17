// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    
    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/clinicalAnalyzesTrademarkIndex.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var lettersArray = new WinJS.Binding.List([]);
            var productsData;
            var indexId = 1;
            clinicalAnalyzesVars.productTypeId = 5;

            Orientation.onChange();
            getProductsByIndex(clinicalAnalyzesVars.letter);
            
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
                getProductsByIndex(lettersArray.getAt(args.detail.itemIndex).letter);
            }


            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log("Results retrieve success", items);
                        displayProductsByIndex(items.getProductsByIndexResult);
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

            function getProductsByIndex(letter) {
                console.log("getProductsByIndex");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        clinicalAnalyzesVars.letter = letter;
                        var options = {
                            url: RESTServices.ClinicalAnalyzesEngine + '/getProductsByIndex?code=' + globalVars.code + "&ISBN=" + globalVars.clinicalAnalyzesISBN + "&indexId=" + indexId
                                + "&productTypeId=" + clinicalAnalyzesVars.productTypeId + "&description=" + letter,
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
                

            function displayProductsByIndex(productsList) {
                if (document.body.querySelector('#emptyList')) {
                    if (productsList.length > 0 && productsList != null && productsList != 'undefined') {
                        document.body.querySelector('#emptyList').style.display = "none";
                    } else {
                        document.body.querySelector('#emptyList').style.display = "block";
                    }
                }
                
                productsData = new WinJS.Binding.List(productsList);

                var trademarkIndex = document.getElementById("trademarkIndex");
                if (trademarkIndex != null && trademarkIndex != undefined) {
                    trademarkIndex = trademarkIndex.winControl;
                    trademarkIndex.itemDataSource = productsData.dataSource;
                    trademarkIndex.oniteminvoked = getProductContent;
                }
                Loader.hide();
            }

            function getProductContent(args) {
                Loader.show();
                console.log(productsData.getAt(args.detail.itemIndex).ProductId);
                clinicalAnalyzesVars.productId = productsData.getAt(args.detail.itemIndex).ProductId;
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/clinicalAnalyzesProductContent.html');
            }

            //Fin de funcion ready
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
