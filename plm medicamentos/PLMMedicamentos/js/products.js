
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/products/products.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _products = null;

                // Page methods:
                var _getProductDetail = function (product) {
                    var productInfo = _products.getAt(product.detail.itemIndex);

                    if (typeof (productInfo.CategotyId) != 'undefined'
                        && typeof (productInfo.DivisionId) != 'undefined'
                        && typeof (productInfo.PharmaFormId) != 'undefined'
                        && typeof (productInfo.ProductId) != 'undefined') {
                        productDetail.brand = productInfo.Brand;
                        productDetail.categoryId = productInfo.CategotyId;
                        productDetail.categoryName = productInfo.CategoryName;
                        productDetail.countryCodes = productInfo.CountryCodes;
                        productDetail.divisionId = productInfo.DivisionId;
                        productDetail.divisionName = productInfo.DivisionName;
                        productDetail.divisionShortName = productInfo.DivisionShortName;
                        productDetail.pharmaForm = productInfo.PharmaForm;
                        productDetail.pharmaFormId = productInfo.PharmaFormId;
                        productDetail.productId = productInfo.ProductId;

                        WinJS.Navigation.navigate('pages/products/productDetail.html');
                    }
                };

                // Page initialization starts here:

                if (productsVars.ProductByEditionInfoItems != null
                    && productsVars.ProductByEditionInfoCount > 0) {
                    if (productsVars.ProductByEditionInfoItems.length == 'undefined') {
                        productsVars.ProductByEditionInfoItems = [productsVars.ProductByEditionInfoItems];
                    }

                    _products = new WinJS.Binding.List(productsVars.ProductByEditionInfoItems);

                    var productsList = document.getElementById('resultsList').winControl;

                    if (productsList) {
                        productsList.itemDataSource = _products.dataSource;
                        productsList.oniteminvoked = _getProductDetail;

                        Orientation.onChange();
                    }
                    // Shouldn't happen:
                } else {
                    WinJS.Navigation.back(1);
                }
            }
        });
})();

