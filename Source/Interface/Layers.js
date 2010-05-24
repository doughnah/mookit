/*
---

script: Layers.js

description: A manager for layers

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4
- /Layer

provides: [Layers]

...
*/
var Layers = new Class({
	
	Implements: Options,
	
	getOptions: function(){
		return {
			
		};
	},
	
	initialize: function(options){
		this.setOptions(this.getOptions(), options);
		this.layers = [];
		this.elements = [];
	},
	
	toggle: function(el, options){
		if($(el)){
			el = this.GetElement(el);
		}
		if(this.elements.contains(el)){
			var n = this.elements.indexOf(el);
			if (this.layers[n].options.control == options.control) {
				this.hide(el, options);
			}else{
				this.show(el, options);
			}
		}else{
			this.show(el, options);
		}
		return false;
	},
	
	show: function(el, options){
		if($(el)){
			el = this.GetElement(el);
		}
		if(this.elements.contains(el)){
			var n = this.elements.indexOf(el);
			if(this.layers[n].inProgress == false){
				if (this.layers[n].visible) {
					el.store('show', true);
					el.store('options', options);
					this.hide(el, options);
				}else{
					this.layers[n].show();
				}
			}
		}else{
			this.elements.push(el);
			var l = new Layer(el, options);
			this.layers.push(l);
			l.show();
		}
		return false;
	},
	
	hide: function(el, options, delay){
		if($(el)){
			el = this.GetElement(el);
		}
		if (this.elements.contains(el)) {
			var n = this.elements.indexOf(el);
			if(this.layers[n].inProgress == false){
				this.layers[n].hide();
			}
			else { 
			    (function() { layers.hide(el); }).delay(250, el);
			}
		}
		return false;
	},
	
	UpdateDimensions: function(el){
		if($(el)){
			el = this.GetElement(el);
		}
		if (this.elements.contains(el)) {
			var n = this.elements.indexOf(el);
			this.layers[n].updateFrameDimensions();
		}
		return false;
	},
	
	GetElement: function(el) {
	
	    var correctElement = $(el);
	    $(document.body).getElements('div[id=' + el + ']').each(function(element, index) {
	        if (layers.elements.contains(element)) {
	            correctElement = element;
	        }
	    });
	    
	    return correctElement;
	}	
	
});

var layers = new Layers();
