/*
---

script: HistoryManager.js

description: A pluin to manage history states

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [HistoryManager]

Usage: 
	1. Register the item.
	ezHistory.register(key, value, function);
		key: an identifing key, it will show up in the hash.
		value: a default value, so when going back through the history to the initial page, this value will be passed to the function.
		function: the function that will be called when the hash changes or the initial url contains the hash (bookmarking, send to friend link).
		
	2. Set the value.
	ezHistory.set(key, value);
	When doing an ajax request or some other navigation thing?, record the value, so it can be sent to the registered function when going back to that state.
		key: same as the one used when registering the function.
		value: the value to itdentify the change in state.

...
*/

var HistoryManager = new Class({

    Implements: Options,

    getOptions: function() {
        return {
            interval: 500
        };
    },

    initialize: function(options) {
        this.setOptions(this.getOptions(), options);

        this.functions = new Hash();
        this.currentState = '';
        this.timer = this.checkLocation.periodical(this.options.interval, this);
        this.isLoaded = false;

        window.addEvent('load', this.onload.bind(this))
    },

    onload: function() {
        this.frame = new IFrame({
            src: 'blank.html',
			id: 'ezHistoryManager',
            frameborder: 0,
            styles: {
                width: 0,
                height: 0,
                border: 0
            }
        }).inject(document.body);

        this.isLoaded = true;
    },

    register: function(key, value, func) {
        this.functions.set(key, func);
        this.set(key, value);
    },

    unregister: function(key) {
        this.functions.erase(key);
    },

    set: function(key, value) {
        this.currentState = '';
        this.currentState = key + '=' + value;
        this.setLocation();
    },

    getLocation: function(load) {
        var obj = {};
        obj.frameUrl = this.frame.contentWindow.document.location.href;
        obj.hash = new Hash(); ;
        var h = obj.frameUrl.indexOf('?');
        if (h > 0) {
            obj.hash = obj.frameUrl.substr(h + 1);
            obj.frameUrl = obj.frameUrl.substr(0, h);
        }
        return obj;
    },

    setLocation: function() {
        if (this.isLoaded) {
            var loc = this.getLocation();
            this.frame.contentWindow.document.location.href = loc.frameUrl + '?' + escape(this.currentState);
        }
    },

    checkLocation: function() {
        if (this.isLoaded) {
            var hash1 = unescape(this.getLocation().hash);
            if (hash1 != this.currentState && hash1.contains('=')) {
                this.currentState = hash1;
                this.changed(hash1);
            }
        }
    },

    changed: function(hash) {
        var pairs = $A(hash.split('&'));
        pairs.each(function(el) {
            var val = el.split('=');
            this.functions.get(val[0]).attempt(val[1]);
        }, this);
    }

});

