 

/****************** 
 * 
 * Data structures:
 * 
 * ***************/
function Application() {
	
	this.name = "";
	this.version = "";
	
	this.info = new ApplicationInfo();
	this.header = new Header();
	this.footer = new Footer();
	this.workingArea = new WorkingArea();
	this.splash = new Splash();
	this.ad = new Ad();
	this.spinner = new Spinner();
	this.sections = new Array();

}

function ApplicationInfo() {
	
	this.cssFile = "";
	this.target = "";
	this.resolutionKey = "";
	this.prefix = "";
	this.atlasUri = "";
	this.countryId = 0;
	this.countryKey = "";
	this.editionId = 0;
	this.interactionsId = 0;
	this.sponsor = new Sponsor();
	
	this.specialities = new Array();
	this.substances = new Array();
	this.ippaSponsorProducts = new Array();
}

function Header() {
	
	this.name = "";
	this.visible = false;
	this.contextualMenu = false;
	this.favourites = false;
	this.settings = false;
}

function Footer() {
	
	this.name = "";
	this.visible = false;
	this.contextualMenu = false;
	this.favourites = false;
	this.settings = false;
}

function WorkingArea() {
	
	this.name = "";
	this.visible = false;
	this.mainEntryHtml = "";
}

function Splash() {
	
	this.name = "";
	this.visible = false;
	this.htmlFile = "";
}

function Ad() {
	
	this.name = "";
	this.visible = false;
	
	this.images = new Array();
}

function Section() {
	
	this.name = "";
	this.visible = false;
	this.contextualMenu = false;
	this.uri = "";
	this.resourceUri = ""; 
	this.barImage = "";
	this.iconImage = "";
	this.displayName = "";
	this.plmId = "";
	this.banner = false;
	this.infoType = "";
	
	this.ad = new Ad();
	this.carousel = new Carousel();
	this.socialNetwork = new SocialNetworks();
	this.subSections = new Array();
}

function Sponsor() {
	this.divisionId = 0;
}

function Network() {
	
	this.name = "";
	this.displayName = "";
	this.iconImage = "";
}

function SocialNetworks() {
	
	this.visible = false;
	this.name = "";
	
	this.networks = new Array();
}

function Carousel() {

	this.visible = false;
	this.name = "";
	this.images = new Array();
}

function Image() {
	
	this.visible = false;
	this.order = 0;
	this.imageUri = "";
}

function ActiveSubstance() {
	
	this.substanceName = "";
	this.englishDescription = "";
}

function IppaProduct() {

	this.divisionId = 0;
	this.categoryId = 0;
	this.productId = 0;
	this.pharmaFormId = 0;
	
	this.brand = "";
}

function BrandImage() {
	
	this.x = 0;
	this.y = 0;
	this.imageUri = "";
}

function Spinner() {
	
	this.name = "";
	this.visible = false;
	this.rows = 0;
	this.cols = 0;
	
	this.brandImages = new Array();
}

/****************** 
 * 
 * Global variables:
 * 
 * ***************/
var application = new Application();

/****************** 
 * 
 * Miscellaneous methods:
 * 
 * ***************/

/*
function findSection(sections, name){
	
	if(Array.isArray(sections)){
	
		for(var i=0; i<sections.length; i++){
			
			if(sections[i].name == name)
				return sections[i];
			
			var objSection = findSection(sections[i].subSections, name);
			
			if (objSection != null)
				return objSection;

		}
		
		return null;
	}
	
	return null;
	
}
*/

function getBoolean(value) {
	
	return value == "true";
}

function loadXmlFile(uri) {
    return new WinJS.Promise(function (completed, error, progress) {
        WinJS
            .xhr({
                url: uri,
                type: 'GET'
            }).then(
                function requestCompleted(request) {
                    if (request.status == 200) {
                        getApplication(request.responseXML, 'application');
                        completed();
                    } else {
                        var errorHandler = new ErrorHandler();
                        errorHandler.Number = 4;
                        errorHandler.Message = "Error al cargar archivo de configuraci\xF3n.";
                        error(errorHandler);
                    }
                },
                function requestError(request) {
                    console.log("Load XML File failure.");
                    console.log("Error status: " + request.status + ' ' + request.satusText);
                    console.log("Error response: " + request.responseText);

                    var errorHandler = new ErrorHandler();
                    errorHandler.Number = 5;
                    errorHandler.Message = "Error al cargar archivo de configuraci\xF3n.";
                    error(errorHandler);
                }
            );
    });
}

