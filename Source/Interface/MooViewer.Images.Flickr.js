/*
---

script: MooViewer.Images.Flickr.js

description: An extension to MooViewer for dymanic loading of flickr images

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4/*
- more:1.2.4/Assets
- more:1.2.4/Request.JSONP
- /MooViewer
- /MooViewer.Images

provides: [MooViewer.Images.Flickr]

...
*/

MooViewer.Images.Flickr = new Class({
	
	Extends: MooViewer.Images,
	
	//Implements: [Options, Events],
	
	options: {
		userId: null,
		groupId: null,
		userIds: null,
		tags: null,
		tagmode: 'all', //all/any
		format: 'json',
		lang: 'en-us',
		size: null, //flickr sizes: default(500 on longest side), s(75x75), t(100 on longest side), m(240 on longest side), b(1024 on longest side)
		url: null,
		maxNav: 9,
		callback: null
	},
	
	initialize: function(container, options){
		this.setOptions(options);
		
		this.viewer = $(container);
		this.viewerWidth = this.viewer.getSize().x;
		
		this.body = new Element('div', {'class':'body'}).inject(this.viewer);
		this.itemsContainer = new Element('ul', {'class':'items'}).inject(this.body);
		
		this.items = [];
		this.titles = [];		
		this.descriptions = [];
		this.navItems = [];
		
		this.createHeader();
		this.createFooter();
		if(this.options.nav){
			this.createNav();
		}
		
		var url = 'http://api.flickr.com/services/feeds/';
			url += this.options.groupId ? 'groups_pool.gne?' : 'photos_public.gne?';
			
		if(this.options.userId){
			url += 'id='+this.options.userId;
		}
		if(this.options.groupId){
			url += 'groupId='+this.options.groupId;
		}
		if(this.options.userIds){
			url += 'userIds='+this.options.userIds;
		}
		if(this.options.tags){
			url += '&tags='+this.options.tags;
		}
		url += '&tagmode='+this.options.tagmode;
		
		if(this.options.url){
			url = this.options.url;
		}
		
		url += '&format='+this.options.format;
		url += '&lang='+this.options.lang;
		url += '&jsoncallback=';
		
		if(this.options.callback){
			url += this.options.callback;
		}else{
			url += 'MooViewer.Images.Flickr.Feed';
			MooViewer.Images.Flickr.CallBacks.push(this.formatJSON.bind(this));
		}
		
		this.scriptTag = new Asset.javascript(url);

	},
	
	createItems: function(data){
		this.parent(data);
		
		if(this.options.maxNav > 0){
			if(this.options.maxNav < this.items.length){
				var width = this.navItems[0].getElement('a').getSize().x;
				this.nav.setStyle('width', (width*this.options.maxNav));
			}
		}
	},
	
	goToItem: function(index){
		this.parent(index);
		
		 if(this.options.nav && this.options.maxNav > 0 && this.options.maxNav < this.items.length){
	    	
	    	var num = Math.floor(this.options.maxNav/2);
	    	
	    	var navDuration = Math.min(Math.abs(index-num) * this.options.duration*1000, 750);
	    	
	    	this.navUL.set('tween', {duration: navDuration, transition: this.parent.transition});
	    	var width = this.navItems[0].getElement('a').getSize().x;
	    	
	    	var left = 0;
	    	if(index >= num){
	    		left = 0-(index-num)*width;
	    	}
	    	if(index >= this.navItems.length-num){
	    		left = 0-(this.navItems.length-this.options.maxNav)*width;
	    	}
	    	
	    	this.navUL.tween('left', left);
	    }
		
	},
	
	formatJSON: function(data){
		var items = [];
		data.items.each(function(el){
			items.push({
				title: el.title,
				desc: data.title,
				image: el.media.m.replace('_m', ''),
				url: el.link
			});
		});
		this.createItems({items:items});
	}
	
});


MooViewer.Images.Flickr.Feed = function(data){
	MooViewer.Images.Flickr.CallBacks[MooViewer.Images.Flickr.FeedData.length](data);
	MooViewer.Images.Flickr.FeedData.push(data);
}

MooViewer.Images.Flickr.FeedData = [];
MooViewer.Images.Flickr.CallBacks = [];