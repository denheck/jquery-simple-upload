(function(jQuery) {
	// default settings to be used for all image upload attempts
	var defaultSettings = {
	    type: "post",
	    processData: false,
	    contentType: false,
	    dataType: "json"
	}

	// simpleUpload function
	var upload = functon(options) {
 		var alias;

 		// if options parameter is a string matching an alias use the stored alias settings
		for (alias in aliasSettings) {
			if (alias === options) {
				options = aliasSettings[alias];
			}
		}

		// handle options parameter being invalid
		if (jQuery.isPlainObject(options) === false) {
			throw "Options parameter is invalid";
		}

		// TODO: don't know if this is going to work with the 'this' object passed directly 
		jQuery('body').on('change', this, { ajaxOptions: options } uploadHandler);
	};

	// attach upload handler to <body> element to allow delegated-events for dynamically added file upload fields
	var uploadHandler = function(event) {
		var file = this.files[0];
		var fd = new FormData();
		var ajaxOptions = event.data.ajaxOptions;

		fd.append('image', file);
		ajaxOptions.data = fd;

		jQuery.ajax(jQuery.extend(true, {}, defaultSettings, ajaxOptions));
	};

	// simpleUploadSetup function
	// alias is the nickname the settings object should be stored under
	var setup = function(alias, options) {

		// settings organized by alias
		this.aliasSettings = {
			default: defaultSettings
		}

		if (options) {
			// add new alias with associated options
			this.aliasSettings[alias] = options;
		} else {
			// change default settings for entire application
			var options = alias;
			jQuery.extend(this.defaultSettings.default, options);
		}
	};

	// Add to jQuery as plugins
	jQuery.fn.extend({
		simpleUploadSetup: setup,
		simpleUpload: upload
	});
})(jQuery);

/* 

Cool Stuff

* Handles dynamically created file upload boxes
* Uploads using HTML 5 via AJAX
* Use aliased settings to upload files to different locations or with different parameters

*/