function getApplication(scopeTag, tag) {
    // Get current reference:
    var $app = scopeTag.getElementsByTagName(tag)[0];

    if (typeof ($app) != 'undefined') {
        // Get tag attributes:
        application.name = $app.getAttribute('name');
        application.version = $app.getAttribute('version');

        // Get application info:
        application.info = getApplicationInfo($app, 'application-info');

        // Get header:
        application.header = getHeader($app, 'header');

        // Get working area:
        application.workingArea = getWorkingArea($app, 'working-area');

        // Get footer:
        application.footer = getFooter($app, 'footer');

        // Get splash:
        application.splash = getSplash($app, 'splash');

        // Get sections:
        application.sections = getSections($app, 'section');

        // Get ads:
        application.ad = getAds($app, 'ad');

        // Get spinner:
        application.spinner = getSpinner($app, 'spinner');
    }
}

function getHeader(scopeTag, tag) {
    // Declare the result object:
    var objHeader = new Header();

    // Get current reference:
    var $header = scopeTag.getElementsByTagName(tag)[0];

    if (typeof ($header) != 'undefined') {
        objHeader.name = $header.getAttribute('name');
        objHeader.visible = $header.getAttribute('visible');

        if (typeof($header.getElementsByTagName('contextual-menu')[0]) != 'undefined') {
            objHeader.contextualMenu = getBoolean($header.getElementsByTagName('contextual-menu')[0].getAttribute('visible'));
        }

        if (typeof ($header.getElementsByTagName('favourites')[0]) != 'undefined') {
            objHeader.favourites = getBoolean($header.getElementsByTagName('favourites')[0].getAttribute('visible'));
        }

        if (typeof ($header.getElementsByTagName('settings')[0]) != 'undefined') {
            objHeader.settings = getBoolean($header.getElementsByTagName('settings')[0].getAttribute('visible'));
        }
    }
	
	return objHeader;
}

function getFooter(scopeTag, tag) {
    // Declare the result object:
    var objFooter = new Footer();

    // Get current reference:
    var $footer = scopeTag.getElementsByTagName(tag)[0];

    if (typeof ($footer) != 'undefined') {
        objFooter.name = $footer.getAttribute('name');
        objFooter.visible = $footer.getAttribute('visible');

        if (typeof ($footer.getElementsByTagName('contextual-menu')[0]) != 'undefined') {
            objFooter.contextualMenu = getBoolean($footer.getElementsByTagName('contextual-menu')[0].getAttribute('visible'));
        }

        if (typeof ($footer.getElementsByTagName('favourites')[0]) != 'undefined') {
            objFooter.favourites = getBoolean($footer.getElementsByTagName('favourites')[0].getAttribute('visible'));
        }

        if (typeof ($footer.getElementsByTagName('settings')[0]) != 'undefined') {
            objFooter.settings = getBoolean($footer.getElementsByTagName('settings')[0].getAttribute('visible'));
        }
    }

	return objFooter;
}

function getWorkingArea(scopeTag, tag) {
    // Declare the result object:
	var objWorkingArea = new WorkingArea();
	
    // Get current reference:
	var $workingArea = scopeTag.getElementsByTagName(tag)[0];

	if (typeof ($workingArea) != 'undefined') {
	    objWorkingArea.name = $workingArea.getAttribute('name');
	    objWorkingArea.visible = getBoolean($workingArea.getAttribute('visible'));

	    if (typeof ($workingArea.getElementsByTagName('main-entry')[0]) != 'undefined') {
	        objWorkingArea.mainEntryHtml = $workingArea.getElementsByTagName('main-entry')[0].textContent;
	    }
	}
	
	return objWorkingArea;
}

