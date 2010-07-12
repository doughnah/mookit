/*
---

script: MooViewer.Images.js

description: An extension to MooViewer for dymanic loading of images

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4/*
- more:1.2.4/Assets
- /MooViewer

provides: [MooViewer.Images]

...
*/

MooViewer.Images = new Class({
	
	Extends: MooViewer,
	
	//Implements: [Options, Events],
	
	options: {
		
	},
	
	initialize: function(container, data, options){
		this.setOptions(options);
		
		//this.parent();
		
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
		
		
		if($type(data) == 'string'){
			//do request
			new Request.JSON({
				url:data, 
				onSuccess:function(json, text){
					this.createItems(JSON.decode(text));
				}.bind(this)
			}).get();
			
		}else if($type(data) == 'object'){
			this.createItems(data);
		}
	},
	
	createItems: function(data){
		data.items.each(function(el,i){
			this.addItem(el);
		}, this);
		
		
		if(this.options.transition == 'fade'){
			this.setFadeStyles();
		}else{
			this.itemsContainer.setStyle('width', this.viewerWidth*data.items.length);
		}
		
		
		this.goToItem(0);
		
		this.playing = false;
		
		if(this.options.autoPlay){
			this.play();
		}
	},
	
	addItem: function(obj){
		var li = new Element('li').inject(this.itemsContainer);
		var img = new Asset.image(obj.image, {
				onload:function(image){
					//console.log(image.height);
					//console.log(this.body.getHeight());
					image.setStyle('top', (this.body.getHeight()-image.height)/2);
				}.bind(this)
			}).inject(li);
		if(obj.url){
			new Element('a', {'href':obj.url}).wraps(img);
		}
		
		this.items.push(li);
		this.titles.push(new Element('h2', {'html':obj.title}));
		this.descriptions.push(new Element('div', {'html':'<p>'+obj.desc+'</p>', 'class':'desc'}));
		
		if(this.options.nav){
			this.addNavItem();
		}
	}
	
});