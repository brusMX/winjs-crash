// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersCategoryDetail.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var productsData = {};
            var clientsData = {};

            getGenericCategoryDetail();

            var categoryParentElement = document.querySelector("#categoryParentName");
            var categoryNameElement = document.querySelector("#categoryName");
            if(categoryParentElement != null && categoryParentElement != undefined &&
                categoryNameElement != null && categoryNameElement != undefined){
                categoryParentElement.innerHTML = healthcareSuppliersVars.parentCategoryName;
                categoryNameElement.innerHTML = healthcareSuppliersVars.categoryName;
            }
            Orientation.onChange();


            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success");
                        displayDetail(items.getGenericCategoryDetailResult);
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

            function getGenericCategoryDetail() {
                console.log("getGenericCategoryDetail");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.HealthcareSuppliersEngine + '/getGenericCategoryDetail?code=' + globalVars.code + "&editionId=" + healthcareSuppliersVars.editionId
                                + "&categoryId=" + healthcareSuppliersVars.categoryId + "&type=" + healthcareSuppliersVars.itemType,
                            type: 'GET'
                        };
                        console.log(options);
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

            function displayDetail(categories) {
                console.log("displayDetail");
                var productsListElement = document.body.querySelector("#productsList");
                var enterprisesListElement = document.body.querySelector("#enterprisesList");
                var productsListSpanElement = document.body.querySelector("#productsListSpan");
                var enterprisesListSpanElement =  document.body.querySelector("#enterprisesListSpan");
                var productsElement = document.body.querySelector("#products");
                var clientsElement = document.body.querySelector("#clients");
                if (categories != null && categories != 'undefined') {
                    if ((categories.Clients.length > 0 && categories.Clients != null && categories.Clients != 'undefined') || (categories.Products.length > 0 && categories.Products != null && categories.Products != 'undefined')) {
                        if ((categories.Clients.length > 0 && categories.Clients != null && categories.Clients != 'undefined') && (categories.Products.length > 0 && categories.Products != null && categories.Products != 'undefined')) {
                            if (productsListElement != undefined && productsListElement != null &&
                                enterprisesListElement != undefined && enterprisesListElement != null &&
                                productsListSpanElement != undefined && productsListSpanElement != null &&
                                enterprisesListSpanElement != undefined && enterprisesListSpanElement != null){
                                    productsListElement.style.display = "none";
                                    enterprisesListElement.style.display = "none";
                                    productsListSpanElement.innerText = "+";
                                    enterprisesListSpanElement.innerText = "+";
                            }
                        }
                        if (categories.Products.length == 0 && productsElement != undefined && productsElement != null) {
                            productsElement.style.display = "none";
                        }
                        if (categories.Clients.length == 0 && clientsElement != undefined && clientsElement != null) {
                            clientsElement.style.display = "none";
                        }
                        document.body.querySelector('#emptyList').style.display = "none";
                        productsData = new WinJS.Binding.List(categories.Products);

                        var productsList = document.getElementById("productsList");
                        if (productsList != null && productsList != undefined) {
                            productsList = productsList.winControl;
                            productsList.itemDataSource = productsData.dataSource;
                            productsList.oniteminvoked = getContentsByProduct;
                        }

                        clientsData = new WinJS.Binding.List(categories.Clients);

                        var enterprisesList = document.getElementById("enterprisesList");
                        if (enterprisesList != null && enterprisesList != undefined) {
                            enterprisesList = enterprisesList.winControl;
                            enterprisesList.itemDataSource = clientsData.dataSource;
                            enterprisesList.oniteminvoked = getClientDetail;
                        }

                    } else {
                        document.body.querySelector('#emptyList').style.display = "block";
                }
                } else {
                    document.body.querySelector('#emptyList').style.display = "block";
                }
                Loader.hide();
               
            }

            function getContentsByProduct(args) {
                Loader.show();
                healthcareSuppliersVars.clientId = productsData.getAt(args.detail.itemIndex).ClientId;
                healthcareSuppliersVars.productId = productsData.getAt(args.detail.itemIndex).ProductId;
                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersProductContents.html');
            }

            function getClientDetail(args) {
                Loader.show();
                healthcareSuppliersVars.clientId = clientsData.getAt(args.detail.itemIndex).ClientId;
                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersClientDetail.html');
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

function changeCategory(showList,hideList) {
    var selectedList = document.body.querySelector("#" + showList);
    var unselectedList = document.body.querySelector("#" + hideList);
    var selectedSpan = document.body.querySelector("#" + showList + "Span");
    var unselectedSpan = document.body.querySelector("#" + hideList + "Span");
    console.log(selectedList);
    console.log(selectedList.style);
    if (selectedList != undefined) {
        console.log("entro");
        console.log(selectedList.style.display);
        if (selectedList.style.display == "block") {
            selectedList.style.display = "none";
            selectedSpan.innerText = "+";
        } else {
            selectedList.style.display = "block";
            selectedSpan.innerText = "-";
        }
    }
    if (unselectedList != undefined) {
        unselectedList.style.display = "none";
        unselectedSpan.innerText = "+";
    }
}