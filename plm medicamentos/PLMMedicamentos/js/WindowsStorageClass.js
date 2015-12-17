
var WindowsStorage = new WindowsStorageClass();

function WindowsStorageClass() {
    // Class variables:
    this.favoritesFile = null;
    this.favoritesFileName = '';
    this.favoritesFilePath = '';
    this.interactionsFile = null;
    this.interactionsFileName = '';
    this.interactionsFilePath = '';
    this.localFolder = null;

    // Class methods:
    this.initialize = function () {
        if (Windows.Storage) {
            var applicationData = Windows.Storage.ApplicationData.current;

            WindowsStorage.localFolder = applicationData.localFolder;
            WindowsStorage.favoritesFileName = 'favorites.json';
            WindowsStorage.interactionsFileName = 'interactions.json';

            // Else shouldn't happen?
        }
    };

    this.createFile = function (collectionName) {
        return new WinJS.Promise(function (completed, error, progress) {
            if (WindowsStorage.localFolder != null) {
                var fileName = '';

                switch (collectionName) {
                    case 'Favorites':
                        fileName = WindowsStorage.favoritesFileName;
                        break;
                    case 'Interactions':
                        fileName = WindowsStorage.interactionsFileName;
                        break;
                }

                if (fileName != '') {
                    WindowsStorage.localFolder
                        .createFileAsync(fileName, Windows.Storage.CreationCollisionOption.failIfExists)
                        .then(
                            // Returns file and file's path if file created:
                            function (file) {
                                switch (collectionName) {
                                    case 'Favorites':
                                        WindowsStorage.favoritesFile = file;
                                        WindowsStorage.favoritesFilePath = file.path;
                                        break;
                                    case 'Interactions':
                                        WindowsStorage.interactionsFile = file;
                                        WindowsStorage.interactionsFilePath = file.path;
                                        break;
                                }

                                completed();

                                // Returns an error if file already exists or can't be created for some reason:
                                // Should happen on creation/permission error only:
                            }, function (err) {
                                console.log("Create File Windows Storage failure.");
                                console.log("Failed creating " + collectionName + " collection file.");
                                console.log("Error: " + err);

                                var errorHandler = new ErrorHandler();
                                errorHandler.Number = 6;
                                errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                                error(errorHandler);
                            }
                        );

                    // Shouldn't happen:
                } else {
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

    this.getFile = function (collectionName) {
        return new WinJS.Promise(function (completed, error, progress) {
            if (WindowsStorage.localFolder != null) {
                var fileName = '';

                switch (collectionName) {
                    case 'Favorites':
                        fileName = WindowsStorage.favoritesFileName;
                        break;
                    case 'Interactions':
                        fileName = WindowsStorage.interactionsFileName;
                        break;
                }

                if (fileName != '') {
                    WindowsStorage.localFolder
                        .getFileAsync(fileName)
                        .then(
                            // Returns file and file's path if file exists:
                            function (file) {
                                switch (collectionName) {
                                    case 'Favorites':
                                        WindowsStorage.favoritesFile = file;
                                        WindowsStorage.favoritesFilePath = file.path;
                                        break;
                                    case 'Interactions':
                                        WindowsStorage.interactionsFile = file;
                                        WindowsStorage.interactionsFilePath = file.path;
                                        break;
                                }

                                completed();

                                // Collection file does not exist:
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
                    // Shouldn't happen:
                } else {
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

    this.getFileContent = function (collectionName) {
        return new WinJS.Promise(function (completed, error, progress) {
            if (WindowsStorage.localFolder != null) {
                var file = null;

                switch (collectionName) {
                    case 'Favorites':
                        file = WindowsStorage.favoritesFile;
                        break;
                    case 'Interactions':
                        file = WindowsStorage.interactionsFile;
                        break;
                }

                if (file != null) {
                    Windows.Storage.FileIO.readTextAsync(file)
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
                                console.log("Failed reading " + collectionName + " collection file.");
                                console.log("Error: " + err);

                                var errorHandler = new ErrorHandler();
                                errorHandler.Number = 6;
                                errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                                error(errorHandler);
                            }
                        );

                    // Shouldn't happen? But get/create file for the first time:
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
                // Shouldn't happen?:
            } else {
                var errorHandler = new ErrorHandler();
                errorHandler.Number = 6;
                errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                error(errorHandler);
            }
        });
    };

    // NOTE: "collectionItems" should always be an array of objects:
    this.writeFileContent = function (collectionName, collectionItems) {
        return new WinJS.Promise(function (completed, error, progress) {
            if (WindowsStorage.localFolder != null) {
                var file = null;

                switch (collectionName) {
                    case 'Favorites':
                        file = WindowsStorage.favoritesFile;
                        break;
                    case 'Interactions':
                        file = WindowsStorage.interactionsFile;
                        break;
                }

                if (file != null) {
                    var fileContent = '';

                    if (collectionItems.length > 0) {
                        fileContent = JSON.stringify(collectionItems);
                    }

                    Windows.Storage.FileIO.writeTextAsync(file, fileContent)
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
                                console.log("Failed writing " + collectionName + " collection file.");
                                console.log("Error: " + err);

                                var errorHandler = new ErrorHandler();
                                errorHandler.Number = 6;
                                errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                                error(errorHandler);
                            }
                        );
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