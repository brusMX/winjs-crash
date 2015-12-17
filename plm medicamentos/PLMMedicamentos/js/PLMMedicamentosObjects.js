
function ErrorHandler() {
    // Error number conventions:
    //      0: Unknown
    //      1: Connection
    //      2: Service request error
    //      3: Service invocation error
    //      4: Document not found
    //      5: Document request error
    //      6: Storage error
    //      7: Local storage collection not found
    //      8: No collection parameters set
    //      N: Other?

    // Object variables:
    this.Message = '';
    this.Number = 0;

    // Object methods:
    this.getMessageByNumber = function (number) {
        var errorNumber = Number(number);

        switch (errorNumber) {
            case 1:
                return "No se ha podido establecer la conexi\xF3n a internet. Por favor verif\xEDquela e int\xE9ntelo nuevamente.";
            case 6:
                return "Error al acceder al almacenamiento local. Por favor int\xE9ntelo nuevamente.";
            default:
                return "Error. Check console log for further details.";

        }
    };
}

function Product() {
    // Object variables:
    this.Brand = '';
    this.CategoryId = 0;
    this.CategoryName = '';
    this.CountryCodes = null;
    this.CountryKey = '';
    this.DivisionId = 0;
    this.DivisionName = '';
    this.DivisionShortName = '';
    this.PharmaForm = '';
    this.PharmaFormId = 0;
    this.ProductId = 0;

    // Object methods:

}

function Validation() {
    // Object variables:
    this.Element = '';
    this.Number = '';
    this.Value = false;

    // Object methods:
    
}