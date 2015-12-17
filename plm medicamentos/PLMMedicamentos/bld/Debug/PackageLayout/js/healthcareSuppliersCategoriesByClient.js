// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersCategoriesByClient.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var categoriesData = {};

            displayCategories(healthcareSuppliersVars.categories);
            var companyNameElement = document.querySelector("#companyName");
            if(companyNameElement != null && companyNameElement != undefined){
                companyNameElement.innerHTML = healthcareSuppliersVars.companyName;
            }
            Orientation.onChange();

            function displayCategories(categories) {
                console.log("display Categories By Client");
                if (categories.length > 0 && categories != null && categories != 'undefined') {
                    categoriesData = new WinJS.Binding.List(categories);

                    var categoriesList = document.getElementById("categoriesByClient");
                    if (categoriesList != null && categoriesList != undefined) {
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
                Loader.show();
                healthcareSuppliersVars.productCategoryId = categoriesData.getAt(args.detail.itemIndex).GenericCategoryId;
                healthcareSuppliersVars.productCategoryName = categoriesData.getAt(args.detail.itemIndex).Description;
                healthcareSuppliersVars.itemTypeByClient = categoriesData.getAt(args.detail.itemIndex).Type;
                
                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersClientCategoriesByParent.html');
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
