/*globals kendo */

function LocationViewModel() {
	/// <summary>
	/// A view model that represents a single search location
	/// </summary>

	var that;

	// --- properties
	
	this.searchString;
	this.displayString;


	// --- public functions

	this.init = function (propertySearchService, searchString, displayString) {

		this.set("searchString", searchString);
		this.set("displayString", displayString);
	};
	
	this.executeSearch = function (pageNumber, resultsCallback) {
		/// <summary>
		/// Executes a search by the search string represented by this view model for the given page
		/// </summary>
		propertySearchService.searchForKeyword(this.searchString, pageNumber, resultsCallback);
	};
	
	// --- private functions

	that = kendo.observable(this);
	return that;
}
