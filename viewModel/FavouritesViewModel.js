/*globals $, FavouritesViewModel */

function FavouritesViewModel() {
	/// <summary>
	/// A view model for managing favourites
	/// </summary>
	
	var that;
	
	// --- properties
	
	this.favourites = [];

	// --- public functions
	
	this.saveProperty = function (property) {
		/// <summary>
		/// Adds a property and updates persisted storage
		/// </summary>
		
		if(!isFound(property.guid)){
			that.favourites.push(property);
			saveFavouritesState();
		}
	};
	
	this.removeProperty = function (property) {
		/// <summary>
		/// Removes a property and updates persisted storage
		/// </summary>
		
		var guidToRemove = property.guid;
		if(isFound(guidToRemove)){
			var newFavourites = $.grep(that.favourites, function(favourite) { 
				return favourite.guid != guidToRemove; 
			});
			this.set("favourites", newFavourites);
			saveFavouritesState();
		}
	};
	
	this.favouriteClicked = function (e) {
		/// <summary>
		/// Navigate to property view of a particular favourite
		/// </summary>
		
		propertyViewModel.init(e.dataItem);
		app.navigate("#propertyView");
	};
	
	this.loadState = function () {
		/// <summary>
		/// Loads the persisted favourites state from local storage
		/// </summary>
    
		var favouritesString = localStorage.getItem("favourites");
		var storedFavourites = JSON.parse(favouritesString);
		$.each(storedFavourites, function(index,storedFavourite){
			that.favourites.push(storedFavourite);
		});
	};
	
	this.isFavourite = function (guid) {
		return isFound(guid);
	}
	
	// --- private functions
	
	function isFound (guidToFind) {
		/// <summary>
		/// Searches for a particular guid
		/// </summary>
		
		var matches = $.grep(that.favourites, function (favourite) {
			return favourite.guid === guidToFind;
		});
		if (matches.length === 0) {
			return false;
		} else {
			return true;
		}
	}
	
	function saveFavouritesState () {
		/// <summary>
		/// Saves the favourites state to local storage
		/// </summary>
	  
		var favouriteStrings = JSON.stringify(that.favourites);
		localStorage.setItem("favourites", favouriteStrings);
	}
	
	that = kendo.observable(this);
	return that;
}
