/*
---

name: Xapper

description: Wrapper for embedding Silverlight movies.

license: MIT-style license.

credits: 
  - Samuel Birch

requires: [Options, Object]

provides: Xapper

...
*/


var Xapper = new Class({

	Implements: Options,

	options: {
		id: null,
		version: 4,
		height: 1,
		width: 1,
		container: null,
		properties: {},
		params: {
			isWindowless: true,
			autoUpgrade: true,
			background: 'white',
			framerate: 24,
			enableHtmlAccess: true
		},
		callBacks: {},
		vars: {},
		enableHistory: false
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
	
			Xapper.CallBacks[this.instance] = {};
	
			var params = options.params, vars = options.vars, callBacks = options.callBacks;
			var properties = $merge({height: options.height, width: options.width}, options.properties);
	
			var self = this;
	
			for (var callBack in callBacks){
				Xapper.CallBacks[this.instance][callBack] = (function(option){
					return function(){
						return option.apply(self.object, arguments);
					};
				})(callBacks[callBack]);
				vars[callBack] = 'Xapper.CallBacks.' + this.instance + '.' + callBack;
			}
	
			params.initParams = $H(vars).toQueryString();
			params.minRuntimeVersion = options.version+'.0';
			properties.type = 'application/x-silverlight-2';
			properties.data = 'data:application/x-silverlight-2,';
			params.source = path;
			
			
			var obj = new Element('object', $merge(properties, {id: id}));
			
			for (var param in params){
				new Element('param', {name: param, value: params[param]}).inject(obj);
			}
			
			this.object = ((container) ? container.empty() : new Element('div')).inject(obj);
			
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
	}

});

Xapper.CallBacks = {};

