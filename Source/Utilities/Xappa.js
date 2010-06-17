/*
---

name: Xappa

description: Wrapper for embedding Silverlight movies.

license: MIT-style license.

credits: 
  - Samuel Birch

requires: [Options, Object]

provides: Xappa

...
*/


var Xappa = new Class({

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
		initParams: {},
		enableHistory: false,
		remote: null
	},

	initialize: function(path, options){
		this.setOptions(options);
		
		if(Browser.Plugins.Silverlight.version >= this.options.version){
		
			this.instance = 'Silverlight_' + Date.now();
	
			
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
				params.initParams = initParams.toQueryString();
			}
			params.minRuntimeVersion = options.version+'.0';
			properties.type = 'application/x-silverlight-2';
			properties.data = 'data:application/x-silverlight-2,';
			params.source = path;
			
			
			var obj = new Element('object', $merge(properties, {id: this.id}));
			
			for (var param in params){
				new Element('param', {name: param, value: params[param]}).inject(obj);
			}
			
			this.object = (container) ? container.empty() : new Element('div').inject(document.body);
			obj.inject(this.object);
			
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
	
	remote: $(this.id).content[this.options.remote]

});

Xappa.CallBacks = {};

