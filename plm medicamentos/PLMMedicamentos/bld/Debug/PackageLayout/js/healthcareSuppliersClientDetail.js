// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersClientDetail.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var webArray = new Array;

            getCompanyDetail();

            function callback(responseText, status) {
                if (status === 200) {
                    if (responseText != "") {
                        var items = JSON.parse(responseText);
                        console.log("Results retrieve success", items.getClientDetailResult);
                        displayCompanyDetail(items.getClientDetailResult);
                    } else {
                        Loader.hide();
                        WinJS.Navigation.back(1);
                        var messageDialog = new Windows.UI.Popups.MessageDialog("No se pudo encontrar el detalle del la empresa.");
                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                        messageDialog.showAsync();
                    }
                } else {
                    console.log("Error obtaining feed. XHR status code: " + status);
                    Loader.hide();
                    WinJS.Navigation.back(1);
                    var messageDialog = new Windows.UI.Popups.MessageDialog("Hubo un error en el servicio al intentar recuperar la empresa.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            function getCompanyDetail() {
                return new WinJS.Promise(function (completed, error, progress) {
                    Connectivity.test().then(function () {
                        var options = {
                            url: RESTServices.HealthcareSuppliersEngine + '/getClientDetail?code=' + globalVars.code + "&editionId=" + healthcareSuppliersVars.editionId
                                + "&clientId=" + healthcareSuppliersVars.clientId,
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

            function displayCompanyDetail(clients) {
                var clientDetail = "";
                if (clients != null && clients != undefined) {

                    var companyNameElement = document.querySelector("#companyName");
                    if (companyNameElement != null && companyNameElement != undefined) {
                        companyNameElement.innerHTML = clients.CompanyName;
                    }
                    healthcareSuppliersVars.companyName = clients.CompanyName;
                    Orientation.onChange();

                    if (clients.Addresses.length > 0) {
                        clientDetail += '<p><b>Direcci&oacute;n:</b>';

                        /* For each address: */

                        for (var i = 0; i < clients.Addresses.length; i++) {
                            clientDetail += '<br>';

                            // Nil validation:
                            if (clients.Addresses[i].Address == null) { clients.Addresses[i].Address = ''; }
                            if (clients.Addresses[i].Suburb == null) { clients.Addresses[i].Suburb = ''; }
                            if (clients.Addresses[i].ZipCode == null) { clients.Addresses[i].ZipCode = ''; }
                            if (clients.Addresses[i].StateName == null) { clients.Addresses[i].StateName = ''; }
                            if (clients.Addresses[i].City == null) { clients.Addresses[i].City = ''; }

                            if (clients.Addresses[i].Address != '') { clientDetail += ' ' + clients.Addresses[i].Address; }
                            if (clients.Addresses[i].Suburb != '') { clientDetail += ' ' + clients.Addresses[i].Suburb; }
                            if (clients.Addresses[i].ZipCode != '') { clientDetail += ' ' + clients.Addresses[i].ZipCode; }
                            if (clients.Addresses[i].City != '') { clientDetail += ' ' + clients.Addresses[i].City; }
                            if (clients.Addresses[i].StateName != '') { clientDetail += ' ' + clients.Addresses[i].StateName; }

                            clientDetail += '</p>';

                            /* For each e-mail: */

                            // Nil validation:
                            if (clients.Addresses[i].Email == null) { clients.Addresses[i].Email = ''; }

                            if (clients.Addresses[i].Email != '') {
                                clientDetail += '<p><b>Correo electr&oacute;nico:</b>';

                                var emailArray = clients.Addresses[i].Email.split(';');

                                if (emailArray.length > 0) {
                                    for (var j = 0; j < emailArray.length; j++) {
                                        clientDetail += '<br><a href="mailto:' + emailArray[j].trim() + '">'
                                            + emailArray[j].trim() + '</a>';
                                    }
                                } else {
                                    clientDetail += '<br><a href="mailto:' + clients.Addresses[i].Email.trim() + '">'
                                            + clients.Addresses[i].Email.trim() + '</a>';
                                }
                            }

                            /* For each website: */

                            // Null validation:
                            if (clients.Addresses[i].Web == null) { clients.Addresses[i].Web = ''; }

                            if (clients.Addresses[i].Web != '') {

                                var string = '';
                                webArray = clients.Addresses[i].Web.split(';');
                                //console.log(webArray);
                                if (webArray.length > 0) {
                                    for (var j = 0; j < webArray.length; j++) {
                                        string += '<br><a href="#" id="webPage' + j + '">' + webArray[j].trim() + '</a>';
                                    }
                                }
                                clientDetail += '<p><b>Direcci&oacute;n web:</b>' + string + '</p>';
                            }
                        }
                    }
                   
                    if (typeof (clients.Phones.length) != 'undefined') {
                        var phoneTypeId = '';
                        var phoneArray = '';

                        for (var i = 0; i < clients.Phones.length; i++) {
                            var phoneTypeId = Number(clients.Phones[i].PhoneTypeId);
                            var phoneArray = clients.Phones[i].Number.trim().split(',');

                            switch (phoneTypeId) {
                                case 1:
                                    clientDetail += '<p><b>Tel&eacute;fono(s):</b>';
                                    break;
                                case 2:
                                    clientDetail += '<p><b>Tel&eacute;fono / Fax:</b>';
                                    break;
                                case 3:
                                    clientDetail += '<p><b>Fax:</b>';
                                    break;
                                case 4:
                                    clientDetail += '<p><b>Lada sin costo:</b>';
                                    break;
                                case 5:
                                    clientDetail += '<p><b>Oxidom:</b>';
                                    break;
                            }

                            if (phoneArray.length > 0) {
                                for (var j = 0; j < phoneArray.length; j++) {
                                    var phoneNumber = phoneArray[j].replace(/-|\x2D|\x28|\x29|\x20|\xA0|\x09/g, '').trim();

                                    if (Number(phoneNumber)) {
                                        clientDetail += '<br>' + '<a href="tel:' + phoneNumber + '">' + phoneArray[j] + '</a>';
                                    } else {
                                        clientDetail += '<br>' + phoneArray[j];
                                    }
                                }
                            } else {
                                var phoneNumber = clients.Phones[i].PhoneValue.replace(/\x2D|\x28|\x29|\x20|\xA0|\x09/g, '').trim();

                                if (Number(phoneNumber)) {
                                    clientDetail += '<br>' + '<a href="tel:' + phoneNumber + '">' + clients.Phones[i].PhoneValue + '</a>';
                                } else {
                                    clientDetail += '<br>' + clients.Phones[i].PhoneValue;
                                }
                            }
                            clientDetail += '</p>';
                        }
                    }


                    clientDetail += '<div class="center">';

                    if (typeof (clients.Categories) != 'undefined' && clients.Categories.length > 0) {
                        healthcareSuppliersVars.categories = clients.Categories;
                        clientDetail += '<button id="categoriesButton" class="win-button button-margin">Categor&iacute;as de Producto</button>';
                    }

                    if (typeof (clients.Brands) != 'undefined' && clients.Brands.length > 0) {
                        healthcareSuppliersVars.brands = clients.Brands;
                        clientDetail += '<button id="brandsButton" class="win-button button-margin">Marcas</button>';
                    }
                    clientDetail += '<br /><br /></div>';
                } else {
                    clientDetail = '<p>Detalle de la empresa no disponible.</p>';
                }

                //console.log(clientDetail);
                var clientDetailElement = document.body.querySelector("#clientDetail");
                if (clientDetailElement != null && clientDetailElement != undefined){
                    clientDetailElement.innerHTML = clientDetail;
                }
                Loader.hide();
                /*
                if (productsVars.ProductByEditionInfoItems != null)
                    document.querySelector("#companyProducts").addEventListener("click", displayCompanyProducts, false);*/
                var categories = document.body.querySelector("#categoriesButton");
                var brands = document.body.querySelector("#brandsButton");
                if (healthcareSuppliersVars.categories != null && healthcareSuppliersVars.categories.length > 0 && categories != undefined && categories != null) {
                    categories.addEventListener("click", displayCategories, false);
                }
                if (healthcareSuppliersVars.brands != null && healthcareSuppliersVars.brands.length > 0 && brands != undefined && brands != null) {
                    brands.addEventListener("click", displayBrands, false);
                }
                if (webArray.length > 0) {
                    for (var i = 0; i < webArray.length; i++) {
                        var webPageElement = document.body.querySelector("#webPage" + i);
                        if (webPageElement != null && webPageElement != undefined) {
                            webPageElement.addEventListener("click",
                            function (event) {
                                //console.log(event.target.innerText);
                                displayWebsite(event.target.innerText);
                            }, false);
                        }
                    }
                }
            }

            function displayWebsite(path) {
                // Create a Uri object from the URI string 
                var uri = new Windows.Foundation.Uri("http://" + path);

                Windows.System.Launcher.launchUriAsync(uri);
            }

            function displayCategories() {
                console.log("display Categories");
                Loader.show();
                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersCategoriesByClient.html');
            }

            function displayBrands() {
                console.log("display Brands Navigation");
                Loader.show();
                WinJS.Navigation.navigate('/pages/healthcareSuppliers/healthcareSuppliersBrandsByClient.html');
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
