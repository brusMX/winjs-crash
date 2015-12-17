
var resultData;
var clientTypeId = 2;
var productTypeId = 2;

HealthcareSearch = new HealthcareSearchClass;

function HealthcareSearchClass() {
    this.searchText = function () {
        console.log("searchText");
        var searchText = document.getElementById('searchText').value;
        var searchTextReg = /^[a-zA-Z\xE1\xE9\xED\xF1\xF3\xFA\xC1\xC9\xCD\xD1\xD3\xDA\xDC0-9.]/g;

        searchText = searchText.trim();

        if (searchText.length > 2) {
            if (searchTextReg.test(searchText)) {
                HealthcareSearch.getResults(searchText);
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
    }

    this.getResults = function(searchText) {
        console.log("getResults");
        Loader.show();

        var searchHealthcareElement = document.body.querySelector("#searchHealthcareList");
        if (searchHealthcareElement != null && searchHealthcareElement != undefined) {
            searchHealthcareElement.style.display = "block";
        }

        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test().then(function () {
                var options = {
                    url: RESTServices.HealthcareSuppliersEngine + '/getResults?code=' + globalVars.code + "&editionId=" + healthcareSuppliersVars.editionId
                        + "&clientTypeId=" + clientTypeId + "&productTypeId=" + productTypeId + "&searchText=" + searchText,
                    type: 'GET'
                };
                WinJS.xhr(options).done(
                    function (result) {
                        //On Success
                        HealthcareSearch.getResultsDone(result.responseText, result.status);
                    },
                    function (result) {
                        //On Failure
                        HealthcareSearch.getResultsDone(null, result.status);
                    }
                );
            }, function (err) { //Connectivity.test error
                var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                WinJS.Navigation.back(1);
                Loader.hide();
                messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                messageDialog.showAsync();
            });
        });
    }

    this.getResultsDone = function (responseText, status) {
        console.log("getResultsDone");
        if (status === 200) {
            if (responseText != "") {
                var items = JSON.parse(responseText);
                console.log("Results retrieve success",items);
                HealthcareSearch.displayResults(items.getResultsResult);
            } else {
                Loader.hide();
                WinJS.Navigation.back(1);
                var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron resultados.");
                messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                messageDialog.showAsync();
            }
        } else {
            console.log("Error obtaining feed. XHR status code: " + status);
            Loader.hide();
            WinJS.Navigation.back(1);
            var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar los resultados.");
            messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
            messageDialog.showAsync();
        }
    }

    this.displayResults = function (items) {
        console.log("displayResults");
        /* Brands */
        if (items.Brands != null && items.Brands != undefined) {
    
            healthcareSuppliersVars.brandsCount = items.Brands.length;
            healthcareSuppliersVars.brandsItems = items.Brands;
        }
    
        /* Categories */
        if (items.Categories != null && items.Categories != undefined) {
    
            healthcareSuppliersVars.categoriesCount = items.Categories.length;
            healthcareSuppliersVars.categoriesItems = items.Categories;
        }
    
        /* Clients */
        if (items.Clients != null && items.Clients != undefined) {
    
            healthcareSuppliersVars.clientsCount = items.Clients.length;
            healthcareSuppliersVars.clientsItems = items.Clients;
        }
    
        /* Products */
    
        if (items.Products != null && items.Products != undefined) {
    
            healthcareSuppliersVars.productsCount = items.Products.length;
            healthcareSuppliersVars.productsItems = items.Products;
        }
    
    
        HealthcareSearch.displayList();
    
    }
    
    this.displayList = function () {
        console.log("displayList");
    
        var resultsList = [
            {
                count: healthcareSuppliersVars.productsCount,
                displayName: 'Productos',
                iconImage: 'images/graphicalEnvironment/submenus/submenu_search_results_products.png',
                uri: '/pages/healthcareSuppliers/healthcareSuppliersProducts.html'
            }, {
                count: healthcareSuppliersVars.brandsCount,
                displayName: 'Marcas',
                iconImage: 'images/graphicalEnvironment/submenus/submenu_healthcare_brands.png',
                uri: '/pages/healthcareSuppliers/healthcareSuppliersBrands.html'
            }, {
                count: healthcareSuppliersVars.clientsCount,
                displayName: 'Empresas',
                iconImage: 'images/graphicalEnvironment/submenus/submenu_healthcare_enterprises.png',
                uri: '/pages/healthcareSuppliers/healthcareSuppliersClients.html'
            }, {
                count: healthcareSuppliersVars.categoriesCount,
                displayName: 'Categorías de Productos',
                iconImage: 'images/graphicalEnvironment/submenus/submenu_healthcare_categories.png',
                uri: '/pages/healthcareSuppliers/healthcareSuppliersCategories.html'
            }
        ];
    
        var trademarkIndex = document.getElementById("trademarkIndex");
        if (trademarkIndex != undefined && trademarkIndex != null) {
            trademarkIndex.style.display = "none";
        }
    
        var lettersIndex = document.getElementById("lettersIndex");
        if (lettersIndex != undefined && lettersIndex != null) {
            lettersIndex.style.display = "none";
        }
    
        var indexElement = document.body.querySelector("#letterIndex");
        if (indexElement != null && indexElement != undefined) {
            indexElement.style.display = "none";
        }
    
        resultData = new WinJS.Binding.List(resultsList);
    
        var resultList = document.getElementById("searchHealthcareList");
        if (resultList != undefined && resultList != null) {
            resultList = resultList.winControl;
            console.log(resultsList);
            resultList.itemDataSource = resultData.dataSource;
            resultList.layout = new WinJS.UI.GridLayout();
            resultList.layout.maximumRowsOrColumns = 5;
            resultList.layout.orientation = 'vertical';
            resultList.oniteminvoked = HealthcareSearch.fnNavigate;
        }
    
        Orientation.onChange();
        Loader.hide();
    }
    
    this.fnNavigate = function (args) {
        var count = resultData.getAt(args.detail.itemIndex).count;
        if (count != undefined && count > 0) {
            var path = resultData.getAt(args.detail.itemIndex).uri;
            WinJS.Navigation.navigate(path);
        }
    }
}
