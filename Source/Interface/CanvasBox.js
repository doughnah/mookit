
/*
---

script: CanvasBox.js

description: An interface for creating canvas based boxes

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [CanvasBox]

...
*/
var CanvasBox = new Class({
	
	Implements: [Options,Events],
	
	getOptions: function(){
		return {
			container: document.body,
			radius: 0,
			classname: 'ezCanvas',
			bg: '#FFFFFF',
			alpha: 100,
			shadowBlur: 8,
			shadowAlpha: 0.7,
			shadowType: 'glow', //null, glow, drop
			size: null //coordinates object - overrides container coordinates
		};
	},
	
	initialize: function(options){
		this.setOptions(this.getOptions(), options);
		
		this.canvas = new Canvas();
		this.ctx = this.canvas.getContext('2d');
		
		this.container = $(this.options.container);
		
		this.createBox();
		
		this.canvas.addClass(this.options.classname);
		this.canvas.inject(this.container);
	},
	
	dimensions: function(w, h){
		var coords = this.container.getCoordinates();
		if(this.options.size){
			coords = this.options.size;
		}
		var obj = {};
			obj.width = coords.width;
			obj.height = coords.height;
			obj.x = 0;
			obj.y = 0;
			
		if(this.options.shadowType == 'glow'){
			obj.fullWidth = obj.width;
			obj.fullHeight = obj.height;
			obj.width = obj.width - (this.options.shadowBlur * 2);
			obj.height = obj.height - (this.options.shadowBlur * 2);
			obj.x = this.options.shadowBlur;
			obj.y = this.options.shadowBlur;
		}
		if(this.options.shadowType == 'drop'){
			obj.fullWidth = obj.width;
			obj.fullHeight = obj.height;
			obj.width = obj.width - this.options.shadowBlur;
			obj.height = obj.height - this.options.shadowBlur;
		}
		
		return obj;
	},
	
	createShadow: function(obj){
		for(var i=0; i<this.options.shadowBlur; i++){
			if(this.options.shadowType == 'glow'){
				xpos = obj.x-((i+1)*1);
				ypos = obj.y-((i+1)*1);
				w = obj.width+((i+1)*2);
				h = obj.height+((i+1)*2);
				rad = this.options.radius+(i+1);
			}
			if(this.options.shadowType == 'drop'){
				xpos = obj.x+((i+1)*1);
				ypos = obj.y+((i+1)*1);
				w = obj.width;
				h = obj.height;
				rad = this.options.radius+(i+1);
			}
			alpha = this.options.shadowAlpha / this.options.shadowBlur;
			this.draw(xpos, ypos, w, h, rad, '0,0,0', alpha);
		}
	},
	
	createBox: function(){
		var dimens = this.dimensions();
		this.canvas.set({
			width: dimens.fullWidth,
			height: dimens.fullHeight
		});
		
		if(this.options.shadowType != 'none'){
			this.createShadow(dimens);
		}
		this.draw(dimens.x, dimens.y, dimens.width, dimens.height, this.options.radius, this.options.bg.toRGB(), 100);
		
	},
	
	draw: function(x, y, width, height, radius, rgb, alpha){
		this.ctx.fillStyle = 'rgba(' + rgb + ',' + alpha + ')';
		this.ctx.beginPath();
		this.ctx.moveTo(x, y + radius);
		this.ctx.lineTo(x, y + height - radius);
		this.ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
		this.ctx.lineTo(x + width - radius, y + height);
		this.ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
		this.ctx.lineTo(x + width, y + radius);
		this.ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		this.ctx.lineTo(x + radius, y);
		this.ctx.quadraticCurveTo(x, y, x, y + radius);
		this.ctx.fill();
	},
	
	clear: function(){
		var dim = this.canvas.getProperties('width', 'height');
		this.ctx.clearRect(0, 0, dim.width, dim.height);
	},
	
	resize: function(width, height){
		this.clear();
		this.createBox();
	}
});
