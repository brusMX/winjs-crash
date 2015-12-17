
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/newsletters/newsletters.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _sectionInfo = null;

                // Page methods:
                var _bindEvents = function () {
                    if (document.getElementById('shareNewsletter')) {
                        document.getElementById('shareNewsletter').addEventListener('click', function () {
                            _shareNewsletter(this);
                        }, false);
                    }

                    var flyoutContainer = document.querySelector('div.social-networks-flyout-container');

                    if (flyoutContainer) {
                        flyoutContainer.addEventListener('click', _hideFlyout, false);
                    }

                    var flyout = document.querySelector('div.social-networks-flyout');

                    if (flyout) {
                        flyout.addEventListener('click', function (event) {
                            _mantainFlyout(event);
                        }, false);
                    }
                };
                var _unbindEvents = function () {
                    if (document.getElementById('shareNewsletter')) {
                        document.getElementById('shareNewsletter').removeEventListener('click', _shareNewsletter, false);
                    }

                    var flyoutContainer = document.querySelector('div.social-networks-flyout-container');

                    if (flyoutContainer) {
                        flyoutContainer.removeEventListener('click', _hideFlyout, false);
                    }

                    var flyout = document.querySelector('div.social-networks-flyout');

                    if (flyout) {
                        flyout.removeEventListener('click', _mantainFlyout, false);
                    }
                };
                var _displayNewsletter = function (item) {
                    var electronicId = item.getAttribute('data-electronic-id');
                    var electronicTitle = item.getAttribute('data-electronic-title');
                    var link = item.getAttribute('data-link');

                    // Send newsletters tracking:
                    _sendTracking(electronicId, electronicTitle);

                    if (link != '') {
                        var windowsUri = new Windows.Foundation.Uri(link);
                        Windows.System.Launcher.launchUriAsync(windowsUri);
                    }
                };
                var _sendTracking = function (electronicId, electronicTitle) {
                    var jsonFormat = '{"Abstract":"' + electronicTitle + '"}';
                    var searchParameters = 'ElectronicId=' + electronicId;

                    LogsServices.addTrackingActivity(globalVars.code, globalVars.newslettersEntityId, jsonFormat, searchParameters, globalVars.parametizedSearchId, globalVars.InfoSourceId);
                };
                var _shareNewsletter = function () {
                    var electronicId = 0;
                    var electronicTitle = '';
                    var link = '';
                    var newslettersRadios = document.getElementsByName('shareNewsletter');

                    if (newslettersRadios.length > 0) {
                        for (var i = 0; i < newslettersRadios.length; i++) {
                            if (newslettersRadios[i].checked) {
                                electronicId = newslettersRadios[i].value;
                                break;
                            }
                        }

                        // Share:
                        if (electronicId > 0) {
                            if (newslettersVars.newslettersItems != null) {
                                for (var i = 0; i < newslettersVars.newslettersItems.length; i++) {
                                    if (electronicId == newslettersVars.newslettersItems[i].ElectronicId) {
                                        electronicTitle = newslettersVars.newslettersItems[i].ElectronicTitle;
                                        link = newslettersVars.newslettersItems[i].Link;
                                        break;
                                    }
                                }

                                if (link != ''
                                    && typeof (_sectionInfo.socialNetwork) != 'undefined'
                                    && typeof (_sectionInfo.socialNetwork.networks) != 'undefined') {
                                    var socialNetworks = [];

                                    for (var i = 0; i < _sectionInfo.socialNetwork.networks.length; i++) {
                                        var socialNetworkUri = '';

                                        switch (_sectionInfo.socialNetwork.networks[i].name) {
                                            case 'Email':
                                                socialNetworkUri = 'mailto:?subject=' + electronicTitle + '&body=' + globalVars.applicationName + ' - ' + encodeURIComponent(link);
                                                break;
                                            case 'LinkedIn':
                                                socialNetworkUri = 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(link);
                                                break;
                                            case 'Facebook':
                                                socialNetworkUri = 'https://facebook.com/share.php?u=' + encodeURIComponent(link);
                                                break;
                                            case 'Twitter':
                                                socialNetworkUri = 'https://twitter.com/home?status=' + encodeURIComponent(link + ' "' + electronicTitle + '"');
                                                break;
                                        }

                                        socialNetworks.push({ name: _sectionInfo.socialNetwork.networks[i].name, uri: socialNetworkUri });
                                    }

                                    if (socialNetworks.length > 0) {
                                        var socialNetworksList
                                            = '<table class="social-networks-table">'
                                                + '<thead>'
                                                    + '<tr>'
                                                        + '<th>Compartir enlace por...</th>'
                                                    + '</tr>'
                                                + '</thead>'
                                                + '<tbody>';

                                        for (var i = 0; i < socialNetworks.length; i++) {
                                            if (socialNetworks[i].name != 'Email') {
                                                socialNetworksList += '<tr><td><a href="#" class="win-link social-networks-link" data-link="' + socialNetworks[i].uri + '">' + socialNetworks[i].name + '</a></td></tr>';
                                            } else {
                                                socialNetworksList += '<tr><td><a href="' + socialNetworks[i].uri + '" class="win-link">' + socialNetworks[i].name + '</a></td></tr>';
                                            }
                                        }

                                        socialNetworksList
                                                += '</tbody>'
                                            + '</table>';

                                        var socialNetworksListDiv = document.getElementById('socialNetworksList');
                                        var socialNetworksFlyout = document.getElementById('socialNetworksFlyout');

                                        if (socialNetworksListDiv
                                            && socialNetworksFlyout) {
                                            socialNetworksListDiv.innerHTML = socialNetworksList;

                                            var socialNetworksLinks = document.getElementsByClassName('social-networks-link');

                                            if (socialNetworksLinks.length > 0) {
                                                for (var i = 0; i < socialNetworksLinks.length; i++) {
                                                    socialNetworksLinks[i].addEventListener('touchend', function () {
                                                        _displaySocialNetwork(this);
                                                    }, false);
                                                }
                                            }

                                            socialNetworksFlyout.setAttribute('style', 'display: block;');
                                        }
                                    }
                                }
                            }
                        } else {
                            var messageDialog = new Windows.UI.Popups.MessageDialog("Seleccione el newsletter que desee compartir.");

                            messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                            messageDialog.showAsync();
                        }
                    }
                };
                var _displaySocialNetwork = function (item) {
                    var uri = item.getAttribute('data-link');

                    if (uri != '') {
                        var windowsUri = new Windows.Foundation.Uri(uri);
                        Windows.System.Launcher.launchUriAsync(windowsUri);
                    }
                };
                var _hideFlyout = function () {
                    var flyoutContainer = document.querySelector('div.social-networks-flyout-container');

                    if (flyoutContainer) {
                        flyoutContainer.setAttribute('style', 'display: none;');
                    }
                };
                var _mantainFlyout = function (event) {
                    event.stopPropagation();
                };

                // Page initialization starts here:

                if (options
                    && typeof (options.data) != 'undefined'
                    && typeof (options.data.infoType) != 'undefined') {
                    _sectionInfo = options.data;
                }

                if (typeof (_sectionInfo.infoType) != 'undefined') {
                    globalVars.newslettersInfoType = options.data.infoType;
                }

                _bindEvents();

                if (globalVars.newslettersInfoType != '') {
                    Loader.show();

                    ClientsServices.getInformationByPrefixByType(globalVars.prefix, globalVars.target, globalVars.newslettersInfoType, globalVars.countryKey)
                        .then(
                            function (result) {
                                newslettersVars.newslettersItems = null;

                                if (typeof (result.getInformationByPrefixByTypeResult) != 'undefined'
                                    && result.getInformationByPrefixByTypeResult != null) {
                                    newslettersVars.newslettersItems = result.getInformationByPrefixByTypeResult;
                                }

                                Loader.hide();

                                if (newslettersVars.newslettersItems != null) {
                                    var newslettersList = '';

                                    for (var i = 0; i < newslettersVars.newslettersItems.length; i++) {
                                        newslettersList
                                            += '<div class="custom-list-item">'
                                                + '<div class="custom-list-item-content" data-electronic-id="' + newslettersVars.newslettersItems[i].ElectronicId + '" data-electronic-title="' + newslettersVars.newslettersItems[i].ElectronicTitle + '" data-link="' + newslettersVars.newslettersItems[i].Link + '">'
                                                    + newslettersVars.newslettersItems[i].ElectronicTitle
                                                + '</div>'
                                                + '<div class="custom-list-item-icon">'
                                                    + '<input name="shareNewsletter" class="win-radio" type="radio" value="' + newslettersVars.newslettersItems[i].ElectronicId + '" />'
                                                + '</div>'
                                            + '</div>';
                                    }

                                    var newslettersListDiv = document.getElementById('customList');

                                    if (newslettersListDiv) {
                                        newslettersListDiv.innerHTML = newslettersList;

                                        // Create listeners:
                                        var displayNewslettersItems = document.getElementsByClassName('custom-list-item-content');

                                        if (displayNewslettersItems.length > 0) {
                                            for (var i = 0; i < displayNewslettersItems.length; i++) {
                                                displayNewslettersItems[i].addEventListener('click', function () {
                                                    _displayNewsletter(this);
                                                }, false);
                                            }
                                        }
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

                    // Shouldn't happen:
                } else {
                    _unbindEvents();
                    WinJS.Navigation.back(1);
                }
            }
        });
})();