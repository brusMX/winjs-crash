// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/patientContent/patientContentMenu.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            
            var patientContent = Navigation.setSubsections('PatientContent');
            var myData = new WinJS.Binding.List([]);
            Orientation.onChange();

            for (var i = 0; i < patientContent.length; i++) {
                var object = {
                    title: patientContent[i].displayName,
                    path: patientContent[i].resourceUri,
                    picture: patientContent[i].iconImage
                };
                myData.push(object);
            }
            

            Loader.hide();

            function fnNavigate(args) {
                if (typeof (myData.getAt(args.detail.itemIndex).path) != 'undefined'
                        && myData.getAt(args.detail.itemIndex).path != '') {
                    var uri = new Windows.Foundation.Uri(myData.getAt(args.detail.itemIndex).path);
                            Windows.System.Launcher.launchUriAsync(uri);
                } else {
                    var messageDialog = new Windows.UI.Popups.MessageDialog("No se puede encontrar la ruta del enlace.");
                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                    messageDialog.showAsync();
                }
            }

            WinJS.UI.processAll().then(function(){
		    
                var patientContentList = document.getElementById("patientContentList");    //Lista a la que hacemos referencia
                if (patientContentList != null && patientContentList != undefined) {
                    patientContentList = patientContentList.winControl;
                    patientContentList.itemDataSource = myData.dataSource;    //Objetos que serviran de fuente para llenar la lista
                    patientContentList.oniteminvoked = fnNavigate;   //Llama a la funcion fnNavigate cuando se selecciona un elemento
                    patientContentList.layout = new WinJS.UI.GridLayout();
                    patientContentList.layout.maximumRowsOrColumns = 5;
                    patientContentList.layout.orientation = "vertical";
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
