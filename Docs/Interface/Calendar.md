Class: Calendar {#Calendar}
===========================

A Calendar control


### Implements:

Options, Events




Calendar Method: constructor {#Calendar:constructor}
-----------------------------------------------------


### Syntax:

	var myCalendar = new Calendar(options);

### Arguments:

1. options - (*object*, optional)

### Options:

* classname - (*string*: defaults to 'calendar') The classname given to the containing div.
* format - (*string*: defaults to 'yyyy/mm/dd') The format for the dates, values can be: dd/mm/yyyy, yyyy/mm/dd, dd-mm-yyyy, yyyy-mm-dd, dd/mm/yy, dd-mm-yy, mm/dd/yyyy, mm-dd-yyyy.
* range - (*array*) An array containing the min and max dates in the format specified above.
* blockedDates - (*array*) An array containing the dates that are to be blocked in the format specified above.
* blockedDays - (*array*) An array containing the days to be blocked. Short names can be used: 'sun'.
* toggleClear - (*boolean*: defaults to true) Allows the date to be deselected.
* input - (*element*) The input that is to be associated with this instance of the calendar.
* container - (*element*)
* width - (*number*: defaults to 170)
* height - (*number*: defaults to 162)
* headerHeight - (*number*: defaults to 22)
* OnSelect - (*function*)
* position - (*string*: defaults to 'right')
* multiSelect - (*boolean*: defaults to false)
* selectDayType - (*boolean*: defaults to false)
* selectRange - (*boolean*: defaults to false)
* hideInput - (*boolean*: defaults to true) If true, this will turn the input into a hidden input field

### Returns:

* (*object*) A new *Calendar* instance.

### Examples:

	var myCalendar = new Calendar({
		blockedDays: ['sat, sun']
	});

### Demos:




Calendar Method: toggle {#Calendar:toggle}
-------------------------------------------


### Syntax:

	myCalendar.toggle([date]);

### Arguments:

1. date - (*string*, optional)

### Returns:

* (*object*) This *Calendar* instance.

### Examples:

	var myCalendar = new Calendar();
		myCalendar.toggle();


Calendar Method: show {#Calendar:show}
---------------------------------------


### Syntax:

	myCalendar.show([date]);

### Arguments:

1. date - (*string*, optional)

### Returns:

* (*object*) This *Calendar* instance.

### Examples:

	var myCalendar = new Calendar();
		myCalendar.show('2010/05/24');
	

Calendar Method: hide {#Calendar:hide}
---------------------------------------


### Syntax:

	myCalendar.hide();
	
### Returns:

* (*object*) This *Calendar* instance.

### Examples:

	var myCalendar = new Calendar();
		myCalendar.hide();
