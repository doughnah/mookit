/*
---

script: BackgroundSlider.js

description: An extension that slides a layer to a given elements position and dimensions.

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4/Fx.Morph

provides: [BackgroundSlider]

...
*/

var BackgroundSlider = new Class({

	getOptions: function(){
		return {
			duration: 300,
			wait: 500,
			transition: Fx.Transitions.Sine.easeInOut,
			className: null,
			fixHeight: null,
			fixWidth: null,
			start: 1,
			id: null,
			padding: {top:0,right:0,bottom:0,left:0},
			_onClick: $empty,
			mouseOver: true
		};
	},

	initialize: function(elements, options){
		this.setOptions(this.getOptions(), options);
		
		this.elements = $$(elements);
		this.timer = 0;
		
		if(this.options.id){
			this.bg = $(this.options.id);
		}else{
			this.bg = new Element('div').setProperty('id','BgSlider_'+new Date().getTime()).injectInside(document.body);
			if(this.options.className){
				this.bg.addClass(this.options.className);	
			}
		}
		
		this.effects = new Fx.Morph(this.bg, {duration: this.options.duration, transition: this.options.transition});
		
		this.elements.each(function(el,i){
			if(this.options.mouseOver){
				el.addEvent('mouseover', this.move.bind(this,el));
				el.addEvent('mouseout', this.delayReset.bind(this));
			}
			el.addEvent('click', this.setStart.bind(this, el));
		},this);
		
		this.set(this.elements[this.options.start-1]);
		
		this.mouseOver = false;
		this.bg.addEvent('mouseover', function(){this.mouseOver = true;}.bind(this));
		this.bg.addEvent('mouseout', function(){this.mouseOver = false; this.reset();}.bind(this));
		this.bg.addEvent('click', this.setStart.bind(this,false));
		
		window.addEvent('resize',function(e){
			this.move(this.startElement);
		}.bind(this));
		
	},
	
	setStart: function(el){
		if(el){
			this.startElement = el;
		}else{
			this.startElement = this.currentElement;
		}
		this.options._onClick(this.startElement);
	},
	
	set: function(el){
		this.setStart(el);
		var pos = el.getCoordinates();
		
		if(this.options.id){
			this.options.padding.top = this.bg.getStyle('paddingTop').toInt();
			this.options.padding.right = this.bg.getStyle('paddingRight').toInt();
			this.options.padding.bottom = this.bg.getStyle('paddingBottom').toInt();
			this.options.padding.left = this.bg.getStyle('paddingLeft').toInt();
			this.bg.setStyle('padding','0px');
		}
		
		var obj = {};
		obj.position = 'absolute';
		obj.top = (pos.top-this.options.padding.top-1)+'px';
		obj.left = (pos.left-this.options.padding.left-1)+'px';
		if(!this.options.fixHeight){obj.height = (pos.height+this.options.padding.top+this.options.padding.bottom)+'px'};
		if(!this.options.fixWidth){obj.width = (pos.width+this.options.padding.left+this.options.padding.right)+'px'};
		
		this.bg.setStyles(obj);
	},
	
	delayReset: function(){
		this.reset.delay(500, this);
	},
	
	reset: function(){
		$clear(this.timer);
		if(!this.mouseOver){
			if(this.options.wait){
				this.timer = this.move.delay(this.options.wait, this, this.startElement);
			}
		}
	},
	
	move: function(el){
		$clear(this.timer);
		var pos = el.getCoordinates();
		this.effects.cancel();
		this.currentElement = el;
		
		var obj = {};
		obj.top = pos.top-this.options.padding.top-1;
		obj.left = pos.left-this.options.padding.left-1;
		if(!this.options.fixHeight){obj.height = pos.height+this.options.padding.top+this.options.padding.bottom};
		if(!this.options.fixWidth){obj.width = pos.width+this.options.padding.left+this.options.padding.right};
		
		this.effects.start(obj);
		
	}

});
BackgroundSlider.implement(new Options);
BackgroundSlider.implement(new Events);

/*************************************************************/
