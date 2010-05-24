/*
---

script: Fx.Bezier.js

description: An Fx extension that give a bezier curve animation

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4/Fx

provides: [Fx.Bezier]

...
*/
Fx.Bezier = new Class({

	Extends: Fx.CSS,

	initialize: function(element, options){
		this.element = this.subject = $(element);
		
		if(!options.styles){
			this.styles = {x:'left', y:'top'};
		}else{
			this.styles = options.styles;
		}
		options.styles = null;
		
		this.parent(options);
	},

	set: function(now){
		if (typeof now == 'string') now = this.search(now);
		for (var p in now) this.render(this.element, p, now[p], this.options.unit);
		return this;
	},

	compute: function(from, to, delta, controls){
		var now = {};
		for (var p in from) {
			if(controls){
				if(p == this.styles.x){
					var t = 'x';
				}
				if(p == this.styles.y){
					var t = 'y';
				}
				var d = 1-delta;
				if(controls.length == 1){
					now[p] = from[p][0].value*(d*d) + controls[0][t]*(2*d*(1-d)) + to[p][0].value*((1-d)*(1-d));
				}
				if(controls.length == 2){
					now[p] = from[p][0].value*(d*d*d) + controls[0][t]*(3*d*d*(1-d)) + controls[1][t]*(3*d*(1-d)*(1-d)) + to[p][0].value*((1-d)*(1-d)*(1-d));
				}
				if(controls.length == 3){
					now[p] = from[p][0].value*(d*d*d*d) + controls[0][t]*(4*d*d*d*(1-d)) + controls[1][t]*(6*d*d*(1-d)*(1-d)) + controls[2][t]*(4*d*(1-d)*(1-d)*(1-d)) + to[p][0].value*((1-d)*(1-d)*(1-d)*(1-d));
				}
			}else{
				now[p] = this.parent(from[p], to[p], delta);
			}
		}
		return now;
	},
	
	step: function(){
		var time = $time();
		if (time < this.time + this.options.duration){
			var delta = this.options.transition((time - this.time) / this.options.duration);
			this.set(this.compute(this.from, this.to, delta, this.options.controls));
		} else {
			this.set(this.compute(this.from, this.to, 1));
			this.complete();
		}
	},

	start: function(properties){
		if (!this.check(arguments.callee, properties)) return this;
		if (typeof properties == 'string') properties = this.search(properties);
		var from = {}, to = {};
		for (var p in properties){
			var parsed = this.prepare(this.element, p, properties[p]);
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		return this.parent(from, to);
	}

});

Element.Properties.bezier = {

	set: function(options){
		var bezier = this.retrieve('bezier');
		if (bezier) bezier.cancel();
		return this.eliminate('bezier').store('bezier:options', $extend({link: 'cancel'}, options));
	},

	get: function(options){
		if (options || !this.retrieve('bezier')){
			if (options || !this.retrieve('bezier:options')) this.set('bezier', options);
			this.store('bezier', new Fx.Bezier(this, this.retrieve('bezier:options')));
		}
		return this.retrieve('bezier');
	}

};

Element.implement({

	bezier: function(props){
		this.get('bezier').start(props);
		return this;
	}

});
	
	