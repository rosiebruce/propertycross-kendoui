/*globals $, kendo, propertySearchService, propertyViewModel, app*/

function SearchResultsViewModel() {
	/// <summary>
	/// A view model that renders the results of a property search.
	/// </summary>

	var that,
		propertySearchService = new PropertySearchService();

	// --- properties
	this.properties = [];
	this.isSearching = false;
	this.totalResults = 0;
	this.pageNumber = 1;
	this.loadMoreText = "Load more ...";
	this.searchString = "";

	// --- public functions
  
	this.hasMoreToLoad = function () {
		return this.get("totalResults") > this.get("properties").length;
	};
  
	this.init = function (searchText, propertyViewModels, totalResults) {
		this.set("properties", propertyViewModels);
		this.set("pageNumber", 1);
		this.set("searchString", searchText);
		this.set("totalResults", totalResults);
	};

	this.loadMore = function () {
		this.set("pageNumber", this.pageNumber + 1);
		this.set("isSearching", true);
		this.set("loadMoreText", "Loading ...");
   
		propertySearchService.searchForKeyword(this.searchString, this.pageNumber, function (searchResults) {
			that.set("isSearching", false);
			that.set("loadMoreText", "Load more ...");

			// add the new batch of properties
			if (searchResults.data && searchResults.data.length > 0) {
				$.each(searchResults.data, function (index, property) {
					that.properties.push(property);
				});
			}
		});
	};

	this.propertyClicked = function (e) {
		// navigate to the property
		propertyViewModel.init(e.dataItem);
		app.navigate("#propertyView");
	};

	that = kendo.observable(this);
	return that;
}