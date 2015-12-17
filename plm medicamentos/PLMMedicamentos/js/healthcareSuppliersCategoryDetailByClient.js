// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersCategoryDetailByClient.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            // TODO: Inicializar la página aquí.
            var productsData = {};

            displayDetail(healthcareSuppliersVars.productsItems);

            var categoryParentElement = document.querySelector("#categoryParentName");
            var categoryNameElement = document.querySelector("#categoryName");
            if (categoryParentElement != null && categoryParentElement != undefined &&
                categoryNameElement != null && categoryNameElement != undefined) {
                categoryParentElement.innerHTML = healthcareSuppliersVars.parentCategoryName;
                categoryNameElement.innerHTML = healthcareSuppliersVars.categoryNameByClient;
            }
            Orientation.onChange();

            function displayDetail(products) {
                console.log("displayDetail");
                console.log(products);
                var productsListElement = document.body.querySelector("#productsList");
                var productsListSpanElement = document.body.querySelector("#productsListSpan");
                var productsElement = document.body.querySelector("#products");
                if (products != null && products != 'undefined' && products.length > 0 ) {
                     productsData = new WinJS.Binding.List(products);

                     var productsList = document.getElementById("productsList");
                     if (productsList != null && productsList != undefined) {
                        productsList = productsList.winControl;
                        productsList.itemDataSource = productsData.dataSource;
                        productsList.oniteminvoked = getContentsByProduct;
                     }
                } else {
                    if (document.body.querySelector("#emptyList") && productsElement) {
                        document.body.querySelector("#emptyList").style.display = "block";
                        productsElement.style.display = "none";
                    }
                }
                Loader.hide();

            }

            function getContentsByProduct(args) {
                Loader.show();
                healthcareSuppliersVars.clientId = productsData.getAt(args.detail.itemIndex).ClientId;
                healthcareSuppliersVars.productId = productsData.getAt(args.detail.itemIndex).ProductId;
                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersProductContents.html');
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


function hideCategory(List) {
    var selectedList = document.body.querySelector("#" + List);
    var selectedSpan = document.body.querySelector("#" + List + "Span");
    //console.log(selectedList);
    //console.log(selectedList.style);
    if (selectedList != undefined) {
        //console.log(selectedList.style.display);
        if (selectedList.style.display == "block") {
            selectedList.style.display = "none";
            selectedSpan.innerText = "+";
        } else {
            selectedList.style.display = "block";
            selectedSpan.innerText = "-";
        }
    }
}