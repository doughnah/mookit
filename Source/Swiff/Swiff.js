/*
---

script: Swiff.js

description: An extension to the core Swiff that provides a version.

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4/Swiff

provides: [Swiff]

...
*/

Swiff = new Class({

	Extends: Swiff,

	options: {
		version: 8
	},

	initialize: function(path, options){
		this.setOptions(options);
		if (Browser.Plugins.Flash.version >= this.options.version) {
			$(this.options.container).getChildren().destroy();
			this.parent(path, options);
		}else{
			return false;
		}
	}

});

Swiff.CallBacks = {};

Swiff.remote = function(obj, fn){
	var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
	return eval(rs);
};

/*************************************************************/
