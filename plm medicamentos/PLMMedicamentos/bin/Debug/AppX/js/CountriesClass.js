
var Countries = new CountriesClass();

function CountriesClass() {
    // Class variables:
    this.items = null;

    // Class methods:
    this.initialize = function () {

    };

    this.get = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            ClientsServices.getCountriesByPrefixByTarget(globalVars.prefix, globalVars.target)
                .then(
                    function (result) {
                        Countries.items = null;

                        if (result != null) {
                            if (typeof (result.getCountriesByPrefixByTargetResult) != 'undefined'
                                && result.getCountriesByPrefixByTargetResult != null) {
                                Countries.items = result.getCountriesByPrefixByTargetResult;
                            }
                        }
                        completed();
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };

    this.set = function () {
        return new WinJS.Promise(function (completed, error, progress) {
            Countries.get()
                .then(
                    function () {
                        if (Countries.items != null) {
                            for (var i = 0; i < Countries.items.length; i++) {
                                if (globalVars.countryKey == Countries.items[i].ID) {
                                    globalVars.countryId = Countries.items[i].CountryId;
                                    globalVars.countryKey = Countries.items[i].ID;
                                    globalVars.editionId = Countries.items[i].EditionId;
                                    globalVars.isbn = Countries.items[i].ISBN;
                                    break;
                                }
                            }
                        }
                        completed();
                    }, function (err) {
                        error(err);
                    }
                );
        });
    };
}