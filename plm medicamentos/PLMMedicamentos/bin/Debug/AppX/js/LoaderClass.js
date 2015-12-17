
var Loader = new LoaderClass();

function LoaderClass() {
    // Class variables:

    // Class methods:
    this.initialize = function () {

    };

    this.show = function () {
        var loader = document.getElementById('contentLoader');

        if (loader) {
            loader.style.display = 'block';
        }
    };

    this.hide = function () {
        var loader = document.getElementById('contentLoader');

        if (loader) {
            loader.style.display = 'none';
        }
    };
}