function getSplash(scopeTag, tag) {
    // Declare the result object:
    var objSplash = new Splash();

    // Get current reference:
    var $splash = scopeTag.getElementsByTagName(tag)[0];

    objSplash.name = $splash.getAttribute('name');
    objSplash.visible = getBoolean($splash.getAttribute('visible'));

    if (typeof($splash.getElementsByTagName('splash-entry')[0]) != 'undefined') {
        objSplash.htmlFile = $splash.getElementsByTagName('splash-entry')[0].textContent;
    }
	
	return objSplash;
}

function getApplicationInfo(scopeTag, tag) {
    // Declare the result object:
    var appInfo = new ApplicationInfo();

    // Get current reference:
    var $info = scopeTag.getElementsByTagName(tag)[0];

    if (typeof ($info) != 'undefined') {
        // Get tag attributes:
        if (typeof($info.getElementsByTagName('css-file')[0]) != 'undefined') {
            appInfo.cssFile = $info.getElementsByTagName('css-file')[0].textContent;
        }

        if (typeof($info.getElementsByTagName('target')[0]) != 'undefined') {
            appInfo.target = $info.getElementsByTagName('target')[0].textContent;
        }

        if (typeof($info.getElementsByTagName('prefix')[0]) != 'undefined') {
            appInfo.prefix = $info.getElementsByTagName('prefix')[0].textContent;
        }

        if (typeof($info.getElementsByTagName('resolution-key')[0]) != 'undefined') {
            appInfo.resolutionKey = $info.getElementsByTagName('resolution-key')[0].textContent;
        }
        
        if (typeof($info.getElementsByTagName('atlas-uri')[0]) != 'undefined') {
            appInfo.atlasUri = $info.getElementsByTagName('atlas-uri')[0].textContent;
        }

        if (typeof($info.getElementsByTagName('edition')[0]) != 'undefined') {
            appInfo.editionId = parseInt($info.getElementsByTagName('edition')[0].getAttribute('id'), 10);
        }

        if (typeof($info.getElementsByTagName('country')[0]) != 'undefined') {
            appInfo.countryId = parseInt($info.getElementsByTagName('country')[0].getAttribute('id'), 10);
        }

        if (typeof($info.getElementsByTagName('country')[0]) != 'undefined') {
            appInfo.countryKey = $info.getElementsByTagName('country')[0].getAttribute('key');
        }

        if (typeof($info.getElementsByTagName('interactions')[0]) != 'undefined') {
            appInfo.interactionsId = parseInt($info.getElementsByTagName('interactions')[0].getAttribute('id'), 10);
        }

        if (typeof ($info.getElementsByTagName('sponsor')[0]) != 'undefined') {
            appInfo.sponsor = getSponsor($info.getElementsByTagName('sponsor')[0]);
        }

        // Get specialities:
        if (typeof ($info.getElementsByTagName('specialities')[0]) != 'undefined') {
            appInfo.specialities = getSpecialities($info.getElementsByTagName('specialities')[0], 'speciality');
        }
        
        // Get active substances:
        if (typeof ($info.getElementsByTagName('active-substances')[0]) != 'undefined') {
            appInfo.substances = getSubstances($info.getElementsByTagName('active-substances')[0], 'substance');
        }

        // Get sponsor products:
        if (typeof ($info.getElementsByTagName('IPPA-sponsor-products')[0]) != 'undefined') {
            appInfo.ippaSponsorProducts = getIppaSponsorProducts($info.getElementsByTagName('IPPA-sponsor-products')[0], 'product');
        }
    }

    return appInfo;
}

function getSpecialities(scopeTag, tag) {
    // Declare the result array:
    var specialities = new Array();

    // Get current reference:
	var $speciality = scopeTag.getElementsByTagName(tag);

	for (var i = 0; i < $speciality.length; i++) {
	    // Add speciality into array:
	    specialities.push($speciality[i].textContent);
	}
	
	return specialities;
}

function getSubstances(scopeTag, tag) {
    // Declare the result array:
    var arrSubstances = new Array();

    // Get current reference:
    var $activeSubstance = scopeTag.getElementsByTagName(tag);

    for (var i = 0; i < $activeSubstance.length; i++) {
        // Create ActiveSubstance object:
        var objSubstance = new ActiveSubstance();

        // Get tag attributes:
        objSubstance.englishDescription = $activeSubstance[i].getAttribute('englishDescription');

        // Get current inner text:
        objSubstance.substanceName = $activeSubstance[i].textContent;

        // Add to array:
        arrSubstances.push(objSubstance);
    }

	return arrSubstances;
}

