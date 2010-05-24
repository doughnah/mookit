/*
---

script: Fx.Accordion.js

description: An Fx.Elements extension which allows you to easily create accordion type controls.

license: MIT-style license

authors:
- Valerio Proietti

requires:
- core:1.2.4/Element.Event
- /Fx.Elements

provides: [Fx.Accordion]

...
*/

PluginName = new Class({
	
	//Extends: 
	Implements: [Options, Events],
	
	options: {
		/*
		onEvent: $empty(),
		*/
		options: true
	}
	
	initialize: function(options){
		this.setOptions(options)
	}
	
});