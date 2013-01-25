/*
 * Flickr DataSource for Fuel UX Datagrid
 * https://github.com/adamalex/fuelux-dgdemo
 *
 * Copyright (c) 2012 Adam Alexander
 * Demo source released to public domain.
 */

var FlickrDataSource = function (options) {
	this._formatter = options.formatter;
	this._columns = options.columns;
  this._url = options.url;
};

FlickrDataSource.prototype = {

	/**
	 * Returns stored column metadata
	 */
	columns: function () {
		return this._columns;
	},

	/**
	 * Called when Datagrid needs data. Logic should check the options parameter
	 * to determine what data to return, then return data by calling the callback.
	 * @param {object} options Options selected in datagrid (ex: {pageIndex:0,pageSize:5,search:'searchterm'})
	 * @param {function} callback To be called with the requested data.
	 */
	data: function (options, callback) {

		var url = this._url;
		var self = this;



			// Search active.  Add URL parameters for Flickr API.
			//url += '&tags=' + options.search;
			//url += '&per_page=' + options.pageSize;
			//url += '&page=' + (options.pageIndex + 1);

			$.ajax(url, {

				// Set JSONP options for Flickr API
				dataType: 'jsonp',
				type: 'GET'

			}).done(function (response) {

				// Prepare data to return to Datagrid
				var data = response;
				var count = response.length;
        /*
				var startIndex = (response.photos.page - 1) * response.photos.perpage;
				var endIndex = startIndex + response.photos.perpage;
				var end = (endIndex > count) ? count : endIndex;
				var pages = response.photos.pages;
				var page = response.photos.page;
				var start = startIndex + 1;
        */

				// Allow client code to format the data
				if (self._formatter) self._formatter(data);

				// Return data to Datagrid
				callback({ data: data, count: count });

			});


	}
};