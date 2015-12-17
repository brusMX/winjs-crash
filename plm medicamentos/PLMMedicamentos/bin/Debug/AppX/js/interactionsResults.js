
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('pages/interactions/interactionsResults.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page variables:
                var _interactionProducts = null;

                // Page methods:
                var _unbindEvents = function () {
                    
                };
                var _cleanVariables = function () {
                    
                };
                var _getInteractionDetail = function (item) {
                    var collapsibleId = item.getAttribute('data-collapsible');

                    // Change styles:
                    if (item.className.indexOf('hidden') >= 0) {
                        WinJS.Utilities.removeClass(item, 'hidden');

                        if (item.hasChildNodes
                            && typeof(item.childNodes[0]) != 'undefined'
                            && item.childNodes[0].hasChildNodes) {
                            item.childNodes[0].childNodes[0].innerHTML = '-';
                        }
                    } else {
                        WinJS.Utilities.addClass(item, 'hidden');

                        if (item.hasChildNodes
                            && typeof (item.childNodes[0]) != 'undefined'
                            && item.childNodes[0].hasChildNodes) {
                            item.childNodes[0].childNodes[0].innerHTML = '+';
                        }
                    }

                    var collapsibleClasses = item.className.split(' ');
                    var collapsibleClassName = '';

                    if (collapsibleClasses.length > 0
                        && typeof(collapsibleClasses[1]) != 'undefined') {
                        collapsibleClassName = collapsibleClasses[1];
                    }

                    if (collapsibleClassName != '') {
                        var collapsibleItems = document.getElementsByClassName(collapsibleClassName);

                        if (collapsibleItems.length > 0) {
                            for (var i = 0; i < collapsibleItems.length; i++) {
                                if (collapsibleId != collapsibleItems[i].getAttribute('data-collapsible')) {
                                    if (collapsibleItems[i].className.indexOf('hidden') < 0) {
                                        WinJS.Utilities.addClass(collapsibleItems[i], 'hidden');

                                        if (collapsibleItems[i].hasChildNodes
                                            && typeof (collapsibleItems[i].childNodes[0]) != 'undefined'
                                            && collapsibleItems[i].childNodes[0].hasChildNodes) {
                                            collapsibleItems[i].childNodes[0].childNodes[0].innerHTML = '+';
                                        }
                                    }
                                }
                            }
                        }
                    }
                };

                // Page initialization starts here:

                if (interactionsVars.interactionsItems != null
                    && typeof (interactionsVars.interactionsItems) != 'undefined') {
                    if (typeof (interactionsVars.interactionsItems.length) == 'undefined') {
                        interactionsVars.interactionsItems = [interactionsVars.interactionsItems];
                    }

                    var interactionsResults = '';

                    for (var i = 0; i < interactionsVars.interactionsItems.length; i++) {
                        var interactionSubstances = [];
                        var interactionGroups = [];

                        interactionsResults +=
                                '<div class="interactions-detail-item">'
                                    + '<p class="product-info">'
                                        + '<b><span>' + interactionsVars.interactionsItems[i].Brand + '</span></b><br />'
                                        + '<i><span>' + interactionsVars.interactionsItems[i].PharmaForm + '</span></i>'
                                    + '</p>'
                                    + '<br />'
                                    + '<div class="interactions-detail-collapsible-set">';

                        if (typeof (interactionsVars.interactionsItems[i].InteractionSubstances) != 'undefined') {
                            if (typeof (interactionsVars.interactionsItems[i].InteractionSubstances.length) == 'undefined') {
                                interactionsVars.interactionsItems[i].InteractionSubstances = [interactionsVars.interactionsItems[i].InteractionSubstances];
                            }

                            if (interactionsVars.interactionsItems[i].InteractionSubstances.length > 0) {
                                interactionsResults
                                    += '<div class="interactions-detail-collapsible collapsible' + i + ' hidden" data-collapsible="0">'
                                        + '<div class="interactions-detail-collapsible-name">'
                                            + '<div class="interactions-detail-collapsible-icon">+</div>'
                                            + 'Sustancias de Interacci&oacute;n'
                                        + '</div>'
                                        + '<div class="interactions-detail-collapsible-detail">'
                                            + '<table class="interactions-detail-table">'
                                                + '<thead>'
                                                    + '<tr>'
                                                        + '<th>Sustancia Activa</th>'
                                                        + '<th>Sustancia de Interacci&oacute;n</th>'
                                                    + '</tr>'
                                                + '</thead>'
                                                + '<tbody>';

                                for (var j = 0; j < interactionsVars.interactionsItems[i].InteractionSubstances.length; j++) {
                                    interactionsResults
                                        += '<tr>'
                                            + '<td>' + interactionsVars.interactionsItems[i].InteractionSubstances[j].ActiveSubstance + '</td>'
                                            + '<td>' + interactionsVars.interactionsItems[i].InteractionSubstances[j].SubstanceInteraction + '</td>'
                                        + '</tr>';

                                    interactionSubstances.push(interactionsVars.interactionsItems[i].InteractionSubstances[j].SubstanceInteraction);
                                }

                                interactionsResults
                                                += '</tbody>'
                                            + '</table>'
                                        + '</div>'
                                    + '</div>';
                            }

                            if (interactionsVars.interactionsItems[i].PharmacologicalGroups.length > 0) {
                                interactionsResults
                                    += '<div class="interactions-detail-collapsible collapsible' + i + ' hidden" data-collapsible="1">'
                                        + '<div class="interactions-detail-collapsible-name">'
                                            + '<div class="interactions-detail-collapsible-icon">+</div>'
                                            + 'Grupos de Interacci&oacute;n'
                                        + '</div>'
                                        + '<div class="interactions-detail-collapsible-detail">'
                                            + '<table class="interactions-detail-table">'
                                                + '<thead>'
                                                    + '<tr>'
                                                        + '<th>Grupo de Interacci&oacute;n</th>'
                                                        + '<th>Sustancia de Interacci&oacute;n</th>'
                                                    + '</tr>'
                                                + '</thead>'
                                                + '<tbody>';

                                for (var j = 0; j < interactionsVars.interactionsItems[i].PharmacologicalGroups.length; j++) {
                                    interactionsResults
                                        += '<tr>'
                                            + '<td>' + interactionsVars.interactionsItems[i].PharmacologicalGroups[j].GroupName + '</td>'
                                            + '<td>' + interactionsVars.interactionsItems[i].PharmacologicalGroups[j].IActiveSubstance + '</td>'
                                        + '</tr>';

                                    interactionGroups.push(interactionsVars.interactionsItems[i].PharmacologicalGroups[j].GroupName);
                                }

                                interactionsResults
                                                += '</tbody>'
                                            + '</table>'
                                        + '</div>'
                                    + '</div>';
                            }

                            interactionsResults
                                += '<div class="interactions-detail-collapsible collapsible' + i + ' hidden"  data-collapsible="2">'
                                    + '<div class="interactions-detail-collapsible-name">'
                                        + '<div class="interactions-detail-collapsible-icon">+</div>'
                                        + 'IPPA'
                                    + '</div>'
                                    + '<div class="interactions-detail-collapsible-detail">' + interactionsVars.interactionsItems[i].HTMLContent + '</div>'
                                + '</div>';
                        }

                        interactionsResults += '</div>'
                                + '</div>';
                    }

                    var interactionsResultsDiv = document.getElementById('interactionsResults');

                    if (interactionsResultsDiv) {
                        interactionsResultsDiv.innerHTML = interactionsResults;

                        var collapsibleItems = document.getElementsByClassName('interactions-detail-collapsible');

                        if (collapsibleItems.length > 0) {
                            for (var i = 0; i < collapsibleItems.length; i++) {
                                collapsibleItems[i].addEventListener('click', function () {
                                    _getInteractionDetail(this);
                                }, false);
                            }
                        }

                        Orientation.onChange();
                    }
                    // Shouldn't happen:
                } else {
                    WinJS.Navigation.back(1);
                }
            }
        });
})();

