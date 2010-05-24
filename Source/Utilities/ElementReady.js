/*
---

script: ElementReady.js

description: Fires when an element is rendered, before domready is fired.

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [ElementReady]

...
*/

var ElementReady = new Class({
	
	initialize: function(el, func){
		//do something
		if($$(el)[0]){
			func();
		}else{
			this.timer = this.check.periodical(10, this, [el, func]);
		}
		
		window.addEvent('domready', function(){
			$clear(this.timer);
		}.bind(this))
	},
	
	check: function(el, func){
		if($$(el)[0]){
			$clear(this.timer);
			func();
		}
	}
	
});