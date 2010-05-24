/*
---

script: Date.Extras.js

description: Date helpers

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [Date.Extras]

...
*/

Date.implement({
    'parse': function(str, format) {
    	
    	var s = '-';
    	
    	if(format.indexOf('/') > 0){
    		s = '/';
    	}
    	
    	var f = format.split(s);
    	var d = str.split(s);
    	
    	var dd;
    	var mm;
    	var yy;
    	
    	for(var i=0; i<f.length; i++){
    		var el = f[i].substr(0,1);
    		if(el == 'd'){
    			dd = d[i];
    		}
    		if(el == 'm'){
    			mm = d[i];
    		}
    		if(el == 'y'){
    			yy = d[i];
    		}
    	}
    	
    	var date = new Date(yy+'/'+mm+'/'+dd);
    	
       // var date = new Date(str);
        var valid = false;
        this.dateFormats.each(function(el) {
            if (str == date.format(el)) {
                //console.log('match: '+el);
                valid = true;
            }
        });
        if (!valid) {
            var sep = '';
            if (str.contains('/')) {
                sep = '/';
            }
            if (str.contains('-')) {
                sep = '-';
            }

            var a = str.split(sep);
            if (a[0].length == 4) {
                return new Date(a[0] + '/' + a[1] + '/' + a[2]);
            } else {
                if (a[2].length == 2) {
                    a[2] = '20' + a[2];
                }
                return new Date(a[2] + '/' + a[1] + '/' + a[0]);
            }
        } else {
            return date;
        }
    },
    'format': function(format) {
        var dd = this.getDate().toString();
        var mm = (this.getMonth() + 1).toString();
        var yyyy = this.getFullYear().toString();
        var yy = yyyy.substr(2);

        if (dd.length == 1) { dd = '0' + dd }
        if (mm.length == 1) { mm = '0' + mm }

        //console.log(yy);

        format = format.replace('dd', dd);
        format = format.replace('mm', mm);
        format = format.replace('yyyy', yyyy);
        format = format.replace('yy', yy);

        return format;
    },
    'today': function() {
        return new Date().clearTime();
    },
    'getFirstDay': function() {
        var d = new Date(this);
        	d.setDate(1);
        return d;
    },
    'clone': function() {
        return new Date(this);
    },
    'addDay': function() {
        return this.addDays(1);
    },
    'addDays': function(num) {
        if (!num) { num = 0 }
        var d = new Date(this);
        	d.setDate(this.getDate() + num);
        return d;
    },
    'addMonth': function() {
        return this.addMonths(1);
    },
    'addMonths': function(num) {
        if (!num) { num = 0 }
        var d = new Date(this);
        	d.setMonth(this.getMonth() + num);
        return d;
    },
    'addYear': function() {
        return this.addYears(1);
    },
    'addYears': function(num) {
        if (!num) { num = 0 }
        var d = new Date(this);
       		d.setFullYear(this.getFullYear() + num);
        return d;
    },
    'isBeforeMonth': function(date) {
        if (this.getFirstDay() < date.getFirstDay()) {
            return true;
        } else {
            return false;
        }
    },
    'isAfterMonth': function(date) {
        if (this.getFirstDay() > date.getFirstDay()) {
            return true;
        } else {
            return false;
        }
    },
    'isBefore': function(date) {
    	//console.log(date);
        if (this.getTime() < date.getTime()) {
            return true;
        } else {
            return false;
        }
    },
    'isAfter': function(date) {
        if (this.getTime() > date.getTime()) {
            return true;
        } else {
            return false;
        }
    },
    'isSame': function(date) {
        if (this.getTime() == date.getTime()) {
            return true;
        } else {
            return false;
        }
    },
    'getEveryDay': function(day, amount) {
    	if(day){
    		if(!amount){
    			amount = 52;
    		}
    		var dates = [];
    		var startDate = this.getNextDay(day);
    		for(var i=0; i<52; i++){
    			dates.push(startDate.addDays(i*7));
    		}
    		return dates;
    	}else{
    		return this;
    	}
    },
    'getNextDay': function(day) {
    	if(day){
    		day = this.getDayFromName(day);
    		var date = this;
            if (date.getDay() != day) {
                do {
                    date = date.addDays(1);
                } while (date.getDay() != day);
            }
            return date;
		}else{
			return this.addDays(1);
		}
    },
    'getPreviousDay': function(day) {
        if (day) {
            day = this.getDayFromName(day);
            var date = this;
            if (date.getDay() != day) {
                do {
                    date = date.addDays(-1);
                } while (date.getDay() != day);
            }
            return date;
        } else {
            return this.addDays(-1);
        }
    },
    'getDayFromName': function(name) {
        name = name.toLowerCase();
        if (this.fullDayNames.contains(name)) {
            return this.fullDayNames.indexOf(name);
        }
        if (this.shortDayNames.contains(name)) {
            return this.shortDayNames.indexOf(name);
        }
    },
    'getFullDayName': function() {
        return this.fullDayNames[this.getDay()].capitalize();
    },
    'getShortDayName': function() {
        return this.shortDayNames[this.getDay()].capitalize();
    },
    'getFullMonthName': function() {
        return this.fullMonthNames[this.getMonth()].capitalize();
    },
    'getShortMonthName': function() {
        return this.shortMonthNames[this.getMonth()].capitalize();
    },
    'clearTime': function() {
        return new Date(this.getFullYear() + '/' + (this.getMonth() + 1) + '/' + this.getDate());
    },
    'fullDayNames': ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    'shortDayNames': ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    'fullMonthNames': ['january', 'febuary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    'shortMonthNames': ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    'dateFormats': ['dd/mm/yyyy', 'dd/mm/yy', 'yyyy/mm/dd', 'dd-mm-yyyy', 'dd-mm-yy', 'yyyy-mm-dd', 'mm/dd/yyyy', 'mm-dd-yyyy']
});

