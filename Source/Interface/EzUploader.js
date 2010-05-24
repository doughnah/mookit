/*
---

script: EzUploader.js

description: A manager for EzUpload. 

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4
- /EzUpload

provides: [EzUploader]

...
*/
var EzUploader = new Class({
	
	Implements: [Events, Options],
	
	options: {
		url: null,
		path: '../FancyUpload2/Swiff.Uploader.swf'
	},
	
	initialize: function(options){
		this.setOptions(options);
		
		if(this.options.url == null){
			this.options.url = '../testbox/'+$(document.body).getElement('form').get('action');
		}
		
		this.inputs = $$('input[type=file]');
		
		this.inputs.each(function(el){
			//get id
			var id = el.get('id');
			//set onload option
			this.options.onload = function(){
				$(id).destroy();
				$(id+'_EzUpload').setStyle('display','block');
			}
			//get filetypes
			this.options.fileTypes = el.get('fileTypes');
			
			//set fieldname
			this.options.fieldName = id;
			
			new EzUpload($(id+'_EzUpload'), this.options);
			
		}, this);
	}
	
});
