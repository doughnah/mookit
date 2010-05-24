/*
---

script: Dropdowns.js

description: A mootools enhanced SuckerFish menu.

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [Dropdowns]

...
*/
var Dropdowns = new Class({
	
	Implements: [Options,Events],
	
	getOptions: function(){
		return {
			fade: true,
			slide: true,
			delay: 500,
			duration: 300,
			dropshadow: false
		};
	},
	
	initialize: function(el, options){
		this.setOptions(this.getOptions(), options);
		
		this.nav = $(el);
		
		this.nav.getElements('li').each(function(el){
			var ul = el.getElement('ul');
			var a = el.getElement('a');
			if(ul){
				var coords = ul.getCoordinates();
				var fx = {};
				
				var margins = {};
				margins.top = ul.getStyle('margin-top');
				margins.left = ul.getStyle('margin-left');
				
				ul.setStyles({
					'left': 'auto',
					'margin': 0
				});
				
				if(this.options.dropshadow){
					ul.shadowSpace = 8;
				}else{
					ul.shadowSpace = 0;
				}
				
				var container = new Element('div', {
					'class': 'ddContainer',
					'styles': {
						'overflow': 'hidden',
						'position': 'absolute',
						'width': coords.width+ul.shadowSpace,
						'height': coords.height+ul.shadowSpace,
						'z-index': ul.getStyle('z-index')
					}
				}).wraps(ul);
				
				if (Browser.Engine.trident) {
	                ul.iframe = new iFrame({container:ul.getParent()});
	                ul.iframe.frame.setStyle('zIndex', ul.getStyle('z-index'));
	                ul.iframe.frame.setStyle('width', coords.width+ul.shadowSpace);
	                ul.iframe.frame.setStyle('height', coords.height+ul.shadowSpace);
	                ul.iframe.frame.setStyle('display', 'block');
		        }
				
				if(this.options.dropshadow){
					var shadow = this.createDropshadow(container);
					if(this.options.fade){
						fx.shadow = new Fx.Tween(shadow, {
							duration: this.options.duration,
							link: 'cancel'
						}).set('opacity', 0);
					}
				}
				fx.fade = new Fx.Tween(ul, {
					duration: this.options.duration,
					link: 'cancel',
					onComplete:function(){
						if(ul.hide){
							ul.setStyle('display', 'none');
						}
					}
				}).set('opacity', 0);
				fx.slide = new Fx.Tween(container, {
					duration: this.options.duration,
					link: 'cancel',
					onComplete:function(){
						if(!ul.hide){
							container.setStyle('overflow', 'visible');
						}
					}
				});
				ul.slide = 'height';
				//if(this.options.slide){
					var pli = el.getParent('li');
					if(pli){
						fx.slide.set('width', 0);
						var m = pli.getStyle('height').toInt();
						container.setStyles({
							'margin-top': margins.top,
							'left': margins.left
						});
						ul.slide = 'width';
					}else{
						fx.slide.set('height', 0);
					}
				//}
				ul.fx = fx;
				a.addClass('arrow').addEvents({
					mouseover: function(e){
						$clear(el.timer);
						ul.setStyles({'display': 'block'});
						this.clearSelected(el);
						el.addClass('selected');
						a.addClass('selected');
						//container.setStyle('overflow', 'visible');
						this.show(ul);
					}.bind(this),
					mouseout: function(){
						a.removeClass('selected');
						el.removeClass('selected');
						/*ul.setStyle('left', 'auto');
						el.timer = (function(){
							this.hide(ul);
						}.bind(this)).delay(this.options.delay);*/
					}.bind(this),
					focus: function(){
						this.fireEvent('mouseover');
					},
					blur: function(){
						//el.removeClass('selected');
						//el.fireEvent('mouseout');
						//(function(){console.log(this.hasClass('selected'));}.bind(this)).delay(100);
					}
				});
				el.addEvents({
					mouseover: function(){
						$clear(el.timer);
					}.bind(this),
					mouseout: function(){
						a.removeClass('selected');
						el.removeClass('selected');
						ul.setStyle('left', 'auto');
						el.timer = (function(){
							this.hide(ul);
						}.bind(this)).delay(this.options.delay);
					}.bind(this)
				});
			}else{
				a.addEvents({
					mouseover: function(e){
						$clear(el.timer);
						this.clearSelected(el);
						var ul = el.getParent('ul');
						var li = ul.getParent('li');
						if(li){
							li.getElement('a').addClass('selected');
							li.addClass('selected');
						}
						a.addClass('selected');
						el.addClass('selected');
					}.bind(this),
					mouseout: function(){
						var ul = el.getParent('ul');
						var li = ul.getParent('li');
						if(li){
							li.getElement('a').removeClass('selected');
							li.removeClass('selected');
						}
						a.removeClass('selected');
						el.removeClass('selected');
						//ul.setStyle('left', 'auto');
						/*el.timer = (function(){
							this.hide(ul);
						}.bind(this)).delay(this.options.delay);*/
					}.bind(this),
					focus: function(){
						this.fireEvent('mouseover');
					},
					blur: function(){
						this.fireEvent('mouseout');
					}
				});
			}
		}, this);
	},
	
	show: function(ul){
		
		ul.hide = false;
		var coords = ul.getCoordinates();
		var val
		if(ul.slide == 'height'){
			val = coords.height+ul.shadowSpace;
		}else{
			val = coords.width+ul.shadowSpace;
		}
		
		if(!this.options.slide){
			ul.fx.slide.set(ul.slide,val);
		}
		ul.fx.slide.start(ul.slide,val);
		
		if(!this.options.fade){
			ul.fx.fade.set('opacity',1);
		}
		ul.fx.fade.start('opacity',1);
		
		if(ul.fx.shadow){
			if(!this.options.fade){
				ul.fx.shadow.set('opacity',1);
			}
			ul.fx.shadow.start('opacity',1);
		}
	},
	
	hide: function(ul){
		ul.hide = true;
		ul.getParent().setStyle('overflow', 'hidden');
		
		if(this.options.slide){
			ul.fx.slide.start(ul.slide,0);
		}
		
		if(this.options.fade){
			ul.fx.fade.start('opacity',0);
		}
		
		if(ul.fx.shadow){
			if(this.options.fade){
				ul.fx.shadow.start('opacity',0);
			}
		}
	},
	
	clearSelected: function(element){
		element.getParent().getChildren().each(function(el){
			el.getElement('a').removeClass('selected');
			el.removeClass('selected');
			var ul = el.getElement('ul');
			if(ul){
				$clear(el.timer);
				this.hide(ul);
			}
		}, this);
	},
	
	createDropshadow: function(cont) {
		/*li.setStyles({
			'position': 'relative'
		});*/
		cont.getChildren().setStyle('z-index', 1);
		var shadow = new Element('div', {
			'class': 'ddShadow',
			'styles': {'height': cont.getElement('ul').getCoordinates().height, 'width': cont.getElement('ul').getCoordinates().width},
			'html': "<div class='ddShadow-upperRight'></div><div class='ddShadow-lowerLeft'></div><div class='ddShadow-shadow'></div>"
		}).inject(cont);//li.getElement('.ddContainer'));
		return shadow;
    }
});
