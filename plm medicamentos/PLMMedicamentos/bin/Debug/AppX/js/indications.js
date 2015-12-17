
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/indications/indications.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _indications = null;

                // Page methods:
                var _getDrugsByIndication = function (indication) {
                    var indicationInfo = _indications.getAt(indication.detail.itemIndex);

                    if (typeof (indicationInfo.IndicationId) != 'undefined') {
                        Loader.show();

                        PharmaServices.getDrugsByIndication(globalVars.code, globalVars.countryId, globalVars.editionId, indicationInfo.IndicationId)
                            .then(
                                function (result) {
                                    Loader.hide();

                                    productsVars.ProductByEditionInfoItems = null;
                                    productsVars.ProductByEditionInfoCount = 0;

                                    if (typeof (result.getDrugsByIndicationResult) != 'undefined') {
                                        productsVars.ProductByEditionInfoItems = result.getDrugsByIndicationResult;
                                        productsVars.ProductByEditionInfoCount = result.getDrugsByIndicationResult.length;

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

                if (indicationsVars.IndicationInfoItems != null
                    && indicationsVars.IndicationInfoCount > 0) {
                    if (indicationsVars.IndicationInfoItems.length == 'undefined') {
                        indicationsVars.IndicationInfoItems = [indicationsVars.IndicationInfoItems];
                    }

                    _indications = new WinJS.Binding.List(indicationsVars.IndicationInfoItems);

                    var indicationsList = document.getElementById('resultsList').winControl;

                    if (indicationsList) {
                        indicationsList.itemDataSource = _indications.dataSource;
                        indicationsList.oniteminvoked = _getDrugsByIndication;

                        Orientation.onChange();
                    }
                    // Shouldn't happen:
                } else {
                    WinJS.Navigation.back(1);
                }
            }
        });
})();