function getIppaSponsorProducts(scopeTag, tag) {
    // Declare the result array:
	var arrProducts = new Array();
	
    // Get current reference:
	var $product = scopeTag.getElementsByTagName(tag);

	for (var i = 0; i < $product.length; i++) {
	    // Create ActiveSubstance object:
	    var objProduct = new IppaProduct();

	    // Get tag attributes:
	    objProduct.divisionId = parseInt($product[i].getAttribute('DivisionId'), 10);
	    objProduct.categoryId = parseInt($product[i].getAttribute('CategoryId'), 10);
	    objProduct.productId = parseInt($product[i].getAttribute('ProductId'), 10);
	    objProduct.pharmaFormId = parseInt($product[i].getAttribute('PharmaFormId'), 10);

	    // Get current inner text:
	    objProduct.brand = $product[i].textContent;

	    // Add to array:
	    arrProducts.push(objProduct);
	}
	
	return arrProducts;
}

function getAds(scopeTag, tag) {
    // Declare the result object:
    var objAd = new Ad();

    // Get current reference:
    var $advertisement = scopeTag.getElementsByTagName(tag)[0];

    if (typeof ($advertisement) != 'undefined') {
        // Get tag attributes:
        objAd.name = $advertisement.getAttribute('name');
        objAd.visible = getBoolean($advertisement.getAttribute('visible'));

        // Get images:
        objAd.images = getImages($advertisement, 'image');
    }

	return objAd;
}

function getSpinner(scopeTag, tag) {
    // Declare the result object:
    var objSpinner = new Spinner();

    // Get current reference:
    var $spinner = scopeTag.getElementsByTagName(tag)[0];

    if (typeof ($spinner) != 'undefined') {
        // Get tag attributes:
        objSpinner.name = $spinner.getAttribute('name');
        objSpinner.visible = getBoolean($spinner.getAttribute('visible'));
        objSpinner.rows = parseInt($spinner.getAttribute('rows'), 10);
        objSpinner.cols = parseInt($spinner.getAttribute('cols'), 10);

        // Get images:
        objSpinner.brandImages = getBrandImages($spinner, 'brand-image');
    }

	return objSpinner;
}

function getSocialNetwork(scopeTag, tag) {
	// Declare the result object:
    var objSocialNets = new SocialNetworks();

    // Get current reference:
    var $social = scopeTag.getElementsByTagName(tag)[0];

    if (typeof ($social) != 'undefined') {
        // Get tag attributes:
        objSocialNets.visible = getBoolean($social.getAttribute('visible'));
        objSocialNets.name = $social.getAttribute('name');

        // Get an Image array:
        objSocialNets.networks = getNetworks($social, 'network');
    }
	
	return objSocialNets;
	
}

function getNetworks(scopeTag, tag) {
	// Declare the result array:
    var arrNets = new Array();

    // Get current reference:
    var $net = scopeTag.getElementsByTagName(tag);

    for (var i = 0; i < $net.length; i++) {
        // Create a Network object:
        var objNet = new Network();

        // Get tag attributes:
        objNet.name = $net[i].getAttribute('name');

        // Get children tag's inner text:
        objNet.displayName = $net[i].getElementsByTagName('display-name')[0].textContent;
        objNet.iconImage = $net[i].getElementsByTagName('icon-image')[0].textContent;

        // Add to array:
        arrNets.push(objNet);
    }

	return arrNets;
}

function getCarousel(scopeTag, tag) {
	// Declare the result object:
    var objCarousel = new Carousel();

    // Get current reference:
    var $carousel = scopeTag.getElementsByTagName(tag)[0];

    if (typeof ($carousel) != 'undefined') {
        // Get tag attributes:
        objCarousel.visible = getBoolean($carousel.getAttribute('visible'));
        objCarousel.name = $carousel.getAttribute('name');

        // Get an Image array:
        objCarousel.images = getImages($carousel, 'image');
    }
	
	return objCarousel;
}

