// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareCategoriesByParent.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.

            var categoriesData = {};

            getCategoriesByParent();
            var categoryNameElement = document.querySelector("#categoryName");
            if (categoryNameElement != undefined && categoryNameElement != null) {
                categoryNameElement.innerHTML = healthcareSuppliersVars.parentCategoryName;
            }


            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displayCategories(items.getGenericCategoriesByParentResult);
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
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar las compañias.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getCategoriesByParent() {
                console.log("getCategoriesByParent");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.HealthcareSuppliersEngine + '/getGenericCategoriesByParent?code=' + globalVars.code + "&editionId=" + healthcareSuppliersVars.editionId
                                + "&parentId=" + healthcareSuppliersVars.parentCategoryId + "&type=" + healthcareSuppliersVars.itemType,
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

            function displayCategories(categories) {
                Orientation.onChange();
                if (categories.length > 0 && categories != null && categories != 'undefined') {
                    document.body.querySelector('#emptyList').style.display = "none";
                    categoriesData = new WinJS.Binding.List(categories);

                    var categoriesList = document.getElementById("categoriesByParent");
                    if (categoriesList != undefined && categoriesList != null) {
                        categoriesList = categoriesList.winControl;
                        categoriesList.itemDataSource = categoriesData.dataSource;
                        categoriesList.oniteminvoked = displayGenericCategoryDetail;
                    }
                } else {
                    document.body.querySelector('#emptyList').style.display = "block";
                }
                Loader.hide();
            }

            function displayGenericCategoryDetail(args) {
                Loader.show();
                healthcareSuppliersVars.categoryId = categoriesData.getAt(args.detail.itemIndex).GenericCategoryId;
                healthcareSuppliersVars.categoryName = categoriesData.getAt(args.detail.itemIndex).Description;
                healthcareSuppliersVars.itemType = categoriesData.getAt(args.detail.itemIndex).Type;
                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersCategoryDetail.html');
            }

            WinJS.UI.processAll();
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
