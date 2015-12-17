
var LocalStorage = new LocalStorageClass();

function LocalStorageClass() {
    // Class variables:
    this.storage = null;

    // Class methods:
    this.initialize = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            LocalStorage.storage = WinJS.Application.local;

            // Currently just one collection will be added:
            LocalStorage.get('User')
                .then(
                    function () {
                        completed();
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.get = function (collectionName) {
        return new WinJS.Promise(function (completed, error, progress) {
            switch (collectionName) {
                case 'User':
                    LocalStorage.storage
                        .exists(collectionName)
                        .then(
                            function (exists) {
                                // Returns true or false if collection exists:
                                if (exists) {
                                    LocalStorage.storage
                                        .readText(collectionName, null)
                                        .then(
                                            function (data) {
                                                if (data != null) {
                                                    var user = JSON.parse(data);

                                                    globalVars.code = user.codeString;
                                                    globalVars.countryKey = user.countryKey;
                                                    globalVars.email = user.userEmail;
                                                } // Else collection empty?

                                                completed();
                                            }, function (err) {
                                                console.log("Get User Local Storage failure.");
                                                console.log("Failed to read collection.");

                                                var errorHandler = new ErrorHandler();
                                                errorHandler.Number = 6;
                                                errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                                                error(errorHandler);
                                            }
                                        );
                                } else {
                                    completed();
                                }
                            }, function (err) {
                                console.log("Get User Local Storage failure.");
                                console.log("Failed to verify collection existance.");

                                var errorHandler = new ErrorHandler();
                                errorHandler.Number = 6;
                                errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                                error(errorHandler);
                            }
                        );
                    break;
                    // Shouldn't happen:
                default:
                    console.log("Collection undefined.");
                    var errorHandler = new ErrorHandler();
                    errorHandler.Number = 7;
                    errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                    error(errorHandler);
            }
        });
    };

    this.set = function (collectionName, params) {
        return new WinJS.Promise(function (completed, error, progress) {
            switch (collectionName) {
                case 'User':
                    var user = new Object();
                    user.countryKey = '';
                    user.codeString = '';
                    user.userEmail = '';

                    if (params.length > 0) {
                        user.codeString = params[0];
                        user.countryKey = params[1];
                        user.userEmail = params[2];

                        LocalStorage.storage
                            .writeText(collectionName, JSON.stringify(user))
                            .then(
                                function (data) {
                                    completed();
                                }, function (err) {
                                    console.log("Set User Local Storage failure.");
                                    console.log("Failed to write collection.");

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 6;
                                    errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                                    error(errorHandler);
                                }
                            );
                        // Shouldn't happen:
                    } else {
                        console.log("Collection parameters empty.");
                        var errorHandler = new ErrorHandler();
                        errorHandler.Number = 8;
                        errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                        error(errorHandler);
                    }
                    break;
                    // Shouldn't happen:
                default:
                    console.log("Collection undefined.");
                    var errorHandler = new ErrorHandler();
                    errorHandler.Number = 7;
                    errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                    error(errorHandler);
            }
        });
    };

    this.update = function (collectionName, params) {
        return new WinJS.Promise(function (completed, error, progress) {
            switch (collectionName) {
                case 'User':
                    var user = new Object();
                    user.countryKey = '';
                    user.codeString = '';
                    user.userEmail = '';

                    if (params.length > 0) {
                        user.codeString = params[0];
                        user.countryKey = params[1];
                        user.userEmail = params[2];

                        LocalStorage.storage
                            .writeText(collectionName, JSON.stringify(user))
                            .then(
                                function (data) {
                                    completed();
                                }, function (err) {
                                    console.log("Update User Local Storage failure.");
                                    console.log("Failed to update collection.");

                                    var errorHandler = new ErrorHandler();
                                    errorHandler.Number = 6;
                                    errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                                    error(errorHandler);
                                }
                            );
                        // Shouldn't happen:
                    } else {
                        console.log("Collection parameters empty.");
                        var errorHandler = new ErrorHandler();
                        errorHandler.Number = 8;
                        errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                        error(errorHandler);
                    }
                    break;
                    // Shouldn't happen:
                default:
                    console.log("Collection undefined.");
                    var errorHandler = new ErrorHandler();
                    errorHandler.Number = 7;
                    errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                    error(errorHandler);
            }
        });
    };
}