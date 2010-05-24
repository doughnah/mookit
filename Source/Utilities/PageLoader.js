/*
---

script: PageLoader.js

description: A plugin that loads content off pages via ajax

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4/Request

provides: [PageLoader]

...
*/

var PageLoader = new Class({
							  
	getOptions: function(){
		return {
			links: '.loadMe',
			loadInTo: 'content',
			loadFrom: 'content',
			_onStart: $empty,
			_onComplete: $empty
		};
	},

	initialize: function(options){
	
		this.setOptions(this.getOptions(), options);
		
		this.links = $$(this.options.links);
		this.links.each(function(el,i){
			el.addEvent('click',function(e){
				if(e != undefined){
					new Event(e).stop();
				}
				this.start(el);
			}.bind(this));
		}.bind(this));
	},
	
	setContent: function(html){
		var temp = new Element('div').set({
			'id': 'temp',
			'styles': {
				'display': 'none'
			},
			'html': html
		}).inject(document.body);
		
		var newEl = $('temp').getElement('#'+this.options.loadFrom);
		newEl.replaces($(this.options.loadInTo));
		newEl.set('id', this.options.loadInTo);
		temp.destroy();
		
	},
	
	start: function(el){
		this.options._onStart();
		this.content = new Request.HTML({
								method: 'get',
								onComplete: this.complete.bind(this),
								autoCancel: true
							}).get(el.href);
	},
	
	complete: function(tree, els, html, js){
		this.setContent(html);
		this.options._onComplete();
	}

});
PageLoader.implement(new Events);
PageLoader.implement(new Options);

