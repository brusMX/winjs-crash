// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var productsData = {};

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/companyProducts.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            
            document.querySelector("#companyName").innerHTML = productsVars.ProductByEditionInfoItems[0].CompanyName;
            Orientation.onChange();
            
            console.log(productsVars.ProductByEditionInfoItems);


            productsData = new WinJS.Binding.List(productsVars.ProductByEditionInfoItems);

            var productsList = document.getElementById("companyProducts").winControl;
            productsList.itemDataSource = productsData.dataSource;
            productsList.oniteminvoked = getProductContent;

            Loader.hide();

            function getProductContent(args) {
                Loader.show();
                console.log(productsVars.ProductByEditionInfoItems[args.detail.itemIndex]);
                productDetail.productId = productsVars.ProductByEditionInfoItems[args.detail.itemIndex].ProductId;
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/productContent.html');
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
