// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/healthcareSuppliers/healthcareSuppliersMenu.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            
            globalVars.healthcareSuppliersISBN = 'GUIA 61';
            healthcareSuppliersVars.editionId = 2;
            healthcareSuppliersVars.clientId = 0;
            healthcareSuppliersVars.letter = '';
            healthcareSuppliersVars.brandsCount = 0;
            healthcareSuppliersVars.brandsItems = null;
            healthcareSuppliersVars.productsCount = 0;
            healthcareSuppliersVars.productsItems = null;
            healthcareSuppliersVars.clientsCount = 0;
            healthcareSuppliersVars.clientsItems = null;
            healthcareSuppliersVars.categoriesCount = 0;
            healthcareSuppliersVars.categoriesItems = null;

            var myData = new WinJS.Binding.List([]);
            Orientation.onChange();

            var healthcareContent = Navigation.setSubsections('HealthcareSuppliers');
            for (var i = 0; i < healthcareContent.length; i++) {
                var object = {
                    title: healthcareContent[i].displayName,
                    path: healthcareContent[i].uri,
                    picture: healthcareContent[i].iconImage
                };
                myData.push(object);
            }
            

            Loader.hide();

            function fnNavigate(args) {
                Loader.show();
                console.log(myData.getAt(args.detail.itemIndex).path);
                WinJS.Navigation.navigate(myData.getAt(args.detail.itemIndex).path);
            }

            WinJS.UI.processAll().then(function(){
		    
                var healthcareList = document.getElementById("healthcareList");    //Lista a la que hacemos referencia
                if (healthcareList != null && healthcareList != undefined) {
                    healthcareList = healthcareList.winControl;
                    healthcareList.itemDataSource = myData.dataSource;    //Objetos que serviran de fuente para llenar la lista
                    healthcareList.oniteminvoked = fnNavigate;   //Llama a la funcion fnNavigate cuando se selecciona un elemento
                    healthcareList.layout = new WinJS.UI.GridLayout();
                    healthcareList.layout.maximumRowsOrColumns = 5;
                    healthcareList.layout.orientation = "vertical";
                }
            });

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
