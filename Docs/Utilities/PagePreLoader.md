Class: PagePreLoader {#PagePreLoader}
=============================

The *PagePreLoader* class hides the page content until its ready to show. It also handles typekit fonts and show the content when these fonts have downloaded so you don't get any nasty jumps.

### Notes:


### Extends:

[]

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

- *PagePreLoader* - <http://labs.mandogroup.com/projects/mookit/Utilities/PagePreLoader.php>



PagePreLoader Method: add {#PagePreLoader:add}
----------------------------------------------------

Adds an item to check for before showing the page content.

### Syntax:

	myLoader.add([key]);

### Arguments:

1. key - (*string*, optional) A string to be used as a key in the loader hash that will hold the ready state of the item (true/false). If no key is passed then one is created for you and returned.

### Returns:

* (*string*) The key of the new item in the loader hash.

### Examples:

	var myLoader = new PagePreLoader();
		myLoader.add('myKey');



PagePreLoader Method: update {#PagePreLoader:update}
----------------------------------------------------

Updates the status of the item in the hash and calls the internal check method which triggers the content to show, if all hash items are ready.

### Syntax:

	myLoader.update(key [, status]);

### Arguments:

1. key - (*string*) The key of the item in the hash.
2. status - (*boolean*, optional: defaults to true) The status that the hash should be set to.

### Returns:

* nothing.

### Examples:

	var myLoader = new PagePreLoader();
		myLoader.add('myKey');
	
	window.addEvent('domready', function(){
		myLoader.update('myKey');
	});



PagePreLoader Method: remove {#PagePreLoader:remove}
----------------------------------------------------

Removes an item from the loader hash.

### Syntax:

	myLoader.remove(key);

### Arguments:

1. key - (*string*) The key of the item in the loader hash that should be removed.

### Returns:

* nothing.

### Examples:

	var myLoader = new PagePreLoader();
		myLoader.add('myKey');
		myLoader.remove('myKey');





