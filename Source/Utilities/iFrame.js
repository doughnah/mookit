
		if($type(element) == 'object'){
			var coords = element;
		}else{
			var el = $(element);
			var coords = el.getCoordinates();
		}
		
		this.frame.setStyles({
			'top': coords.top,
			'left': coords.left,
			'width': coords.width,
			'height': coords.height
		});
	},
	
	fillPage: function(){
		this.frame.setStyles({
			'top': 0,
			'left': 0,
			'width': window.getScrollSize().x,
			'height': window.getScrollSize().y
		});
	},
	
	show: function(){
		//if (this.options.browsers) {
			this.frame.setStyle('display', 'block');
		//}
	},
	
	hide: function(){
		this.frame.setStyle('display', 'none')
	}
	
});