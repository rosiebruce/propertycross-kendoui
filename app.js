/*globals kendo, document, PropertySearchViewModel, SearchResultsViewModel, PropertyViewModel  */

// create the mobile app
var app = new kendo.mobile.Application(document.body);

// create the view models
var propertySearchViewModel = new PropertySearchViewModel();
var searchResultsViewModel = new SearchResultsViewModel();
var propertyViewModel = new PropertyViewModel();
var favouritesViewModel = new FavouritesViewModel();

// load the initial states
propertySearchViewModel.loadState();
favouritesViewModel.loadState();





















