/*
---

script: ModuleLayout.js

description: An Drag extension that allows the management of windows in containers.

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4/Drag
- core:1.2.4/Drag.Move

provides: [ModuleLayout]

...
*/

var ModuleLayout = new Class({

    Implements: [Events, Options],

    options: {
        zIndex: 2,
        url: null,
        method: 'get',
        bgClass: 'ezBackground',
        moduleClass: 'ezModule',
		staticModuleClass: 'ezStaticModule',
        moduleDragClass: 'ezModuleDrag',
        containerClass: 'ezContainer',
        moduleHolderClass: 'ezModuleHolder',
        ghostClass: 'ezGhost',
        idPrefix: 'ezMod_'
    },

    initialize: function(containers, options) {
        this.setOptions(options);
        this.contentContainers = [];
        $$(containers).each(function(el) {
            this.contentContainers.push(el.get('id'));
        }, this);
        this.containers = [];
        this.modules = [];

        this.request = new Request({
            method: this.options.method,
            url: this.options.url,
            link: 'cancel',
            onSuccess: this.updateData.bind(this)
        });

        this.container = new Element('div', {
            'styles': {
                'position': 'absolute',
                'display': 'none',
                //'opacity': 0,
                'top': 0,
                'left': 0,
                'zIndex': this.options.zIndex
            }
        }).inject(document.body);

        this.setContainerSize();

        this.bg = new Element('div', {
            'class': this.options.bgClass,
            'styles': { 'opacity': 0.7 }
        }).inject(this.container);

        this.getData();

        document.addEvent('mousemove', function(e) {
            e = new Event(e);
            this.mousePos = e.page;
        } .bind(this));

        window.addEvent('resize', this.setContainerSize.bind(this));
    },

    setContainerSize: function() {
        var size = window.getScrollSize();
        this.container.setStyles({
            'width': size.x,
            'height': size.y
        });
    },

    createModuleList: function(text) {
        this.data = JSON.decode(text);

        this.moduleHolder = new Element('div', {
            'class': this.options.moduleHolderClass
        }).inject(this.container);

        this.saveButton = new Element('input', {
            'type': 'button',
            'value': 'Save',
            'styles': {
                'margin': 5
            },
            'events': {
                'click': function() {
                    if (this.options.url) {
                        this.update();
                    }
                    this.saveButton.set({
                        'value': 'Saving...',
                        'disabled': true
                    })
                    //this.hide();
                } .bind(this)
            }
        }).inject(this.moduleHolder);

        this.cancelButton = new Element('input', {
            'type': 'button',
            'value': 'Cancel',
            'styles': {
                'margin': 5
            },
            'events': {
                'click': function() {
                    this.hide();
                    this.reset();
                } .bind(this)
            }
        }).inject(this.moduleHolder);

        this.data.modules.each(function(el) {
            var mod = new Element('div', {
                'id': this.options.idPrefix + el.id,
                'class': this.options.moduleClass,
                'text': el.title
            }).inject(this.moduleHolder);
            this.modules.push(mod);
        }, this);

        this.data.containers.each(function(el) {
			if($(el.id).getStyle('display') != 'none'){
            	this.createContainer(el, this.container);
			}
        }, this);

        this.createDrag();
        
        // if the moduleholder has scrolling then it pushes the width of the container outside the bounds of the window
        // make the moduke holder the width of the scrollbar thinner so that it resices in the page correctly
        if (this.moduleHolder.offsetWidth > this.moduleHolder.scrollWidth + 1) {
            this.moduleHolder.setStyle('width', this.moduleHolder.scrollWidth + 15);
        } else {
            this.moduleHolder.setStyle('width', this.moduleHolder.scrollWidth - 1);
        }
    },

    createContainer: function(obj, parent) {
        var styles = {};

        if (parent == this.container) {
            styles.width = 300;
            styles.position = 'absolute';
            if (this.contentContainers.contains(obj.id)) {
                var coords = $(obj.id).getCoordinates();
                var padding = $(obj.id).getStyle('padding-left').toInt();
                var border = $(obj.id).getStyle('border-width').toInt() * 2;
                styles.width = coords.width - padding - border;
                styles.top = coords.top;
                styles.left = coords.left;
                styles.margin = 0;
            }
            //styles.float = 'left';
        }

        var container = new Element('div', {
            'id': this.options.idPrefix + obj.id,
            'class': this.options.containerClass,
            'styles': styles
        }).inject(parent);

        this.containers.push(container);

        obj.modules.each(function(el) {
            if (el.modules) {
				if($(el.id).getStyle('display') != 'none'){
                	this.createContainer(el, container);
				}
            } else {
				var cls = this.options.moduleClass;
				if(!el.interact){
					cls = this.options.staticModuleClass
				}
                var mod = new Element('div', {
                    'id': this.options.idPrefix + el.id,
                    'text': el.title,
                    'class': cls
                }).inject(container);
				if(el.interact){
                	this.modules.push(mod);
				}
            }
        }, this);
    },

    reset: function() {
        this.data.modules.each(function(el) {
            $(this.options.idPrefix + el.id).inject(this.moduleHolder);
        }, this);

        this.data.containers.each(function(el) {
            this.resetContainer(el, this.container);
        }, this);
    },

    resetContainer: function(obj, parent) {
        var container = $(this.options.idPrefix + obj.id);
		if(container){
	        container.inject(parent);
	        obj.modules.each(function(el) {
	            if (el.modules) {
	                this.resetContainer(el, container);
	            } else {
	                $(this.options.idPrefix + el.id).inject(container);
	            }
	        }, this);
		}
    },

    positionContainers: function() {
        /*this.container.getChildren('.'+this.options.containerClass).each(function(el){
        var id = el.get('id').replace(this.options.idPrefix, '');
        $(id)
        }, this);*/
    },

    createDrag: function() {
        this.modules.each(function(el) {
            el.ghost = new Element('div', { 'class': this.options.ghostClass, 'html': '&nbsp;' });
            el.container = new Element('div');
            el.makeDraggable({
                droppables: this.containers,

                onStart: function(element) {
                    element.addClass(this.options.moduleDragClass);
                    
                    var ghostWidth = this.mousePos.x;
                    if (ghostWidth < 400)
                        ghostWidth = 400;

                    var coords = element.getCoordinates();
                    element.container.setStyles({
                        'position': 'absolute',
                        'top': coords.top - element.getStyle('margin-top').toInt(),
                        'left': coords.left - element.getStyle('margin-left').toInt(),
                        'width': coords.width + 10,
                        'z-index': element.getStyle('z-index') + 1
                    }).inject(this.container);
                    element.inject(element.container);
                } .bind(this),

                onDrag: function(element) {
                    if (element.sort) {
                        element.sort.getElements('.' + this.options.moduleClass + ', .' + this.options.containerClass + ', .'+this.options.staticModuleClass).each(function(el) {
                            var coords = el.getCoordinates();
                            var eCoords = element.ghost.getCoordinates();
                            if (el.getPrevious() == null && this.mousePos.y < coords.top && element.sort.getFirst().hasClass(this.options.containerClass)) {
                                element.ghost.inject(el, 'before');
                            } else
                                if (this.mousePos.y < eCoords.top && this.mousePos.y < coords.bottom && this.mousePos.y > coords.top) {
                                element.ghost.inject(el, 'before');
                            } else
                                if (this.mousePos.y > eCoords.bottom && this.mousePos.y < coords.bottom && this.mousePos.y > coords.top) {
                                element.ghost.inject(el, 'after');
                            }
                        } .bind(this));
                    }
                } .bind(this),

                onDrop: function(element, droppable) {
                    if (!droppable) {
                        //console.log(element, ' dropped on nothing');
                        element.inject(this.moduleHolder);
                    } else {
                        //console.log(element, 'dropped on', droppable);
                        element.replaces(element.ghost);
                    }

                    element.setStyles({
                        'left': 0,
                        'top': 0
                    }).removeClass(this.options.moduleDragClass);
                    element.container.dispose();
                } .bind(this),

                onEnter: function(element, droppable) {
                    //console.log(element, 'entered', droppable);
                    element.ghost.inject(droppable);
                    element.sort = droppable;
                },

                onLeave: function(element, droppable) {
                    //console.log(element, 'left', droppable);
                    element.ghost.dispose();
                    element.sort = undefined;
                }

            });
        } .bind(this));
    },

    getData: function() {
        new Request({
            method: this.options.method,
            url: this.options.url,
            link: 'cancel',
            onSuccess: this.createModuleList.bind(this)
        }).send();
    },

    update: function() {
        var data = [];
        data.push("saveLayout=true");
        this.containers.each(function(el) {
            var id = el.get('id').replace(this.options.idPrefix, '');
            var mods = [];
            el.getChildren().each(function(ch) {
                mods.push(ch.get('id').replace(this.options.idPrefix, ''));
            }, this);
            data.push(id + '=' + mods.join(','));
        }, this);

        this.request.send(data.join('&'));
    },

    updateData: function(text) {
        this.data = JSON.decode(text);
        window.location = window.location.href;
    },

    show: function() {
        this.container.setStyles({
            'display': 'block'
        });
    },

    hide: function() {
        this.container.setStyles({
            'display': 'none'
        });
    }

});
