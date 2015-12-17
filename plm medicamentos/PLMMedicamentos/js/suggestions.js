// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/settings/suggestions.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            getContact();

            function getContact() {
                console.log("getContact");
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.PLMClientsEngine + '/getCommentTypesByPrefixByCountry?target=' + globalVars.target + '&prefix='
                                + globalVars.prefix + '&country=' + globalVars.countryKey,
                            type: 'GET'
                        };
                        console.log(options);
                        WinJS.xhr(options).done(
                            function (result) {
                                //On Success
                                callback(result.responseText, result.status);
                            },
                            function (result) {
                                //On Failure
                                callback(null, result.status);
                            }
                        );
                    }, function (err) { //Connectivity.test error
                        var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                        WinJS.Navigation.back(1);
                        Loader.hide();
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    });
                });
            }

            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log("Results retrieve success", items);
                        displaySuggestions(items.getCommentTypesByPrefixByCountryResult);
                    } else {
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se encontraron informaci&oacute;n de contacto.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar la informaci&oacute;n de contacto.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function displaySuggestions(suggestionItems) {
                console.log("displaySuggestions");
                var suggestionsElement = document.body.querySelector("#suggestionsList");
                var suggestionButton = document.body.querySelector('#sendSuggestion');
                if (suggestionsElement != null && suggestionsElement != undefined) {

                    var htmlContent='<div>';
	
                    if (typeof (suggestionItems) != "undefined") {
                        for (var i = 0; i < suggestionItems.length; i++) {
                            /*htmlContent = htmlContent + '<label><input type="radio" class="win-radio"  name="comment" value="'
                                + suggestionItems[i].CommentTypeId + '-' + suggestionItems[i].BranchId + '-'
                                + suggestionItems[i].BusinessUnitId + '-' + suggestionItems[i].DistributionId + '-'
                                + suggestionItems[i].PrefixId + '-' + suggestionItems[i].TargetId + '">'
                                + suggestionItems[i].TypeDescription + '</label><br>';*/

                            htmlContent = htmlContent + '<div><label><div class="div-input-radio"><input type="radio" class="win-radio" name="comment" value="'
                                + suggestionItems[i].CommentTypeId + '-' + suggestionItems[i].BranchId + '-'
                                + suggestionItems[i].BusinessUnitId + '-' + suggestionItems[i].DistributionId + '-'
                                + suggestionItems[i].PrefixId + '-' + suggestionItems[i].TargetId + '"></div><div class="div-input-description">'
                                + suggestionItems[i].TypeDescription + '</div></label></div>';
                        }
                        htmlContent = htmlContent + '</div>'
                        suggestionsElement.innerHTML = htmlContent;
                        
                        if (suggestionButton) {
                            suggestionButton.addEventListener("click", sendSuggestion, false);
                        }
                        Orientation.onChange();
                    }
                } else {
                    if (document.body.querySelector('#emptyList')) {
                        document.body.querySelector("#emptyList").style.display = "block";
                    }
                    if (document.body.querySelector('#txtComment')) {
                        document.body.querySelector("#txtComment").style.display = "none";
                    }
                    if (suggestionButton) {
                        suggestionButton.style.display = "none";
                    }
                }
                Loader.hide();
            }

            function sendSuggestion() {

                var elem = null;
                var select = false;
                var commentType = document.body.querySelector("input[name=comment]:checked");
                if (commentType) {
                    var comentValue = commentType.value;
                    if (typeof (comentValue) != "undefined") {
                        elem = comentValue.split('-');
                        select = true;
                    }
                    var txtElement = document.body.querySelector("#txtComment");
                    if (txtElement) {
                        var txt = txtElement.value;
                        console.log(txt, txt.length);
                        if (txt.length > 14) {
                            Loader.show();
                            return new WinJS.Promise(function (completed, error, progress) {
                                Connectivity.test().then(function () {
                                    var options = {
                                        url: RESTServices.PLMClientsEngine + '/addClientComment?commentTypeId=' + elem[0] + '&branchId=' + elem[1]
                                            + '&businessUnitId=' + elem[2] + '&distributionId=' + elem[3] + '&prefixId=' + elem[4] + '&targetId=' + elem[5]
                                            + '&content=' + txt + '&code=' + globalVars.code,
                                        type: 'GET'
                                    };

                                    WinJS.xhr(options).done(
                                        function (result) {
                                            //On Success
                                            commentsDetail(result.responseText, result.status);
                                        },
                                        function (result) {
                                            //On Failure
                                            commentsDetail(null, result.status);
                                        }
                                    );
                                }, function (err) { //Connectivity.test error
                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                                    Loader.hide();
                                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                    messageDialog.showAsync();
                                    WinJS.Navigation.back(1);
                                });
                            });
                        } else {
                            var messageDialog = new Windows.UI.Popups.MessageDialog("El comentario debe de contener al menos 15 caracteres.");
                            messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                            messageDialog.showAsync();
                        }
                    } else {
                        var messageDialog = new Windows.UI.Popups.MessageDialog("El comentario debe de contener al menos cinco caracteres.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Debe de seleccionar un tipo de sugerencia.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function commentsDetail(responseText, status) {
                if (status === 200) {
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Su comentario se envio correctamente.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    var messageDialog = new Windows.UI.Popups.MessageDialog("No ha sido posible enviar su sugerencia.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            //Fin de ready
        },

        unload: function () {
            // TODO: Responder a las navegaciones fuera de esta página.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Responder a los cambios en el diseño.
        }
    });
})();
