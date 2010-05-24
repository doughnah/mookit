/*
---

script: Tree.js

description: A simple plugin that turns a nested UL list into a hide/show tree

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [Tree]

...
*/

var Tree = new Class({
							  
	getOptions: function(){
		return {
			clsOpened: 'opened',
			clsClosed: 'closed',
			trigger: 'span',
			open: null,
			_onClick: $lambda(false)
		};
	},

	initialize: function(tree, options){
		this.setOptions(this.getOptions(), options);
		
		this.tree = $(tree);
		this.elements = this.tree.getElements('ul').getParent();
		this.elements.each(function(el,i){
			el.getElement('ul').setStyle('display', 'none');
			el.addClass(this.options.clsClosed);
			el.getElement(this.options.trigger).addEvent('click',this.openClose.bind(this, el));
		}, this);
		
		//auto open
		if(this.options.open != null){
			this.toggle($(this.options.open));
		}
	},
	
	openClose: function(el){
		var ul = el.getElement('ul');
		var status = '';
		if(ul){
			if(ul.getStyle('display') == 'none'){
				ul.setStyle('display','');
				el.removeClass(this.options.clsClosed);
				el.addClass(this.options.clsOpened);
				status = 'open';
			}else{
				ul.setStyle('display','none');
				el.removeClass(this.options.clsOpened);
				el.addClass(this.options.clsClosed);
				status = 'closed';
			}
			this.options._onClick(el, status);
		}
	},
	
	toggle: function(id){
		var el = $(id);
		if(el != this.tree){
			if(el.get('tag') == 'li'){
				this.openClose(el);
			}
			this.toggle(el.getParent());
		}
	}

});
Tree.implement(new Events);
Tree.implement(new Options);

/*************************************************************/
