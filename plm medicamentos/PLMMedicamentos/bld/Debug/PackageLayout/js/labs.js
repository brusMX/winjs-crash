
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/labs/labs.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _divisions = null;

                // Page methods:
                var _getDrugsByLab = function (division) {
                    var divisionInfo = _divisions.getAt(division.detail.itemIndex);

                    if (typeof (divisionInfo.DivisionId) != 'undefined') {
                        Loader.show();

                        PharmaServices.getDrugsByLab(globalVars.code, globalVars.countryId, globalVars.editionId, divisionInfo.DivisionId)
                            .then(
                                function (result) {
                                    Loader.hide();

                                    productsVars.ProductByEditionInfoItems = null;
                                    productsVars.ProductByEditionInfoCount = 0;

                                    if (typeof (result.getDrugsByLabResult) != 'undefined') {
                                        productsVars.ProductByEditionInfoItems = result.getDrugsByLabResult;
                                        productsVars.ProductByEditionInfoCount = result.getDrugsByLabResult.length;

                                        WinJS.Navigation.navigate('pages/products/products.html');
                                    }
                                }, function (err) {
                                    Loader.hide();

                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                    messageDialog.showAsync();
                                }
                            );
                    }
                };

                // Page initialization starts here:

                if (divisionsVars.DivisionByEditionInfoItems != null
                    && divisionsVars.DivisionByEditionInfoCount > 0) {
                    if (divisionsVars.DivisionByEditionInfoItems.length == 'undefined') {
                        divisionsVars.DivisionByEditionInfoItems = [divisionsVars.DivisionByEditionInfoItems];
                    }

                    _divisions = new WinJS.Binding.List(divisionsVars.DivisionByEditionInfoItems);

                    var labsList = document.getElementById('resultsList').winControl;

                    if (labsList) {
                        labsList.itemDataSource = _divisions.dataSource;
                        labsList.oniteminvoked = _getDrugsByLab;

                        Orientation.onChange();
                    }
                    // Shouldn't happen:
                } else {
                    WinJS.Navigation.back(1);
                }
            }
        });
})();

