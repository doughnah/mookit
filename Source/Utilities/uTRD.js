/*
---

script: uTRD.js

description: A plugin that detects text resize

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [uTRD]

...
*/

var uTRD = new Class({
	
	Implements: [Options,Events],
	
	getOptions: function(){
		return {
			delay: 200,
			base: 16
		};
	},
	
	initialize: function(options){
		this.setOptions(this.getOptions(), options);
		this.functions = [];
		this.element = new Element('div', {
			'id': 'uTRD_Controller_'+$time(),
			'styles': {
				'position': 'absolute',
				'left': '-1000em',
				'top': 0,
				'width': '1em',
				'height': '20em'
			}
		}).inject($(document.body));
		
		this.oldSize = this.element.getCoordinates().height;
		this.defaultSize = this.oldSize;
		this.checking = false;
	},
	
	start: function(){
		this.checking = true;
		this.timer = this.check.periodical(this.options.delay, this);
	},
	
	stop: function(){
		$clear(this.timer);
	},
	
	check: function(){
		var newSize = this.element.getCoordinates().height;
		if(this.oldSize != newSize){
			var size = 20*this.options.base;
			var percent = ((newSize / size) * 100).toInt();

			this.functions.each(function(el,i){
				el.attempt([percent]);
			}, this);
			this.oldSize = newSize;
		}
	},
	
	defaultCheck: function(){
		if((this.defaultSize/this.options.base).toInt() != 20){
			this.defaultSize = 20*this.options.base;
			var percent = ((this.oldSize / this.defaultSize) * 100).toInt();
			this.functions.each(function(el,i){
				el.attempt([percent, true]);
			}, this);
		}
	},
	
	add: function(func){
		this.functions.push(func);
		this.defaultCheck();
		if(!this.checking){
			this.start();
		}
	}
	
});

