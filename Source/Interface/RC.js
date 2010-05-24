/*
---

script: RC.js

description: A plugin to create images based rounded corners

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [RC]

...
*/
var RC = new Class({
	
	Implements: [Options],
	
	getOptions: function(){
		return {
			classname: 'rc'
		};
	},
	
	initialize: function(els, options){
		this.setOptions(this.getOptions(), options);
		
		this.boxes = $$(els);
		
		this.boxes.each(function(el,i){
			
			el.addClass(this.options.classname);
			
			var tl = new Element('div', {'class': 'tl'});
			var tr = new Element('div', {'class': 'tr'});
			var c = new Element('div', {'class': 'c'});
			var bl = new Element('div', {'class': 'bl'});
			var br = new Element('div', {'class': 'br'});
			
			var children = el.getChildren();
			c.inject(el, 'top');
			children.inject(c);
			
			tl.inject(c, 'before');
			tr.inject(tl, 'after');
			bl.inject(c, 'after');
			br.inject(bl, 'after');
			
		}, this);
	}
	
});
/************************************************************/