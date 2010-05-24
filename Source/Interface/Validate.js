/*
---

script: Validate.js

description: A form extension that provides validation

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4
- /Native/Date.Extras.js

provides: [Validate]

...
*/

var Validate = new Class({
	
	getOptions: function(){
		return {
			validateOnBlur: true,
			errorClass: 'error',
			errorMsgClass: 'errorMessage',
			dateFormat: 'dd/MM/yy',
			_onFail: $empty,
			_onSuccess: false,
			showErrorsInline: true,
			label: 'Please wait...'
		};
	},

	initialize: function(form, options){
		this.setOptions(this.getOptions(), options);
		
		this.form = $(form);
		this.elements = this.form.getElements('.required');
		
		this.list = [];
		
		this.elements.each(function(el,i){
			if(this.options.validateOnBlur){
				el.addEvent('blur', this.validate.bind(this, el));
			}
		}.bind(this));
		
		this.form.addEvent('submit', function(e){
			var event = new Event(e);
			var doSubmit = true;
			this.elements.each(function(el,i){
				if(! this.validate(el)){
					event.stop();
					doSubmit = false
					this.list.include(el);
				}else{
					this.list.erase(el);
				}
			}.bind(this));
			
			if(doSubmit){
				if(this.options._onSuccess){
					event.stop();
					this.options._onSuccess(this.form);
				}else{
					this.form.getElement('input[type=submit]').setProperty('value',this.options.label);
				}
			}else{
				this.options._onFail(this.getList());
			}
			
			return false;
			
		}.bind(this));
		
	},
	
	getList: function(){
		var list = new Element('ul');
		this.list.each(function(el,i){
			if(el.title != ''){
			var li = new Element('li').inject(list);
			new Element('label').set({
				'for': el.id,
				'text': el.title
			}).inject(li);
			}
		});
		return list;
	},
	
	validate: function(el){
		var valid = true;
		this.clearMsg(el);
		
		switch(el.type){
			case 'text':
			case 'textarea':
			case 'select-one':
				if(el.value != ''){
					if(el.hasClass('email')){
						var regEmail = /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/;
						if(el.value.toUpperCase().match(regEmail)){
							valid = true;
						}else{
							valid = false;
							this.setMsg(el, 'Please enter a valid email address');
						}
					}
					
					if(el.hasClass('number')){
						var regNum = /[-+]?[0-9]*\.?[0-9]+/;
						if(el.value.match(regNum)){
							valid = true;
						}else{
							valid = false;
							this.setMsg(el, 'Please enter a valid number');
						}
					}
					
					if(el.hasClass('postcode')){
						var regPC = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/
						if(el.value.match(regPC)){
							valid = true;
						}else{
							valid = false;
							this.setMsg(el, 'Please enter a valid postcode');
						}
					}
					
					if(el.hasClass('date')){
						var d = Date.parseExact(el.value, this.options.dateFormat);
						if(d != null){
							valid = true;
						}else{
							valid = false;
							this.setMsg(el, 'Please enter a valid date in the format: '+this.options.dateFormat.toLowerCase());
						}
					}
					
				}else{
					valid = false;
					this.setMsg(el);
				}
				break;
				
			case 'checkbox':
				if(!el.checked){
					valid = false;
					this.setMsg(el);
				}else{
					valid = true;
				}
				break;
				
			case 'radio':
				var rad = $A(this.form[el.name]);
				var ok = false;
				rad.each(function(e,i){
					if(e.checked){
						ok = true;
					}
				});
				if(!ok){
					valid = false;
					this.setMsg(rad.getLast(), 'Please select an option');
				}else{
					valid = true;
					this.clearMsg(rad.getLast());
				}
				break;
				
		}
		return valid;
	},
	
	setMsg: function(el, msg){
		if(msg == undefined){
			msg = el.title;
		}
		if(this.options.showErrorsInline){
			if(el.error == undefined){
				el.error = new Element('span').addClass(this.options.errorMsgClass).set('text', msg).inject(el, 'after');
			}else{
				el.error.set('text', msg);
			}
			el.addClass(this.options.errorClass);
		}
	},
	
	clearMsg: function(el){
		el.removeClass(this.options.errorClass);
		if(el.error != undefined){
			el.error.destroy();
			el.error = undefined;
		}
	}
	
});

Validate.implement(new Options);
Validate.implement(new Events);


/*************************************************************/

