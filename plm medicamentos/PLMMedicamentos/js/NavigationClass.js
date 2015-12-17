
var Navigation = new NavigationClass();

function NavigationClass() {
    // Class variables:
    this.countries = null;
    this.scenarios = null;
    this.settings = null;

    // Class methods:
    this.set = function () {
        var scenarios = new Array();

        if (globalVars.code != '') {
            if (globalVars.sections != null
                && globalVars.sections.length > 0) {
                for (var i = 0; i < globalVars.sections.length; i++) {
                    if (globalVars.sections[i].visible == true) {
                        globalVars.sections[i]['className'] = '';

                        if (globalVars.sections[i].name == 'PatientContent'
                            || globalVars.sections[i].name == 'Favorites'
                            || globalVars.sections[i].name == 'Newsletters') {
                            globalVars.sections[i].className = 'navigation-hr';
                        } else {
                            globalVars.sections[i].className = 'navigation-hr hidden';
                        }

                        scenarios.push(globalVars.sections[i]);
                    }
                }
            }
        } else {
            scenarios.push({ uri: 'pages/settings/register.html' });
        }

        this.bind(scenarios);
    };

    this.bind = function (scenarios) {
        if (this.scenarios != null) {
            if (Navigation.scenarios.length > 0) {
                Navigation.scenarios.splice(0, Navigation.scenarios.length);
            }

            for (var i = 0; i < scenarios.length; i++) {
                Navigation.scenarios.push(scenarios[i]);
            }
        } else {
            Navigation.scenarios = new WinJS.Binding.List(scenarios);
        }
    };

    this.getSubsections = function (sectionName) {
        var sections = this.setSubsections(sectionName);

        switch (sectionName) {
            case 'Settings':
                Navigation.settings = new WinJS.Binding.List(sections);
                if (Navigation.settings == null) {
                    
                }
        }
    };

    this.setSubsections = function (sectionName) {
        var sections = [];

        if (globalVars.sections != null) {
            for (var i = 0; i < globalVars.sections.length; i++) {
                if (sectionName == globalVars.sections[i].name
                    && typeof (globalVars.sections[i].subSections) != 'undefined'
                    && globalVars.sections[i].subSections.length > 0) {
                    for (var j = 0; j < globalVars.sections[i].subSections.length; j++) {
                        if (globalVars.sections[i].subSections[j].visible == true) {
                            sections.push(globalVars.sections[i].subSections[j]);
                        }
                    }
                    break;
                }
            }
        }

        return sections;
    };

    this.setCountries = function () {
        if (Countries.items != null) {
            var countries = [];

            for (var i = 0; i < Countries.items.length; i++) {
                var iconImage = '';

                if (Countries.items[i].BaseUrl != null && Countries.items[i].BaseUrl != ''
                    && Countries.items[i].FileName != null && Countries.items[i].FileName != '') {
                    iconImage = Countries.items[i].BaseUrl + Countries.items[i].FileName;
                }

                countries.push({
                    countryId: Countries.items[i].CountryId,
                    countryKey: Countries.items[i].ID,
                    displayName: Countries.items[i].CountryName,
                    editionId: Countries.items[i].EditionId,
                    iconImage: iconImage
                });
            }

            if (this.countries != null) {
                if (Navigation.countries.length > 0) {
                    Navigation.countries.splice(0, Navigation.countries.length);
                }

                for (var i = 0; i < countries.length; i++) {
                    Navigation.countries.push(countries[i]);
                }
            } else {
                Navigation.countries = new WinJS.Binding.List(countries);
            }
        }
    };
}