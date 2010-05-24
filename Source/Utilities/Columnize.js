/*
---

script: Columnize.js

description: An extension that will split content into columns

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [Columnize]

...
*/

var Columnize = new Class({
	
	Implements: [Options,Events],
	
	getOptions: function(){
		return {
			columns: 4,
			margin: 20,
			tolerance: 100,
			equalize: true
		};
	},
	
	initialize: function(area, options){
		this.setOptions(this.getOptions(), options);
		this.area = $$(area)[0];
		
		this.areaSize = this.area.getSize();
		this.area.setStyles({
			'width': '100%',
			'overflow': 'hidden'
		});
		
		
		
		this.elements = this.area.getChildren();
		
		//var temp = new Element('div', {'styles':{'width':this.columnWidth}}).inject(this.area);
		//this.elements.inject(temp);
		
		//this.average = Math.ceil(this.area.getSize().y/this.options.columns);
		
		//this.items = Math.ceil(this.elements.length/this.options.columns);
		
		this.createColumns();
		
		//temp.destroy();
		
	},
	
	columns: function(num){
		this.options.columns = num;
		this.clearColumns();
		this.createColumns();
	},
	
	clearColumns: function(){
		this.cols.each(function(el,i){
			el.getChildren().inject(this.area);
			el.destroy();
		}, this);
		this.elements = this.area.getChildren();
	},
	
	createColumns: function(){
		this.cols = [];
		
		this.columnWidth = Math.floor((this.areaSize.x-(this.options.margin*(this.options.columns-1)))/this.options.columns);
		this.items = Math.ceil(this.elements.length/this.options.columns);
		
		for(var i=0; i<this.options.columns; i++){
			var margin = this.options.margin;
			var width = this.columnWidth;
			if(i==this.options.columns-1){
				margin = 0;
				width = this.columnWidth//+this.options.margin;
			}
			var col = new Element('div', {
				'styles': {
					'margin-right': margin,
					'float': 'left',
					'width': width,
					'text-align': 'justify'
				}
			});
			col.inject(this.area);
			this.cols.push(col);
			
			if(this.items > this.elements.length){
				this.items = this.elements.length;
			}
			for(var j=0; j<this.items; j++){
				var it = this.elements.shift();
					it.inject(col);
					
				if(it.get('tag') == 'img'){
					it.setStyles({'width': width});
				}
			}
		}
		
		this.sort();
	},
	
	sort: function(){
		
		var c = 0;
		
		while(c < this.cols.length-1){
			//console.log('> checking col: '+c);
			//console.log((this.cols[c].getSize().y+this.options.tolerance)+' : '+this.cols[c+1].getSize().y);
			//console.log(this.cols[c].getSize().y+' : '+(this.cols[c+1].getSize().y+this.options.tolerance));
			
			if(this.cols[c].getSize().y+this.options.tolerance < this.cols[c+1].getSize().y){
				//console.log('col:'+c+' is shorter than col:'+(c+1));
				//console.log(this.cols[c+1].getFirst());
				this.cols[c+1].getFirst().inject(this.cols[c]);
				c = 0;
			}else if(this.cols[c].getSize().y > (this.cols[c+1].getSize().y+this.options.tolerance)){
				//console.log('  col:'+(c+1)+' is shorter than col:'+c);
				if(this.options.equalize){
					//console.log('col:'+c+' - '+(this.cols.length-2));
					if(c < this.cols.length-2){
						//console.log((c+2)+' has child: '+this.cols[c+2].getChildren()[0]);
						if(this.cols[c+2].getChildren()[0]){
							//console.log('  col:'+(c+1)+' is shorter than col:'+c);
							//console.log(this.cols[c+2].getFirst());
							this.cols[c+2].getFirst().inject(this.cols[c+1]);
							c = 0;
						}else{
							c++;
						}
					}else{
						c++;
					}
				}else{
					c++;
				}
			}else{
				c++;
			}
		}
		
		if(!this.cols[this.cols.length-2].getChildren()[0]){
			//console.log('REORDER');
			for(var i=0; i<this.cols.length-2; i++){
				this.cols[i].getLast().inject(this.cols[i+1], 'top');
			}
		}
		
		/*
		while(this.cols[this.cols.length-1].getSize().y > this.cols[this.cols.length-2].getSize().y+this.options.tolerance){
			for(var i=this.cols.length-1; i>0; i--){
				if(this.cols[i].getSize().y > this.cols[i-1].getSize().y+this.options.tolerance){
					this.cols[i].getFirst().inject(this.cols[i-1]);
				}
			}
		}
		
		//if(this.cols.length > 2){
		while(this.cols[0].getSize().y+this.options.tolerance < this.cols[1].getSize().y){
			//console.log((this.cols[0].getSize().y+this.options.tolerance) +' : '+ this.cols[1].getSize().y);
			for(var i=0; i<this.cols.length-1; i++){
				//console.log(c+' : '+i);
				
				var tol = this.options.tolerance;
				if(i == this.cols.length-2){tol = 0;}
				//console.log(tol);
				//console.log((this.cols[i].getSize().y+tol)+' : '+this.cols[i+1].getSize().y);
				while(this.cols[i].getSize().y+tol < this.cols[i+1].getSize().y){
					this.cols[i+1].getFirst().inject(this.cols[i]);
				}
				//console.log((this.cols[i].getSize().y+tol)+' : '+this.cols[i+1].getSize().y);
			}
			//console.log((this.cols[0].getSize().y+this.options.tolerance) +' : '+ this.cols[1].getSize().y);
		}
		
		var count = 0;
		while(this.columnCheck() == false && count < 20){
			for(var i=1; i<this.cols.length-1; i++){
				this.cols[i+1].getFirst().inject(this.cols[i]);
				//console.log(this.cols[i-1].getSize().y +' : '+ this.cols[i].getSize().y);
				if(this.cols[i-1].getSize().y < this.cols[i].getSize().y){
					this.cols[i].getLast().inject(this.cols[i+1], 'top');
				}
			}
			count++;
		}
		*/
		
		/*while(this.cols[this.cols.length-1].getSize().y > this.cols[this.cols.length-2].getSize().y+this.options.tolerance){
			for(var i=this.cols.length-1; i>0; i--){
				if(this.cols[i].getSize().y > this.cols[i-1].getSize().y+this.options.tolerance){
					this.cols[i].getFirst().inject(this.cols[i-1]);
				}
			}
		}*/
		
		/*if(this.cols.length > 2){
			for(var i=0; i<this.cols.length-1; i++){
				if(i>0){
					this.cols[i+1].getFirst().inject(this.cols[i]);
					if(this.cols[i].getSize().y > this.cols[i-1].getSize().y+this.options.tolerance){
						this.cols[i].getLast().inject(this.cols[i+1], 'top');
					}
				}
			}
		}*/
	}
	
});