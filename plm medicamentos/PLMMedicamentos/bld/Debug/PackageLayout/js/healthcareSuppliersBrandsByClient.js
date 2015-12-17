// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersBrandsByClient.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var brandsData = {};

            var companyNameElement = document.body.querySelector("#companyName");
            if (companyNameElement != null && companyNameElement != undefined) {
                companyNameElement.innerHTML = healthcareSuppliersVars.companyName;
            }
            getImageSource();

            function getImageSource() {
                for (var i = 0; i < healthcareSuppliersVars.brands.length; i++) {

                    if (healthcareSuppliersVars.brands[i].BaseUrl == null) { healthcareSuppliersVars.brands[i].BasuUrl = ''; }
                    if (healthcareSuppliersVars.brands[i].Logo == null) { healthcareSuppliersVars.brands[i].Logo = ''; }

                    var imageSource = healthcareSuppliersVars.brands[i].BaseUrl + healthcareSuppliersVars.brands[i].Logo;
                    healthcareSuppliersVars.brands[i].imageSource= imageSource;
                }
                displayBrands(healthcareSuppliersVars.brands);
            }
           
            function displayBrands(brands) {
                console.log("displayBrands");
                Orientation.onChange();
                if (brands.length > 0 && brands != null && brands != 'undefined') {
                    document.body.querySelector('#emptyList').style.display = "none";
                    brandsData = new WinJS.Binding.List(brands);

                    var brandsList = document.getElementById("brandsList");
                    if (brandsList != undefined && brandsList != null) {
                        brandsList = brandsList.winControl;
                        brandsList.itemDataSource = brandsData.dataSource;
                    }
                    
                    //brandsList.oniteminvoked = displayGenericCategoryDetail;
                } else {
                    if (document.body.querySelector("#emptyList")) {
                        document.body.querySelector("#emptyList").style.display = "block";
                    }
                }
                Loader.hide();
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
