
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

...
*/

var DatePicker = new Class({
	
	Extends: Calendar,
	
	initialize: function(options) {
		this.parent(options);
		
		if (this.input) {
        	this.input.set('type', 'text');
            //create icon...
            this.icon = new Element('span', {
                'class': this.options.classname + 'Icon',
                'id': this.ref,
                'html': '&nbsp;'
            }).inject(this.input, 'after');
            this.icon.addEvent('click', this.toggle.bind(this, false));
            this.input.set('readOnly', true);
            this.input.addEvent('focus', this.toggle.bind(this, false));
            this.container.setStyle('display', 'none').inject(document.body);
        }
	},
	
	show: function(date) {
        this.parent(date);

        if (this.input) {
            layers.show(this.container, {
                control: this.ref,
                fade: true,
                position: this.options.position,
                dropshadow: true,
                closeOnBlur: true,
                OnHide: function() { this.showing = false } .bind(this)
            });
        }

    },

    hide: function() {
    	this.parent();
    	
        if (this.input) {
            layers.hide(this.container);
        }
    }
	
});
