﻿/*globals $, kendo, PropertySearchService, localStorage, searchResultsViewModel, app */

function PropertySearchViewModel() {
	/// <summary>
	/// A view model for searching for properties for a given location
	/// </summary>

	var that,
    	propertySearchService = new PropertySearchService();
	
	// --- properties
	this.searchString = "";
	this.displayString = "";
	  
	this.isSearching = false;
	this.searchEnabled = false;
	  
	this.userMessage = "";
	  
	this.recentSearches = [];
	this.locations = [];

	this.recentSearchTitleVisible = function () {
		return this.get("recentSearches").length > 0;
	};
  
	this.locationsVisible = function () {
		return this.get("locations").length > 0;
	};
  
	this.searchButtonDisabled = function () {
		return this.get("searchString").length === 0 && this.get("isSearching") === false;
	};

	// --- 'private' functions

	function saveRecentSearchesState() {
		/// <summary>
		/// Saves the recent searches state to local storage
		/// </summary>
		var recentSearchStrings = JSON.stringify(that.recentSearches);
		localStorage.setItem("recentSearches", recentSearchStrings);
	}

	function updateLocations(locations) {
		$.each(locations, function (index, location) {
			that.locations.push(location);
        });
	}
  
	function addSearchTermToRecentSearches(searchString, displayString, totalResults) {
		/// <summary>
		/// Adds the current search term to the search history
	    /// </summary>

		// check whether we already have this item in our recent searches list
		var searchLocation = searchLocation = {
			searchString: searchString,
			displayString: displayString, 
			totalResults: totalResults
		};
	
		var matches = $.grep(that.recentSearches, function (recentSearch) {
			return recentSearch.searchString === searchString;
		});

		// if there is no match, add this term
		if (matches.length === 0) {

			// add the new item
			that.recentSearches.unshift(searchLocation);

			// limit to 5 recent search terms
			while (that.recentSearches.length > 5) {
				that.recentSearches.pop();
			}

			saveRecentSearchesState();
		}
	}
  
	function resultsCallback(searchResults) {
		if (searchResults.responseCode == 1) {
			if(searchResults.totalResults === null) {
				that.set("userMessage", "There were no properties found for the given location.");
			} else {
				// store this search
				addSearchTermToRecentSearches(searchResults.placeName, searchResults.longTitle, searchResults.totalResults);

				// navigate to the results view model
				searchResultsViewModel.init(this.searchString, searchResults.data, searchResults.totalResults);
				app.navigate("#searchResultsView");
			}
		} else if (searchResults.responseCode == 2){
			updateLocations(searchResults.data);
			that.set("userMessage", "You searched for an ambiguous location.");
		} else {
			that.userMessage("The location given was not recognised.");
		}

		that.set("isSearching", false);
	}
	
	function searchForCoordinate (position) {
		that.set("displayString", "");//position.coords.latitude.toFixed(2) + ", " + position.coords.longitude.toFixed(2));
		propertySearchService.searchForCoordinate(position.coords.latitude, position.coords.longitude, 1, resultsCallback);
	}
	  
	function locationError (err) {
		that.set("isSearching", false);
		if(err.code == 1) {
			that.set("userMessage", "Access is denied.");
		} else if( err.code == 2) {
			that.set("userMessage", "Position is unavailable.");
		}
	}

	// --- functions
	
	this.executeMyLocationSearch = function () {
		
		this.set("locations", []);
		this.set("userMessage", "");
		this.set("isSearching", true);
	    
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(searchForCoordinate, locationError);
		} else { 
			this.set("userMessage", "Geolocation is not supported by this browser.");
		}
	};
  
	this.update = function () {
		this.set("searchString", this.displayString);
	}
	this.executeTextSearch = function () {
		
		this.set("locations", []);
		
		if ($.trim(this.searchString) === "") {
			return;
		}

		this.set("userMessage", "");
		this.set("isSearching", true);

		propertySearchService.searchForKeyword(this.searchString, 1, resultsCallback);
	};

	this.loadState = function () {
		/// <summary>
		/// Loads the persisted recent searches from local storage
		/// </summary>

		var recentSearchesString = localStorage.getItem("recentSearches");
		var searches = JSON.parse(recentSearchesString);
		$.each(searches, function(index,item){
			that.recentSearches.push(item);
		});
	};

	this.viewFavouritesClicked = function () {
		app.navigate("#favouritesView");
	};
	
	this.recentSearchClicked = function (e) {
		/// <summary>
		/// Handles clicks on recent search terms.
		/// </summary>
		this.set("searchString", e.dataItem.searchString);
		this.set("displayString", e.dataItem.displayString);
		this.executeTextSearch();
	};
  
	this.locationClicked = function (e) {
		/// <summary>
		/// Handles clicks on location.
		/// </summary>
		this.set("searchString", e.dataItem.placeName);
		this.set("displayString", e.dataItem.longTitle);
		this.executeTextSearch();
	};

	that = kendo.observable(this);
	return that;
}

 