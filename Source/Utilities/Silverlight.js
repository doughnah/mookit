/*
---

name: Silverlight

description: Wrapper for embedding Silverlight movies.

license: MIT-style license.

credits: 
  - 

requires: [Options, Object]

provides: Silverlight

...
*/


Browser.Plugins.Silverlight = (function(){
	
	var version;
	
	if(Browser.Engine.trident){
		var agc = new ActiveXObject('AgControl.AgControl');
		if(agc.IsVersionSupported('1.0')){version = 1;}
		if(agc.IsVersionSupported('2.0')){version = 2;}
		if(agc.IsVersionSupported('3.0')){version = 3;}
		if(agc.IsVersionSupported('4.0')){version = 4;}
	}else{
		version = navigator.plugins['Silverlight Plug-In'].description.substring(0,1);
	}
	
	if(!version){
		version = 0;
	}
	
	return {version: Number(version) || 0};
})();



var Silverlight = new Class({

	Implements: Options,

	options: {
		id: null,
		version: 4,
		height: 1,
		width: 1,
		container: null,
		properties: {},
		params: {
			minRuntimeVersion: '3.0',
			windowless: 'transparent'
		},
		callBacks: {},
		vars: {}
	},

	toElement: function(){
		return this.object;
	},

	initialize: function(path, options){
		this.setOptions(options);
		
		if(Browser.Plugins.Silverlight.version >= this.options.version){
		
			this.instance = 'Silverlight_' + Date.now();
	
			
			options = this.options;
			var id = this.id = options.id || this.instance;
			var container = document.id(options.container);
	
			Silverlight.CallBacks[this.instance] = {};
	
			var params = options.params, vars = options.vars, callBacks = options.callBacks;
			var properties = $merge({height: options.height, width: options.width}, options.properties);
	
			var self = this;
	
			for (var callBack in callBacks){
				Silverlight.CallBacks[this.instance][callBack] = (function(option){
					return function(){
						return option.apply(self.object, arguments);
					};
				})(callBacks[callBack]);
				vars[callBack] = 'Silverlight.CallBacks.' + this.instance + '.' + callBack;
			}
	
			//params.flashVars = Object.toQueryString(vars);
			properties.type = 'application/x-silverlight';
			properties.data = 'data:application/x-silverlight,';
			properties.source = path;
			
			var build = '<object id="' + id + '"';
			for (var property in properties) build += ' ' + property + '="' + properties[property] + '"';
			build += '>';
			for (var param in params){
				if (params[param]) build += '<param name="' + param + '" value="' + params[param] + '" />';
			}
			build += '</object>';
			this.object = ((container) ? container.empty() : new Element('div')).set('html', build).firstChild;
			
		}
	},

	replaces: function(element){
		element = document.id(element, true);
		element.parentNode.replaceChild(this.toElement(), element);
		return this;
	},

	inject: function(element){
		document.id(element, true).appendChild(this.toElement());
		return this;
	},

	remote: function(){
		return Silverlight.remote.apply(Silverlight, [this.toElement()].extend(arguments));
	}

});

Silverlight.CallBacks = {};
/*
Silverlight.remote = function(obj, fn){
	var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
	return eval(rs);
};
*/