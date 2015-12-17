
var Orientation = new OrientationClass();

function OrientationClass() {
    // Class variables:

    // Class methods:
    this.initialize = function () {
        window.addEventListener('orientationchange', Orientation.onChange, false);
    };

    this.onChange = function () {
        var header = document.querySelector('header');
        //console.log(header);

        if (header && typeof(header) != 'undefined') {

            var contentHeight = document.querySelector('#contentHost').offsetHeight - header.offsetHeight;
            var fragment = document.body.querySelector(".fragment");
            //console.log(contentHeight);
            if (fragment
                && typeof (fragment) != 'undefined') {

                //console.log(fragment.offsetHeight);
                fragment.style.height = (contentHeight - 5 + 'px');
            }
            
            var list = document.body.querySelectorAll(".win-listview");
            //console.log(list);
            if (list
                && list.length > 0
                && typeof (list[0]) != 'undefined') {

                for (var i = 0; i < list.length; i++) {
                    //console.log(list[i].offsetHeight);
                    list[i].style.height = (contentHeight - 10 + 'px');
                    list[i].style.overflow = "scroll";
                    list[i].style.overflowX = "hidden";
                }
            }
            

        }
    };
}

Orientation.initialize();