
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/products/productDetail.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _products = null;

                // Page methods:
                var _bindEvents = function () {
                    if (document.getElementById('getProductFavorite')) {
                        document.getElementById('getProductFavorite').addEventListener('click', function () {
                            _getProductFavorite(this);
                        }, false);
                    }
                };
                var _unbindEvents = function () {
                    if (document.getElementById('getProductFavorite')) {
                        document.getElementById('getProductFavorite').removeEventListener('click', _getProductFavorite, false);
                    }
                };
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

                                        if (favoritesVars.favoritesProductsByCountry.length > 0) {
                                            for (var i = 0; i < favoritesVars.favoritesProductsByCountry.length; i++) {
                                                if (favoritesVars.favoritesProductsByCountry[i].CategoryId == productDetail.categoryId
                                                    && favoritesVars.favoritesProductsByCountry[i].DivisionId == productDetail.divisionId
                                                    && favoritesVars.favoritesProductsByCountry[i].PharmaFormId == productDetail.pharmaFormId
                                                    && favoritesVars.favoritesProductsByCountry[i].ProductId == productDetail.productId) {
                                                    if (document.getElementById('getProductFavorite')) {
                                                        var productFavorite = document.getElementById('getProductFavorite');
                                                        WinJS.Utilities.addClass(productFavorite, 'favorite');
                                                        break;
                                                    }
                                                }
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
                var _getAllAttributesByProduct = function () {
                    Loader.show();

                    PharmaServices
                        .getAllAttributesByProduct(
                            globalVars.code,
                            globalVars.editionId,
                            productDetail.divisionId,
                            productDetail.categoryId,
                            productDetail.productId,
                            productDetail.pharmaFormId,
                            globalVars.resolutionKey
                        ).then(
                            function (result) {
                                Loader.hide();

                                productDetail.productContent = null;

                                if (typeof (result.getAllAttributesByProductResult) != 'undefined') {
                                    productDetail.productContent = result.getAllAttributesByProductResult;
                                }

                                if (productDetail.productContent != null
                                    && typeof (productDetail.productContent) != 'undefined') {
                                    if (document.getElementById('productName')) {
                                        document.getElementById('productName').innerHTML = productDetail.productContent.Brand;
                                    }

                                    if (document.getElementById('pharmaForm')) {
                                        document.getElementById('pharmaForm').innerHTML = productDetail.productContent.PharmaForm;
                                    }

                                    if (document.getElementById('activeSubstances')) {
                                        if (typeof (productDetail.productContent.Substances.length) == 'undefined') {
                                            productDetail.productContent.Substances = [productDetail.productContent.Substances];
                                        }

                                        var activeSubstances = [];

                                        for (var i = 0; i < productDetail.productContent.Substances.length; i++) {
                                            activeSubstances.push(productDetail.productContent.Substances[i].Description);
                                        }

                                        document.getElementById('activeSubstances').innerHTML = activeSubstances.join(', ');
                                    }

                                    if (document.getElementById('productAttributes')) {
                                        if (typeof (productDetail.productContent.Attributes.length) == 'undefined') {
                                            productDetail.productContent.Attributes = [productDetail.productContent.Attributes];
                                        }

                                        var attributes = '';

                                        for (var i = 0; i < productDetail.productContent.Attributes.length; i++) {
                                            attributes +=
                                                '<div class="product-attribute hidden"'
                                                        + ' data-attribute-id="' + productDetail.productContent.Attributes[i].AttributeId + '"'
                                                        + ' data-attribute-group-key="' + productDetail.productContent.Attributes[i].AttributeGroupKey + '"'
                                                    + '>'
                                                    + '<div class="product-attribute-name">'
                                                        + '<div class="product-attribute-icon">+</div>'
                                                        + productDetail.productContent.Attributes[i].AttributeName
                                                    + '</div>'
                                                    + '<div class="product-attribute-detail">'
                                                        + productDetail.productContent.Attributes[i].HTMLContent
                                                    + '</div>'
                                                + '</div>';
                                        }

                                        document.getElementById('productAttributes').innerHTML = attributes;

                                        var productAttributes = document.getElementsByClassName('product-attribute');

                                        if (productAttributes.length > 0) {
                                            for (var i = 0; i < productAttributes.length; i++) {
                                                productAttributes[i].addEventListener('click', function () {
                                                    _getAttributeDetail(this);
                                                }, false);
                                            }
                                        }
                                    }

                                    if (productDetail.productContent.BaseUrl != null && productDetail.productContent.BaseUrl != ''
                                        && productDetail.productContent.ProductShot != null && productDetail.productContent.ProductShot != '') {
                                        var imageUri = productDetail.productContent.BaseUrl + productDetail.productContent.ProductShot;

                                        WinJS
                                            .xhr({
                                                url: imageUri,
                                                type: 'GET'
                                            }).then(
                                                function requestCompleted(request) {
                                                    if (request.status == 200) {
                                                        if (document.getElementById('productImage')) {
                                                            document.getElementById('productImage').setAttribute('src', imageUri);
                                                        }
                                                    } else {
                                                        console.log("Product Shot invocation failure.");
                                                        console.log("Error: [" + request.status + '] ' + request.statusText);
                                                        console.log("Error response: " + request.responseText);
                                                    }
                                                },
                                                function requestError(request) {
                                                    console.log("Product Shot invocation failure.");
                                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                                    console.log("Error response: " + request.responseText);
                                                }
                                            );
                                    }
                                }
                            }, function (err) {
                                Loader.hide();

                                var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                messageDialog.commands
                                    .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                        WinJS.Navigation.back(1);
                                    }));
                                messageDialog.showAsync();
                            }
                        );
                };
                var _getAttributeDetail = function (item) {
                    var attributeId = item.getAttribute('data-attribute-id');
                    var attributeGroupKey = item.getAttribute('data-attribute-group-key');

                    // Change styles:
                    if (item.className.indexOf('hidden') >= 0) {
                        WinJS.Utilities.removeClass(item, 'hidden');

                        if (item.hasChildNodes
                            && typeof (item.childNodes[0]) != 'undefined'
                            && item.childNodes[0].hasChildNodes) {
                            item.childNodes[0].childNodes[0].innerHTML = '-';
                        }

                        // Showing implies sending attribute tracking:
                        _sendTracking(attributeGroupKey);
                    } else {
                        WinJS.Utilities.addClass(item, 'hidden');

                        if (item.hasChildNodes
                            && typeof (item.childNodes[0]) != 'undefined'
                            && item.childNodes[0].hasChildNodes) {
                            item.childNodes[0].childNodes[0].innerHTML = '+';
                        }
                    }

                    var productAttributes = document.getElementsByClassName('product-attribute');

                    if (productAttributes.length > 0) {
                        for (var i = 0; i < productAttributes.length; i++) {
                            if (attributeId != productAttributes[i].getAttribute('data-attribute-id')) {
                                if (productAttributes[i].className.indexOf('hidden') < 0) {
                                    WinJS.Utilities.addClass(productAttributes[i], 'hidden');

                                    if (productAttributes[i].hasChildNodes
                                        && typeof (productAttributes[i].childNodes[0]) != 'undefined'
                                        && productAttributes[i].childNodes[0].hasChildNodes) {
                                        productAttributes[i].childNodes[0].childNodes[0].innerHTML = '+';
                                    }
                                }
                            }
                        }

                    }
                };
                var _sendTracking = function (attributeGroupKey) {
                    var jsonFormat = '{"Laboratorio":"' + productDetail.divisionName + '","Categoria":"' + productDetail.categoryName + '","Producto":"' + productDetail.brand + '","Forma Farmaceutica":"' + productDetail.pharmaForm + '"}';
                    var searchParameters = 'DivisionId=' + productDetail.divisionId + ';CategoryId=' + productDetail.categoryId + ';ProductId=' + productDetail.productId + ';PharmaFormId=' + productDetail.pharmaFormId;

                    LogsServices.addPLMTrackingActivity(attributeGroupKey, globalVars.code, globalVars.attributeEntityId, globalVars.isbn, jsonFormat, searchParameters, globalVars.parametizedSearchId, globalVars.PSESourceId);
                };
                var _getProductFavorite = function (item) {
                    // Remove:
                    if (item.className.indexOf('favorite') >= 0) {
                        var productIndex = 0;

                        for (var i = 0; i < favoritesVars.favoritesProducts.length; i++) {
                            if (favoritesVars.favoritesProducts[i].CountryKey == globalVars.countryKey
                                && favoritesVars.favoritesProducts[i].CategoryId == productDetail.categoryId
                                && favoritesVars.favoritesProducts[i].DivisionId == productDetail.divisionId
                                && favoritesVars.favoritesProducts[i].PharmaFormId == productDetail.pharmaFormId
                                && favoritesVars.favoritesProducts[i].ProductId == productDetail.productId) {
                                productIndex = i;
                                break;
                            }
                        }

                        favoritesVars.favoritesProducts.splice(productIndex, 1);

                        _writeFileContent(item, false);
                    } else {
                        var favoriteProduct = new Product();
                        favoriteProduct.Brand = productDetail.brand;
                        favoriteProduct.CategoryId = productDetail.categoryId;
                        favoriteProduct.CategoryName = productDetail.categoryName;
                        favoriteProduct.CountryCodes = productDetail.countryCodes;
                        favoriteProduct.CountryKey = globalVars.countryKey;
                        favoriteProduct.DivisionId = productDetail.divisionId;
                        favoriteProduct.DivisionName = productDetail.divisionName;
                        favoriteProduct.DivisionShortName = productDetail.divisionShortName;
                        favoriteProduct.PharmaForm = productDetail.pharmaForm;
                        favoriteProduct.PharmaFormId = productDetail.pharmaFormId;
                        favoriteProduct.ProductId = productDetail.productId;

                        favoritesVars.favoritesProducts.push(favoriteProduct);

                        _writeFileContent(item, true);
                    }
                };
                var _writeFileContent = function (item, listed) {
                    Loader.show();

                    WindowsStorage.writeFileContent('Favorites', favoritesVars.favoritesProducts)
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

                                if (listed) {
                                    WinJS.Utilities.addClass(item, 'favorite');
                                } else {
                                    WinJS.Utilities.removeClass(item, 'favorite');
                                }

                                Loader.hide();
                            }, function (err) {
                                Loader.hide();

                                var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                messageDialog.showAsync();
                            }
                        );
                };

                // Page initialization starts here:

                _bindEvents();

                if (productDetail.categoryId > 0
                    && productDetail.divisionId > 0
                    && productDetail.pharmaFormId > 0
                    && productDetail.productId > 0) {
                    
                    _getFavorites()
                        .then(
                            function () {
                                _getAllAttributesByProduct();
                            }, function (err) {
                                var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                messageDialog.showAsync();

                                _getAllAttributesByProduct();
                            }
                        );

                    // Shouldn't happen:
                } else {
                    WinJS.Navigation.back(1);
                }
            }
        });
})();