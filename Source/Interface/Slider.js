/*
Script: Slider.js
	Class for creating horizontal and vertical slider controls.
	version 1.2

License:
	MIT-style license.
*/

var Slider = new Class({

	Implements: [Events, Options],

	options: {/*
		onChange: $empty,
		onComplete: $empty,*/
		onTick: function(position, index){
			if(!index) index = 0;
			if(this.options.snap) position = this.toPosition(this.eSteps[index]);
			this.knobs[index].setStyle(this.property, position);
		},
		snap: false,
		offset: 0,
		range: false,
		wheel: false,
		steps: 100,
		mode: 'horizontal'
	},

	initialize: function(element, knobs, options){
		this.setOptions(options);
		this.element = $(element);
		this.knobs = $$(knobs);
		this.previousChange = this.previousEnd = this.step = -1;
		if(this.knobs.length == 1){
			this.element.addEvent('mousedown', this.clickedElement.bind(this));
			if (this.options.wheel) this.element.addEvent('mousewheel', this.scrolledElement.bindWithEvent(this));
		}
		
		var offset, limit = {}, modifiers = {'x': false, 'y': false};
		switch (this.options.mode){
			case 'vertical':
				this.axis = 'y';
				this.property = 'top';
				offset = 'offsetHeight';
				break;
			case 'horizontal':
				this.axis = 'x';
				this.property = 'left';
				offset = 'offsetWidth';
		}
		this.half = this.knobs[0][offset] / 2;
		this.full = this.element[offset] - this.knobs[0][offset] + (this.options.offset * 2);
		this.min = $chk(this.options.range[0]) ? this.options.range[0] : 0;
		this.max = $chk(this.options.range[1]) ? this.options.range[1] : this.options.steps;
		this.range = this.max - this.min;
		this.steps = this.options.steps || this.full;
		this.stepSize = Math.abs(this.range) / this.steps;
		this.stepWidth = this.stepSize * this.full / Math.abs(this.range) ;
		
		this.eSteps = [];
		
		this.knobs.setStyle('position', 'absolute').setStyle(this.property, - this.options.offset);
		modifiers[this.axis] = this.property;
		limit[this.axis] = [- this.options.offset, this.full - this.options.offset];
		
		this.drag = [];
		this.knobs.each(function(el,i){
			el.index = i;
			this.drag.push(new Drag(el, {
				snap: 0,
				limit: limit,
				modifiers: modifiers,
				onDrag: function(el){
					this.draggedKnob(el,i);
				}.bind(this),
				onStart: function(el){
					this.draggedKnob(el,i);
				}.bind(this),
				onComplete: function(el){
					this.draggedKnob(el,i);
					this.end(this.checkStep(this.eSteps[i], i));
				}.bind(this)
			}));
		}, this);
		
		if (this.options.snap) {
			this.drag.each(function(el,i){
				el.options.grid = Math.ceil(this.stepWidth);
				el.options.limit[this.axis][1] = this.full;
			}, this);
		}
	},

	set: function(step){
		if($type(step) == 'number'){
			step = [step];
		}
		step.each(function(el,i){
			if (!((this.range > 0) ^ (el < this.min))) el = this.min;
			if (!((this.range > 0) ^ (el > this.max))) el = this.max;
			
			this.eSteps[i] = Math.round(el);
			this.checkStep(this.eSteps[i], i);
			this.end(this.eSteps[i]);
			this.fireEvent('tick', [this.toPosition(this.eSteps[i]),i]);
		}, this);
		return this;
	},

	clickedElement: function(event){
		var dir = this.range < 0 ? -1 : 1;
		var position = event.page[this.axis] - this.element.getPosition()[this.axis] - this.half;
		position = position.limit(-this.options.offset, this.full -this.options.offset);
		
		this.eSteps[0] = Math.round(this.min + dir * this.toStep(position));
		this.checkStep(this.eSteps[0], 0);
		this.end(this.eSteps[0]);
		this.fireEvent('tick', position);
	},
	
	scrolledElement: function(event){
		var mode = (this.options.mode == 'horizontal') ? (event.wheel < 0) : (event.wheel > 0);
		this.set(mode ? this.eSteps[0] - this.stepSize : this.eSteps[0] + this.stepSize);
		event.stop();
	},

	draggedKnob: function(el, index){
		var dir = this.range < 0 ? -1 : 1;
		var position = this.drag[index].value.now[this.axis];
		position = position.limit(-this.options.offset, this.full -this.options.offset);
		this.eSteps[index] = Math.round(this.min + dir * this.toStep(position));
		this.checkStep(this.eSteps[index], index);
	},

	checkStep: function(step, index){
		if (this.previousChange != step){
			this.previousChange = step;
			this.fireEvent('change', [step, index]);
		}
	},

	end: function(step){
		if (this.previousEnd !== step){
			this.previousEnd = step;
			this.fireEvent('complete', step + '');
		}
	},

	toStep: function(position){
		var step = (position + this.options.offset) * this.stepSize / this.full * this.steps;
		return this.options.steps ? Math.round((position + this.options.offset) / this.full * this.steps)*this.stepSize : step;
	},

	toPosition: function(step){
		return (this.full * Math.abs(this.min - step)) / (this.steps * this.stepSize) - this.options.offset;
	}

});