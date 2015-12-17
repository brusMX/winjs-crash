// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/companyDetail.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var webPage = new Array;

            Orientation.onChange();
            getCompanyDetail();

            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log(items);
                        console.log("Results retrieve success", items.getCompanyDetailResult);
                        displayCompanyDetail(items.getCompanyDetailResult);
                    } else {
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se pudo encontrar el detalle del la compa&ntilde;ia.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar las compa&ntilde;ias.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getCompanyDetail() {
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.ClinicalAnalyzesEngine + '/getCompanyDetail?code=' + globalVars.code + "&ISBN=" + globalVars.clinicalAnalyzesISBN + "&companyId=" + clinicalAnalyzesVars.companyId,
                            type: 'GET'
                        };
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
                    });
                }, function (err) { //Connectivity.test error
                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                    WinJS.Navigation.back(1);
                    Loader.hide();
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
            });
        }
            
            function displayCompanyDetail(company) {
                var companyDetail = "";
                if (company != null && company != undefined) {

                    document.querySelector("#companyName").innerHTML = company.CompanyName;

                    if (company.Address == null) { company.Address = ''; }
                    if (company.CityName == null) { company.CityName = ''; }
                    if (company.Email == null) { company.Email = ''; }
                    if (company.PostalCode == null) { company.PostalCode = ''; }
                    if (company.StateName == null) { company.StateName = ''; }
                    if (company.Suburb == null) { company.Suburb = ''; }
                    if (company.Web == null) { company.Web = ''; }

                    if (company.Address != ''
                        || company.CityName != ''
                        || company.PostalCode != ''
                        || company.StateName != ''
                        || company.Suburb != '') {
                        companyDetail += '<p><b>Direcci&oacute;n:</b><br>';

                        if (company.Address != '') { companyDetail += ' ' + company.Address; }
                        if (company.Suburb != '') { companyDetail += ' ' + company.Suburb; }
                        if (company.PostalCode != '') { companyDetail += ' ' + company.PostalCode; }
                        if (company.CityName != '') { companyDetail += ' ' + company.CityName; }
                        if (company.StateName != '') { companyDetail += ' ' + company.StateName; }

                        companyDetail += '</p>';
                    }

                    if (company.Email != '') {
                        companyDetail += '<p><b>Correo electr&oacute;nico:</b><br>' + '<a href="mailto:' + company.Email + '">' + company.Email + '</a>' + '</p>';
                    }

                    if (company.Web != '') {
                        webPage = company.Web.split(';');
                        var string = '';
                        for (var i = 0; i < webPage.length; i++) {
                            string += '<a href="#" id="webPage' + i + '">' + webPage[i].trim() + '</a><br>';
                        }
                        companyDetail += '<p><b>Direcci&oacute;n web:</b><br>' + string + '</p>';
                    }

                   
                    if (typeof (company.CompanyPhones.length) != 'undefined') {
                        var phoneTypeId = '';
                        var phoneArray = '';

                        for (var i = 0; i < company.CompanyPhones.length; i++) {
                            var phoneTypeId = Number(company.CompanyPhones[i].PhoneTypeId);
                            var phoneArray = company.CompanyPhones[i].PhoneValue.trim().split(',');

                            switch (phoneTypeId) {
                                case 1:
                                    companyDetail += '<p><b>Tel&eacute;fono(s):</b>';
                                    break;
                                case 2:
                                    companyDetail += '<p><b>Tel&eacute;fono / Fax:</b>';
                                    break;
                                case 3:
                                    companyDetail += '<p><b>Fax:</b>';
                                    break;
                                case 4:
                                    companyDetail += '<p><b>Lada sin costo:</b>';
                                    break;
                                case 5:
                                    companyDetail += '<p><b>Oxidom:</b>';
                                    break;
                            }
                           
                            if (phoneArray.length > 0) {
                                for (var j = 0; j < phoneArray.length; j++) {
                                    var phoneNumber = phoneArray[j].replace(/-|\x2D|\x28|\x29|\x20|\xA0|\x09/g, '').trim();

                                    if (Number(phoneNumber)) {
                                        companyDetail += '<br>' + '<a href="tel:' + phoneNumber + '">' + phoneArray[j] + '</a>';
                                    } else {
                                        companyDetail += '<br>' + phoneArray[j];
                                    }
                                }
                            } else {
                                var phoneNumber = company.CompanyPhones[i].PhoneValue.replace(/\x2D|\x28|\x29|\x20|\xA0|\x09/g, '').trim();

                                if (Number(phoneNumber)) {
                                    companyDetail += '<br>' + '<a href="tel:' + phoneNumber + '">' + company.CompanyPhones[i].PhoneValue + '</a>';
                                } else {
                                    companyDetail += '<br>' + company.CompanyPhones[i].PhoneValue;
                                }
                            }
                            companyDetail += '</p>';
                        }
                    }

                    if (company.Products.length > 0) {
                        productsVars.ProductByEditionInfoItems = company.Products;
                        companyDetail += '<div class="alignCenter"><button id="companyProducts" class="win-button">Productos</button></div>';
                    }

                } else {
                    companyDetail = '<p>Detalle de la compa&ntilde;&iacute;a no disponible.</p>';
                }

                console.log(companyDetail);
                document.body.querySelector("#companyDetail").innerHTML = companyDetail;
                Loader.hide();
                if(productsVars.ProductByEditionInfoItems != null)
                    document.querySelector("#companyProducts").addEventListener("click", displayCompanyProducts, false);
                if (webPage.length > 0) {
                    for (var i = 0; i < webPage.length; i++) {
                        document.body.querySelector("#webPage" + i).addEventListener("click", function (event) { console.log(event.target.innerText); displayWebsite(event.target.innerText); }, false);
                    }
                }
            }

            function displayWebsite(path) {
                // Create a Uri object from the URI string 
                var uri = new Windows.Foundation.Uri("http://" + path);

                Windows.System.Launcher.launchUriAsync(uri);
            }

            function displayCompanyProducts() {
                console.log("display Company Products");
                Loader.show();
                WinJS.Navigation.navigate('/pages/clinicalAnalyzes/companyProducts.html');
            }

            //TODO: Fin de la funcion ready
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
