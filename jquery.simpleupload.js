(function(jQuery) {
	// default settings to be used for all image upload attempts
	var defaultSettings = {
	    type: "post",
	    processData: false,
	    contentType: false,
	    dataType: "json",
        fileKey: "file",
        additionalFormData: {}
	}

	// simpleUpload function
	var upload = function(options) {
 		var alias;
        var aliasSettings = jQuery.simpleUploadAliasSettings;

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

		// bind handler to image field change event
		this.on({
            change: uploadHandler
        }, {
            ajaxOptions: options 
        });
	};

	// attach upload handler to <body> element to allow delegated-events for dynamically added file upload fields
    // TODO: add support for delegated events
	var uploadHandler = function(event) {
		var file = this.files[0];
		var fd = new FormData();
		var ajaxOptions = jQuery.extend(true, {}, defaultSettings, event.data.ajaxOptions);

		fd.append(ajaxOptions.fileKey, file);
		ajaxOptions.data = fd;

        $.each(ajaxOptions.additionalFormData, function(k, v) {
            fd.append(k, v);
        });

		jQuery.ajax(ajaxOptions);
	};

	// simpleUploadSetup function
	// alias is the nickname the settings object should be stored under
	var setup = function(alias, options) {
		if (options) {
			// add new alias with associated options
			jQuery.simpleUploadAliasSettings[alias] = options;
		} else {
			// change default settings for entire application
			var options = alias;
			jQuery.extend(jQuery.simpleUploadAliasSettings.defaults, options);
		}
	};

	// Add to jQuery as plugins
	jQuery.fn.simpleUpload = upload;

    jQuery.extend({
        simpleUploadAliasSettings: {
            defaults: defaultSettings
        },
        simpleUploadSetup: setup
    });
})(jQuery);

/* 

Cool Stuff

* Handles dynamically created file upload boxes
* Uploads using HTML 5 via AJAX
* Use aliased settings to upload files to different locations or with different parameters

*/