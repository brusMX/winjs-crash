
var WindowsStorage = new WindowsStorageClass();

function WindowsStorageClass() {
    // Class variables:
    this.favoritesFileName = '';
    this.interactionsFile = null;
    this.interactionsFileName = '';
    this.interactionsFilePath = '';
    this.localFolder = null;

    // Class methods:
    this.initialize = function () {
        if (Windows.Storage) {
            var applicationData = Windows.Storage.ApplicationData.current;

            WindowsStorage.localFolder = applicationData.localFolder;
            WindowsStorage.interactionsFileName = 'interactions.json';

            // Else shouldn't happen?
        }
    };

    this.createFile = function (collectionName) {
        return new WinJS.Promise(function (completed, error, progress) {
            if (WindowsStorage.localFolder != null) {
                switch (collectionName) {
                    case 'Interactions':
                        WindowsStorage.localFolder
                            .createFileAsync(WindowsStorage.interactionsFileName, Windows.Storage.CreationCollisionOption.failIfExists)
                            .then(
                                // Returns file and file's path if file created:
                                function (file) {
                                    WindowsStorage.interactionsFile = file;
                                    WindowsStorage.interactionsFilePath = file.path;
                                    completed();

                                    // Returns an error if file already exists or can't be created for some reason:
                                    // Should happen on creation/permission error only:
                                }, function (err) {
                                    console.log("Create File Windows Storage failure.");
                                    console.log("Failed creating Interactions collection file.");
                                    console.log("Error: " + err);

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
                // Shouldn't happen?:
            } else {
                var errorHandler = new ErrorHandler();
                errorHandler.Number = 6;
                errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                error(errorHandler);
            }
        });
    };

    this.getFile = function(collectionName) {
        return new WinJS.Promise(function (completed, error, progress) {
            if (WindowsStorage.localFolder != null) {
                switch (collectionName) {
                    case 'Interactions':
                        WindowsStorage.localFolder
                            .getFileAsync(WindowsStorage.interactionsFileName)
                            .then(
                                // Returns file and file's path if file exists:
                                function (file) {
                                    WindowsStorage.interactionsFile = file;
                                    WindowsStorage.interactionsFilePath = file.path;
                                    completed();

                                    // Collection file doesn not exist:
                                }, function (err) {
                                    WindowsStorage.createFile(collectionName)
                                        .then(
                                            function () {
                                                completed();
                                            }, function (err) {
                                                error(err);
                                            }
                                        );
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
                // Shouldn't happen?:
            } else {
                var errorHandler = new ErrorHandler();
                errorHandler.Number = 6;
                errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                error(errorHandler);
            }
        });
    };

    this.getFileContent = function(collectionName) {
        return new WinJS.Promise(function (completed, error, progress) {
            if (WindowsStorage.localFolder != null) {
                switch (collectionName) {
                    case 'Interactions':
                        if (WindowsStorage.interactionsFile != null) {
                            Windows.Storage.FileIO.readTextAsync(WindowsStorage.interactionsFile)
                                .then(
                                    function (fileContent) {
                                        var collectionArray = [];

                                        if (fileContent != '') {
                                            var collectionItems = JSON.parse(fileContent);

                                            for (var i = 0; i < collectionItems.length; i++) {
                                                collectionArray.push(collectionItems[i]);
                                            }
                                        }

                                        completed(collectionArray);
                                    }, function (err) {
                                        console.log("Get File Content Windows Storage failure.");
                                        console.log("Failed reading Interactions collection file.");
                                        console.log("Error: " + err);

                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 6;
                                        errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                                        error(errorHandler);
                                    }
                                );

                            // Get/create file for the first time:
                        } else {
                            WindowsStorage.getFile(collectionName)
                                .then(
                                    function () {
                                        WindowsStorage.getFileContent(collectionName)
                                            .then(
                                                function (collectionArray) {
                                                    completed(collectionArray);

                                                    // Shouldn't happen:
                                                }, function (err) {
                                                    error(err);
                                                }
                                            );
                                    }, function (err) {
                                        error(err);
                                    }
                                );
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
                // Shouldn't happen?:
            } else {
                var errorHandler = new ErrorHandler();
                errorHandler.Number = 6;
                errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                error(errorHandler);
            }
        });
    };

    this.writeFileContent = function (collectionName, collectionItems) {
        return new WinJS.Promise(function (completed, error, progress) {
            if (WindowsStorage.localFolder != null) {
                switch (collectionName) {
                    case 'Interactions':
                        if (WindowsStorage.interactionsFile != null) {
                            var fileContent = '';

                            if (collectionItems.length > 0) {
                                fileContent = JSON.stringify(collectionItems);
                            }

                            Windows.Storage.FileIO.writeTextAsync(WindowsStorage.interactionsFile, fileContent)
                                .then(
                                    function () {
                                        WindowsStorage.getFileContent(collectionName)
                                            .then(
                                                function (collectionArray) {
                                                    completed(collectionArray);
                                                }, function (err) {
                                                    error(err);
                                                }
                                            );
                                    }, function (err) {
                                        console.log("Write File Content Windows Storage failure.");
                                        console.log("Failed writing Interactions collection file.");
                                        console.log("Error: " + err);

                                        var errorHandler = new ErrorHandler();
                                        errorHandler.Number = 6;
                                        errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                                        error(errorHandler);
                                    }
                                );

                            // Get/create file for the first time:
                        } else {
                            WindowsStorage.getFile(collectionName)
                                .then(
                                    function () {
                                        WindowsStorage.getFileContent(collectionName)
                                            .then(
                                                function (collectionArray) {
                                                    completed(collectionArray);

                                                    // Shouldn't happen:
                                                }, function (err) {
                                                    error(err);
                                                }
                                            );
                                    }, function (err) {
                                        error(err);
                                    }
                                );
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
                // Shouldn't happen?:
            } else {
                var errorHandler = new ErrorHandler();
                errorHandler.Number = 6;
                errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                error(errorHandler);
            }
        });
    };
}

WindowsStorage.initialize();