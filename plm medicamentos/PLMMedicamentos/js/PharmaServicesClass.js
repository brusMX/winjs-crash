
var PharmaServices = new PharmaServicesClass();

function PharmaServicesClass() {
    // Class variables:

    // Class methods:
    this.initialize = function () {

    };

    this.getResults = function (code, countryId, editionId, searchText) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PharmaSearchEngine + '/getResults?'
                                    + 'code=' + code
                                    + '&countryId=' + countryId
                                    + '&editionId=' + editionId
                                    + '&searchText=' + searchText,
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar resultados de la b\xFAsqueda.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Results invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar resultados de la b\xFAsqueda.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.getDrugsBySubstance = function (code, countryId, editionId, substanceId) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PharmaSearchEngine + '/getDrugsBySubstance?'
                                    + 'code=' + code
                                    + '&countryId=' + countryId
                                    + '&editionId=' + editionId
                                    + '&substanceId=' + substanceId,
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar productos por sustancia.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Drugs By Substance invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar productos por sustancia.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.getDrugsByIndication = function (code, countryId, editionId, indicationId) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PharmaSearchEngine + '/getDrugsByIndication?'
                                    + 'code=' + code
                                    + '&countryId=' + countryId
                                    + '&editionId=' + editionId
                                    + '&indicationId=' + indicationId,
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar productos por indicaci\xF3n.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Drugs By Indication invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar productos por indicaci\xF3n.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.getDrugsByLab = function (code, countryId, editionId, labId) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PharmaSearchEngine + '/getDrugsByLab?'
                                    + 'code=' + code
                                    + '&countryId=' + countryId
                                    + '&editionId=' + editionId
                                    + '&labId=' + labId,
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar productos por laboratorio.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Drugs By Lab invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar productos por laboratorio.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.getAllAttributesByProduct = function (code, editionId, divisionId, categoryId, productId, pharmaFormId, resolutionKey) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PharmaSearchEngine + '/getAllAttributesByProduct?'
                                    + 'code=' + code
                                    + '&editionId=' + editionId
                                    + '&divisionId=' + divisionId
                                    + '&categoryId=' + categoryId
                                    + '&productId=' + productId
                                    + '&pharmaFormId=' + pharmaFormId
                                    + '&resolutionKey=' + resolutionKey,
                                type: 'GET'
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar el detalle del producto.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Attributes By Product invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar el detalle del producto.";
                                    error(errorHandler);
                                }
                            );
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };
}