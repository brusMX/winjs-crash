// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/clinicalAnalyzes/index.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var section = 3;
            var subsection = 1;
            var indexData = new WinJS.Binding.List([]);
            Orientation.onChange();

            console.log(application.sections[section].subSections[subsection]);
            var sectionContent = application.sections[section].subSections[subsection].subSections;
            for (var i = 0; i < sectionContent.length; i++) {
                indexData.push(sectionContent[i]);
            }
            
            var indexList = document.getElementById("indexList").winControl;
            indexList.itemDataSource = indexData.dataSource;
            indexList.oniteminvoked = subSectionNavigate;

            Loader.hide();

            function subSectionNavigate(args) {
                Loader.show();
                console.log(indexData.getAt(args.detail.itemIndex).uri);
                clinicalAnalyzesVars.letter = '';
                WinJS.Navigation.navigate(indexData.getAt(args.detail.itemIndex).uri);
            }

            WinJS.UI.processAll();
            // TODO: Fin del contenido.
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
