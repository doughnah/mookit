Class: Xappa {#Xappa}
=====================

The *Xappa* class embeds Silverlight into the page as the Swiff class does. It also includes version detection.



### Syntax:

	var myXappa = new Xappa(path [,options]);

### Arguments:

1. path - (*string*) The path to the .xap file.
2. options - (*object* optional) 

### Options:

* id - (*string*) The id given to the embedded object.
* version - (*number*: defaults to 4) The major version number.
* minorVersion - (*string*: defaults to '.0') The minor version number to be appended to the major version.
* height - (*number*: defaults to 1) The height of the object in pixels (pass in a string with % if needed).
* width - (*number*: defaults to 1) The height of the object in pixels (pass in a string with % if needed).
* container - (*string*) The id of the container in which the contents will be replaced with the object.
* properties - (*object*) A key/value pairs object of the properties of the object tag.
* params - (*object*) A key/value pairs object of the params for the object.
* 	windowless - (*boolean*: defaults to true)
* 	autoUpgrade - (*boolean*: defaults to true)
* 	background - (*string*: defaults to 'white')
* 	framerate - (*number*: defaults to 24)
* 	enableHtmlAccess - (*boolean*: defaults to true)
* callBacks - (*object*) a key/value pairs object of the events for the object.
* initParams - (*object*) a key/value pairs object of the initParams.
* enableHistory - (*boolean*: defaults to false) Turns on the silverlight history iframe.
* remote - (*string*) The name of the object within the silverlight movie for remote scripting access.

### Returns:

* (*object*) A new *Xappa* instance.


### Examples:

	new Xappa('mySilverlightFile.xap', {
		container: 'myXapContainer',
		version: 4,
		minorVersion: '.0.54'
		width: 550,
		height: 550,
		initParams: {
			myVar: 'hello'
		}
	});


### Demos:

- *Xappa* - <http://labs.mandogroup.com/projects/mookit/Utilities/Xappa.php>



Xappa Method: remote {#Xappa:remote}
-------------------------------------

Gives access to the silverlight scripting object as defined in the init options.


### Syntax:

	var myXappa = new Xappa('myXap.xap', {remote: 'mySilverlightObject'});
		myXappa.remote.doSomethingInSilverlight();


### Returns:

* (*object*) Access to the silverlight object.


