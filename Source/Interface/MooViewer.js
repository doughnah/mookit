/*
---

script: MooViewer.js

description: A slideshow type plugin for content

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4/*

provides: [MooViewer]

...
*/

var MooViewer = new Class({
	
	Implements: [Options, Events],
	
	options: {
		/*
		onEvent: $empty(),
		*/
		autoPlay: true,
		title: true,
		desc: true,
		nav: true,
		buttons: true,
		fadeText: true,
		transition: 'sine:out', //fade
		duration: .25,
		wait: 3,
		backFade: false,
		index: false //is first slide an index page? - if yes then gets remove.
	},
	
	initialize: function(container, options){
		this.setOptions(options);
		
		this.viewer = $(container);
		this.viewerWidth = this.viewer.getSize().x;
		
		this.itemsContainer = this.viewer.getElement('ul.items');
		this.items = this.viewer.getElements('li');
		this.descriptions = this.viewer.getElements('div.desc').dispose();
		this.titles = this.viewer.getElements('h2').dispose();
		
		if(this.options.index){
			this.items[0].destroy();
		}
		
		this.body = new Element('div', {'class':'body'}).wraps(this.itemsContainer);
		
		this.fading = false;
		
		if(this.options.transition == 'fade'){
			this.setFadeStyles();
		}else{
			this.itemsContainer.setStyle('width', this.viewerWidth*this.items.length);
		}
		
		this.navItems = [];
		
		this.createHeader();
		this.createFooter();
		if(this.options.nav){
			this.createNav();
			this.items.each(function(el,i){
				this.addNavItem();
			}, this);
		}
		
		this.goToItem(0);
		
		this.playing = false;
		
		if(this.options.autoPlay){
			this.play();
		}
	},
	
	setFadeStyles: function(){
		this.items.each(function(el){
			el.setStyles({
				position: 'absolute',
				top: 0,
				left: 0
			}).fade('hide');
		});
	},
	
	createHeader: function(){
		this.header = new Element('div', {'class':'header'}).inject(this.viewer, 'top');
		
		if(this.options.buttons){
			new Element('ul', {
	        	html: '<li class="next"><a href="javascript:;">Next</a></li><li class="previous"><a href="javascript:;">Previous</a></li>'
	        }).inject(this.header);
	        
	        this.header.getElement('.next').addEvent('click', function(e){this.resetTimer();this.next();}.bind(this));
	        this.header.getElement('.previous').addEvent('click', function(e){this.resetTimer();this.previous();}.bind(this));
        }
        
        if(this.options.title){
        	this.title = new Element('h2').inject(this.header);
        }
	},
	
	createFooter: function(){
		this.footer = new Element('div', {'class':'footer'}).inject(this.viewer);
		
		if(this.options.desc){
			this.desc = new Element('div', {'class':'desc'}).inject(this.footer);
		}
	},
	
	createNav: function(){
		this.nav = new Element('div', {'class': 'nav'}).inject(this.footer, 'top');
		this.navUL = new Element('ul').inject(this.nav);
	},
	
	addNavItem: function(){
		var self = this;
		var id = this.navItems.length;
		var li = new Element('li', {
			html:'<a href="javascript:;" title="'+this.titles[id].get('text')+'">'+this.titles[id].get('text')+'</a>',
			events: {
				'click': function(e){
					self.resetTimer();
					self.goToItem(this.retrieve('id'));
				}
			}
		}).store('id', id).inject(this.navUL);
		
		this.navItems.push(li);

		var width = this.navItems[0].getElement('a').getSize().x;
		this.navUL.setStyle('width', (width*this.items.length));
	},
	
	next: function(){
		//console.log('next');
		if(!this.fading){
			var index = this.selected+1;
			
			if(index >= this.items.length){
				index = 0;
			}
			
			this.goToItem(index);
		}
	},
	
	previous: function(){
		//console.log('previous');
		if(!this.fading){
			var index = this.selected-1;
			
			if(index < 0){
				index = this.items.length-1;
			}
			
			this.goToItem(index);
		}
	},
	
	goTo: function(index){
		if(!this.fading){
			if(index >= this.items.length){
				index = this.items.length-1;
			}
			if(index < 0){
				index = 0;
			}
			
			this.goToItem(index);
		}
	},
	
	play: function(){
		this.playing = true;
		this.timer = this.next.periodical(this.options.wait*1000, this);
	},
	
	pause: function(){
		$clear(this.timer);
		this.playing = false;
	},
	
	resetTimer: function(){
		if(this.playing){
			$clear(this.timer);
			this.play();
		}
	},
	
	goToItem: function(index){
		//console.log('goto: '+index);
		
		var duration = Math.min(Math.abs(index - this.selected) * this.options.duration*1000, 750);
		
		var fade = false;
		if(this.options.transition == 'fade') fade = true;
		
		var transition = fade ? 'linear' : this.options.transition;
		
		if(fade){
			//this.items[index].fade('hide');
			this.fading = true;
			this.items[index].inject(this.itemsContainer, 'bottom');
			this.items[index].set('tween', {
				duration: this.options.duration*1000, 
				onComplete: function(){
					//this.items[this.selected].getPrevious().fade('hide');
					this.items.each(function(el){el.fade('hide');});
					this.items[this.selected].fade('show');
					this.fading = false;
				}.bind(this)
			});
			this.items[index].fade('in');
			if(this.selected && this.options.backFade){
				this.items[this.selected].fade('out');
			}
		}else{
	    	this.itemsContainer.set('tween',  {duration: duration, transition: transition});
	    	this.itemsContainer.tween('left', index * -(this.viewerWidth));
	    }
	    
	    
	    this.selected = index;
	    
	    if(this.options.nav){
	    	this.navItems.each(function(el){el.removeClass('selected');});
	    	this.navItems[index].addClass('selected');
	    }
	    
	    if(this.options.title){
	    	if(this.options.fadeText){
	    		this.title.fade('hide').fade('in');
	    	}
	    	this.title.set('html', this.options.title == true ? this.titles[index].get('html') : this.options.title);
	    }
	    if(this.options.desc){
	    	if(this.options.fadeText){
	    		this.desc.fade('hide').fade('in');
	    	}
			this.desc.set('html', this.descriptions[index].get('html'));
		}
		
	}
	
});