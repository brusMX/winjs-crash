
var XML = new XMLClass();

function XMLClass() {
    this.load = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            var countryKey = '';
            var xmlPath = '';

            countryKey = globalVars.countryKey;

            if (globalVars.countryKey == 'BEL'
                    || globalVars.countryKey == 'COR'
                    || globalVars.countryKey == 'SAL'
                    || globalVars.countryKey == 'GUA'
                    || globalVars.countryKey == 'HAI'
                    || globalVars.countryKey == 'HON'
                    || globalVars.countryKey == 'NIC'
                    || globalVars.countryKey == 'PAN'
                    || globalVars.countryKey == 'DOM'
                    || globalVars.countryKey == 'WTI') {
                countryKey = 'CAD';
            }

            switch (countryKey) {
                case 'CAD':
                    xmlPath += 'app-config-CAD.xml';
                    break;
                case 'COL':
                    xmlPath += 'app-config-COL.xml';
                    break;
                case 'CHI':
                    xmlPath += 'app-config-CHI.xml';
                    break;
                case 'ECU':
                    xmlPath += 'app-config-ECU.xml';
                    break;
                case 'MEX':
                    xmlPath += 'app-config-MEX.xml';
                    break;
                case 'PER':
                    xmlPath += 'app-config-PER.xml';
                    break;
                default:
                    xmlPath += 'app-config-MEX.xml';
            }

            loadXmlFile(xmlPath)
                .then(
                    function () {
                        globalVars.applicationName = application.name;
                        globalVars.countryKey = application.info.countryKey;
                        globalVars.countryId = application.info.countryId;
                        globalVars.editionId = application.info.editionId;
                        globalVars.interactionsId = application.info.interactionsId;
                        globalVars.prefix = application.info.prefix;
                        globalVars.target = application.info.target;
                        globalVars.sections = application.sections;
                        globalVars.resolutionKey = application.info.resolutionKey;

                        completed();
                    },
                    function (err) {
                        error(err);
                    }
                );
        });
    };
}