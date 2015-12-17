// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var productsData = {};

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/clinicalAnalyzesCompanyProducts.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            
            var companyNameElement =  document.querySelector("#companyName");
            if(companyNameElement != null && companyNameElement != undefined){
                companyNameElement.innerHTML = clinicalAnalyzesVars.ProductByEditionInfoItems[0].CompanyName;
            }
           
            Orientation.onChange();
            
            console.log(clinicalAnalyzesVars.ProductByEditionInfoItems);

            productsData = new WinJS.Binding.List(clinicalAnalyzesVars.ProductByEditionInfoItems);

            var productsList = document.getElementById("companyProducts");
            if (productsList != null && productsList != undefined) {
                productsList = productsList.winControl;
                productsList.itemDataSource = productsData.dataSource;
                productsList.oniteminvoked = getProductContent;
            }

            Loader.hide();

            function getProductContent(args) {
                Loader.show();
                console.log(clinicalAnalyzesVars.ProductByEditionInfoItems[args.detail.itemIndex]);
                clinicalAnalyzesVars.productId = clinicalAnalyzesVars.ProductByEditionInfoItems[args.detail.itemIndex].ProductId;
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/clinicalAnalyzesProductContent.html');
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
