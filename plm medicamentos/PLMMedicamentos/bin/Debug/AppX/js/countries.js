
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/settings/countries.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page methods:
                var _changeCountry = function (country) {
                    var countryInfo = Navigation.countries.getAt(country.detail.itemIndex);

                    if (globalVars.countryKey != countryInfo.countryKey) {

                        globalVars.countryKey = countryInfo.countryKey;

                        Loader.show();

                        XML.load()
                            .then(Countries.set)
                            .then(
                                function () {
                                    Loader.hide();

                                    Navigation.set();

                                    // Clean navigation:
                                    var options = {
                                        changedCountry: true
                                    };

                                    WinJS.Navigation.navigate('pages/products/searchEngine.html', options);

                                    // Shouldn't happen unless there's no connection available or XML file isn't found:
                                }, function (err) {
                                    Loader.hide();

                                    Navigation.set();

                                    // Clean navigation:
                                    var options = {
                                        changedCountry: true
                                    };

                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                        WinJS.Navigation.navigate('pages/products/searchEngine.html', options);
                                    }));
                                    messageDialog.showAsync();
                                }
                            );
                    } else {
                        WinJS.Navigation.back(1);
                    }
                };

                // Page initialization starts here:

                Navigation.setCountries();

                var menuList = document.getElementById('menuList').winControl;

                // Populate menu:
                if (menuList
                    && Navigation.countries != null) {
                    menuList.itemDataSource = Navigation.countries.dataSource;
                    menuList.oniteminvoked = _changeCountry;
                    menuList.layout = new WinJS.UI.GridLayout();
                    menuList.layout.maximumRowsOrColumns = 5;
                    menuList.layout.orientation = 'vertical';

                    Orientation.onChange();
                } else {
                    WinJS.Navigation.back(1);
                }
                Loader.hide();
            }
        });
})();