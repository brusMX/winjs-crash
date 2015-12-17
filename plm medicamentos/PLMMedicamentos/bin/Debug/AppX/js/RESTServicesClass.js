
var RESTServices = new RESTServicesClass();

function RESTServicesClass() {
    // Class variables:
    this.configUrl = '';
    this.ClinicalAnalyzesEngine = '';
    this.HealthcareSuppliersEngine = '';
    this.MetadataEngine = '';
    this.PLMClientsEngine = '';
    this.PLMInteractionsEngine = '';
    this.PLMLogsEngine = '';
    this.PharmaSearchEngine = '';
    this.Services = null;

    // Class methods:
    this.initialize = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            RESTServices.configUrl = 'http://www.plmconnection.com/plmservices/moviles/mexico/plmmedicamentos/windows10/conf/plm.config.xml';

            Connectivity.test()
                .then(
                    function () {
                        RESTServices.set()
                            .then(
                                function () {
                                    completed();
                                },
                                function (err) {
                                    error(err);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.get = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            WinJS
                .xhr({
                    url: RESTServices.configUrl,
                    type: 'GET'
                }).then(
                    function requestCompleted(request) {
                        if (request.status == 200) {
                            completed(request.responseXML);
                        } else {
                            var errorHandler = new ErrorHandler();
                            errorHandler.Number = 2;
                            errorHandler.Message = "Error al recuperar Servicios Web.";
                            error(errorHandler);
                        }
                    },
                    function requestError(request) {
                        console.log("Get PLM REST Services invocation failure.");
                        console.log("Error: [" + request.status + '] ' + request.statusText);
                        console.log("Error response: " + request.responseText);

                        var errorHandler = new ErrorHandler();
                        errorHandler.Number = 3;
                        errorHandler.Message = "Error al recuperar Servicios Web.";
                        error(errorHandler);
                    }
                );
        });
    };

    this.set = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            RESTServices.get()
                .done(
                    function (result) {
                        RESTServices.Services = result.getElementsByTagName('PLMWebServices')[0];

                        if (typeof (RESTServices.Services) != 'undefined') {
                            if (typeof (RESTServices.Services.getElementsByTagName('ClinicalAnalyzesEngine')[0]) != 'undefined') {
                                RESTServices.ClinicalAnalyzesEngine = RESTServices.Services.getElementsByTagName('ClinicalAnalyzesEngine')[0].textContent;
                            }

                            if (typeof (RESTServices.Services.getElementsByTagName('HealthcareSuppliersEngine')[0]) != 'undefined') {
                                RESTServices.HealthcareSuppliersEngine = RESTServices.Services.getElementsByTagName('HealthcareSuppliersEngine')[0].textContent;
                            }

                            if (typeof (RESTServices.Services.getElementsByTagName('MetadataEngine')[0]) != 'undefined') {
                                RESTServices.MetadataEngine = RESTServices.Services.getElementsByTagName('MetadataEngine')[0].textContent;
                            }

                            if (typeof (RESTServices.Services.getElementsByTagName('PLMClientsEngine')[0]) != 'undefined') {
                                RESTServices.PLMClientsEngine = RESTServices.Services.getElementsByTagName('PLMClientsEngine')[0].textContent;
                            }

                            if (typeof (RESTServices.Services.getElementsByTagName('PLMInteractionsEngine')[0]) != 'undefined') {
                                RESTServices.PLMInteractionsEngine = RESTServices.Services.getElementsByTagName('PLMInteractionsEngine')[0].textContent;
                            }

                            if (typeof (RESTServices.Services.getElementsByTagName('PLMLogsEngine')[0]) != 'undefined') {
                                RESTServices.PLMLogsEngine = RESTServices.Services.getElementsByTagName('PLMLogsEngine')[0].textContent;
                            }

                            if (typeof (RESTServices.Services.getElementsByTagName('PharmaSearchEngine')[0]) != 'undefined') {
                                RESTServices.PharmaSearchEngine = RESTServices.Services.getElementsByTagName('PharmaSearchEngine')[0].textContent;
                            }
                        }

                        completed();
                    },
                    function (err) {
                        error(err);
                    }
                );
        });
    };
}