// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersProducts.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var productsData = {};

            Orientation.onChange();
            displayProducts(healthcareSuppliersVars.productsItems);

            function displayProducts(products) {
                console.log("displayProducts");
                if (products.length > 0 && products != null && products != 'undefined') {
                    productsData = new WinJS.Binding.List(products);

                    var productsList = document.getElementById("productsList");
                    if (productsList != undefined && productsList != null) {
                        productsList = productsList.winControl;
                        productsList.itemDataSource = productsData.dataSource;
                        productsList.oniteminvoked = displayProductContent;
                    }

                } else {
                    if (document.body.querySelector("#emptyList")) {
                        document.body.querySelector("#emptyList").style.display = "block";
                    }
                }
                Loader.hide();
            }

            function displayProductContent(args) {
                Loader.show();
                healthcareSuppliersVars.clientId = productsData.getAt(args.detail.itemIndex).ClientId;
                healthcareSuppliersVars.productId = productsData.getAt(args.detail.itemIndex).ProductId;

                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersProductContents.html');
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
