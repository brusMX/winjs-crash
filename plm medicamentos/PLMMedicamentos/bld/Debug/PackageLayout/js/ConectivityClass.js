
var Connectivity = new ConnectivityClass();

function ConnectivityClass() {
    // Class variables:

    // Class methods
    this.initialize = function () {

    };

    this.test = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            var profile = new Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
            if (profile != null
                && typeof (profile.getNetworkConnectivityLevel) != 'undefined') {
                var networkConnectivityLevel = profile.getNetworkConnectivityLevel();

                if (networkConnectivityLevel < 3) {
                    var errorHandler = new ErrorHandler();
                    errorHandler.Number = 1;
                    errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                    error(errorHandler);
                } else {
                    completed();
                }
            } else {
                var errorHandler = new ErrorHandler();
                errorHandler.Number = 1;
                errorHandler.Message = errorHandler.getMessageByNumber(errorHandler.Number);
                error(errorHandler);
            }
        });
    };
}