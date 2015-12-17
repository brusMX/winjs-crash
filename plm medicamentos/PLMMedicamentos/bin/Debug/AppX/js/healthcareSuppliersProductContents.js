// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersProductContents.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.


            getContentsByProduct();

            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != '') {
                        var items = JSON.parse(responseText);
                        console.log("Results retrieve success",items);

                        productDetail.productContent = items.getContentsByProductResult;
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

            function getContentsByProduct() {
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.HealthcareSuppliersEngine + '/getContentsByProduct?code=' + globalVars.code + "&editionId=" + healthcareSuppliersVars.editionId
                                + "&clientId=" + healthcareSuppliersVars.clientId + "&productId=" + healthcareSuppliersVars.productId + "&resolutionKey=" + globalVars.resolutionKey,
                            type: 'GET'
                        };
                        console.log(options);
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
                if (productDetails != null && productDetails != undefined) {
                    var options = {
                        url: productDetails.BaseUrl + productDetails.ProductShot,
                        type: 'GET'
                    };
                    console.log(options);
                    WinJS.xhr(options).done(
                        function (result) {
                            var imageElement = document.querySelector("#productImage");
                            if (imageElement != null && imageElement != undefined) {
                                if (result.status === 200) {
                                    imageElement.setAttribute("src", productDetails.BaseUrl + productDetails.ProductShot);
                                    imageElement.style.display = "block";
                                } else {
                                    imageElement.setAttribute("src", "");
                                }
                            }
                        },
                        function (result) {
                            var imageElement = document.querySelector("#productImage");
                            if (imageElement != null && imageElement != undefined) {
                                imageElement.setAttribute("src", "");
                            }
                        }
                    );

                    var productNameElement = document.querySelector('#productName');
                    if (productNameElement != null && productNameElement != undefined) {
                        productNameElement.innerHTML = productDetails.ProductName;
                    }
                    Orientation.onChange();

                    //Display the attributes list
                    if (typeof (productDetails.AttributeGroups) != "undefined") {
                    }

                    //console.log(productDetails.Attributes);
                    var attributes = "";

                    for (var i = 0; i < productDetails.AttributeGroups.length; i++) {

                        attributes += '<div>' +
                            '<p class="expandable-menu" onclick="showAttibute(' + i + ',\'' + productDetails.AttributeGroups[i].AttributeGroupKey
                            + '\',\'' + productDetails.ProductName + '\',\'' + productDetails.CompanyName + '\')" id="attributeName' + i + '">'
                            + productDetails.AttributeGroups[i].AttributeGroupName + '<span class="icon-status" id="productsListSpan' + i + '">+</span></p>' +
                            '<div style="display: none; overflow-x: scroll;" id="HTMLContent' + i + '">' + productDetails.AttributeGroups[i].AttributeGroupHTMLContent + '</div></div>';
                    }

                    //console.log(attributes);
                    var attributesElement = document.body.querySelector("#attributes");
                    if (attributesElement != null && attributesElement != undefined) {
                        console.log(attributesElement);
                        attributesElement.innerHTML = attributes;
                    }
                } else {
                    if (document.body.querySelector("#emptyList")) {
                        document.body.querySelector("#emptyList").style.display = "block";
                    }
                }
                Loader.hide();
            }
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


function showAttibute(index, attributeGroupKey, productName, companyName) {
    //console.log(document.body.querySelector("#HTMLContent" + index).style.display);
    var attributeId = document.body.querySelector("#HTMLContent" + index);
    var spanId = document.body.querySelector("#productsListSpan" + index);
    if (attributeId != null && attributeId != undefined && spanId != null && spanId != undefined) {
        if (attributeId.style.display == "none") {
            //console.log("ttrue");
            for (var i = 0; i < productDetail.productContent.AttributeGroups.length; i++) {
                var attributeId2 = document.body.querySelector("#HTMLContent" + i);
                var spanId2 = document.body.querySelector("#productsListSpan" + i);
                if (attributeId2 != null && attributeId2 != undefined && spanId2 != null && spanId2 != undefined) {
                    attributeId2.style.display = "none";
                    spanId2.innerText = "+";
                }
            }
            //console.log(attributeGroupKey, productName, companyName);
            //console.log(healthcareSuppliersVars.clientId, healthcareSuppliersVars.categoryId, healthcareSuppliersVars.productId, healthcareSuppliersVars.categoryName);
            attributeId.style.display = "block";
            spanId.innerText = "-";

            var jsonFormat = '{"Empresa":"' + companyName + '","Categoria":"' + healthcareSuppliersVars.categoryName + '","Producto":"' + productName + '"}';
            var searchParameters = 'ClientId=' + healthcareSuppliersVars.clientId + ';CategoryId=' + healthcareSuppliersVars.categoryId + ';ProductId=' + healthcareSuppliersVars.productId;

            LogsServices.addPLMTrackingActivity(attributeGroupKey,
                globalVars.code,
                globalVars.attributeEntityId,
                globalVars.healthcareSuppliersISBN,
                jsonFormat,
                searchParameters,
                globalVars.parametizedSearchId,
                globalVars.PSESourceId);
        } else {
            //console.log("false");
            attributeId.style.display = "none";
            spanId.innerText = "+";
        }
    }
    
}
