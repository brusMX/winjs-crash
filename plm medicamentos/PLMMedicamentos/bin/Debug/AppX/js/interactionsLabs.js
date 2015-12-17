
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/interactions/interactionsLabs.html', {
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

                                    interactionsVars.ProductByEditionInfoItems = null;
                                    interactionsVars.ProductByEditionInfoCount = 0;

                                    if (typeof (result.getDrugsByLabResult) != 'undefined') {
                                        interactionsVars.ProductByEditionInfoItems = result.getDrugsByLabResult;
                                        interactionsVars.ProductByEditionInfoCount = result.getDrugsByLabResult.length;

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

                if (interactionsVars.DivisionByEditionInfoItems != null
                    && interactionsVars.DivisionByEditionInfoCount > 0) {
                    if (interactionsVars.DivisionByEditionInfoItems.length == 'undefined') {
                        interactionsVars.DivisionByEditionInfoItems = [interactionsVars.DivisionByEditionInfoItems];
                    }

                    _divisions = new WinJS.Binding.List(interactionsVars.DivisionByEditionInfoItems);

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

