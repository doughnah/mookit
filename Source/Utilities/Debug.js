/*
---

script: Debug.js

description: Allows console.logs to be turned on/off

license: MIT-style license

authors:
- Samuel Birch

requires:

provides: [Debug]

...
*/

var debug = true;

if(!debug){
	var console = {
		log: function(){}
	}
}