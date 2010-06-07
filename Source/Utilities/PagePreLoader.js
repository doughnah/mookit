/*
---

script: PagePreLoader.js

description: A plugin that hides the page content until it's ready.

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4
- more:Assets

provides: [PagePreLoader]

...
*/
var PagePreLoader = new Class({
	
	Implements: Options,
	
	options: {
		css: 'css/loading.css',
		delay: 0,
		fade: true,
		typekitId: null
	},

	initialize: function(options){
		this.setOptions(options);
		this.loaders = new Hash();
		this.timer = $time();
		this.css = new Asset.css(this.options.css);
		if(this.options.typekitId){
			this.add('typekit');
			this.loadFonts();
		}
		this.add('domready');
	},
	
	add: function(id){
		//console.log('add');
		var loaderId = id || $time();
		this.loaders.set(loaderId, false);
		return loaderId;
	},
	
	update: function(id, status){
		this.loaders.set(id, status || true);
		this.check();
	},
	
	remove: function(id){
		this.loaders.erase(id);
	},
	
	check: function(){
		if(!this.loaders.hasValue(false)){
			var now = $time();
			if(now > this.timer + (this.options.delay*1000)){
				this.show();
			}else{
				this.show.delay((this.timer + (this.options.delay*1000))-now, this);
			}
			
		}
	},
	
	show: function(){
		//console.log('show');
		if(this.options.fade && !Browser.Engine.trident){
			$(document.body).fade('hide');
		}
		this.css.destroy();
		if(this.options.fade && !Browser.Engine.trident){
			$(document.body).fade('in');
		}
		$(document.body).focus();
	},
	
	loadFonts: function(){
		var self = this;
		WebFont.load({
			typekit: {id:this.options.typekitId},
		    loading: function() {
				//console.log('loading');
			},
			fontloading: function(fontFamily, fontDescription) {
				//console.log('font loading: '+fontFamily);
			},
			fontactive: function(fontFamily, fontDescription) {
				//console.log('font active: '+fontFamily);
			},
			fontinactive: function(fontFamily, fontDescription) {
				//console.log('font inactive: '+fontFamily);
			},
			active: function() {
				//console.log('active');
				self.update('typekit');
			},
			inactive: function() {
				//console.log('inactive');
				self.update('typekit');
			}
		});
	}
});