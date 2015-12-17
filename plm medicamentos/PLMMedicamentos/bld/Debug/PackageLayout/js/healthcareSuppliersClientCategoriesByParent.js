// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersClientCategoriesByParent.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.

            var categoriesData = {};

            getCategoriesByParentByClient();
            var companyNameElement = document.querySelector("#companyName");
            var categoryName = document.querySelector("#categoryName");
            if(companyNameElement != null && companyNameElement != undefined &&
                categoryName != null && categoryName != undefined){
                    companyNameElement.innerHTML = healthcareSuppliersVars.companyName;
                    categoryName.innerHTML = healthcareSuppliersVars.productCategoryName;
            }
            Orientation.onChange();


            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log("Results retrieve success",items);
                        displayCategories(items.getGenericCategoriesByParentByClientResult);
                    } else {
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron categorías.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar las categorías.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getCategoriesByParentByClient() {
                console.log("getCategoriesByParentByClient");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.HealthcareSuppliersEngine + '/getGenericCategoriesByParentByClient?code=' + globalVars.code + "&editionId=" + healthcareSuppliersVars.editionId
                                + "&parentId=" + healthcareSuppliersVars.productCategoryId + "&clientId=" + healthcareSuppliersVars.clientId + "&type=" + healthcareSuppliersVars.itemTypeByClient,
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
                console.log("displayCategories");
                if (categories != null && categories != 'undefined' && categories.length > 0 ) {
                    for (var i = 0; i < categories.length; i++) {
                        if (categories[i].Products != null && categories[i].Products != undefined && categories[i].Products.length > 0) {
                            categories[i].Arrow = '<i><i>';
                        } else {
                            categories[i].Arrow = '';
                        }
                    }
                    
                    categoriesData = new WinJS.Binding.List(categories);
                    var categoriesList = document.getElementById("categoriesByParent");
                    if (categoriesList != null & categoriesList != undefined) {
                        categoriesList = categoriesList.winControl;
                        categoriesList.itemDataSource = categoriesData.dataSource;
                        categoriesList.oniteminvoked = displayGenericCategoryDetail;
                    }
                } else {
                    if (document.body.querySelector("#emptyList")) {
                        document.body.querySelector("#emptyList").style.display = "block";
                    }
                }
                Loader.hide();
            }

            function displayGenericCategoryDetail(args) {
                if (categoriesData.getAt(args.detail.itemIndex).Products && categoriesData.getAt(args.detail.itemIndex).Products.length > 0) {
                    Loader.show();
                    healthcareSuppliersVars.categoryNameByClient = categoriesData.getAt(args.detail.itemIndex).Description;
                    healthcareSuppliersVars.productsItems = categoriesData.getAt(args.detail.itemIndex).Products;
                    WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersCategoryDetailByClient.html');
                }
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
