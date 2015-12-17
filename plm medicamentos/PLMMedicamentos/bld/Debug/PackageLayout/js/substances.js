
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/substances/substances.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _activeSubstances = null;

                // Page methods:
                var _getDrugsBySubstance = function (activeSubstance) {
                    var activeSubstanceInfo = _activeSubstances.getAt(activeSubstance.detail.itemIndex);

                    if (typeof (activeSubstanceInfo.ActiveSubstanceId) != 'undefined') {
                        Loader.show();

                        PharmaServices.getDrugsBySubstance(globalVars.code, globalVars.countryId, globalVars.editionId, activeSubstanceInfo.ActiveSubstanceId)
                            .then(
                                function (result) {
                                    Loader.hide();

                                    productsVars.ProductByEditionInfoItems = null;
                                    productsVars.ProductByEditionInfoCount = 0;

                                    if (typeof (result.getDrugsBySubstanceResult) != 'undefined') {
                                        productsVars.ProductByEditionInfoItems = result.getDrugsBySubstanceResult;
                                        productsVars.ProductByEditionInfoCount = result.getDrugsBySubstanceResult.length;

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

                if (substancesVars.ActiveSubstanceInfoItems != null
                    && substancesVars.ActiveSubstanceInfoCount > 0) {
                    if (substancesVars.ActiveSubstanceInfoItems.length == 'undefined') {
                        substancesVars.ActiveSubstanceInfoItems = [substancesVars.ActiveSubstanceInfoItems];
                    }

                    _activeSubstances = new WinJS.Binding.List(substancesVars.ActiveSubstanceInfoItems);

                    var activeSubstancesList = document.getElementById('resultsList').winControl;

                    if (activeSubstancesList) {
                        activeSubstancesList.itemDataSource = _activeSubstances.dataSource;
                        activeSubstancesList.oniteminvoked = _getDrugsBySubstance;

                        Orientation.onChange();
                    }
                    // Shouldn't happen:
                } else {
                    WinJS.Navigation.back(1);
                }
            }
        });
})();

