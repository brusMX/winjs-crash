// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/clinicalAnalyzesBrandsIndex.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var lettersArray = new WinJS.Binding.List([]);
            var brandsData;
            var indexId = 4;
            Orientation.onChange();

            getBrands(clinicalAnalyzesVars.letter);

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
                getBrands(lettersArray.getAt(args.detail.itemIndex).letter);
            }


            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displayBrands(items.getBrandsResult);
                    } else {
                        console.log("No se encontraron resultados");
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron marcas participantes en esta categoria.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar las marcas comerciales.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getBrands(letter) {
                console.log("getBrands");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        clinicalAnalyzesVars.letter = letter;
                        var options = {
                            url: RESTServices.ClinicalAnalyzesEngine + '/getBrands?code=' + globalVars.code + "&ISBN=" + globalVars.clinicalAnalyzesISBN + "&indexId=" + indexId + "&description=" + letter,
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

            function displayBrands(brandsList) {
                if (document.body.querySelector('#emptyList')) {
                    if (brandsList.length > 0) {
                        console.log(brandsList);
                        document.body.querySelector('#emptyList').style.display = "none";
                    } else {
                        document.body.querySelector('#emptyList').style.display = "block";
                    }
                }
                
                brandsData = new WinJS.Binding.List(brandsList);

                var trademarkIndex = document.getElementById("trademarkIndex");
                if (trademarkIndex != null && trademarkIndex != undefined){
                    trademarkIndex = trademarkIndex.winControl;
                    trademarkIndex.itemDataSource = brandsData.dataSource;
                    trademarkIndex.oniteminvoked = getCompaniesByBrand;
                }
                Loader.hide();
            }

            function getCompaniesByBrand(args) {
                Loader.show();
                console.log(brandsData.getAt(args.detail.itemIndex).SectionId);
                clinicalAnalyzesVars.brandId = brandsData.getAt(args.detail.itemIndex).BrandId;
                clinicalAnalyzesVars.brandName = brandsData.getAt(args.detail.itemIndex).BrandName;
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/clinicalAnalyzesCompaniesByBrand.html');
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
