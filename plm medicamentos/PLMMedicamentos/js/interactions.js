
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/interactions/interactions.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _interactionProducts = null;

                // Page methods:
                var _bindEvents = function () {
                    if (document.getElementById('interactionsInstructions')) { document.getElementById('interactionsInstructions').addEventListener('click', _displayInstructions, false); }
                    if (document.getElementById('addProducts')) { document.getElementById('addProducts').addEventListener('click', _addProducts, false); }
                    if (document.getElementById('deleteProducts')) { document.getElementById('deleteProducts').addEventListener('click', _deleteProducts, false); }
                    if (document.getElementById('interactProducts')) { document.getElementById('interactProducts').addEventListener('click', _interactProducts, false); }
                };
                var _unbindEvents = function () {
                    if (document.getElementById('interactionsInstructions')) { document.getElementById('interactionsInstructions').removeEventListener('click', _displayInstructions, false); }
                    if (document.getElementById('addProducts')) { document.getElementById('addProducts').removeEventListener('click', _addProducts, false); }
                    if (document.getElementById('deleteProducts')) { document.getElementById('deleteProducts').removeEventListener('click', _deleteProducts, false); }
                    if (document.getElementById('interactProducts')) { document.getElementById('interactProducts').removeEventListener('click', _interactProducts, false); }
                };
                var _cleanVariables = function () {
                    
                };
                var _displayInstructions = function () {
                    var instructionsUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/manualim/instructivo_interacciones.jpg';
                    var windowsUri = new Windows.Foundation.Uri(instructionsUri);

                    Windows.System.Launcher.launchUriAsync(windowsUri);
                };
                var _addProducts = function () {
                    if (interactionsVars.interactionsProductsByCountry.length < globalVars.interactionsLimit) {
                        _unbindEvents();
                        WinJS.Navigation.navigate('pages/interactions/interactionsSearchEngine.html');
                    } else {
                        var messageDialog = new Windows.UI.Popups.MessageDialog("Borre alg\xFAn medicamento para ingresar otro en su lugar.");

                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                };
                var _deleteProducts = function () {
                    if (interactionsVars.interactionsProductsByCountry.length > 0) {
                        var messageDialog = new Windows.UI.Popups.MessageDialog("\xBFEst\xE1 seguro de que desea eliminar todos los medicamentos?");

                        messageDialog.commands
                            .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                var products = [];

                                for (var i = 0; i < interactionsVars.interactionsProducts.length; i++) {
                                    if (globalVars.countryKey != interactionsVars.interactionsProducts[i].CountryKey) {
                                        products.push(interactionsVars.interactionsProducts[i]);
                                    }
                                }

                                Loader.show();

                                WindowsStorage.writeFileContent('Interactions', products)
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

                                            _interactionProducts = new WinJS.Binding.List(interactionsVars.interactionsProductsByCountry);

                                            Loader.hide();

                                            var interactionsProductsList = document.getElementById('resultsList').winControl;

                                            if (interactionsProductsList) {
                                                interactionsProductsList.itemDataSource = _interactionProducts.dataSource;
                                                interactionsProductsList.oniteminvoked = _deleteProduct;
                                            }
                                        }, function (err) {
                                            Loader.hide();

                                            var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                            messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                            messageDialog.showAsync();
                                        }
                                    );
                            }));
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Cancelar"));
                        messageDialog.showAsync();
                    }
                };
                var _interactProducts = function () {
                    if (interactionsVars.interactionsProductsByCountry.length >= 2) {
                        var products = [];

                        for (var i = 0; i < interactionsVars.interactionsProductsByCountry.length; i++) {
                            var product = {
                                'Brand': interactionsVars.interactionsProductsByCountry[i].Brand,
                                'CategoryName': interactionsVars.interactionsProductsByCountry[i].CategoryName,
                                'CategotyId': interactionsVars.interactionsProductsByCountry[i].CategoryId,
                                'CountryCodes': interactionsVars.interactionsProductsByCountry[i].CountryCodes,
                                'DivisionId': interactionsVars.interactionsProductsByCountry[i].DivisionId,
                                'DivisionName': interactionsVars.interactionsProductsByCountry[i].DivisionName,
                                'DivisionShortName': interactionsVars.interactionsProductsByCountry[i].DivisionShortName,
                                'PharmaForm': interactionsVars.interactionsProductsByCountry[i].PharmaForm,
                                'PharmaFormId': interactionsVars.interactionsProductsByCountry[i].PharmaFormId,
                                'ProductId': interactionsVars.interactionsProductsByCountry[i].ProductId
                            };

                            products.push(product);
                        }

                        Loader.show();

                        InteractionsServices.getInteractionsByProducts(globalVars.countryId, products)
                            .then(
                                function (result) {
                                    Loader.hide();

                                    interactionsVars.interactionsItems = null;

                                    if (typeof (result) != 'undefined'
                                        && typeof (result.length) == 'undefined') {
                                        result = [result];
                                    }

                                    interactionsVars.interactionsItems = result;

                                    if (typeof (result) != 'undefined'
                                        && interactionsVars.interactionsItems.length > 0) {
                                        _unbindEvents();
                                        WinJS.Navigation.navigate('pages/interactions/interactionsResults.html');
                                    } else {
                                        var messageDialog = new Windows.UI.Popups.MessageDialog("Los medicamentos seleccionados no reportaron interacci\xF3n.");

                                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                        messageDialog.showAsync();
                                    }
                                }, function (err) {
                                    Loader.hide();

                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                    messageDialog.showAsync();
                                }
                            );
                    } else {
                        var messageDialog = new Windows.UI.Popups.MessageDialog("Son necesarios al menos dos medicamentos para interaccionar.");

                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                };
                var _deleteProduct = function (product) {
                    var messageDialog = new Windows.UI.Popups.MessageDialog("\xBFEst\xE1 seguro de que desea eliminar el medicamento?");

                    messageDialog.commands
                        .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                            var productIndex = 0;
                            var productInfo = _interactionProducts.getAt(product.detail.itemIndex);

                            Loader.show();

                            for (var i = 0; i < interactionsVars.interactionsProducts.length; i++) {
                                if (interactionsVars.interactionsProducts[i].CountryKey == globalVars.countryKey
                                    && interactionsVars.interactionsProducts[i].CategoryId == productInfo.CategoryId
                                    && interactionsVars.interactionsProducts[i].DivisionId == productInfo.DivisionId
                                    && interactionsVars.interactionsProducts[i].PharmaFormId == productInfo.PharmaFormId
                                    && interactionsVars.interactionsProducts[i].ProductId == productInfo.ProductId) {
                                    productIndex = i;
                                    break;
                                }
                            }

                            interactionsVars.interactionsProducts.splice(productIndex, 1);

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

                                        _interactionProducts = new WinJS.Binding.List(interactionsVars.interactionsProductsByCountry);

                                        Loader.hide();

                                        var interactionsProductsList = document.getElementById('resultsList').winControl;

                                        if (interactionsProductsList) {
                                            interactionsProductsList.itemDataSource = _interactionProducts.dataSource;
                                            interactionsProductsList.oniteminvoked = _deleteProduct;
                                        }
                                    }, function (err) {
                                        Loader.hide();

                                        var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                        messageDialog.showAsync();
                                    }
                                );
                        }));
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Cancelar"));
                    messageDialog.showAsync();
                };

                // Page initialization starts here:

                _bindEvents();

                WindowsStorage.getFileContent('Interactions')
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

                            _interactionProducts = new WinJS.Binding.List(interactionsVars.interactionsProductsByCountry);

                            var interactionsProductsList = document.getElementById('resultsList').winControl;

                            if (interactionsProductsList) {
                                interactionsProductsList.itemDataSource = _interactionProducts.dataSource;
                                interactionsProductsList.oniteminvoked = _deleteProduct;
                            }
                        }, function (err) {
                            var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                            messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                            messageDialog.showAsync();
                        }
                    );
            }
        });
})();

