/*
---

script: Element.GetNodes.js

description: An Element extension that allows you to get any node type.

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [Element.GetNodes]

...
*/
Element.implement({
    GetNodes: function(nodeName) {
        var nodes = $A(this.childNodes);
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].childNodes.length > 0) {
                nodes.extend(nodes[i].childNodes);
            }
        }
        var results = nodes;
        if (nodeName) {
            var type = 'nodeName';
            if ($type(nodeName) == 'number') {
                type = 'nodeType';
            }
            results = [];
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i][type] == nodeName) {
                    results.push(nodes[i]);
                }
            }
        }
        return results;
    }
});