function getImages(scopeTag, tag) {
	// Declare the result array:
    var arrImages = new Array();

    // Get current reference:
    var $image = scopeTag.getElementsByTagName(tag);

    for (var i = 0; i < $image.length; i++) {
        // Create an Image object:
        var objImage = new Image();

        // Get tag attributes:
        objImage.visible = getBoolean($image[i].getAttribute('visible'));
        objImage.order = parseInt($image[i].getAttribute('order'), 10);

        // Get current inner text:
        objImage.imageUri = $image[i].textContent;

        // Add to array:
        arrImages.push(objImage);
    }

	return arrImages;
}

function getBrandImages(scopeTag, tag) {
	// Declare the result array:
    var arrBrandImages = new Array();

    // Get current reference:
    var $brandImage = scopeTag.getElementsByTagName(tag);

    for (var i = 0; i < $brandImage.length; i++) {
        // Create a BrandImage object:
        var objBrandImage = new BrandImage();

        // Get tag attributes:
        objBrandImage.x = parseInt($brandImage[i].getAttribute('x'), 10);
        objBrandImage.y = parseInt($brandImage[i].getAttribute('y'), 10);

        // Get current inner text:
        objBrandImage.imageUri = $brandImage[i].textContent;

        // Add to array:
        arrBrandImages.push(objBrandImage);
    }
	
	return arrBrandImages;
}

function getSections(scopeTag, tag) {
    // Declare the result array:
    var arrSections = new Array();

    // Get current reference:
    var $section;
    
    // In case is not a section will recive scopeTag as childNodes:
    if (tag != 'section') {
        $section = [];

        if (scopeTag.length > 0) {
            for (var i = 0; i < scopeTag.length; i++) {
                if (scopeTag[i].tagName == 'sub-section'
                    && scopeTag[i].nodeType == 1) {
                    $section.push(scopeTag[i]);
                }
            }
        }
    } else {
        $section = scopeTag.getElementsByTagName(tag);
    }

    for (var i = 0; i < $section.length; i++) {
        // Create a Section object:
        var objSection = new Section();

        // Get tag attributes:
        objSection.name = $section[i].getAttribute('name');
        objSection.visible = getBoolean($section[i].getAttribute('visible'));
        objSection.contextualMenu = getBoolean($section[i].getAttribute('contextual-menu'));
        objSection.plmId = $section[i].getAttribute('plmId');
        objSection.banner = getBoolean($section[i].getAttribute('banner'));
        objSection.infoType = $section[i].getAttribute('infoType');

        // Get inner tags:
        if (typeof ($section[i].getElementsByTagName('uri')[0]) != 'undefined') {
            objSection.uri = $section[i].getElementsByTagName('uri')[0].textContent;
        }

        if (typeof($section[i].getElementsByTagName('resource-uri')[0]) != 'undefined') {
            objSection.resourceUri = $section[i].getElementsByTagName('resource-uri')[0].textContent;
        }

        if (typeof($section[i].getElementsByTagName('bar-image')[0]) != 'undefined') {
            objSection.barImage = $section[i].getElementsByTagName('bar-image')[0].textContent;
        }

        if (typeof($section[i].getElementsByTagName('icon-image')[0]) != 'undefined') {
            objSection.iconImage = $section[i].getElementsByTagName('icon-image')[0].textContent;
        }

        if (typeof ($section[i].getElementsByTagName('display-name')[0]) != 'undefined') {
            objSection.displayName = $section[i].getElementsByTagName('display-name')[0].textContent;
        }

        // Get carousel if exists:
        objSection.carousel = getCarousel($section[i], 'carousel');

        // Get ads:
        objSection.ad = getAds($section[i], 'ad');

        // Get social networks:
        objSection.socialNetwork = getSocialNetwork($section[i], 'social-netwoks');

        // Get sub-sections:
        if (typeof ($section[i].childNodes) != 'undefined') {
            objSection.subSections = getSections($section[i].childNodes, 'sub-section');
        }

        // Add current section into array:
        arrSections.push(objSection);
    }
	
	return arrSections;
}

function getSponsor(scopeTag) {
    // Declare the result object:
	var objSponsor = new Sponsor();
	
    // Get tag attributes:
	objSponsor.divisionId = scopeTag.getAttribute('DivisionId');
	
	return objSponsor;
}