
var LogsServices = new LogsServicesClass();

function LogsServicesClass() {
    // Class variables:

    // Class methods:
    this.initialize = function () {

    };

    this.addTrackingActivity = function (codeString, entityId, jsonFormat, searchParameters, searchTypeId, sourceId) {
        Connectivity.test()
            .then(
                function () {
                    var track = {
                        'CodeString': codeString,
                        'EntityId': entityId,
                        'JSONFormat': jsonFormat,
                        'ParentId': null,
                        'Replicate': false,
                        'SearchDate': '\/Date(' + Date.parse(LogsServices.getSearchDate()) + ')\/',
                        'SearchParameters': searchParameters,
                        'SearchTypeId': searchTypeId,
                        'SourceId': sourceId,
                        'TrackId': 0
                    };

                    WinJS
                        .xhr({
                            url: RESTServices.PLMLogsEngine + '/addTrackingActivity',
                            type: 'POST',
                            headers: {
                                'Content-type': 'application/json; charset=utf-8'
                            },
                            data: JSON.stringify(track)
                        }).then(
                            function requestCompleted(request) {
                                if (request.status == 200) {
                                    console.log("Add Tracking Activity invocation successful.");
                                } else {
                                    console.log("Add Tracking Activity invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);
                                }
                            },
                            function requestError(request) {
                                console.log("Add Tracking Activity invocation failure.");
                                console.log("Error: [" + request.status + '] ' + request.statusText);
                                console.log("Error response: " + request.responseText);
                            }
                        );
                }, function (err) {
                    console.log("Add Tracking Activity invocation failure due to connection failure.");
                }
            );
    };

    this.addPLMTrackingActivity = function (attributeGroupKey, codeString, entityId, isbn, jsonFormat, searchParameters, searchTypeId, sourceId) {
        Connectivity.test()
            .then(
                function () {
                    var track = {
                        'AttributeGroupKey': attributeGroupKey,
                        'CodeString': codeString,
                        'EntityId': entityId,
                        'ISBN': isbn,
                        'JsonFormat': jsonFormat,
                        'Replicate': false,
                        'SearchDate': '\/Date(' + Date.parse(LogsServices.getSearchDate()) + ')\/',
                        'SearchParameters': searchParameters,
                        'SearchTypeId': searchTypeId,
                        'SourceId': sourceId,
                        'TrackId': 0
                    };

                    WinJS
                        .xhr({
                            url: RESTServices.PLMLogsEngine + '/addPLMTrackingActivity',
                            type: 'POST',
                            headers: {
                                'Content-type': 'application/json; charset=utf-8'
                            },
                            data: JSON.stringify(track)
                        }).then(
                            function requestCompleted(request) {
                                if (request.status == 200) {
                                    console.log("Add PLM Tracking Activity invocation successful.");
                                } else {
                                    console.log("Add PLM Tracking Activity invocation failure.");
                                    console.log("Error: [" + request.status + '] ' + request.statusText);
                                    console.log("Error response: " + request.responseText);
                                }
                            },
                            function requestError(request) {
                                console.log("Add PLM Tracking Activity invocation failure.");
                                console.log("Error: [" + request.status + '] ' + request.statusText);
                                console.log("Error response: " + request.responseText);
                            }
                        );
                }, function (err) {
                    console.log("Add PLM Tracking Activity invocation failure due to connection failure.");
                }
            );
    };

    this.getSearchDate = function () {
        var currentDate = new Date();
        var searchDate = currentDate.getFullYear();

        if ((currentDate.getMonth() + 1) < 10) {
            searchDate = searchDate + '-0' + (currentDate.getMonth() + 1);
        } else {
            searchDate = searchDate + '-' + (currentDate.getMonth() + 1);
        }

        if (currentDate.getDate() < 10) {
            searchDate = searchDate + '-0' + currentDate.getDate();
        } else {
            searchDate = searchDate + '-' + currentDate.getDate();
        }

        if (currentDate.getHours() < 10) {
            searchDate = searchDate + 'T0' + currentDate.getHours();
        } else {
            searchDate = searchDate + 'T' + currentDate.getHours();
        }

        if (currentDate.getMinutes() < 10) {
            searchDate = searchDate + ':0' + currentDate.getMinutes();
        } else {
            searchDate = searchDate + ':' + currentDate.getMinutes();
        }

        if (currentDate.getSeconds() < 10) {
            searchDate = searchDate + ':0' + currentDate.getSeconds();
        } else {
            searchDate = searchDate + ':' + currentDate.getSeconds();
        }

        return searchDate;
    };
}