Class: DatePicker {#DatePicker}
===============================

A picker wrapper for the Calendar class


### Extends:

Calendar




DatePicker Method: constructor {#DatePicker:constructor}
---------------------------------------------------------


### Syntax:

	var myDatePicker = new DatePicker(options);

### Arguments:

1. options - (*object*, optional)

### Options:

* zIndex - (*number*: defaults to 1000)
* hideInput - (*boolean*: defaults to false)
* plus all calendar options.

### Returns:

* (*object*) A new *DatePicker* instance.

### Examples:

	var myDatePicker = new DatePicker({
		blockedDays: ['sat, sun']
	});

### Demos:



DatePicker Method: toggle {#DatePicker:toggle}
-----------------------------------------------


### Syntax:

	myDatePicker.toggle([date]);


### Arguments:

1. date - (*string*, optional)

### Returns:

* (*object*) This *DatePicker* instance.

### Examples:

	var myDatePicker = new DatePicker();
		myDatePicker.toggle();


DatePicker Method: show {#DatePicker:show}
-------------------------------------------


### Syntax:

	myDatePicker.show([date]);

### Arguments:

1. date - (*string*, optional)

### Returns:

* (*object*) This *DatePicker* instance.

### Examples:

	var myDatePicker = new DatePicker();
		myDatePicker.show('2010/05/24');


DatePicker Method: hide {#DatePicker:hide}
-------------------------------------------


### Syntax:

	myDatePicker.hide();

### Returns:

* (*object*) This *DatePicker* instance.

### Examples:

	var myDatePicker = new DatePicker();
		myDatePicker.show('2010/05/24');
		myDatepicker.hide();

