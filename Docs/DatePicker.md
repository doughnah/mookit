Class: DatePicker {#DatePicker}
===============================

The DatePicker class is a wrapper for the Calendar class.

### Notes:


### Extends:

Calendar


### Syntax:

	var myLoader = new PagePreLoader([options]);

### Arguments:

1. options   - (*object*, optional) options below.

#### Options:

* css     		- (*string*: defaults to 'css/loading.css') The location of the css file that get added to the page while the content is loading.
* delay        	- (*integer*: defaults to 0) The seconds to delay before showing the content. This take into account the time it take to load fonts.
* fade     		- (*boolean*: defaults to false) If set to true, fades in the content when ready.
* typekitId     - (*string*: defaults to null) You kit's typekit id.

### Returns:

* (*object*) A new *PagePreLoader* instance.


### Examples:

	var myLoader = new PagePreLoader({typekitId:'xxxxxx'});
	
	window.addEvent('domready', function(){
		myLoader.update('loaded');
	});

### Demos:

- *PagePreLoader* - <http://labs.mandogroup.com/projects/mookit/utilities/PagePreLoader.htm>




DatePicker Method: constructor {#DatePicker:constructor}
---------------------------------------------------------


### Syntax:

	var myDatePicker = new DatePicker(options);

### Arguments:

1. options - (**)

### Options:

* zindex - (**)
* hideInput - (**)


DatePicker Method: toggle {#DatePicker:toggle}
-----------------------------------------------


### Syntax:



### Arguments:

1. date - (**)


DatePicker Method: show {#DatePicker:show}
-------------------------------------------


### Syntax:



### Arguments:

1. date - (**)


DatePicker Method: hide {#DatePicker:hide}
-------------------------------------------


### Syntax:




DatePicker Method: blur {#DatePicker:blur}
-------------------------------------------


### Syntax:



### Arguments:

1. e - (**)

