﻿// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/imagingAndRadiology.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var sectionsData = {};
            var sectionIdParent = 13;

            Orientation.onChange();
            getSectionsByParentId();

            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displaySections(items.getSectionsByParentIdResult);
                    } else {
                        console.log("No se encontraron resultados");
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron secciones en esta categoria.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar las secciones.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getSectionsByParentId() {
                console.log("getSectionsByParentId");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.ClinicalAnalyzesEngine + '/getSectionsByParentId?code=' + globalVars.code + "&ISBN=" + globalVars.clinicalAnalyzesISBN + "&sectionIdParent=" + sectionIdParent,
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

            function displaySections(sections) {
                if (sections.length > 0 || sections != null && sections != 'undefined') {
                    sectionsData = new WinJS.Binding.List(sections);

                    var sectionsList = document.getElementById("sections").winControl;
                    sectionsList.itemDataSource = sectionsData.dataSource;
                    sectionsList.oniteminvoked = getSectionsByParent;
                } else {
                    document.body.querySelector("#emptyList").style.display = "block";
                }
                Loader.hide();
            }

            function getSectionsByParent(args) {
                Loader.show();
                console.log(sectionsData.getAt(args.detail.itemIndex).SectionId);
                clinicalAnalyzesVars.sectionParentId = sectionsData.getAt(args.detail.itemIndex).SectionId;
                clinicalAnalyzesVars.sectionParentName = sectionsData.getAt(args.detail.itemIndex).Description;
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/sectionsByParent.html');
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
