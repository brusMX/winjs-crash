
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/interactions/interactionsProducts.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _products = null;

                // Page methods:
                var _getProductInteraction = function (product) {
                    var productInfo = _products.getAt(product.detail.itemIndex);

                    // Remove:
                    if (productInfo.Listed) {
                        var productIndex = 0;

                        for (var i = 0; i < interactionsVars.interactionsProducts.length; i++) {
                            if (interactionsVars.interactionsProducts[i].CountryKey == globalVars.countryKey
                                && interactionsVars.interactionsProducts[i].CategoryId == productInfo.CategotyId
                                && interactionsVars.interactionsProducts[i].DivisionId == productInfo.DivisionId
                                && interactionsVars.interactionsProducts[i].PharmaFormId == productInfo.PharmaFormId
                                && interactionsVars.interactionsProducts[i].ProductId == productInfo.ProductId) {
                                productIndex = i;
                                break;
                            }
                        }

                        interactionsVars.interactionsProducts.splice(productIndex, 1);

                        _writeFileContent(productInfo, 'interactions-item-checkmark', false);

                        // Add:
                    } else {
                        if (interactionsVars.interactionsProductsByCountry.length < globalVars.interactionsLimit) {
                            var interactionProduct = new Product();
                            interactionProduct.Brand = productInfo.Brand;
                            interactionProduct.CategoryId = productInfo.CategotyId;
                            interactionProduct.CategoryName = productInfo.CategoryName;
                            interactionProduct.CountryCodes = productInfo.CountryCodes;
                            interactionProduct.CountryKey = globalVars.countryKey;
                            interactionProduct.DivisionId = productInfo.DivisionId;
                            interactionProduct.DivisionName = productInfo.DivisionName;
                            interactionProduct.DivisionShortName = productInfo.DivisionShortName;
                            interactionProduct.PharmaForm = productInfo.PharmaForm;
                            interactionProduct.PharmaFormId = productInfo.PharmaFormId;
                            interactionProduct.ProductId = productInfo.ProductId;

                            interactionsVars.interactionsProducts.push(interactionProduct);

                            _writeFileContent(productInfo, 'interactions-item-checkmark checked', true);
                        } else {
                            var messageDialog = new Windows.UI.Popups.MessageDialog("Borre alg\xFAn medicamento para ingresar otro en su lugar.");

                            messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                            messageDialog.showAsync();
                        }
                    }
                };
                var _writeFileContent = function (productInfo, className, listed) {

                    Loader.show();

                    WindowsStorage.writeFileContent('Interactions', interactionsVars.interactionsProducts)
                        .then(
                            function (collection) {
                                interactionsVars.interactionsProducts = [];
                                interactionsVars.interactionsProductsByCountry = [];

                                if (collection.length > 0) {
                                    interactionsVars.interactionsProducts = collection;

                                    for (var i = 0; i < interactionsVars.interactionsProducts.length; i++) {
                                        if (globalVars.countryKey == interactionsVars.interactionsProducts[i].CountryKey) {
                                            interactionsVars.interactionsProductsByCountry.push(interactionsVars.interactionsProducts[i]);
                                        }
                                    }
                                }

                                for (var i = 0; i < interactionsVars.ProductByEditionInfoItems.length; i++) {
                                    if (productInfo.CategotyId == interactionsVars.ProductByEditionInfoItems[i].CategotyId
                                        && productInfo.DivisionId == interactionsVars.ProductByEditionInfoItems[i].DivisionId
                                        && productInfo.PharmaFormId == interactionsVars.ProductByEditionInfoItems[i].PharmaFormId
                                        && productInfo.ProductId == interactionsVars.ProductByEditionInfoItems[i].ProductId) {
                                        interactionsVars.ProductByEditionInfoItems[i].ClassName = className;
                                        interactionsVars.ProductByEditionInfoItems[i].Listed = listed;
                                        break;
                                    }
                                }

                                _products = new WinJS.Binding.List(interactionsVars.ProductByEditionInfoItems);

                                Loader.hide();

                                var productsList = document.getElementById('resultsList').winControl;

                                if (productsList) {
                                    productsList.itemDataSource = _products.dataSource;
                                    productsList.oniteminvoked = _getProductInteraction;
                                }
                            }, function (err) {
                                Loader.hide();

                                var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                messageDialog.showAsync();
                            }
                        );
                };

                // Page initialization starts here:

                if (interactionsVars.ProductByEditionInfoItems != null
                    && interactionsVars.ProductByEditionInfoCount > 0) {
                    if (interactionsVars.ProductByEditionInfoItems.length == 'undefined') {
                        interactionsVars.ProductByEditionInfoItems = [interactionsVars.ProductByEditionInfoItems];
                    }

                    for (var i = 0; i < interactionsVars.ProductByEditionInfoCount; i++) {
                        interactionsVars.ProductByEditionInfoItems[i]['ClassName'] = 'interactions-item-checkmark';
                        interactionsVars.ProductByEditionInfoItems[i]['Listed'] = false;

                        if (interactionsVars.interactionsProducts.length > 0) {
                            for (var j = 0; j < interactionsVars.interactionsProducts.length; j++) {
                                if (interactionsVars.interactionsProducts[j].CategoryId == interactionsVars.ProductByEditionInfoItems[i].CategotyId
                                    && interactionsVars.interactionsProducts[j].DivisionId == interactionsVars.ProductByEditionInfoItems[i].DivisionId
                                    && interactionsVars.interactionsProducts[j].PharmaFormId == interactionsVars.ProductByEditionInfoItems[i].PharmaFormId
                                    && interactionsVars.interactionsProducts[j].ProductId == interactionsVars.ProductByEditionInfoItems[i].ProductId) {
                                    interactionsVars.ProductByEditionInfoItems[i].ClassName += ' checked';
                                    interactionsVars.ProductByEditionInfoItems[i].Listed = true;
                                    break;
                                }
                            }
                        }
                    }

                    _products = new WinJS.Binding.List(interactionsVars.ProductByEditionInfoItems);

                    var productsList = document.getElementById('resultsList').winControl;

                    if (productsList) {
                        productsList.itemDataSource = _products.dataSource;
                        productsList.oniteminvoked = _getProductInteraction;

                        Orientation.onChange();
                    }
                    // Shouldn't happen:
                } else {
                    WinJS.Navigation.back(1);
                }
            }
        });
})();

