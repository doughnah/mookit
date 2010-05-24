/*
---

script: AjaxForm.js

description: Turns a standard form into an ajax form, allows for external validation

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [AjaxForm]

...
*/

var AjaxForm = new Class({
							  
	getOptions: function(){
		return {
			onStart: this.start,
			onComplete: this.complete,
			msgBox: false,
			validate: false
		};
	},

	initialize: function(form, options){
		this.setOptions(this.getOptions(), options);
		
		this.form = $(form);
		
		if(!this.options.msgBox){
			this.options.msgBox = new Element('div').setProperties({id: 'msgBox'});
			//this.popup = new InlinePopup({content: this.options.msgBox});
			this.usePopup = true;
		}else{
			this.options.msgBox = $(this.options.msgBox);
			this.boxFx = new Fx.Style(this.options.msgBox, 'opacity', {duration:300});
			this.boxFx.set(0);
		}
		
		if(!this.options.validate){
			this.form.addEvent('submit', function(e){
				new Event(e).stop();
				this.submit();
			}.bind(this));
		}
	},
	
	submit: function(){
		this.options.onStart(this);
		this.form.send({
			onComplete: this.options.onComplete.bind(this),
			evalScripts: true
		});
	},
	
	start: function(obj){
		obj.options.msgBox.addClass('processing');
		if(obj.usePopup){
			obj.popup = new InlinePopup({fadeDuration:300, content: obj.options.msgBox});
			obj.popup.show();	
		}else{
			obj.boxFx.start(1);
		}
	},
	
	complete: function(data){
		if(this.usePopup){
			this.popup.hide();
			this.showResult.delay(300, this, data);
		}else{
			this.boxFx.start(0);
			this.showResult.delay(300, this, data);
		}
	},
	
	showResult: function(data){
		this.options.msgBox.removeClass('processing');
		this.options.msgBox.setHTML(data);
		var closeBox = new Element('div').setProperties({id:'closeBox'}).setText('CLOSE').injectInside(this.options.msgBox);
		closeBox.addEvent('click', function(e){
			new Event(e).stop();
			if(this.usePopup){
				this.popup.hide();
			}else{
				this.boxFx.start(0);
			}
		}.bind(this));
		
		if(this.usePopup){
			this.popup.setContent(this.options.msgBox);
			this.popup.show();
		}else{
			this.boxFx.start(1);
		}
	}
	

});

AjaxForm.implement(new Events);
AjaxForm.implement(new Options);

/*************************************************************/
