
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/products/searchEngine.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _searchResults = '';

                // Page methods:
                var _setStyle = function () {
                    var bodies = document.getElementsByTagName('body');

                    if (bodies
                        && bodies.length > 0
                        && typeof (bodies[0]) != 'undefined') {
                        if (bodies[0].className.indexOf('ui-dark') >= 0) {
                            WinJS.Utilities.removeClass(bodies[0], 'ui-dark');
                        }
                    }
                };
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
                var _cleanAllVariables = function () {

                    // Search Engine variables:
                    searchEngineVars.itemsResults = null;
                    searchEngineVars.productResultCount = 0;
                    searchEngineVars.substanceResultCount = 0;
                    searchEngineVars.indicationResultCount = 0;
                    searchEngineVars.labResultCount = 0;
                    productsVars.ProductByEditionInfoItems = null;
                    productsVars.ProductByEditionInfoCount = 0;
                    substancesVars.ActiveSubstanceInfoItems = null;
                    substancesVars.ActiveSubstanceInfoCount = 0;
                    indicationsVars.IndicationInfoItems = null;
                    indicationsVars.IndicationInfoCount = 0;
                    divisionsVars.DivisionByEditionInfoItems = null;
                    divisionsVars.DivisionByEditionInfoCount = 0;
                    productDetail.brand = '';
                    productDetail.categoryId = 0;
                    productDetail.categoryName = '';
                    productDetail.countryCodes = null;
                    productDetail.divisionId = 0;
                    productDetail.divisionName = '';
                    productDetail.pharmaForm = '';
                    productDetail.pharmaFormId = 0;
                    productDetail.productId = 0;
                    productDetail.productContent = null;
                    productDetail.attributeContent = null;

                    // Interactions variables:
                    interactionsVars.interactionsProducts = [];
                    interactionsVars.interactionsProductsByCountry = [];
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
                var _cleanResults = function () {
                    searchEngineVars.itemsResults = null;
                    searchEngineVars.productResultCount = 0;
                    searchEngineVars.substanceResultCount = 0;
                    searchEngineVars.indicationResultCount = 0;
                    searchEngineVars.labResultCount = 0;
                    productsVars.ProductByEditionInfoItems = null;
                    productsVars.ProductByEditionInfoCount = 0;
                    substancesVars.ActiveSubstanceInfoItems = null;
                    substancesVars.ActiveSubstanceInfoCount = 0;
                    indicationsVars.IndicationInfoItems = null;
                    indicationsVars.IndicationInfoCount = 0;
                    divisionsVars.DivisionByEditionInfoItems = null;
                    divisionsVars.DivisionByEditionInfoCount = 0;
                    productDetail.brand = '';
                    productDetail.categoryId = 0;
                    productDetail.categoryName = '';
                    productDetail.countryCodes = null;
                    productDetail.divisionId = 0;
                    productDetail.divisionName = '';
                    productDetail.pharmaForm = '';
                    productDetail.pharmaFormId = 0;
                    productDetail.productId = 0;
                    productDetail.productContent = null;
                    productDetail.attributeContent = null;

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

                                searchEngineVars.itemsResults = null;

                                if (typeof (result.getResultsResult) != 'undefined') {

                                    searchEngineVars.itemsResults = result.getResultsResult;

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
                            productsVars.ProductByEditionInfoItems = results.Products;
                            productsVars.ProductByEditionInfoCount = results.Products.length;
                            searchEngineVars.productResultCount = results.Products.length;
                        }
                    }

                    // Get Substances:
                    if (typeof (results.Substances) != 'undefined') {
                        if (typeof (results.Substances.length) == 'undefined') {
                            results.Substances = [results.Substances];
                        }

                        if (results.Substances.length > 0) {
                            substancesVars.ActiveSubstanceInfoItems = results.Substances;
                            substancesVars.ActiveSubstanceInfoCount = results.Substances.length;
                            searchEngineVars.substanceResultCount = results.Substances.length;
                        }
                    }

                    // Get Indications:
                    if (typeof (results.Indications) != 'undefined') {
                        if (typeof (results.Indications.length) == 'undefined') {
                            results.Indications = [results.Indications];
                        }

                        if (results.Indications.length > 0) {
                            indicationsVars.IndicationInfoItems = results.Indications;
                            indicationsVars.IndicationInfoCount = results.Indications.length;
                            searchEngineVars.indicationResultCount = results.Indications.length;
                        }
                    }

                    // Get Laboratories:
                    if (typeof (results.Labs) != 'undefined') {
                        if (typeof (results.Labs.length) == 'undefined') {
                            results.Labs = [results.Labs];
                        }

                        if (results.Labs.length > 0) {
                            divisionsVars.DivisionByEditionInfoItems = results.Labs;
                            divisionsVars.DivisionByEditionInfoCount = results.Labs.length;
                            searchEngineVars.labResultCount = results.Labs.length;
                        }
                    }

                    var searchResultsList = [
                        {
                            count: searchEngineVars.productResultCount,
                            displayName: 'Productos',
                            iconImage: 'images/graphicalEnvironment/submenus/submenu_search_results_products.png',
                            uri: 'pages/products/products.html'
                        }, {
                            count: searchEngineVars.substanceResultCount,
                            displayName: 'Sustancias',
                            iconImage: 'images/graphicalEnvironment/submenus/submenu_search_results_substances.png',
                            uri: 'pages/substances/substances.html'
                        }, {
                            count: searchEngineVars.indicationResultCount,
                            displayName: 'Indicaciones',
                            iconImage: 'images/graphicalEnvironment/submenus/submenu_search_results_indications.png',
                            uri: 'pages/indications/indications.html'
                        }, {
                            count: searchEngineVars.labResultCount,
                            displayName: 'Laboratorios',
                            iconImage: 'images/graphicalEnvironment/submenus/submenu_search_results_laboratories.png',
                            uri: 'pages/labs/labs.html'
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

                // Set first time or change country style:
                if (options) {
                    if (typeof (options.firstTime) != 'undefined'
                        && options.firstTime) {
                        _setStyle();

                        WinJS.Navigation.history.backStack = [];
                        options = {};
                    } else if (typeof (options.changedCountry) != 'undefined'
                        && options.changedCountry) {
                        _cleanAllVariables();
                        WinJS.Navigation.history.backStack = [];
                        options = {};
                    }
                }

                _bindEvents();

                // Load results from history:
                if ((searchEngineVars.productResultCount > 0
                    || searchEngineVars.substanceResultCount > 0
                    || searchEngineVars.indicationResultCount > 0
                    || searchEngineVars.labResultCount > 0)
                    && searchEngineVars.itemsResults != null) {
                    _displayResults(searchEngineVars.itemsResults);
                }
            }
        });
})();

