
var globalVars = new Object();
globalVars.applicationName = '';
globalVars.code = '';
globalVars.countryId = 0;
globalVars.countryKey = '';
globalVars.editionId = 0;
globalVars.email = '';
globalVars.error = null;
globalVars.interactionsCount = 0;
globalVars.interactionsLimit = 0;
globalVars.isbn = '';
globalVars.prefix = '';
globalVars.resolutionKey = '';
globalVars.sections = null;
globalVars.specialities = null;
globalVars.target = '';

globalVars.interactionsId = 0;
globalVars.clinicalAnalyzesISBN = '';
globalVars.healthcareSuppliersISBN = '';

globalVars.InfoSourceId = 0;
globalVars.parametizedSearchId = 10
globalVars.PSESourceId = 0;

globalVars.attributeEntityId = 0;
globalVars.newslettersEntityId = 0;

globalVars.newslettersInfoType = '';

/* Search Engine */

var searchEngineVars = new Object();
searchEngineVars.itemsResults = null;
searchEngineVars.productResultCount = 0;
searchEngineVars.substanceResultCount = 0;
searchEngineVars.indicationResultCount = 0;
searchEngineVars.labResultCount = 0;

var productsVars = new Object();
productsVars.ProductByEditionInfoItems = null;
productsVars.ProductByEditionInfoCount = 0;

var substancesVars = new Object();
substancesVars.ActiveSubstanceInfoItems = null;
substancesVars.ActiveSubstanceInfoCount = 0;

var indicationsVars = new Object();
indicationsVars.IndicationInfoItems = null;
indicationsVars.IndicationInfoCount = 0;

var divisionsVars = new Object();
divisionsVars.DivisionByEditionInfoItems = null;
divisionsVars.DivisionByEditionInfoCount = 0;

var productDetail = new Object();
productDetail.brand = '';
productDetail.categoryId = 0;
productDetail.categoryName = '';
productDetail.countryCodes = null;
productDetail.divisionId = 0;
productDetail.divisionName = '';
productDetail.divisionShortName = '';
productDetail.pharmaForm = '';
productDetail.pharmaFormId = 0;
productDetail.productId = 0;
productDetail.productContent = null;
productDetail.attributeContent = null;

/* Interactions */

var interactionsVars = new Object();

interactionsVars.interactionsProducts = [];
interactionsVars.interactionsProductsByCountry = [];

interactionsVars.itemsResults = null;

interactionsVars.indicationResultCount = 0;
interactionsVars.labResultCount = 0;
interactionsVars.productResultCount = 0;
interactionsVars.substanceResultCount = 0;

interactionsVars.ActiveSubstanceInfoCount = 0;
interactionsVars.ActiveSubstanceInfoItems = null;
interactionsVars.DivisionByEditionInfoCount = 0;
interactionsVars.DivisionByEditionInfoItems = null;
interactionsVars.IndicationInfoCount = 0;
interactionsVars.IndicationInfoItems = null;
interactionsVars.ProductByEditionInfoCount = 0;
interactionsVars.ProductByEditionInfoItems = null;

interactionsVars.interactionsItems = null;

/* Clinical Analyzes */

var clinicalAnalyzesVars = new Object();

clinicalAnalyzesVars.countryId = '';
clinicalAnalyzesVars.companyTypeId = '';
clinicalAnalyzesVars.companyId = 0;
clinicalAnalyzesVars.letter = '';
    clinicalAnalyzesVars.sectionId = 0;
clinicalAnalyzesVars.sectionName = '';
clinicalAnalyzesVars.sectionParentId = 0;
clinicalAnalyzesVars.sectionParentName = '';
clinicalAnalyzesVars.brandId = 0;
clinicalAnalyzesVars.brandName = '';
clinicalAnalyzesVars.stateId = 0;
clinicalAnalyzesVars.stateName = '';
clinicalAnalyzesVars.cityId = 0;
clinicalAnalyzesVars.cityName = '';
clinicalAnalyzesVars.ProductByEditionInfoItems = null;
clinicalAnalyzesVars.productId = 0;

/* Healthcare Suppliers */

var healthcareSuppliersVars = new Object();

healthcareSuppliersVars.editionId = 0;
healthcareSuppliersVars.letter = '';
healthcareSuppliersVars.categoryId = 0;
healthcareSuppliersVars.categoryName = '';
healthcareSuppliersVars.itemType = 0;
healthcareSuppliersVars.parentCategoryId = 0;
healthcareSuppliersVars.parentCategoryName = '';
healthcareSuppliersVars.clientId = 0;
healthcareSuppliersVars.productId = 0;
healthcareSuppliersVars.companyName = '';
healthcareSuppliersVars.companyNameByClient = '';
healthcareSuppliersVars.productCategoryId = 0;
healthcareSuppliersVars.productCategoryName = '';
healthcareSuppliersVars.itemTypeByClient = '';

healthcareSuppliersVars.categories = null;
healthcareSuppliersVars.brands = null;
healthcareSuppliersVars.brandsCount = 0;
healthcareSuppliersVars.brandsItems = null;
healthcareSuppliersVars.productsCount = 0;
healthcareSuppliersVars.productsItems = null;
healthcareSuppliersVars.clientsCount = 0;
healthcareSuppliersVars.clientsItems = null;
healthcareSuppliersVars.categoriesCount = 0;
healthcareSuppliersVars.categoriesItems = null;

/* Favorites */

var favoritesVars = new Object();
favoritesVars.favoritesProducts = [];
favoritesVars.favoritesProductsByCountry = [];

/* Newsletters */

var newslettersVars = new Object();
newslettersVars.newslettersItems = null;

/* Settings */

/* Profile */

var profileVars = new Object();

profileVars.profileCodePrefix = '';
profileVars.profileCountry = '';
profileVars.profileEmail = '';
profileVars.profileEntrySource = '';
profileVars.profileFirstName = '';
profileVars.profileLastName = '';
profileVars.profileLicense = '';
profileVars.profileProfession = 0;
profileVars.profileResidenceKey = '';
profileVars.profileSLastName = '';
profileVars.profileSpeciality = 0;
profileVars.profileState = '';
profileVars.profileTargetOutput = '';

profileVars.countriesItems = null;
profileVars.professionsItems = null;
profileVars.professionsByParentItems = null;
profileVars.profileItems = null;
profileVars.residencesItems = null;
profileVars.specialitiesItems = null;
profileVars.statesItems = null;
