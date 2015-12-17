
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/interactions/interactionsSubstances.html', {
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

                                    interactionsVars.ProductByEditionInfoItems = null;
                                    interactionsVars.ProductByEditionInfoCount = 0;

                                    if (typeof (result.getDrugsBySubstanceResult) != 'undefined') {
                                        interactionsVars.ProductByEditionInfoItems = result.getDrugsBySubstanceResult;
                                        interactionsVars.ProductByEditionInfoCount = result.getDrugsBySubstanceResult.length;

                                        WinJS.Navigation.navigate('pages/interactions/interactionsProducts.html');
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

                if (interactionsVars.ActiveSubstanceInfoItems != null
                    && interactionsVars.ActiveSubstanceInfoCount > 0) {
                    if (interactionsVars.ActiveSubstanceInfoItems.length == 'undefined') {
                        interactionsVars.ActiveSubstanceInfoItems = [interactionsVars.ActiveSubstanceInfoItems];
                    }

                    _activeSubstances = new WinJS.Binding.List(interactionsVars.ActiveSubstanceInfoItems);

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

