/*
---

script: BgResizer.js

description: An extension that resizes background images.

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [BgResizer]

...
*/

var BgResizer = new Class({
	
	Implements: [Options,Events],
	
	getOptions: function(){
		return {
			
		};
	},
	
	initialize: function(elements, options){
		this.setOptions(this.getOptions(), options);
		this.elements = $$(elements);
		
		new textResizeDetector({
			_onChange: function(oldSize, newSize){
				var percent = ((newSize / oldSize) * 100).toInt();
				this.elements.each(function(el){
					var src = el.getStyle('backgroundImage');
						if(src.indexOf('?') > 0){
							end = src.indexOf('?');
						}else{
							end = src.length;
						}
						src = src.substring(0, end);
						src = src.replace('url(','');
						src = src.replace(')','');
						src = src.replace('"','');
						src = src.replace('"','');
						
					el.setStyle('backgroundImage', 'url('+src+'?p='+percent+')');
				});
				(function(){
					new Element('div', {
						'styles': {
							'position': 'absolute',
							'top': 0,
							'left': 0,
							'width': '10',
							'height': '10'
						},
						'html': ''
					}).inject(document.body).destroy();
				}).delay(250)
			}.bind(this)
		});
		
	}
});