
var InteractionsServices = new InteractionsServicesClass();

function InteractionsServicesClass() {
    // Class variables:

    // Class methods:
    this.initialize = function () {

    };

    this.getInteractionsByProducts = function (countryId, products) {
        return new WinJS.Promise(function (completed, error, progress) {
            Connectivity.test()
                .then(
                    function () {
                        WinJS
                            .xhr({
                                url: RESTServices.PLMInteractionsEngine + '/getInteractionsByProducts/' + countryId,
                                type: 'POST',
                                headers: {
                                    'Content-type': 'application/json; charset=utf-8'
                                },
                                data: JSON.stringify(products)
                            }).then(
                                function requestCompleted(request) {
                                    if (request.status == 200) {
                                        completed(JSON.parse(request.response));
                                    } else {
                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 2;
                                        errorHandler.Message = "Error al intentar recuperar Interacciones.";
                                        error(errorHandler);
                                    }
                                },
                                function requestError(request) {
                                    console.log("Get Interactions By Products invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 3;
                                    errorHandler.Message = "Error al intentar recuperar Interacciones.";
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