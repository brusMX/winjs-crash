
(function () {
    "use strict";

    WinJS.UI.Pages
        .define('/pages/settings/profile.html', {
            // This function is called whenever a user navigates to this page. It
            // populates the page elements with the app's data.
            ready: function (element, options) {
                // TODO: Initialize the page here.

                options = options || {};

                // Page methods:
                var _bindEvents = function () {
                    if (document.getElementById('professions')) { document.getElementById('professions').addEventListener('change', function (event) { _onProfessionChange(this); }, false); }
                    if (document.getElementById('specialities')) { document.getElementById('specialities').addEventListener('change', function (event) { _onSpecialityChange(this); }, false); }
                    if (document.getElementById('countries')) { document.getElementById('countries').addEventListener('change', function (event) { _onCountryChange(this); }, false); }
                    if (document.getElementById('termsAndConditions')) { document.getElementById('termsAndConditions').addEventListener('touchend', function () { _displayDocument('Terms'); }, false); }
                    if (document.getElementById('privacyNotice')) { document.getElementById('privacyNotice').addEventListener('touchend', function () { _displayDocument('Privacy'); }, false); }

                    if (globalVars.code != '') {
                        if (document.getElementById('saveProfile')) { document.getElementById('saveProfile').addEventListener('click', _saveProfile, false); }
                        if (document.getElementById('cancelProfile')) { document.getElementById('cancelProfile').addEventListener('click', _cancelProfile, false); }
                    } else {
                        if (document.getElementById('registerProfile')) { document.getElementById('registerProfile').addEventListener('click', _registerProfile, false); }
                    }
                };
                var _unbindEvents = function () {
                    if (document.getElementById('professions')) { document.getElementById('professions').removeEventListener('change', _onProfessionChange, false); }
                    if (document.getElementById('specialities')) { document.getElementById('specialities').removeEventListener('change', _onSpecialityChange, false); }
                    if (document.getElementById('countries')) { document.getElementById('countries').removeEventListener('change', _onCountryChange, false); }
                    if (document.getElementById('termsAndConditions')) { document.getElementById('termsAndConditions').removeEventListener('touchend', _displayDocument, false); }
                    if (document.getElementById('privacyNotice')) { document.getElementById('privacyNotice').removeEventListener('touchend', _displayDocument, false); }

                    if (globalVars.code != '') {
                        if (document.getElementById('saveProfile')) { document.getElementById('saveProfile').removeEventListener('click', _saveProfile, false); }
                        if (document.getElementById('cancelProfile')) { document.getElementById('cancelProfile').removeEventListener('click', _cancelProfile, false); }
                    } else {
                        if (document.getElementById('registerProfile')) { document.getElementById('registerProfile').removeEventListener('click', _registerProfile, false); }
                    }
                };
                var _cleanVariables = function () {
                    profileVars.profileCodePrefix = '';
                    profileVars.profileCountry = '';
                    profileVars.profileEmail = '';
                    profileVars.profileEntrySource = '';
                    profileVars.profileFirstName = '';
                    profileVars.profileLastName = '';
                    profileVars.profileLicense = '';
                    profileVars.profileProfession = 0;
                    profileVars.profileResidenceKey = '';
                    profileVars.profileSLastName = '';
                    profileVars.profileSpeciality = 0;
                    profileVars.profileState = '';
                    profileVars.profileTargetOutput = '';
                    profileVars.countriesItems = null;
                    profileVars.professionsItems = null;
                    profileVars.professionsByParentItems = null;
                    profileVars.profileItems = null;
                    profileVars.residencesItems = null;
                    profileVars.specialitiesItems = null;
                    profileVars.statesItems = null;
                };
                var _getClientDetailByEmail = function (email) {

                    Loader.show();

                    ClientsServices.getClientDetailByEmail(email)
                            .then(
                                function (result) {
                                    profileVars.profileItems = null;

                                    if (typeof (result.getClientDetailByEmailResult) != 'undefined'
                                        && result.getClientDetailByEmailResult != null) {
                                        profileVars.profileItems = result.getClientDetailByEmailResult;
                                    }

                                    _displayUserInfo();

                                    _getProfessions()
                                        .then(_getCountries)
                                        .then(
                                            function () {
                                                Loader.hide();
                                            }, function (err) {
                                                Loader.hide();

                                                var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                                messageDialog.commands
                                                    .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                                        _unbindEvents();
                                                        _cleanVariables();
                                                        WinJS.Navigation.back(1);
                                                    }));
                                                messageDialog.showAsync();
                                            }
                                        );
                                }, function (err) {
                                    Loader.hide();

                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                    messageDialog.commands
                                        .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                            _unbindEvents();
                                            _cleanVariables();
                                            WinJS.Navigation.back(1);
                                        }));
                                    messageDialog.showAsync();
                                }
                            );
                };
                var _displayUserInfo = function () {
                    if (document.getElementById('email')) {
                        document.getElementById('email').value = globalVars.email;
                    }

                    if (profileVars.profileItems != null) {
                        if (profileVars.profileItems.FirstName != null
                            && profileVars.profileItems.FirstName != ''
                            && document.getElementById('firstName')) {
                            document.getElementById('firstName').value = profileVars.profileItems.FirstName;
                        }

                        if (profileVars.profileItems.LastName != null
                            && profileVars.profileItems.LastName != ''
                            && document.getElementById('lastName')) {
                            document.getElementById('lastName').value = profileVars.profileItems.LastName;
                        }

                        if (profileVars.profileItems.SecondLastName != null
                            && profileVars.profileItems.SecondLastName != ''
                            && document.getElementById('secondLastName')) {
                            document.getElementById('secondLastName').value = profileVars.profileItems.SecondLastName;
                        }

                        if (profileVars.profileItems.Email != null
                            && profileVars.profileItems.Email != ''
                            && document.getElementById('email')) {
                            document.getElementById('email').value = profileVars.profileItems.Email;
                        }
                    }
                };
                var _getProfessions = function () {
                    return new WinJS.Promise(function (completed, error, progress) {
                        ClientsServices.getProfessions()
                            .then(
                                function (result) {
                                    profileVars.professionsItems = null;

                                    if (typeof (result.getProfessionsResult) != 'undefined'
                                        && result.getProfessionsResult != null) {
                                        profileVars.professionsItems = result.getProfessionsResult;
                                    }

                                    if (profileVars.professionsItems != null) {
                                        _displayProfessions()
                                            .then(
                                                function () {
                                                    completed();
                                                }, function (err) {
                                                    error(err);
                                                }
                                            );
                                        // Shouldn't happen:
                                    } else {
                                        // If empty object, disable register/save buttons:
                                        if (document.getElementById('registerProfile')) {
                                            document.getElementById('registerProfile').setAttribute('disabled');
                                        }
                                        
                                        if (document.getElementById('saveProfile')) {
                                            document.getElementById('saveProfile').setAttribute('disabled');
                                        }

                                        completed();
                                    }
                                }, function (err) {
                                    error(err);
                                }
                            );
                    });
                };
                var _displayProfessions = function () {
                    return new WinJS.Promise(function (completed, error, progress) {
                        var professionsSelect = document.getElementById('professions');

                        if (professionsSelect) {
                            var professionId = 0;

                            if (typeof (profileVars.professionsItems.length) == 'undefined') {
                                profileVars.professionsItems = [profileVars.professionsItems];
                            }

                            for (var i = 0; i < profileVars.professionsItems.length; i++) {
                                var option = document.createElement('option');

                                option.text = profileVars.professionsItems[i].ProfessionName;
                                option.value = profileVars.professionsItems[i].ProfessionId;

                                if (i == 0) {
                                    option.selected = true;
                                }

                                if (profileVars.profileItems != null
                                    && profileVars.profileItems.Profession != null) {
                                    if (profileVars.profileItems.Profession.ProfessionId > 0
                                        && profileVars.profileItems.Profession.ProfessionId == profileVars.professionsItems[i].ProfessionId) {
                                        option.selected = true;
                                        professionId = Number(profileVars.professionsItems[i].ProfessionId);
                                    } else {
                                        if (profileVars.profileItems.Profession.ParentId != null) {
                                            if (profileVars.profileItems.Profession.ParentId == profileVars.professionsItems[i].ProfessionId) {
                                                option.selected = true;
                                                professionId = Number(profileVars.professionsItems[i].ProfessionId);
                                            }
                                        }
                                    }
                                }

                                professionsSelect.add(option);
                            }

                            if (professionId > 0) {
                                if (professionId == 7 || professionId == 8) {
                                    var professionalLicense = document.getElementById('professionalLicense');

                                    if (profileVars.profileItems != null
                                        && profileVars.profileItems.ProfessionalLicense != '') {
                                        professionalLicense.value = profileVars.profileItems.ProfessionalLicense;
                                    }

                                    document.getElementById('professionalLicenseDiv').setAttribute('style', 'display: block;');
                                }

                                _getProfessionsByParent(professionId)
                                    .then(function () {
                                        return _getSpecialities(professionId);
                                    }).then(
                                        function () {
                                            completed();
                                        }, function (err) {
                                            error(err);
                                        }
                                    );

                            } else {
                                completed();
                            }
                        } else {
                            completed();
                        }
                    });
                };
                var _onProfessionChange = function (profession) {
                    var professionId = profession.value;

                    document.getElementById('professionsByParentDiv').setAttribute('style', 'display: none;');
                    document.getElementById('specialitiesDiv').setAttribute('style', 'display: none;');
                    document.getElementById('residencesDiv').setAttribute('style', 'display: none;');
                    document.getElementById('professionalLicenseDiv').setAttribute('style', 'display: none;');

                    document.getElementById('professionsByParent').options.length = 0;
                    document.getElementById('specialities').options.length = 0;
                    document.getElementById('residences').options.length = 0;

                    document.getElementById('professionalLicense').value = '';

                    if (profileVars.profileItems != null) {
                        profileVars.profileItems.Profession = null;
                        profileVars.profileItems.Speciality = null;
                        profileVars.profileItems.ResidenceKey = null;
                        profileVars.profileItems.ProfessionalLicense = '';
                    }

                    if (professionId > 0) {
                        if (professionId == 7 || professionId == 8) {
                            document.getElementById('professionalLicenseDiv').setAttribute('style', 'display: block;');
                        }

                        Loader.show();

                        _getProfessionsByParent(professionId)
                            .then(function () {
                                return _getSpecialities(professionId);
                            }).then(
                                function () {
                                    Loader.hide();
                                }, function (err) {
                                    Loader.hide();

                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                    messageDialog.commands
                                        .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                            _unbindEvents();
                                            _cleanVariables();
                                            WinJS.Navigation.back(1);
                                        }));
                                    messageDialog.showAsync();
                                }
                            );
                    };
                };
                var _getProfessionsByParent = function (parentId) {
                    return new WinJS.Promise(function (completed, error, progress) {
                        ClientsServices.getProfessionsByParent(parentId)
                            .then(
                                function (result) {
                                    profileVars.professionsByParentItems = null;

                                    if (typeof (result.getProfessionsByParentResult) != 'undefined'
                                        && result.getProfessionsByParentResult != null) {
                                        profileVars.professionsByParentItems = result.getProfessionsByParentResult;
                                    }

                                    if (profileVars.professionsByParentItems != null) {
                                        _displayProfessionsByParent()
                                            .done(function () {
                                                completed();
                                            });
                                    } else {
                                        completed();
                                    }
                                }, function (err) {
                                    error(err);
                                }
                            );
                    });
                };
                var _displayProfessionsByParent = function () {
                    return new WinJS.Promise(function (completed, error, progress) {
                        var professionsByParentSelect = document.getElementById('professionsByParent');

                        if (professionsByParentSelect) {
                            if (typeof (profileVars.professionsByParentItems.length) == 'undefined') {
                                profileVars.professionsByParentItems = [profileVars.professionsByParentItems];
                            }

                            if (profileVars.professionsByParentItems.length > 0) {
                                var option = document.createElement('option');
                                option.text = 'SELECCIONAR';
                                option.value = -1;
                                option.selected = true;

                                professionsByParentSelect.add(option);

                                for (var i = 0; i < profileVars.professionsByParentItems.length; i++) {
                                    var option = document.createElement('option');

                                    option.text = profileVars.professionsByParentItems[i].ProfessionName;
                                    option.value = profileVars.professionsByParentItems[i].ProfessionId;

                                    if (profileVars.profileItems != null
                                        && profileVars.profileItems.Profession != null) {
                                        if (profileVars.profileItems.Profession.ProfessionId == profileVars.professionsByParentItems[i].ProfessionId) {
                                            option.selected = true;
                                        }
                                    }

                                    professionsByParentSelect.add(option);
                                }

                                document.getElementById('professionsByParentDiv').setAttribute('style', 'display: block;');
                            }
                        }

                        completed();
                    });
                };
                var _getSpecialities = function (professionId) {
                    return new WinJS.Promise(function (completed, error, progress) {
                        ClientsServices.getSpecialities(professionId)
                            .then(
                                function (result) {
                                    profileVars.specialitiesItem = null;

                                    if (typeof (result.getSpecialitiesResult) != 'undefined'
                                        && result.getSpecialitiesResult != null) {
                                        profileVars.specialitiesItems = result.getSpecialitiesResult;
                                    }

                                    if (profileVars.specialitiesItems != null) {
                                        _displaySpecialities()
                                            .then(
                                                function () {
                                                    completed();
                                                }, function (err) {
                                                    error(err);
                                                }
                                            );
                                    } else {
                                        completed();
                                    }
                                }, function (err) {
                                    error(err);
                                }
                            );
                    });
                };
                var _displaySpecialities = function () {
                    return new WinJS.Promise(function (completed, error, progress) {
                        var specialitiesSelect = document.getElementById('specialities');

                        if (specialitiesSelect) {
                            var specialityId = 0;

                            if (typeof (profileVars.specialitiesItems.length) == 'undefined') {
                                profileVars.specialitiesItems = [profileVars.specialitiesItems];
                            }

                            if (profileVars.specialitiesItems.length > 1) {
                                for (var i = 0; i < profileVars.specialitiesItems.length; i++) {
                                    var option = document.createElement('option');

                                    option.text = profileVars.specialitiesItems[i].SpecialityName;
                                    option.value = profileVars.specialitiesItems[i].SpecialityId;

                                    if (i == 0) {
                                        option.selected = true;
                                    }

                                    if (profileVars.profileItems != null
                                        && profileVars.profileItems.Speciality != null) {
                                        if (profileVars.profileItems.Speciality.SpecialityId == profileVars.specialitiesItems[i].SpecialityId) {
                                            option.selected = true;
                                            specialityId = profileVars.specialitiesItems[i].SpecialityId;
                                        }
                                    }

                                    specialitiesSelect.add(option);
                                }

                                if (specialityId > 0) {
                                    _getResidences(specialityId)
                                        .then(
                                            function () {
                                                completed();
                                            }, function (err) {
                                                error(err);
                                            }
                                        );
                                }

                                document.getElementById('specialitiesDiv').setAttribute('style', 'display: block;');
                            }
                        }

                        completed();
                    });
                };
                var _onSpecialityChange = function (speciality) {
                    var specialityId = speciality.value;

                    document.getElementById('residencesDiv').setAttribute('style', 'display: none;');

                    document.getElementById('residences').options.length = 0;

                    if (profileVars.profileItems != null) {
                        profileVars.profileItems.Speciality = null;
                        profileVars.profileItems.ResidenceKey = null;
                    }

                    if (specialityId > 0) {

                        Loader.show();

                        _getResidences(specialityId)
                            .then(
                                function () {
                                    Loader.hide();
                                }, function (err) {
                                    Loader.hide();

                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                    messageDialog.commands
                                        .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                            _unbindEvents();
                                            _cleanVariables();
                                            WinJS.Navigation.back(1);
                                        }));
                                    messageDialog.showAsync();
                                }
                            );
                    }
                };
                var _getResidences = function (specialityId) {
                    return new WinJS.Promise(function (completed, error, progress) {
                        ClientsServices.getResidenceLevelsBySpeciality(specialityId)
                            .then(
                                function (result) {
                                    profileVars.residencesItems = null;

                                    if (typeof (result.getResidenceLevelsBySpecialityResult) != 'undefined'
                                        && result.getResidenceLevelsBySpecialityResult != null) {
                                        profileVars.residencesItems = result.getResidenceLevelsBySpecialityResult;
                                    }

                                    if (profileVars.residencesItems != null) {
                                        _displayResidences()
                                            .done(function () {
                                                completed();
                                            });
                                    } else {
                                        completed();
                                    }
                                }, function (err) {
                                    error(err);
                                }
                            );
                    });
                };
                var _displayResidences = function () {
                    return new WinJS.Promise(function (completed, error, progress) {
                        var residencesSelect = document.getElementById('residences');

                        if (residencesSelect) {
                            if (typeof (profileVars.residencesItems.length) == 'undefined') {
                                profileVars.residencesItems = [profileVars.residencesItems];
                            }

                            if (profileVars.residencesItems.length > 0) {
                                for (var i = 0; i < profileVars.residencesItems.length; i++) {
                                    var option = document.createElement('option');

                                    if (profileVars.residencesItems[i].ResidenceKey == null) {
                                        profileVars.residencesItems[i].ResidenceKey = '';
                                    }

                                    option.text = profileVars.residencesItems[i].ResidenceName;
                                    option.value = profileVars.residencesItems[i].ResidenceKey;

                                    if (i == 0) {
                                        option.selected = true;
                                    }

                                    if (profileVars.profileItems != null
                                        && profileVars.profileItems.ResidenceKey != null) {
                                        if (profileVars.profileItems.ResidenceKey == profileVars.residencesItems[i].ResidenceKey) {
                                            option.selected = true;
                                        }
                                    }

                                    residencesSelect.add(option);
                                }

                                document.getElementById('residencesDiv').setAttribute('style', 'display: block;');
                            }
                        }

                        completed();
                    });
                };
                var _getCountries = function () {
                    return new WinJS.Promise(function (completed, error, progress) {
                        ClientsServices.getCountries()
                            .then(
                                function (result) {
                                    profileVars.countriesItems = null;

                                    if (typeof (result.getCountriesResult) != 'undefined'
                                        && result.getCountriesResult != null) {
                                        profileVars.countriesItems = result.getCountriesResult;
                                    }

                                    if (profileVars.countriesItems != null) {
                                        _displayCountries()
                                            .then(
                                                function () {
                                                    completed();
                                                }, function (err) {
                                                    error(err);
                                                }
                                            );
                                        // Shouldn't happen:
                                    } else {
                                        // If empty object, disable register/save buttons:
                                        if (document.getElementById('registerProfile')) {
                                            document.getElementById('registerProfile').setAttribute('disabled');
                                        }

                                        if (document.getElementById('saveProfile')) {
                                            document.getElementById('saveProfile').setAttribute('disabled');
                                        }

                                        completed();
                                    }
                                }, function (err) {
                                    error(err);
                                }
                            );
                    });
                };
                var _displayCountries = function () {
                    return new WinJS.Promise(function (completed, error, progress) {
                        var countriesSelect = document.getElementById('countries');

                        if (countriesSelect) {
                            var countryId = 0;

                            if (typeof (profileVars.countriesItems.length) == 'undefined') {
                                profileVars.countriesItems = [profileVars.countriesItems];
                            }

                            for (var i = 0; i < profileVars.countriesItems.length; i++) {
                                var option = document.createElement('option');

                                if (profileVars.countriesItems[i].ID == null) {
                                    profileVars.countriesItems[i].ID = '';
                                }

                                option.text = profileVars.countriesItems[i].CountryName;
                                option.value = profileVars.countriesItems[i].CountryId + '|' + profileVars.countriesItems[i].ID;

                                if (i == 0) {
                                    option.selected = true;
                                }

                                if (profileVars.profileItems != null) {
                                    if (profileVars.profileItems.CountryId > 0) {
                                        if (profileVars.profileItems.CountryId == profileVars.countriesItems[i].CountryId) {
                                            option.selected = true;
                                            countryId = profileVars.countriesItems[i].CountryId;
                                        }
                                    }
                                }

                                countriesSelect.add(option);
                            }

                            if (countryId > 0) {
                                _getStates(countryId)
                                    .then(
                                        function () {
                                            completed();
                                        }, function (err) {
                                            error(err);
                                        }
                                    );
                            } else {
                                completed();
                            }
                        } else {
                            completed();
                        }
                    });
                };
                var _onCountryChange = function (country) {
                    var country = country.value;
                    var countryArray = country.split('|');
                    var countryId = 0;

                    document.getElementById('statesDiv').setAttribute('style', 'display: none;');

                    document.getElementById('states').options.length = 0;

                    document.getElementById('termsCheckbox').checked = false;
                    document.getElementById('privacyCheckbox').checked = false;

                    if (countryArray.length > 0
                        && typeof (countryArray[0]) != 'undefined') {
                        countryId = countryArray[0];
                    }

                    if (profileVars.profileItems != null) {
                        profileVars.profileItems.CountryId = 0;
                        profileVars.profileItems.StateId = 0;
                    }

                    if (countryId > 0) {

                        Loader.show();

                        _getStates(countryId)
                            .then(
                                function () {
                                    Loader.hide();
                                }, function (err) {
                                    Loader.hide();

                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);

                                    messageDialog.commands
                                        .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                            _unbindEvents();
                                            _cleanVariables();
                                            WinJS.Navigation.back(1);
                                        }));
                                    messageDialog.showAsync();
                                }
                            );
                    }
                };
                var _getStates = function (countryId) {
                    return new WinJS.Promise(function (completed, error, progress) {
                        ClientsServices.getStateByCountry(countryId)
                            .then(
                                function (result) {
                                    profileVars.statesItems = null;

                                    if (typeof (result.getStateByCountryResult) != 'undefined'
                                        && result.getStateByCountryResult != null) {
                                        profileVars.statesItems = result.getStateByCountryResult;
                                    }

                                    if (profileVars.statesItems != null) {
                                        _displayStates()
                                            .done(function () {
                                                completed();
                                            });
                                    } else {
                                        completed();
                                    }
                                }, function (err) {
                                    error(err);
                                }
                            );
                    });
                };
                var _displayStates = function () {
                    return new WinJS.Promise(function (completed, error, progress) {
                        var statesSelect = document.getElementById('states');

                        if (statesSelect) {
                            if (typeof (profileVars.statesItems.length) == 'undefined') {
                                profileVars.statesItems = [profileVars.statesItems];
                            }

                            if (profileVars.statesItems.length > 0) {
                                for (var i = 0; i < profileVars.statesItems.length; i++) {
                                    var option = document.createElement('option');

                                    if (profileVars.statesItems[i].ShortName == null) {
                                        profileVars.statesItems[i].ShortName = '';
                                    }

                                    option.text = profileVars.statesItems[i].StateName;
                                    option.value = profileVars.statesItems[i].StateId + '|' + profileVars.statesItems[i].ShortName;

                                    if (i == 0) {
                                        option.selected = true;
                                    }

                                    if (profileVars.profileItems != null) {
                                        if (profileVars.profileItems.StateId > 0) {
                                            if (profileVars.profileItems.StateId == profileVars.statesItems[i].StateId) {
                                                option.selected = true;
                                            }
                                        }
                                    }

                                    statesSelect.add(option);
                                }

                                document.getElementById('statesDiv').setAttribute('style', 'display: block;');
                            }
                        }

                        completed();
                    });
                };
                var _displayDocument = function (documentType) {
                    var country = document.getElementById('countries').value;
                    var countryArray = country.split('|');
                    var countryKey = '';
                    var documentUri = '';

                    if (countryArray.length > 0
                        && typeof (countryArray[1]) != 'undefined') {
                        countryKey = countryArray[1];

                        if (countryKey == 'BEL'
                            || countryKey == 'COR'
                            || countryKey == 'SAL'
                            || countryKey == 'GUA'
                            || countryKey == 'HAI'
                            || countryKey == 'HON'
                            || countryKey == 'NIC'
                            || countryKey == 'PAN'
                            || countryKey == 'DOM') {
                            countryKey = 'CAD';
                        }

                        switch (documentType) {
                            case 'Terms':
                                switch (countryKey) {
                                    case 'CAD':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/terminos/terms-cad.htm';
                                        break;
                                    case 'CHI':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/terminos/terms-chi.htm';
                                        break;
                                    case 'COL':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/terminos/terms-col.htm';
                                        break;
                                    case 'ECU':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/terminos/terms-ecu.htm';
                                        break;
                                    case 'MEX':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/terminos/terms-mex.htm';
                                        break;
                                    case 'PER':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/terminos/terms-per.htm';
                                        break;
                                    default:
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/terminos/terms-mex.htm';
                                }
                                break;
                            case 'Privacy':
                                switch (countryKey) {
                                    case 'CAD':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/avisoprivacidad/privacy-cad.htm';
                                        break;
                                    case 'CHI':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/avisoprivacidad/privacy-chi.htm';
                                        break;
                                    case 'COL':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/avisoprivacidad/privacy-col.htm';
                                        break;
                                    case 'ECU':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/avisoprivacidad/privacy-ecu.htm';
                                        break;
                                    case 'MEX':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/avisoprivacidad/privacy-mex.htm';
                                        break;
                                    case 'PER':
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/avisoprivacidad/privacy-per.htm';
                                        break;
                                    default:
                                        documentUri = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/avisoprivacidad/privacy-mex.htm';
                                }
                                break;
                        }
                        
                        if (documentUri != '') {
                            var windowsUri = new Windows.Foundation.Uri(documentUri);
                            Windows.System.Launcher.launchUriAsync(windowsUri);
                        }
                    }
                };
                var _registerProfile = function () {
                    var validation = _validate();

                    Loader.show();

                    if (validation.Value) {
                        var termsChecked = document.getElementById('termsCheckbox').checked;
                        var privacyChecked = document.getElementById('privacyCheckbox').checked;

                        if (termsChecked
                            && privacyChecked) {
                            profileVars.profileCodePrefix = globalVars.prefix;
                            profileVars.profileEntrySource = 'DISPOSITIVO_MOVIL';
                            profileVars.profileTargetOutput = globalVars.target;

                            ClientsServices.saveMobileClient()
                                .then(
                                    function (result) {
                                        Loader.hide();

                                        var codeString = '';

                                        if (typeof (result.saveMobileClientResult) != 'undefined'
                                            && result.saveMobileClientResult != null) {
                                            codeString = result.saveMobileClientResult;
                                        }

                                        if (codeString != '') {
                                            var params = [codeString, profileVars.profileCountry, profileVars.profileEmail];

                                            LocalStorage.set('User', params)
                                                .then(
                                                    function () {
                                                        LocalStorage.get('User')
                                                            .then(
                                                                function () {
                                                                    XML.load()
                                                                        .then(Countries.set)
                                                                        .then(
                                                                            function () {
                                                                                Loader.hide();

                                                                                Navigation.set();

                                                                                // Clean navigation:
                                                                                var options = {
                                                                                    firstTime: true
                                                                                };

                                                                                _unbindEvents();
                                                                                _cleanVariables();

                                                                                WinJS.Navigation.navigate('pages/products/searchEngine.html', options);

                                                                                // Shouldn't happen unless there's no connection available or XML file isn't found:
                                                                            }, function (err) {
                                                                                Loader.hide();

                                                                                Navigation.set();

                                                                                // Clean navigation:
                                                                                var options = {
                                                                                    firstTime: true
                                                                                };

                                                                                var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                                                                                messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                                                                    _unbindEvents();
                                                                                    _cleanVariables();

                                                                                    WinJS.Navigation.navigate('pages/products/searchEngine.html', options);
                                                                                }));
                                                                                messageDialog.showAsync();
                                                                            }
                                                                        );
                                                                }, function (err) {
                                                                    Loader.hide();

                                                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                                                                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                                                    messageDialog.showAsync();
                                                                }
                                                            );
                                                    }, function (err) {
                                                        Loader.hide();

                                                        var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                                                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                                        messageDialog.showAsync();
                                                    }
                                                );
                                        } else {
                                            Loader.hide();

                                            var messageDialog = new Windows.UI.Popups.MessageDialog("Error al intentar registrarlo. Por favor int\xE9ntelo nuevamente.");
                                            messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                            messageDialog.showAsync();
                                        }
                                    }, function (err) {
                                        Loader.hide();

                                        var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                                        messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                        messageDialog.showAsync();
                                    }
                                );
                        } else {
                            Loader.hide();

                            var messageDialog = new Windows.UI.Popups.MessageDialog("Debe aceptar los T\xE9rminos y Condiciones y el Aviso de Privacidad para continuar.");
                            messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                            messageDialog.showAsync();
                        }
                    } else {
                        Loader.hide();

                        var messageDialog = new Windows.UI.Popups.MessageDialog(validation.Message);

                        messageDialog.commands
                            .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                document.getElementById(validation.Element).focus();
                            }));
                        messageDialog.showAsync();
                    }
                };
                var _saveProfile = function () {
                    var validation = _validate();

                    Loader.show();

                    if (validation.Value) {
                        profileVars.profileCodePrefix = globalVars.prefix;
                        profileVars.profileEntrySource = 'DISPOSITIVO_MOVIL';
                        profileVars.profileTargetOutput = globalVars.target;

                        ClientsServices.updateMobileClient()
                            .then(
                                function (result) {
                                    Loader.hide();

                                    if (globalVars.countryKey != globalVars.profileCountry) {
                                        var params = [globalVars.code, profileVars.profileCountry, profileVars.profileEmail];

                                        LocalStorage.update('User', params)
                                            .then(
                                                function () {
                                                    LocalStorage.get('User')
                                                        .then(
                                                            function () {
                                                                XML.load()
                                                                    .then(Countries.set)
                                                                    .then(
                                                                        function () {
                                                                            Loader.hide();

                                                                            Navigation.set();

                                                                            // Clean navigation:
                                                                            var options = {
                                                                                changedCountry: true
                                                                            };

                                                                            _unbindEvents();
                                                                            _cleanVariables();

                                                                            WinJS.Navigation.navigate('pages/products/searchEngine.html', options);

                                                                            // Shouldn't happen unless there's no connection available or XML file isn't found:
                                                                        }, function (err) {
                                                                            Loader.hide();

                                                                            Navigation.set();

                                                                            // Clean navigation:
                                                                            var options = {
                                                                                changedCountry: true
                                                                            };

                                                                            _unbindEvents();
                                                                            _cleanVariables();

                                                                            var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                                                                            messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                                                                WinJS.Navigation.navigate('pages/products/searchEngine.html', options);
                                                                            }));
                                                                            messageDialog.showAsync();
                                                                        }
                                                                    );
                                                            }, function (err) {
                                                                Loader.hide();

                                                                var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                                                                messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                                                messageDialog.showAsync();
                                                            }
                                                        );
                                                }, function (err) {
                                                    Loader.hide();

                                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                                                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                                    messageDialog.showAsync();
                                                }
                                            );
                                    } else {
                                        _unbindEvents();
                                        _cleanVariables();
                                        WinJS.Navigation.back(1);
                                    }
                                }, function (err) {
                                    Loader.hide();

                                    var messageDialog = new Windows.UI.Popups.MessageDialog(err.Message);
                                    messageDialog.commands.append(new Windows.UI.Popups.UICommand("Aceptar"));
                                    messageDialog.showAsync();
                                }
                            );

                    } else {
                        Loader.hide();

                        var messageDialog = new Windows.UI.Popups.MessageDialog(validation.Message);

                        messageDialog.commands
                            .append(new Windows.UI.Popups.UICommand("Aceptar", function () {
                                document.getElementById(validation.Element).focus();
                            }));
                        messageDialog.showAsync();
                    }
                };
                var _cancelProfile = function () {
                    _unbindEvents();
                    _cleanVariables();
                    WinJS.Navigation.back(1);
                };
                var _validate = function () {
                    var country = document.getElementById('countries').value;
                    var countryArray = country.split('|');
                    var countryKey = '';

                    var state = document.getElementById('states').value;
                    var stateArray = state.split('|');
                    var stateShortName = '';

                    var validationObj = new Validation();
                    validationObj.Value = true;

                    if (countryArray.length > 0
                        && typeof (countryArray[1]) != 'undefined') {
                        countryKey = countryArray[1];
                    }

                    if (stateArray.length > 0
                        && typeof (stateArray[1]) != 'undefined') {
                        stateShortName = stateArray[1];
                    }

                    profileVars.profileFirstName = document.getElementById('firstName').value;
                    profileVars.profileLastName = document.getElementById('lastName').value;
                    profileVars.profileSLastName = document.getElementById('secondLastName').value;
                    profileVars.profileEmail = document.getElementById('email').value;
                    profileVars.profileProfession = document.getElementById('professions').value;
                    profileVars.profileSpeciality = document.getElementById('specialities').value;
                    profileVars.profileResidenceKey = document.getElementById('residences').value;
                    profileVars.profileLicense = document.getElementById('professionalLicense').value.toUpperCase();
                    profileVars.profileCountry = countryKey;
                    profileVars.profileState = stateShortName;

                    if (profileVars.profileFirstName.length < 3) {
                        validationObj.Element = 'firstName';
                        validationObj.Message = "El Nombre debe ser de al menos 3 caracteres.";
                        validationObj.Value = false;
                        return validationObj;
                    }

                    if (profileVars.profileLastName.length < 3) {
                        validationObj.Element = 'lastName';
                        validationObj.Message = "El Apellido Paterno debe ser de al menos 3 caracteres.";
                        validationObj.Value = false;
                        return validationObj;
                    }

                    if (profileVars.profileSLastName.length < 3) {
                        validationObj.Element = 'secondLastName';
                        validationObj.Message = "El Apellido Materno debe ser de al menos 3 caracteres.";
                        validationObj.Value = false;
                        return validationObj;
                    }

                    if (profileVars.profileProfession <= 0) {
                        validationObj.Element = 'professions';
                        validationObj.Message = "Debe elegir una Profesi\xF3n.";
                        validationObj.Value = false;
                        return validationObj;
                    }

                    var professionsByParentSelect = document.getElementById('professionsByParent');

                    if (professionsByParentSelect.options.length > 0) {
                        var professionId = document.getElementById('professionsByParent').value;

                        if (professionId <= 0) {
                            validationObj.Element = 'professionsByParent';
                            validationObj.Message = "Debe elegir una Profesi\xF3n.";
                            validationObj.Value = false;
                            return validationObj;
                        } else {
                            profileVars.profileProfession = professionId;
                        }
                    }

                    var specialitiesSelect = document.getElementById('specialities');

                    if (specialitiesSelect.options.length > 1) {
                        if (profileVars.profileSpeciality <= 0) {
                            validationObj.Element = 'specialities';
                            validationObj.Message = "Debe elegir una Especialidad.";
                            validationObj.Value = false;
                            return validationObj;
                        }
                    } else {
                        profileVars.profileSpeciality = 0;
                    }

                    var residencesSelect = document.getElementById('residences');

                    if (residencesSelect.options.length > 0) {
                        if (profileVars.profileResidenceKey == '') {
                            validationObj.Element = 'residences';
                            validationObj.Message = "Debe elegir una Residencia.";
                            validationObj.Value = false;
                            return validationObj;
                        }
                    } else {
                        profileVars.profileResidenceKey = 0;
                    }

                    if ((profileVars.profileProfession == 7 || profileVars.profileProfession == 8)
                        && (profileVars.profileLicense.length < 5 || profileVars.profileLicense.length > 10)) {
                        validationObj.Element = 'professionalLicense';
                        validationObj.Message = "La C\xE9dula Profesional debe ser de al menos 5 y m\xE1ximo 10 caracteres.";
                        validationObj.Value = false;
                        return validationObj;
                    }

                    if (profileVars.profileCountry == '') {
                        validationObj.Element = 'countries';
                        validationObj.Message = "Debe elegir un Pa\xEDs.";
                        validationObj.Value = false;
                        return validationObj;
                    }

                    var statesSelect = document.getElementById('states');

                    if (statesSelect.options.length > 0) {
                        if (profileVars.profileState == '') {
                            validationObj.Element = 'states';
                            validationObj.Message = "Debe elegir un Estado.";
                            validationObj.Value = false;
                            return validationObj;
                        }
                    } else {
                        profileVars.profileState = '';
                    }

                    return validationObj;
                };

                // Page initialization starts here:

                _bindEvents();

                if (document.getElementById('professionsByParentDiv')) { document.getElementById('professionsByParentDiv').setAttribute('style', 'display: none;'); }
                if (document.getElementById('specialitiesDiv')) { document.getElementById('specialitiesDiv').setAttribute('style', 'display: none;'); }
                if (document.getElementById('residencesDiv')) { document.getElementById('residencesDiv').setAttribute('style', 'display: none;'); }
                if (document.getElementById('professionalLicenseDiv')) { document.getElementById('professionalLicenseDiv').setAttribute('style', 'display: none;'); }
                if (document.getElementById('statesDiv')) { document.getElementById('statesDiv').setAttribute('style', 'display: none;'); }
                if (document.getElementById('saveProfileButtonDiv')) { document.getElementById('saveProfileButtonDiv').setAttribute('style', 'display: none;'); }

                if (globalVars.code != '') {
                    if (document.getElementById('noticesDiv')) { document.getElementById('noticesDiv').setAttribute('style', 'display: none;'); }
                    if (document.getElementById('registerProfileButtonDiv')) { document.getElementById('registerProfileButtonDiv').setAttribute('style', 'display: none;'); }
                    if (document.getElementById('saveProfileButtonDiv')) { document.getElementById('saveProfileButtonDiv').setAttribute('style', 'display: block;'); }
                }

                _getClientDetailByEmail(globalVars.email);
            },
        });
})();

