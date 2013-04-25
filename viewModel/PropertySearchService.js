/*globals $, PropertyViewModel */

function PropertySearchService() {
	/// <summary>
	/// A service that provide a very simple twitter search function, returing a simplified
	/// version of the response provided by the Twitter APIs
	/// </summary>

	var baseUrl = "http://api.nestoria.co.uk/api";
	
	this.searchForCoordinate = function (latitude, longitude, pageNumber, callback) {

		var params = {
	    	    country: "uk",
	    		pretty: "1",
	    		action: "search_listings",
	    		encoding: "json",
	    		listing_type: "buy",
	    		page: pageNumber,
	    		centre_point: latitude + "," + longitude
		};
    	  
		doSearch(params, callback);
	};
      
	this.searchForKeyword = function (searchString, pageNumber, callback) {

		var params = {
	    	    country: "uk",
	    		pretty: "1",
	    		action: "search_listings",
	    		encoding: "json",
	    		listing_type: "buy",
	    		page: pageNumber,
	    		place_name: searchString
		};
		
    	doSearch(params, callback);
    };
	
	function doSearch (params, callback) {
		$.ajax({
			dataType: "jsonp",
			url: baseUrl,
			data: params,
			success: function (response) {
				// add the new items
				var searchResults = populateViewModels(response);
				callback(searchResults);
			},
			error: function () {
				// TODO
				alert("error");
			}
       });
	};
	
	function populateViewModels (results) {
	    
	    var responseCode = results.response.application_response_code,
	    property, location, response;
	    var viewModels = [];

	    
	  	if (responseCode === "100" || /* one unambiguous location */
	  			responseCode === "101" || /* best guess location */
	      		responseCode === "110" /* large location, 1000 matches max */) {

	  		results.response.listings.forEach(function (value) {
	  			property = {
	  					guid: value.guid,
	      		        title: value.title,
	      		        price: value.price_formatted.substr(0, value.price_formatted.lastIndexOf(" ")),
	      		        bedrooms: value.bedroom_number,
	      		        bathrooms: value.bathroom_number,
	      		        propertyType: value.property_type,
	      		        thumbnail: value.thumb_url,
	      		        image: value.img_url,
	      		        summary: value.summary
	  			};
	  			viewModels.push(property);
	  		});

	  		response = {
	  				responseCode: 1,
	  				data: viewModels,
	  				totalResults: results.response.total_results,
	  				pageNumber: results.response.page,
	  				longTitle: results.response.locations[0].long_title,
	  				placeName: results.response.locations[0].place_name
	  		};
	  		
	  	} else if (responseCode === "200" || /* ambiguous location */
	  			responseCode === "202" /* mis-spelled location */) {

	  		results.response.locations.forEach(function (value) {
	  			location = {
	  					longTitle: value.long_title,
	      		        placeName: value.place_name,
	      		        title: value.title
	      		};
	      		viewModels.push(location);
	      	});

	  		response = {
	  				responseCode: 2,
	  				data: viewModels
	        };
	      	
	  	}  else {
	  		/*
	  		  201 - unknown location
	          210 - coordinate error
	        */
	  		response = {
	  				responseCode:3
	  		};
	  	}

	  	return response;
	};
	
}
