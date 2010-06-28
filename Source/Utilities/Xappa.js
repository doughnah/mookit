/*
---

name: Xappa

description: Wrapper for embedding Silverlight movies & Silverlight detection.

license: MIT-style license.

credits: 
  - Samuel Birch

requires: [Options, Object]

provides: [Browser.Plugins.Silverlight, Xappa]

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


var Xappa = new Class({

	Implements: Options,

	options: {
		id: null,
		version: 4,
		minorVersion: '.0',
		height: 1,
		width: 1,
		container: null,
		properties: {},
		params: {
			windowless: true,
			autoUpgrade: true,
			background: 'white',
			framerate: 24,
			enableHtmlAccess: true
		},
		callBacks: {},
		initParams: {},
		enableHistory: false,
		remote: null
	},

	initialize: function(path, options){
		this.setOptions(options);
		
		if(Browser.Plugins.Silverlight.version >= this.options.version){
		
			this.instance = 'Silverlight_' + $time();

			options = this.options;
			this.id = options.id || this.instance;
			var container = document.id(options.container);
	
			Xappa.CallBacks[this.instance] = {};
	
			var params = options.params, callBacks = options.callBacks;
			var properties = $merge({height: options.height, width: options.width}, options.properties);
	
			var self = this;
	
			for (var callBack in callBacks){
				Xappa.CallBacks[this.instance][callBack] = (function(option){
					return function(){
						return option.apply(self.object, arguments);
					};
				})(callBacks[callBack]);
				vars[callBack] = 'Xappa.CallBacks.' + this.instance + '.' + callBack;
			}
			
			var initParams = $H(options.initParams);
			if(initParams.getLength() > 0){
				params.initParams = unescape(initParams.toQueryString());
			}
			params.minRuntimeVersion = options.version+options.minorVersion;
			properties.type = 'application/x-silverlight-2';
			properties.data = 'data:application/x-silverlight-2,';
			params.source = path;
			
			
			var build = '<object id="' + this.id + '"';
			for (var property in properties) build += ' ' + property + '=' + properties[property] + '"';
			build += '>';
			for (var param in params) {
				if (params[param]) build += '<param name=' + param + '" value=' + params[param] + '" />';
			}
			build += '</object>';
			
			this.object = (container) ? container.empty() : new Element('div').inject(document.body);
			this.object.set('html', build);
			
			if(options.enableHistory){
				if(!document.id('_sl_historyFrame')){
					new IFrame({
						id: '_sl_historyFrame',
						styles: {
							width: 0,
							height: 0,
							border: 0,
							visibility: 'hidden'
						}
					}).inject(this.object);
				}
			}
		}
	},
	
	remote: function(){
		return $(this.id).content[this.options.remote];
	}

});

Xappa.CallBacks = {};