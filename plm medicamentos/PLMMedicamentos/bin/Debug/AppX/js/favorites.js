
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/favorites/favorites.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _favoriteProducts = null;

                // Page methods:
                var _getFavorites = function () {
                    return new WinJS.Promise(function (completed, error, progress) {
                        WindowsStorage.getFileContent('Favorites')
                            .then(
                                function (collection) {
                                    favoritesVars.favoritesProducts = [];
                                    favoritesVars.favoritesProductsByCountry = [];

                                    if (collection.length > 0) {
                                        favoritesVars.favoritesProducts = collection;

                                        for (var i = 0; i < favoritesVars.favoritesProducts.length; i++) {
                                            if (globalVars.countryKey == favoritesVars.favoritesProducts[i].CountryKey) {
                                                favoritesVars.favoritesProductsByCountry.push(favoritesVars.favoritesProducts[i]);
                                            }
                                        }
                                    }

                                    completed();
                                }, function (err) {
                                    error(err);
                                }
                            );
                    });
                };
                var _getProductDetail = function (product) {
                    var productInfo = _favoriteProducts.getAt(product.detail.itemIndex);

                    if (typeof (productInfo.CategoryId) != 'undefined'
                        && typeof (productInfo.DivisionId) != 'undefined'
                        && typeof (productInfo.PharmaFormId) != 'undefined'
                        && typeof (productInfo.ProductId) != 'undefined') {
                        productDetail.brand = productInfo.Brand;
                        productDetail.categoryId = productInfo.CategoryId;
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

                _getFavorites()
                    .then(
                        function () {
                            _favoriteProducts = new WinJS.Binding.List(favoritesVars.favoritesProductsByCountry);

                            var favoritesProductsList = document.getElementById('resultsList').winControl;

                            if (favoritesProductsList) {
                                favoritesProductsList.itemDataSource = _favoriteProducts.dataSource;
                                favoritesProductsList.oniteminvoked = _getProductDetail;
                            }
                        }, function (err) {
                            var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                            messageDialog.commands
                                .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                    WinJS.Navigation.back(1);
                                }));
                            messageDialog.showAsync();
                        }
                    );
            }
        });
})();

