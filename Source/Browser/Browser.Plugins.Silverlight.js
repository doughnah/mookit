/*
---

name: Browser.Plugins.Silverlight

description: Plugin version detection for Silverlight.

license: MIT-style license.

credits: 
  - Samuel Birch

requires: 

provides: Browser.Plugins.Silverlight

...
*/


Browser.Plugins.Silverlight = (function(){
	
	var version;
	
	if(Browser.Engine.trident){
		var agc = new ActiveXObject('AgControl.AgControl');
		if(agc.IsVersionSupported('1.0')){version = 1;}
		if(agc.IsVersionSupported('2.0')){version = 2;}
		if(agc.IsVersionSupported('3.0')){version = 3;}
		if(agc.IsVersionSupported('4.0')){version = 4;}
	}else{
		version = navigator.plugins['Silverlight Plug-In'].description.substring(0,1);
	}
	
	if(!version){
		version = 0;
	}
	
	return {version: Number(version) || 0};
})();