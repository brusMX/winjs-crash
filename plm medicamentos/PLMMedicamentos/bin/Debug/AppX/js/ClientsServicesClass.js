
var ClientsServices = new ClientServicesClass();

function ClientServicesClass() {
    // Class variables:

    // Class methods:
    this.initialize = function () {

    };

    this.getClientDetailByEmail = function (email) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMClientsEngine + '/getClientDetailByEmail?email=' + email,
                                headers: {
                                    "If-Modified-Since": new Date()
                                },
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar Perfil.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Client Detail By Email invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar Perfil.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.getProfessions = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMClientsEngine + '/getProfessions',
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Profesiones.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Professions invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Profesiones.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.getProfessionsByParent = function (parentId) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMClientsEngine + '/getProfessionsByParent?parentId=' + parentId,
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Profesiones.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Professions By Parent invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Profesiones.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.getSpecialities = function (professionId) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMClientsEngine + '/getSpecialities?professionId=' + professionId,
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Especialidades.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Specialities invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Especialidades.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    // Speciality needs SpecialityId:
    this.getResidenceLevelsBySpeciality = function (speciality) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMClientsEngine + '/getResidenceLevelsBySpeciality?speciality=' + speciality,
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Residencias.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Residence Levels By Speciality invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Residencias.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.getCountries = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMClientsEngine + '/getCountries',
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Pa\xEDses.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Countries invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Pa\xEDses.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.getStateByCountry = function (countryId) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMClientsEngine + '/getStateByCountry?countryId=' + countryId,
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Estados.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get States By Country invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar informaci\xF3n de Estados.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.saveMobileClient = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            var data =
                'codePrefix=' + profileVars.profileCodePrefix
                + '&firstName=' + profileVars.profileFirstName
                + '&lastName=' + profileVars.profileLastName
                + '&slastName=' + profileVars.profileSLastName
                + '&email=' + profileVars.profileEmail
                + '&profession=' + profileVars.profileProfession
                + '&otherProfession=';

            if (profileVars.profileSpeciality != 0) {
                data += '&speciality=' + profileVars.profileSpeciality + '&specialityName=';
            }

            data += '&professionalLicense=' + profileVars.profileLicense
    		    + '&residenceKey=' + profileVars.profileResidenceKey
    		    + '&country=' + profileVars.profileCountry
    		    + '&state=' + profileVars.profileState
    		    + '&source=' + profileVars.profileEntrySource
    		    + '&targetOutput=' + profileVars.profileTargetOutput
    		    + '&IMEI=';

            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMClientsEngine + '/saveMobileClient?' + data,
                                headers: {
                                    "If-Modified-Since": new Date()
                                },
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar registrarlo. Por favor int\xE9ntelo nuevamente.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Save Mobile Client invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar registrarlo. Por favor int\xE9ntelo nuevamente.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.updateMobileClient = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            var data = 'codeString=' + globalVars.code
    		    + '&firstName=' + profileVars.profileFirstName
    		    + '&lastName=' + profileVars.profileLastName
    		    + '&slastName=' + profileVars.profileSLastName
    		    + '&email=' + profileVars.profileEmail
    		    + '&profession=' + profileVars.profileProfession
    		    + '&otherProfession=';

            if (profileVars.profileSpeciality != 0) {
                data += '&speciality=' + profileVars.profileSpeciality + '&specialityName=';
            }

            data += '&professionalLicense=' + profileVars.profileLicense
                + '&residenceKey=' + profileVars.profileResidenceKey
                + '&country=' + profileVars.profileCountry
                + '&state=' + profileVars.profileState
                + '&source=' + profileVars.profileEntrySource
                + '&targetOutput=' + profileVars.profileTargetOutput
                + '&IMEI=';

            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMClientsEngine + '/updateMobileClient?' + data,
                                headers: {
                                    "If-Modified-Since": new Date()
                                },
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar actualizar su Perfil. Por favor int\xE9ntelo nuevamente.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Update Mobile Client invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar actualizar su Perfil. Por favor int\xE9ntelo nuevamente.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.getCountriesByPrefixByTarget = function (prefix, target) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMClientsEngine + '/getCountriesByPrefixByTarget'
                                    + '?prefix=' + prefix
                                    + '&target=' + target,
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        completed();
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Countries By Prefix By Target invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    completed();
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };


    this.getInformationByPrefixByType = function (prefix, targetId, informationTypeId, country) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMClientsEngine + '/getInformationByPrefixByType'
                                    + '?prefix=' + prefix
                                    + '&targetId=' + targetId
                                    + '&informationTypeId=' + informationTypeId
                                    + '&country=' + country,
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        completed();
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Information By Prefix By Type invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    completed();
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };
}