// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersCategories.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var categoriesData = {};

            Orientation.onChange();
            displayCategories(healthcareSuppliersVars.categoriesItems);

            function displayCategories(categories) {
                console.log("displayCategories");
                if (categories.length > 0 && categories != null && categories != 'undefined') {
                    categoriesData = new WinJS.Binding.List(categories);

                    var categoriesList = document.getElementById("categoriesList");
                    if (categoriesList != undefined && categoriesList != null) {
                        categoriesList = categoriesList.winControl;
                        categoriesList.itemDataSource = categoriesData.dataSource;
                        categoriesList.oniteminvoked = getCategoriesByParent;
                    }

                } else {
                    if (document.body.querySelector("#emptyList")) {
                        document.body.querySelector("#emptyList").style.display = "block";
                    }
                }
                Loader.hide();
            }

            function getCategoriesByParent(args) {
                Loader.show();
                console.log(categoriesData.getAt(args.detail.itemIndex).GenericCategoryId);
                healthcareSuppliersVars.parentCategoryId = categoriesData.getAt(args.detail.itemIndex).GenericCategoryId;
                healthcareSuppliersVars.parentCategoryName = categoriesData.getAt(args.detail.itemIndex).Description;
                healthcareSuppliersVars.itemType = categoriesData.getAt(args.detail.itemIndex).Type;
                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersCategoriesByParent.html');
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
