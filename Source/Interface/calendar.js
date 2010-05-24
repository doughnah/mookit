
/*
---

script: Calendar.js

description: A calendar control

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [Calendar]

...
*/

var Calendar = new Class({

	selectedValues: [],

    Implements: [Options, Events],

    getOptions: function() {
        return {
            classname: 'calendar',
            format: 'yyyy/mm/dd', //  dd/mm/yyyy  yyyy/mm/dd  dd-mm-yyyy  yyyy-mm-dd  dd/mm/yy  dd-mm-yy  mm/dd/yyyy  mm-dd-yyyy
            range: null, // [min, max]
            blockedDates: null, // []
            blockedDays: null, // ['sat', 'sun']
            toggleClear: true,
            input: null,
            container: null,
            width: 170,
            height: 162,
            headerHeight: 22,
            OnSelect: $empty,
            position: 'right',
            multiSelect: false,
            selectDayType: false,
            selectRange: false
        };
    },

    initialize: function(options) {
        this.setOptions(this.getOptions(), options);
        
        this.container = new Element('div', { 'class': this.options.classname + 'Container' });

        this.header = new Element('div', { 'class': this.options.classname + 'Header' }).inject(this.container);

        this.prevArrow = new Element('span', { 'class': 'left' }).inject(this.header);
        this.prevArrow.addEvent('click', this.previous.bind(this));

        this.titleHolder = new Element('span', { 'class': 'title' }).inject(this.header);
        this.titleHolder.addEvent('click', this.showPanel.bind(this));

        this.nextArrow = new Element('span', { 'class': 'right' }).inject(this.header);
        this.nextArrow.addEvent('click', this.next.bind(this));

        this.headerHeight = this.options.headerHeight;

        this.input = $(this.options.input);

        if (this.input) {
        	this.newInput = new Element('input', {type: 'hidden'});
        	this.newInput.set('value', this.input.get('value'));
        	this.newInput.set('name', this.input.get('name'));
        	this.newInput.set('id', this.input.get('id'));
        	this.newInput.inject(this.input, 'after');
        	this.input.destroy();
        	this.input = this.newInput;
        }
        if(this.options.container){
        	this.container.inject($(this.options.container));
    	}

        this.today = new Date();
        this.currentDate = this.today.getFirstDay();

        if (this.options.blockedDates) {
            this.options.blockedDates.each(function(el, i) {
                this.options.blockedDates[i] = this.today.parse(el, this.options.format).format('yyyy/mm/dd');
            }, this);
        }
        if (this.options.range) {
            this.options.range.each(function(el, i) {
                this.options.range[i] = this.today.parse(el, this.options.format);
            }, this);
        }
        if (this.options.container) {
            this.show();
        }
    },

    createCalendarDates: function(date) {
		//console.log(date);
        date = date.clearTime();
        var firstDay = date.getFirstDay();
        var monthName = firstDay.getFullMonthName();
        var fullYear = firstDay.getFullYear();
        var startDate = firstDay.getPreviousDay('mon');

        this.title = monthName + ' ' + fullYear;
        this.shownDate = date;
        this.panel = 'month';

        var div = new Element('div', { 'class': this.options.classname });
        var table = new Element('table', { 'cellspacing': 1, 'class': 'date' }).inject(div);

        var body = new Element('tbody').inject(table);

        var head = new Element('tr').inject(body);
        var mon = new Element('th', { 'text': 'Mon', 'scope': 'col' }).inject(head);
        var tue = new Element('th', { 'text': 'Tue', 'scope': 'col' }).inject(head);
        var wed = new Element('th', { 'text': 'Wed', 'scope': 'col' }).inject(head);
        var thu = new Element('th', { 'text': 'Thu', 'scope': 'col' }).inject(head);
        var fri = new Element('th', { 'text': 'Fri', 'scope': 'col' }).inject(head);
        var sat = new Element('th', { 'text': 'Sat', 'scope': 'col' }).inject(head);
        var sun = new Element('th', { 'text': 'Sun', 'scope': 'col' }).inject(head);
        
        if(this.options.selectDayType){
        	mon.addEvent('click', this.selectDay.bindWithEvent(this, 'mon')).setStyle('cursor', 'pointer');
        	tue.addEvent('click', this.selectDay.bindWithEvent(this, 'tue')).setStyle('cursor', 'pointer');
        	wed.addEvent('click', this.selectDay.bindWithEvent(this, 'wed')).setStyle('cursor', 'pointer');
        	thu.addEvent('click', this.selectDay.bindWithEvent(this, 'thu')).setStyle('cursor', 'pointer');
        	fri.addEvent('click', this.selectDay.bindWithEvent(this, 'fri')).setStyle('cursor', 'pointer');
        	sat.addEvent('click', this.selectDay.bindWithEvent(this, 'sat')).setStyle('cursor', 'pointer');
        	sun.addEvent('click', this.selectDay.bindWithEvent(this, 'sun')).setStyle('cursor', 'pointer');
        }

        //var body = new Element('tbody').inject(table);
        //console.log(date);
        var count = 0;
        var row = 1;
        for (var i = 0; i < 6; i++) {
            var tr = new Element('tr', { 'class': 'row' + row }).inject(body);
            for (var j = 0; j < 7; j++) {
                var classname = '';

                if (startDate.isBeforeMonth(date)) {
                    classname += ' past';
                }
                if (startDate.isAfterMonth(date)) {
                    classname += ' future';
                }
                if (startDate.isSame(startDate.today())) {
                    classname += ' today';
                }
                if (this.options.blockedDates) {
                    if (this.options.blockedDates.contains(startDate.format(this.options.format))) {
                        classname += ' blocked';
                    }
                }
                if (this.options.range) {
                    if (startDate.isBefore(this.options.range[0]) || startDate.isAfter(this.options.range[1])) {
                        classname += ' blocked';
                    }
                }
                if (this.options.blockedDays) {
                    if (this.options.blockedDays.contains(startDate.getShortDayName().toLowerCase())) {
                        classname += ' blocked';
                    }
                }
                
                 if (this.selectedValues.contains(startDate.getTime()) && !classname.contains('blocked')) {
                    classname += ' selected';
                }

                var el = new Element('td', {
                    'text': startDate.getDate(),
                    'class': classname,
                }).inject(tr);
                el.store('date', startDate);
                //el.addEvent('click', this.selectDate.bind(this, startDate));
                if (!el.hasClass('blocked')) {
                    el.addEvent('click', this.selectDate.bindWithEvent(this, [startDate, el]));
                }
                
                if(this.selectedValues.contains(startDate.format(this.options.format))){
                	this.selectedElements.include(el);
            	}

                startDate = startDate.addDay();
            }
            row++;
        }
        return div;
    },

    createCalendarMonths: function(date) {

        date = date.clearTime();
        var fullYear = date.getFullYear();

        this.title = fullYear;
        this.shownDate = date;
        this.panel = 'year';

        var div = new Element('div', { 'class': this.options.classname });
        var table = new Element('table', { 'cellspacing': 1, 'class': 'month' }).inject(div);
        var body = new Element('tbody').inject(table);

        //
        var count = 0;
        var row = 1;
        for (var i = 0; i < 3; i++) {
            var tr = new Element('tr', { 'class': 'row' + row }).inject(body);
            for (var j = 0; j < 4; j++) {
                var classname = '';

                if (this.selectedMonth) {
                    if (this.selectedYear == date.getFullYear()) {
                        if (this.selectedMonth == count) {
                            classname = 'selected';
                        }
                    }
                }
                var el = new Element('td', {
                    'text': date.shortMonthNames[count].capitalize(),
                    'class': classname
                }).inject(tr);
                el.addEvent('click', this.selectMonth.bind(this, count));
                count++;
            }
            row++;
        }
        return div;
    },

    createCalendarYears: function(date) {

        date = date.clearTime();

        var y = date.getFullYear() - new Date().getFullYear();
        var num = Math.floor(y / 12);

        startDate = new Date().addYears((num * 12)).addYears(-2);

        this.title = 'Years:';
        this.shownDate = date;
        this.panel = 'years';

        var div = new Element('div', { 'class': this.options.classname });
        var table = new Element('table', { 'cellspacing': 1, 'class': 'month' }).inject(div);

        var body = new Element('tbody').inject(table);
        var count = 0;
        var row = 1;
        for (var i = 0; i < 3; i++) {
            var tr = new Element('tr', { 'class': 'row' + row }).inject(body);
            for (var j = 0; j < 4; j++) {
                var classname = '';

                if (this.selectedYear) {
                    if (startDate.getFullYear() == this.selectedYear) {
                        classname = 'selected';
                    }
                }
                var el = new Element('td', {
                    'text': startDate.getFullYear(),
                    'class': classname
                }).inject(tr);
                el.addEvent('click', this.selectYear.bind(this, startDate.getFullYear()));
                startDate = startDate.addYear();
            }
            row++;
        }
        return div;
    },

    showMonth: function(date) {
    	//console.log(date);
        this.month = this.createCalendarDates(date).setStyles({
            'position': 'absolute',
            'top': this.headerHeight,
            'left': 0,
            'zIndex': 0
        }).inject(this.container);
        this.titleHolder.set('html', this.title);
    },

    showMonths: function(date, slide) {
        this.months = this.createCalendarMonths(date).setStyles({
            'position': 'absolute',
            'top': -(this.options.height),
            'left': 0,
            'zIndex': 2
        }).inject(this.container);
        this.titleHolder.set('html', this.title);

        if (slide) {
            new Fx.Tween(this.months, {
                onComplete: function() { this.month.setStyle('display', 'none'); } .bind(this)
            }).start('top', -(this.options.height), this.headerHeight);
        } else {
            this.months.setStyle('top', this.headerHeight);
        }
    },

    showYears: function(date) {
        this.years = this.createCalendarYears(date).setStyles({
            'position': 'absolute',
            'top': -(this.options.height),
            'left': 0,
            'zIndex': 3
        }).inject(this.container);
        this.titleHolder.set('html', this.title);

        new Fx.Tween(this.years, {
            onComplete: function() { this.months.setStyle('display', 'none'); } .bind(this)
        }).start('top', -(this.options.height), this.headerHeight);
    },

    hideMonths: function() {
        this.month.setStyle('display', 'block');
        new Fx.Tween(this.months, {
            onComplete: function() {
                this.months.destroy();
            } .bind(this)
        }).start('top', this.headerHeight, -(this.options.height));
    },

    hideYears: function() {
        this.months.setStyle('display', 'block');
        new Fx.Tween(this.years, {
            onComplete: function() {
                this.years.destroy();
            } .bind(this)
        }).start('top', this.headerHeight, -(this.options.height));
    },

    toggle: function(date) {
        if (this.showing) {
            this.hide();
        } else {
            this.show(date);
        }
    },

    show: function(date) {
        this.showing = true;
        if (this.months) {
            this.months.destroy();
        }
        if (this.years) {
            this.years.destroy();
        }

        if (!date && this.input) {
            date = this.input.get('value');
            var dates = date.split(',');
            date = dates[0];
            dates.erase('');
            dates.each(function(d){
            	this.selectedValues.push(new Date().parse(d, this.options.format).getTime());
            }, this);
        }
        //console.log(date);
        if (date) {
            if ($type(date) == 'string') {
                date = new Date().parse(date, this.options.format);
            }
            this.selected = date.clearTime();
            this.selectedMonth = this.selected.getMonth();
            this.selectedYear = this.selected.getFullYear();
        } else {
            date = new Date().today();
        }
        
       this.currentDate = date.getFirstDay();
        this.showMonth(date);

    },

    hide: function() {
        this.showing = false;
        if (this.input) {
            //layers.hide(this.container);
        }
    },

    next: function() {
        if (this.panel == 'month') {
            this.nextMonth();
        }
        if (this.panel == 'year') {
            this.nextYear();
        }
        if (this.panel == 'years') {
            this.nextYears();
        }
    },

    previous: function() {
        if (this.panel == 'month') {
            this.previousMonth();
        }
        if (this.panel == 'year') {
            this.previousYear();
        }
        if (this.panel == 'years') {
            this.previousYears();
        }
    },

    showPanel: function() {
        if (this.panel == 'month') {
            this.showMonths(this.shownDate, true);
        } else if (this.panel == 'year') {
            this.showYears(this.shownDate);
        }
    },

    nextMonth: function() {
        this.currentDate = this.currentDate.addMonths(1);
        var newCal = this.createCalendarDates(this.currentDate).setStyles({
            'position': 'absolute',
            'top': this.headerHeight,
            'left': this.options.width,
            'zIndex': 0
        }).inject(this.container);
        this.titleHolder.set('html', this.title);

        new Fx.Tween(this.month, {
            onComplete: function() {
                this.month.destroy();
            } .bind(this)
        }).start('left', 0, -(this.options.width));
        new Fx.Tween(newCal, {
            onComplete: function() {
                this.month = newCal;
            } .delay(600, this)
        }).start('left', this.options.width, 0);
    },

    previousMonth: function() {
        this.currentDate = this.currentDate.addMonths(-1);
        var newCal = this.createCalendarDates(this.currentDate).setStyles({
            'position': 'absolute',
            'top': this.headerHeight,
            'left': -(this.options.width),
            'zIndex': 0
        }).inject(this.container);
        this.titleHolder.set('html', this.title);

        new Fx.Tween(this.month, {
            onComplete: function() {
                this.month.destroy();
            } .bind(this)
        }).start('left', 0, this.options.width);
        new Fx.Tween(newCal, {
            onComplete: function() {
                this.month = newCal;
            } .delay(600, this)
        }).start('left', -(this.options.width), 0);
    },

    nextYear: function() {
        this.currentDate = this.currentDate.addYears(1);
        var newCal = this.createCalendarMonths(this.currentDate).setStyles({
            'position': 'absolute',
            'top': this.headerHeight,
            'left': this.options.width,
            'zIndex': 2
        }).inject(this.container);
        this.titleHolder.set('html', this.title);

        new Fx.Tween(this.months, {
            onComplete: function() {
                this.months.destroy();
            } .bind(this)
        }).start('left', 0, -(this.options.width));
        new Fx.Tween(newCal, {
            onComplete: function() {
                this.months = newCal;
            } .delay(600, this)
        }).start('left', this.options.width, 0);
    },

    previousYear: function() {
        this.currentDate = this.currentDate.addYears(-1);
        var newCal = this.createCalendarMonths(this.currentDate).setStyles({
            'position': 'absolute',
            'top': this.headerHeight,
            'left': -(this.options.width),
            'zIndex': 2
        }).inject(this.container);
        this.titleHolder.set('html', this.title);

        new Fx.Tween(this.months, {
            onComplete: function() {
                this.months.destroy();
            } .bind(this)
        }).start('left', 0, this.options.width);
        new Fx.Tween(newCal, {
            onComplete: function() {
                this.months = newCal;
            } .delay(600, this)
        }).start('left', -(this.options.width), 0);
    },

    nextYears: function() {
        this.currentDate = this.currentDate.addYears(12);
        var newCal = this.createCalendarYears(this.currentDate).setStyles({
            'position': 'absolute',
            'top': this.headerHeight,
            'left': this.options.width,
            'zIndex': 3
        }).inject(this.container);

        new Fx.Tween(this.years, {
            onComplete: function() {
                this.years.destroy();
            } .bind(this)
        }).start('left', 0, -(this.options.width));
        new Fx.Tween(newCal, {
            onComplete: function() {
                this.years = newCal;
            } .delay(600, this)
        }).start('left', this.options.width, 0);
    },

    previousYears: function() {
        this.currentDate = this.currentDate.addYears(-12);
        var newCal = this.createCalendarYears(this.currentDate).setStyles({
            'position': 'absolute',
            'top': this.headerHeight,
            'left': -(this.options.width),
            'zIndex': 3
        }).inject(this.container);

        new Fx.Tween(this.years, {
            onComplete: function() {
                this.years.destroy();
            } .bind(this)
        }).start('left', 0, this.options.width);
        new Fx.Tween(newCal, {
            onComplete: function() {
                this.years = newCal;
            } .delay(600, this)
        }).start('left', -(this.options.width), 0);
    },
    
    selectDay: function(e, day){
    	//console.log(day);
    	e = new Event(e);
    	
    	var num;
    	num = new Date().getDayFromName(day)-1;
    	if(num < 0) num = 6;
    	
    	this.container.getElements('tr').each(function(tr, i){
    		if(i>0){
    			var d = tr.getElements('td')[num];
    			if(!d.hasClass('blocked')){
    				this.selectedValues.include(d.retrieve('date').getTime());
    				d.addClass('selected');
				}
    		}
    	}, this);
    	
    	if(e.shift){
    		//select every for a year
    		var allDays = this.currentDate.getEveryDay(day);
    		var temp = [];
    		allDays.each(function(d){temp.push(d.getTime());});
    		this.selectedValues.combine(temp);
    	}
    	
    	this.outputValues();
    },

    selectDate: function(e, date, el) {
        e = new Event(e);
        
        var dte = date.format(this.options.format);
        
        this.selectedValues.erase('');
        
        if (this.options.toggleClear) {
        	el.toggleClass('selected');
        	if(this.selectedValues.contains(date.getTime())){
        		this.selectedValues.erase(date.getTime());
        		this.selected = null;
        	}else{
        		this.selectedValues.include(date.getTime());
        	}
    	}else{
    		this.selectedValues.include(date.getTime());
    		el.addClass('selected');
    	}
    	
    	if(this.options.selectRange && this.selectedValues.length > 1){
    		if(e.shift){
	    		var d = date;
	    		var amount = date > this.previousSelectedDate ? -1 : 1;
	    		do{
	    			d = d.addDays(amount);
	    			this.selectedValues.include(d.getTime());
	    		}while(!d.isSame(this.previousSelectedDate));
	    		
	    		this.container.getElements('td').each(function(td){
	    			if(this.selectedValues.contains(td.retrieve('date').getTime())){
	    				if(!td.hasClass('blocked')){
	    					td.addClass('selected');
    					}else{
    						this.selectedValues.erase(td.retrieve('date').getTime());
    					}
	    			}
	    		}, this);
			}
    	}
    	
    	this.outputValues();
    	
        
		this.previousSelectedDate = date;
        
        this.hide();
        if (this.options.OnSelect) {
            this.options.OnSelect();
        }
        
    },

    selectMonth: function(date) {
        //console.log(date);
        this.month.destroy();
        this.currentDate.setMonth(date);
        this.selectedMonth = date;
        this.showMonth(this.currentDate);
        this.hideMonths();
    },

    selectYear: function(date) {
        //console.log(date);
        this.months.destroy();
        this.currentDate.setFullYear(date);
        this.selectedMonth = null;
        this.selectedYear = date;
        this.showMonths(this.currentDate);
        this.hideYears();
    },
    
    outputValues: function(){
    	var temp = [];
    	this.selectedValues.each(function(d){
    		temp.push(new Date(d).format(this.options.format));
    	}, this);
    	
    	if(this.options.multiSelect){
    		this.input.set('value', temp.toString());
		}else{
			this.input.set('value', temp.pop());
			this.selectedValues.empty();
		}
    }

});
