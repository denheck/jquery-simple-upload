(function(jQuery) {
	// default settings to be used for all file upload attempts
	var defaultSettings = {
	    type: "post",
	    processData: false,
	    contentType: false,
	    dataType: "json",
        fileKey: "file",
        additionalFormData: {}
	}

    // make ajax request
    var makeRequest = function(ajaxOptions) {
        var jqXHR = jQuery.ajax(ajaxOptions);

        jqXHR.always(function() {
            $(this.element).val('');
        });
    }

	// simpleUpload function
	var upload = function(alias, options) {
 		var aliasOptions = {};
        var additionalOptions = {};
        var aliasSettings = jQuery.simpleUploadAliasSettings;

        if (alias && aliasSettings[alias]) {
            aliasOptions = aliasSettings[alias];
        } else if (alias) {
            aliasOptions = alias;
        }

        if (options) {
            additionalOptions = options;
        }

        var ajaxOptions = jQuery.extend(true, {}, aliasOptions, additionalOptions);

		// bind handler to file field change event
		this.on('change', {
            ajaxOptions: ajaxOptions
        }, uploadHandler);

        // add drop wrapper around file input
        this.wrap(
            $('<div></div>', {
                class: "simpleUploadDropWrapper"
            })

            .on('dragenter', function(event) {
                event.preventDefault();
                return true;
            })

            .on('dragover', function() {
                return false;
            })

            .on('drop', {
                ajaxOptions: ajaxOptions
            }, uploadHandler)
        );
	};

	// attach upload handler to <body> element to allow delegated-events for dynamically added file upload fields
    // TODO: add support for delegated events
	var uploadHandler = function(event) {
        var externalFileSource = getExternalFileSource(event);
        var ajaxOptions = jQuery.extend(true, {}, defaultSettings, event.data.ajaxOptions);
        ajaxOptions.element = this;
        ajaxOptions.data = new FormData();

        if (externalFileSource) {
            ajaxOptions.additionalFormData.externalFileSource = externalFileSource;
        }

        $.each(ajaxOptions.additionalFormData, function(k, v) {
            ajaxOptions.data.append(k, v);
        });

        if (this.files) {
            for (var i = 0; i < this.files.length; i++) {
                ajaxOptions.data.append(ajaxOptions.fileKey, this.files[i]);
                makeRequest(ajaxOptions);
            }
        } else {
            makeRequest(ajaxOptions);
        }

        return false;
	};

    // get files from external sources if available
    var getExternalFileSource = function(event) {
        var externalFileSource = null;

        try {
            var source = event.originalEvent.dataTransfer.getData('text/uri-list');

            if (source.substr(0,4) !== 'file') {
                externalFileSource = source;
            }
        } catch (e) { }

        return externalFileSource;
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

* Handles dynamically created file upload boxes (NOT YET)
* Uploads using HTML 5 via AJAX
* Use aliased settings to upload files to different locations or with different parameters
* Can add a config file with all file upload settings defined in one place using $.simpleUploadSetup
* Can drag and drop files from desktop and from web browser (TODO additional security filtering recommended)

*/