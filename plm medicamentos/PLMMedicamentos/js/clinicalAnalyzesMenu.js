// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/clinicalAnalyzesMenu.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
           
            var myData = new WinJS.Binding.List([]);
            Orientation.onChange();

            var clinicalAnalyzesContent = Navigation.setSubsections('ClinicalAnalyzes');
            for (var i = 0; i < clinicalAnalyzesContent.length; i++) {
                var object = {
                    title: clinicalAnalyzesContent[i].displayName,
                    path: clinicalAnalyzesContent[i].uri,
                    picture: clinicalAnalyzesContent[i].iconImage
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
		    
                var list2 = document.getElementById("clinicalList");    //Lista a la que hacemos referencia
                if (list2 != null & list2 != undefined) {
                    list2 = list2.winControl
                    list2.itemDataSource = myData.dataSource;    //Objetos que serviran de fuente para llenar la lista
                    list2.oniteminvoked = fnNavigate;   //Llama a la funcion fnNavigate cuando se selecciona un elemento
                    list2.layout = new WinJS.UI.GridLayout();
                    list2.layout.maximumRowsOrColumns = 5;
                    list2.layout.orientation = "vertical";
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
