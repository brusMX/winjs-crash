// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersBrands.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var brandsData = {};

            getImageSource();

            function getImageSource() {
                for (var i = 0; i < healthcareSuppliersVars.brandsItems.length; i++) {

                    if (healthcareSuppliersVars.brandsItems[i].BaseUrl == null) { healthcareSuppliersVars.brandsItems[i].BasuUrl = ''; }
                    if (healthcareSuppliersVars.brandsItems[i].Logo == null) { healthcareSuppliersVars.brandsItems[i].Logo = ''; }

                    var imageSource = healthcareSuppliersVars.brandsItems[i].BaseUrl + healthcareSuppliersVars.brandsItems[i].Logo;
                    healthcareSuppliersVars.brandsItems[i].imageSource = imageSource;
                }
                displayBrands(healthcareSuppliersVars.brandsItems);
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
                        brandsList.oniteminvoked = displayClientsByBrand;
                    }

                } else {
                    if (document.body.querySelector("#emptyList")) {
                        document.body.querySelector("#emptyList").style.display = "block";
                    }
                }
                Loader.hide();
            }

            function displayClientsByBrand(args) {
                Loader.show();
                healthcareSuppliersVars.brandId = brandsData.getAt(args.detail.itemIndex).BrandId;
                healthcareSuppliersVars.brandName = brandsData.getAt(args.detail.itemIndex).BrandName;

                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersClientsByBrand.html');
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
