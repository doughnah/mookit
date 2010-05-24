/*
---

script: URLParser.js

description: A script that parses URLs

license: MIT-style license

authors:
- Steven Levithan

requires:

provides: [URLParser]

...
*/

function parseUrl(sourceUrl){
    var urlPartNames = ["source","protocol","authority","domain","port","path","directoryPath","fileName","query","anchor"];
    var urlParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(sourceUrl);
    var url = {};
    
    for(var i = 0; i < 10; i++){
        url[urlPartNames[i]] = (urlParts[i] ? urlParts[i] : "");
    }
    
    // Always end directoryPath with a trailing backslash if a path was present in the source URI
    // Note that a trailing backslash is NOT automatically inserted within or appended to the "path" key
    if(url.directoryPath.length > 0){
        url.directoryPath = url.directoryPath.replace(/\/?$/, "/");
    }
    
    return url;
}

