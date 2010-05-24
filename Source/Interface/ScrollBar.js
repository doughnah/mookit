/*
---

script: ScrollBar.js

description: An Drag extension that creates a custom scrollbar

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4/Drag
- core:1.2.4/Drag.Move
- /Slider

provides: [moduleLayout]

...
*/
var ScrollBar = new Class({
	
	Implements: [Options,Events],
	
	getOptions: function(){
		return {
			mode: 'vertical',
			buttons: true,
			bar: true,
			scrollSpeed: 30,
			ignoreMouse: false
		};
	},
	
	initialize: function(area, options){
		this.setOptions(this.getOptions(), options);
		
		this.area = $$(area)[0];
		
		this.container = new Element('div', {'class':'scrollBar'}).inject(this.area, 'after');
		if(this.options.bar){
			this.bar = new Element('div', {'class':'scrollArea'}).inject(this.container);
			this.handle = new Element('div', {'class':'scrollHandle', 'html':'<div class="top"></div><div class="bottom"></div>'}).inject(this.bar);
			
			this.setHandleSize();
		}
		
		if(this.options.buttons){
			this.upBtn = new Element('div', {'class':'upBtn'}).inject(this.container, 'top');
			this.downBtn = new Element('div', {'class':'downBtn'}).inject(this.container);
			
			this.downBtn.addEvents({
				'mousedown': function(e){
					this.timer = this.scroll.periodical(50, this, -1);
				}.bind(this),
				'mouseup': function(e){
					$clear(this.timer);
				}.bind(this)
			});
			this.upBtn.addEvents({
				'mousedown': function(e){
					this.timer = this.scroll.periodical(50, this, 1);
				}.bind(this),
				'mouseup': function(e){
					$clear(this.timer);
				}.bind(this)
			});
		}
		
		this.area.setStyles({
			'overflow': 'hidden',
			'margin-right': this.container.getStyle('width')
		});

		var vert = true;
		
		if(this.options.mode == 'horizontal'){
			vert = false;
			this.steps = this.area.getScrollSize().x - this.area.getSize().x;
		}else{
			this.steps = this.area.getScrollSize().y - this.area.getSize().y;
		}
		
		if(this.options.bar){
			this.slider = new Slider(this.bar, this.handle, {	
				steps: this.steps,
				mode: (this.options.mode),
				onChange: function(step){
					// Scrolls the content element in x or y direction.
					var x = (vert?0:step);
					var y = (vert?step:0);
					this.area.scrollTo(x,y);
				}.bind(this)
			}).set(0);
		}
		
		if( !(this.options.ignoreMouse) ){
			// Scroll the content element when the mousewheel is used within the 
			// content or the scrollbar element.
			$$(this.area, this.bar).addEvent('mousewheel', function(e){	
				e = new Event(e).stop();
				var step = this.slider.step - e.wheel * 30;
				this.slider.set(step);					
			}.bind(this));
		}
		// Stops the handle dragging process when the mouse leaves the document body.
		if(this.options.bar){
			$(document.body).addEvent('mouseleave',function(){this.slider.drag.stop()}.bind(this));
		}
	},
	
	setHandleSize: function(){
		var window = this.area.getSize().y;
		var total = this.area.getScrollSize().y;
		var percent = Math.ceil((window/total)*100);
		//console.log(window);
		//console.log(total);
		//console.log(percent+'%');
		var h = Math.ceil((window/100)*percent);
		//console.log(h);
		this.handle.setStyle('height',  percent+'%');
		//console.log('----------------------------');
	},
	
	scroll: function(dir){
		var step = this.slider.step - dir * this.options.scrollSpeed;
		this.slider.set(step);
	}
});


/****************************************************************************/