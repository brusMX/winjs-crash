// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/clinicalAnalyzesGenericsIndex.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var lettersArray = new WinJS.Binding.List([]);
            var sectionsData;
            var indexId = 3;

            Orientation.onChange();
            getSectionsByIndex(clinicalAnalyzesVars.letter);

            for (var i = 0; i < 26; i++) {
                lettersArray.push({ letter: String.fromCharCode(65 + i) })
            }

            var lettersIndex = document.getElementById("lettersIndex");
            if (lettersIndex != null && lettersIndex != undefined){
                lettersIndex = lettersIndex.winControl;
                lettersIndex.itemDataSource = lettersArray.dataSource;
                lettersIndex.oniteminvoked = indexNavigate;
            }

            function indexNavigate(args) {
                Loader.show();
                console.log(lettersArray.getAt(args.detail.itemIndex).letter);
                getSectionsByIndex(lettersArray.getAt(args.detail.itemIndex).letter);
            }


            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displaySectionsByIndex(items.getSectionsByIndexResult);
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

            function getSectionsByIndex(letter) {
                console.log("getProductsByIndex");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        clinicalAnalyzesVars.letter = letter;
                        var options = {
                            url: RESTServices.ClinicalAnalyzesEngine + '/getSectionsByIndex?code=' + globalVars.code + "&ISBN=" + globalVars.clinicalAnalyzesISBN + "&indexId=" + indexId + "&description=" + letter,
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

            function displaySectionsByIndex(sectionsList) {
                if (document.body.querySelector('#emptyList')) {
                    if (sectionsList.length > 0 && sectionsList != null && sectionsList != 'undefined') {
                        console.log(sectionsList);
                        document.body.querySelector('#emptyList').style.display = "none";
                    } else {
                        document.body.querySelector('#emptyList').style.display = "block";
                    }
                }
                
                sectionsData = new WinJS.Binding.List(sectionsList);

                var trademarkIndex = document.getElementById("trademarkIndex");
                if (trademarkIndex != null && trademarkIndex != undefined) {
                    trademarkIndex = trademarkIndex.winControl;
                    trademarkIndex.itemDataSource = sectionsData.dataSource;
                    trademarkIndex.oniteminvoked = getProductsBySection;
                }
                Loader.hide();
            }

            function getProductsBySection(args) {
                Loader.show();
                console.log(sectionsData.getAt(args.detail.itemIndex).SectionId);
                clinicalAnalyzesVars.sectionId = sectionsData.getAt(args.detail.itemIndex).SectionId;
                clinicalAnalyzesVars.sectionName = sectionsData.getAt(args.detail.itemIndex).Description;
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/clinicalAnalyzesProductsBySection.html');
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
