
/*
---

script: DatePicker.js

description: An picker interface for the calendar

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4
- /Calendar

provides: [DatePicker]

example:
	
	
demo:
	
	
...
*/

var DatePicker = new Class({
	
	Extends: Calendar,
	
	options: {
		'zindex': 1000,
		hideInput: false
		//onBlur: $empty
	},
	
	initialize: function(options) {
		
		this.parent(options);
		
		this.hidden = true;
		
		if (this.input) {
            //create icon...
            this.icon = new Element('span', {
                'class': this.options.classname + 'Icon',
                'id': this.ref,
                'html': '&nbsp;'
            }).inject(this.input, 'after');
            this.icon.addEvent('click', this.toggle.bind(this, false));
            this.input.set('readOnly', true);
            this.input.addEvents({
            	'focus': this.show.bind(this, false)
        	});
            
            var coords = this.input.getCoordinates(this.input.getParent());
            
            this.container.setStyles({
            	'display': 'none',
            	'z-index': this.options.zindex,
            	'position': 'absolute',
            	'top': coords.top+coords.height,
            	'left': coords.left
            });
        }
		
        document.addEvent('click', this.blur.bind(this));
	},
	
	toggle: function(date){
		//console.log('toggle');
		if(this.hidden){
			this.show(date);
		}else{
			this.hide();
		}
	},
	
	show: function(date) {
        this.parent(date);
		//console.log('show');
        if (this.input) {
            this.container.setStyle('display', 'block');
            this.hidden = false;
        }

    },

    hide: function() {
    	this.parent();
    	//console.log('hide');
        if (this.input) {
            this.container.setStyle('display', 'none');
            this.hidden = true;
        }
    },
    
    blur: function(e){
    	e = new Event(e);
    	
    	var areas = [
    				this.container.getCoordinates(),
    				this.input.getCoordinates(),
    				this.icon.getCoordinates()
    				];
    				
        var doHide = true;
        
        areas.each(function(el){
        	if (e.page.x > el.left && e.page.x < el.right && e.page.y > el.top && e.page.y < el.bottom) {
            	doHide = false;
        	}
        });

        if (doHide) {
            this.hide();
        }
    }
	
});
