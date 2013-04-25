/*globals kendo */

function PropertyViewModel() {
	/// <summary>
	/// A view model that represents a single property
	/// </summary>

	var that;

	// --- properties
	
	this.property;
	this.isFave;


	// --- public functions

	this.init = function (property) {

		this.set("property", property);
		this.set("isFave", favouritesViewModel.isFavourite(property.guid));
	};
	
	this.addToFavourites = function (e) {
		/// <summary>
		/// Handles clicks on add to Favourites button.
		/// </summary>
		
		favouritesViewModel.saveProperty(this.get("property"));
		this.set("isFave", true);
	};
	
	this.removeFromFavourites = function (e) {
		/// <summary>
		/// Handles clicks on remove from Favourites button.
		/// </summary>
		
		favouritesViewModel.removeProperty(this.get("property"));
		this.set("isFave", false);
	};
	
	this.isFavourite = function () {
		return this.get("isFave");
	}
	
	this.getStats = function () {
		var stats = this.get("property").bedrooms + ' bed ' + this.get("property").propertyType;
		var bathrooms = this.get("property").bathrooms;
		if (bathrooms) {
			stats += ', ' + bathrooms + ' ' + (bathrooms > 1 ? 'bathrooms' : 'bathroom');
		}
		return stats;
	};
	
	// --- private functions

	that = kendo.observable(this);
	return that;
}
