
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/settings/settingsMenu.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page methods:
                var _changePage = function (section) {
                    var sectionInfo = Navigation.settings.getAt(section.detail.itemIndex);

                    if (typeof (sectionInfo.uri) != 'undefined'
                        && sectionInfo.uri != '') {
                        Loader.show();
                        WinJS.Navigation.navigate(sectionInfo.uri);
                    } else {
                        // Open web browser document.
                        if (typeof (sectionInfo.resourceUri) != 'undefined'
                        && sectionInfo.resourceUri != '') {
                            var uri = new Windows.Foundation.Uri(sectionInfo.resourceUri);
                            Windows.System.Launcher.launchUriAsync(uri);
                        } else {
                            var messageDialog = new Windows.UI.Popups.MessageDialog("No se puede encontrar la ruta del enlace.");
                            messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                            messageDialog.showAsync();
                        }
                    }
                };

                // Page initialization starts here:

                Navigation.getSubsections('Settings');
                Orientation.onChange();
                // Populate menu:
                if (Navigation.settings != null) {
                    var menuList = document.getElementById('menuList').winControl;

                    if (menuList) {
                        menuList.itemDataSource = Navigation.settings.dataSource;
                        menuList.oniteminvoked = _changePage;
                        menuList.layout = new WinJS.UI.GridLayout();
                        menuList.layout.maximumRowsOrColumns = 5;
                        menuList.layout.orientation = 'vertical';

                        Orientation.onChange();
                    }
                    // Shouldn't happen:
                } else {
                    WinJS.Navigation.back(1);
                }
            }
        });
})();