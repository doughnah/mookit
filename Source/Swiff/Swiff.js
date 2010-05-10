

/**************************************************************

	Script		: Swiff
	Version		: 1.0
	Authors		: Samuel Birch
	Desc		: Adds version checking to the Swiff class

**************************************************************/

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
