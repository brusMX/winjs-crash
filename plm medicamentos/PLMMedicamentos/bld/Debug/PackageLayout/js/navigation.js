
(function () {
    "use strict";
    
    var currentScenarioUrl = null;

    WinJS.Navigation.addEventListener("navigating", function (evt) {
        currentScenarioUrl = evt.detail.location;
    });
    
    // Control that populates and runs the scenario selector:
    var ScenarioSelect = WinJS.UI.Pages.define("pages/navigation/navigation.html", {
        ready: function (element, options) {
            var that = this;

            element.addEventListener("selectionchanging", function (evt) {
                if (evt.detail.newSelection.count() === 0) {
                    evt.preventDefault();
                }
            });

            element.addEventListener("iteminvoked", function (evt) {
                evt.detail.itemPromise.then(function (item) {
                    that._selectedIndex = item.index;
                    var newUrl = item.data.uri;
                    if (currentScenarioUrl !== newUrl) {
                        // Temporal validation:
                        if (item.data.name == 'Newsletters') {
                            WinJS.Navigation.navigate(newUrl, item);
                        } else {
                            WinJS.Navigation.navigate(newUrl);
                        }
                        var splitView = document.querySelector("#root.win-splitview-openeddisplayoverlay");
                        splitView && splitView.winControl.closePane();
                    } else {
                        var splitView = document.querySelector("#root.win-splitview-openeddisplayoverlay");
                        splitView && splitView.winControl.closePane();
                    }
                });
            });
            /*
            element.addEventListener("keyboardnavigating", function (evt) {
                var listview = evt.target.winControl;
                listview.elementFromIndex(evt.detail.newFocus).click();
            });
            */
            this._selectedIndex = 0;

            var lastUrl = WinJS.Application.sessionState.lastUrl;
            Navigation.scenarios.forEach(function (s, index) {
                s.scenarioNumber = index + 1;
                if (s.uri === lastUrl && index !== that._selectedIndex) {
                    that._selectedIndex = index;
                }
            });

            this._listview = element.querySelector(".win-listview").winControl;
            this._listview.selection.set([this._selectedIndex]);
            this._listview.currentItem = { index: this._selectedIndex, hasFocus: true };
        }
    });

    // SDK Sample Test helper
    /*
    document.TestSdkSample = {
        getLastError: function () {
            return lastError;
        },

        getLastStatus: function () {
            return lastStatus;
        },

        selectScenario: function (scenarioID) {
            scenarioID = scenarioID >> 0;
            var scenarioIndex = scenarioID - 1;
            var scenarioControl = document.querySelector("#scenarioControl").winControl;
            scenarioControl.elementFromIndex(scenarioIndex).click();
        }
    };
    */
})();