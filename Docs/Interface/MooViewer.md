Class: MooViewer {#MooViewer}
=============================

A slideshow plugin.


### Implements:

Options, Events




MooViewer Method: constructor {#MooViewer:constructor}
-------------------------------------------------------


### Syntax:

	var myMooViewer = new MooViewer(container, options);

### Arguments:

1. container - (*mixed*) the id as a string or an object of the element which will contain the MooViewer.
2. options - (*object*, optional)

### Options:

* autoPlay - (*boolean*: defaults to true) If the MooViewer should automatically go to the next item after the *wait* time.
* title - (*boolean*: defaults to true) If the title should be displayed.
* desc - (*boolean*: defaults to true) If the description should be displayed.
* nav - (*boolean*: defaults to true) If the quick nav (dots) should be displayed.
* buttons - (*boolean*: defaults to true) If the next/previous buttons should be displayed.
* fadeText - (*boolean*: defaults to true) If the title & description text should fade in with the item.
* transition - (*mixed*: defaults to 'sine:out') The transition effect, either a string or an object. Can also use 'fade' to do a cross-fade effect.
* duration - (*number*: defaults to .25) The amount of seconds the transition will take.
* wait - (*number*: defaults to 3) The amount of seconds each item should pause before showing the next.
* backFade - (*boolean*: defaults to false) Should the item behind fade out? used more for cross fading between different formatted images (portrait & landscape). If you are not using different formats or not fading then keep as false for better performance.
* index - (*boolean*: defaults to false) Is the first item an index/contents item? if so it will get removed.


### Returns:

* (*object*) A new *MooViewer* instance.

### Examples:

	var myMooViewer = new MooViewer('myMooViewerContainer');

### Demos:




MooViewer Method: next {#MooViewer:next}
-----------------------------------------

Transitions to the next item, if its the last item it will go back to the start.

### Syntax:

	myMooViewer.next();


MooViewer Method: previous {#MooViewer:previous}
-------------------------------------------------

Transitions to the previous item, if its the first item it will back to the end.

### Syntax:

	myMooViewer.previous();


MooViewer Method: play {#MooViewer:play}
-----------------------------------------

Starts playing the items, the wait between items it defined in the options.

### Syntax:

	myMooViewer.play();


MooViewer Method: pause {#MooViewer:pause}
-------------------------------------------

Pauses the playback.

### Syntax:

	myMooViewer.pause();


MooViewer Method: goTo {#MooViewer:goTo}
-------------------------------------------------

Go directly to an item.

### Syntax:

	myMooViewer.goTo(index);

### Arguments:

1. index - (*number*) - zero based, the number of the item to show.



