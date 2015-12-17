
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/interactions/interactionsSearchEngine.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _searchResults = '';

                // Page methods:
                var _bindEvents = function () {
                    if (document.getElementById('search')) {
                        document.getElementById('search').addEventListener('click', _searchText, false);
                    }
                };
                var _unbindEvents = function () {
                    if (document.getElementById('search')) {
                        document.getElementById('search').removeEventListener('click', _searchText, false);
                    }
                };
                var _cleanVariables = function () {
                    
                };
                var _cleanResults = function () {
                    interactionsVars.itemsResults = null;
                    interactionsVars.indicationResultCount = 0;
                    interactionsVars.labResultCount = 0;
                    interactionsVars.productResultCount = 0;
                    interactionsVars.substanceResultCount = 0;
                    interactionsVars.ActiveSubstanceInfoCount = 0;
                    interactionsVars.ActiveSubstanceInfoItems = null;
                    interactionsVars.DivisionByEditionInfoCount = 0;
                    interactionsVars.DivisionByEditionInfoItems = null;
                    interactionsVars.IndicationInfoCount = 0;
                    interactionsVars.IndicationInfoItems = null;
                    interactionsVars.ProductByEditionInfoCount = 0;
                    interactionsVars.ProductByEditionInfoItems = null;
                };
                var _searchText = function () {
                    var searchText = document.getElementById('searchText').value;
                    var searchTextReg = /^[a-zA-Z\xE1\xE9\xED\xF1\xF3\xFA\xC1\xC9\xCD\xD1\xD3\xDA\xDC0-9.]/g;

                    searchText = searchText.trim();

                    if (searchText.length >= 3) {
                        if (searchTextReg.test(searchText)) {
                            _getResults(searchText);
                        } else {
                            var messageDialog = new Windows.UI.Popups.MessageDialog("Ingrese un t\xE9rmino v\xE1lido para continuar.");

                            messageDialog.commands
                                .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                    document.getElementById('searchText').focus();
                                }));
                            messageDialog.showAsync();
                        }
                    } else {
                        if (searchText.length > 0) {
                            var messageDialog = new Windows.UI.Popups.MessageDialog("Ingrese al menos 3 caracteres para continuar.");

                            messageDialog.commands
                                .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                    document.getElementById('searchText').focus();
                                }));
                            messageDialog.showAsync();
                        } else {
                            document.getElementById('searchText').focus();
                        }
                    }
                };
                var _getResults = function (searchText) {

                    Loader.show();

                    _cleanResults();

                    PharmaServices.getResults(globalVars.code, globalVars.countryId, globalVars.editionId, searchText)
                        .then(
                            function (result) {
                                Loader.hide();

                                interactionsVars.itemsResults = null;

                                if (typeof (result.getResultsResult) != 'undefined') {

                                    interactionsVars.itemsResults = result.getResultsResult;

                                    _displayResults(result.getResultsResult);
                                }
                            }, function (err) {
                                Loader.hide();

                                var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                messageDialog.showAsync();
                            }
                        );
                };
                var _displayResults = function (results) {
                    // Get Products:
                    if (typeof (results.Products) != 'undefined') {
                        if (typeof (results.Products.length) == 'undefined') {
                            results.Products = [results.Products];
                        }

                        if (results.Products.length > 0) {
                            interactionsVars.ProductByEditionInfoItems = results.Products;
                            interactionsVars.ProductByEditionInfoCount = results.Products.length;
                            interactionsVars.productResultCount = results.Products.length;
                        }
                    }

                    // Get Substances:
                    if (typeof (results.Substances) != 'undefined') {
                        if (typeof (results.Substances.length) == 'undefined') {
                            results.Substances = [results.Substances];
                        }

                        if (results.Substances.length > 0) {
                            interactionsVars.ActiveSubstanceInfoItems = results.Substances;
                            interactionsVars.ActiveSubstanceInfoCount = results.Substances.length;
                            interactionsVars.substanceResultCount = results.Substances.length;
                        }
                    }

                    // Get Indications:
                    if (typeof (results.Indications) != 'undefined') {
                        if (typeof (results.Indications.length) == 'undefined') {
                            results.Indications = [results.Indications];
                        }

                        if (results.Indications.length > 0) {
                            interactionsVars.IndicationInfoItems = results.Indications;
                            interactionsVars.IndicationInfoCount = results.Indications.length;
                            interactionsVars.indicationResultCount = results.Indications.length;
                        }
                    }

                    // Get Laboratories:
                    if (typeof (results.Labs) != 'undefined') {
                        if (typeof (results.Labs.length) == 'undefined') {
                            results.Labs = [results.Labs];
                        }

                        if (results.Labs.length > 0) {
                            interactionsVars.DivisionByEditionInfoItems = results.Labs;
                            interactionsVars.DivisionByEditionInfoCount = results.Labs.length;
                            interactionsVars.labResultCount = results.Labs.length;
                        }
                    }

                    var searchResultsList = [
                        {
                            count: interactionsVars.productResultCount,
                            displayName: 'Productos',
                            iconImage: 'images/graphicalEnvironment/submenus/submenu_search_results_products.png',
                            uri: 'pages/interactions/interactionsProducts.html'
                        }, {
                            count: interactionsVars.substanceResultCount,
                            displayName: 'Sustancias',
                            iconImage: 'images/graphicalEnvironment/submenus/submenu_search_results_substances.png',
                            uri: 'pages/interactions/interactionsSubstances.html'
                        }, {
                            count: interactionsVars.indicationResultCount,
                            displayName: 'Indicaciones',
                            iconImage: 'images/graphicalEnvironment/submenus/submenu_search_results_indications.png',
                            uri: 'pages/interactions/interactionsIndications.html'
                        }, {
                            count: interactionsVars.labResultCount,
                            displayName: 'Laboratorios',
                            iconImage: 'images/graphicalEnvironment/submenus/submenu_search_results_laboratories.png',
                            uri: 'pages/interactions/interactionsLabs.html'
                        }
                    ];

                    // List binding:
                    _searchResults = new WinJS.Binding.List(searchResultsList);

                    var resultsList = document.getElementById('resultsList').winControl;

                    if (resultsList) {
                        resultsList.itemDataSource = _searchResults.dataSource;
                        resultsList.oniteminvoked = _displayResultsList;
                        resultsList.layout = new WinJS.UI.GridLayout();
                        resultsList.layout.maximumRowsOrColumns = 5;
                        resultsList.layout.orientation = 'vertical';

                        Orientation.onChange();
                    }
                };
                var _displayResultsList = function (type) {
                    var typeInfo = _searchResults.getAt(type.detail.itemIndex);

                    if (typeof (typeInfo.displayName) != 'undefined'
                        && typeInfo.count > 0) {
                        _unbindEvents();
                        WinJS.Navigation.navigate(typeInfo.uri);
                    }
                };

                // Page initialization starts here:

                _bindEvents();

                // Load results from history:
                if ((interactionsVars.productResultCount > 0
                    || interactionsVars.substanceResultCount > 0
                    || interactionsVars.indicationResultCount > 0
                    || interactionsVars.labResultCount > 0)
                    && interactionsVars.itemsResults != null) {
                    _displayResults(interactionsVars.itemsResults);
                }
            }
        });
})();

