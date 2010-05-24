/*
---

script: Layer.js

description: A plugin that creates popup layers.

license: MIT-style license

authors:
- Samuel Birch

requires:
- core:1.2.4

provides: [Layer]

...
*/

var Layer = new Class({

    Implements: Options,

    getOptions: function() {
        return {
            fade: false,
            slide: false,
            vertical: null, //slide direction: up, down
            horizontal: null, //slide direction: left, right
            duration: 500, //milliseconds
            transition: 'sine:out',
            control: null, //element/string of the control that the layer is to be positioned against
            position: null, //type in relation to the control: top, left, bottom, right, center   XY object: (array) [x,y], 
            align: null, //the side to be aligned to the control: top, left, bottom, right
            center: 'both', //both, vertical, horizontal
            container: window, //used with center
            modal: false,
            modalTarget: null,
            bgColor: '#000',
            opacity: 0.7,
            dropshadow: false,
            shadow: null, //glow, drop, null
            shadowSize: 8,
            closeOnMouseout: false,
            mouseoutDelay: 2000,
            closeOnBlur: false,
            MoveToBody: false,
            OnHide: $empty,
            OnShow: $empty,
            multibox: false,
            initialWidth: 400,
            initialHeight: 300
        };
    },

    initialize: function(element, options) {
        this.setOptions(this.getOptions(), options);
        this.layer = $(element);
        this.unique = new Date().getTime();
        this.ref = element;

        this.visible = false;
        this.doBlur = false;
        this.inProgress = false;

        if (this.layer && this.options.MoveToBody) {
            if (this.layer.getParent() != document.body) {
                if ($$('form').length > 0) {
                    this.layer.inject($$('form')[0]);
                }
                else {
                    this.layer.inject($(document.body));
                }
            }
        }

        if (this.layer) {
            this.ref = this.layer;
            this.layer.setStyles({
                'display': 'block',
                'visibility': 'hidden',
                'position': 'absolute'
            });

            this.coords = this.layer.getCoordinates();
            //this.coords.width++;
            this.layer.setStyles({
                'position': 'relative',
                //'visibility': 'visible',
                'z-index': 2
            });

            //if the layer element is the same as has been previously used then it would already be wrapped in a container.
            // so lets check and see.
            var useParentAsContainer = false;
            if (this.layer.getParent().id) {

                if (this.layer.getParent().id.contains('EzLayerWrapperElement')) {
                    useParentAsContainer = true;
                }
            }

            if (useParentAsContainer) {
                this.container = this.layer.getParent();
                this.container.setStyles({ 'overflow': 'hidden', 'width': 0, 'height': 0, 'display': 'none' });

            } else {
                this.container = new Element('div', {
                    'id': 'EzLayerWrapperElement' + this.unique,
                    'styles': {
                        'overflow': 'hidden',
                        'width': 0,
                        'height': 0,
                        'display': 'none'
                    }
                }).wraps(this.layer);
            }
            if (this.options.multibox) {
                this.container.setStyles({
                    'overflow': 'visible',
                    'position': 'absolute'
                });
            }

            this.layer.setStyle('visibility', 'visible');
        }

        if (this.options.modalTarget) {
            this.options.modal = false;
            var modalTarget = $(this.options.modalTarget);
            if (!this.layer) {
                this.layer = new Element('div').inject(document.body);
            }

            var tag = modalTarget.get('tag');
            if (tag == 'img' || tag == 'input' || tag == 'textarea' || tag == 'select') {
                //create a container
                modalTarget = new Element('span').wraps(modalTarget);
            }

            if (modalTarget.getStyle('position') == 'static') {
                modalTarget.setStyle('position', 'relative');
            };

            this.loaderContainer = new Element('div', {
                'class': 'ezLoader',
                'styles': {
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'width': '100%',
                    'height': '100%',
                    'zIndex': 1
                }
            }).wraps(this.layer).inject(modalTarget);
            this.content = new Element('div', {
                'styles': {
                    'position': 'absolute',
                    'height': 'auto',
                    'width': '100%',
                    'zIndex': 2
                }
            }).wraps(this.layer);
            this.bg = new Element('div', {
                'styles': {
                    'position': 'absolute',
                    'width': '100%',
                    'height': '100%',
                    'top': 0,
                    'left': 0,
                    'zIndex': 1,
                    'background-color': this.options.bgColor,
                    'opacity': this.options.opacity
                }
            }).inject(this.loaderContainer);

            this.content = this.layer;
            this.layer = this.loaderContainer;

            this.container = new Element('div').wraps(this.layer);

            if (Browser.Engine.trident4) {
                var c = modalTarget.getCoordinates();

                this.container.setStyles({
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'width': c.width,
                    'height': c.height
                });
            }

            this.coords = modalTarget.getCoordinates();
            this.coords.width++;
        }


        this.layerRef = this.layer;

        /*if (this.options.dropshadow) {
        this.coords.width += 8;
        this.coords.height += 8;
        this.layerRef = this.createDropshadow();
        }*/
        if (this.options.shadow) {
            var num = 0;
            if (this.options.shadow == 'glow') {
                num = this.options.shadowSize * 2;
            }
            if (this.options.shadow == 'drop') {
                num = this.options.shadowSize;
            }
            this.coords.width += num;
            this.coords.height += num;
            this.layerRef = this.createShadow();
        }

        this.fx = {};

        if (Browser.Engine.trident4) {
            var c = this.container;
            if (this.options.modal) {
                c = document.body;
            }
            this.frame = new iFrame({ container: c });
            this.frame.frame.setStyle('height', '100%');
            this.frameTimer = 0;
        }

        if (this.options.modal) {
            if ($('ezLayerOverlay' + this.unique)) {
                this.overlay = $('ezLayerOverlay' + this.unique).setStyles({
                    'backgroundColor': this.options.bgColor
                });
            } else {
                this.overlay = new Element('div', {
                    'id': 'ezLayerOverlay' + this.unique,
                    'styles': {
                        'position': 'absolute',
                        'display': 'none',
                        'opacity': 0,
                        'top': 0,
                        'left': 0,
                        'width': window.getScrollSize().x,
                        'height': window.getScrollSize().y,
                        'zIndex': 2,
                        'backgroundColor': this.options.bgColor
                    }
                }).inject(document.body);
            }
            this.fx.overlay = new Fx.Tween(this.overlay, {
                duration: this.options.duration,
                transition: Fx.Transitions.linear,
                onComplete: function() {
                    if (this.overlay.getStyle('opacity') == 0) {
                        this.overlay.setStyle('display', 'none');
                    }
                } .bind(this)
            });
            if (this.frame) {
                this.frame.fillPage();
            }
        }

        this.fx.container = new Fx.Morph(this.container, {
            duration: this.options.duration,
            transition: this.options.transition,
            link: 'cancel',
            onStart: function() {
                if (this.doHide && this.frame) {
                    $clear(this.frameTimer);
                }
                if (!this.options.fade) {
                    this.container.setStyle('opacity', 1);
                }

            } .bind(this),
            onComplete: function() {
                if (this.doHide) {
                    this.container.setStyle('display', 'none');
                    if (!this.options.multibox) {
                        this.layer.setStyle('display', 'none');
                        this.layer.inject(this.container, 'before');
                        if (this.frame) {
                            this.frame.frame.destroy();
                        }
                        this.container.destroy();
                        if (this.options.modalTarget) {
                            this.content.setStyle('display', 'none');
                            this.content.inject(this.layer, 'before');
                            this.layer.destroy();
                        }
                        if (this.overlay) {
                            this.overlay.destroy();
                        }
                        this.visible = false;
                        var n = layers.elements.indexOf(this.ref);
                        layers.elements.erase(this.ref);
                        layers.layers.splice(n, 1);

                        if ($type(this.ref) == 'element') {
                            if (this.ref.retrieve('show')) {
                                this.ref.store('show', false);
                                layers.show(this.ref, this.ref.retrieve('options'));
                            } else {
                                this.inProgress = false;
                            }
                            this.inProgress = false;
                        }
                    }
                }
                else {
                    if (!Browser.Engine.trident4) {
                        this.container.store('defaults', this.container.getCoordinates());
                        this.container.setStyles({
                            'overflow': 'visible'
                        });
                        if (!this.options.multibox) {
                            this.container.setStyle('height', 'auto')
                        }

                        this.updateFrameDimensions();
                    }

                    if (this.options.closeOnMouseout) {
                        this.layer.addEvents({
                            'mouseout': function() {
                                this.delay = layers.hide.delay(this.options.mouseoutDelay, layers, this.ref);
                            } .bind(this),
                            'mouseover': function() {
                                $clear(this.delay);
                            } .bind(this)
                        });
                        if (this.options.control) {
                            $(this.options.control).cloneEvents(this.layer, 'mouseout');
                            $(this.options.control).cloneEvents(this.layer, 'mouseover');
                        }
                    }

                    this.doBlur = true;
                    this.visible = true;
                    this.inProgress = false;
                }
            } .bind(this)
        });

        this.fx.layer = new Fx.Tween(this.layerRef, {
            duration: this.options.duration,
            onComplete: function() {
                if (this.doHide) {
                    (function() { this.layerRef.setStyle('opacity', 1); }).delay(50, this);
                }
            } .bind(this)
        });

        this.position();

        window.addEvent('resize', this.resize.bind(this));

        if (this.options.closeOnBlur) {
            document.addEvent('click', function(e) {
                if (this.doBlur) {
                    e = new Event(e);
                    var lCoords = this.layer.getCoordinates();
                    var doHide = true;

                    if (e.page.x > lCoords.left && e.page.x < lCoords.right && e.page.y > lCoords.top && e.page.y < lCoords.bottom) {
                        doHide = false;
                    }
                    if (doHide) {
                        if (this.options.OnHide) {
                            layers.hide(this.ref, { onHide: this.options.OnHide });
                        } else {
                            layers.hide(this.ref);
                        }
                    }

                }
            } .bind(this));
        }
    },

    updateFrameDimensions: function() {
        if (this.frame) {
            var coords = this.container.getCoordinates();
            if (this.options.modalTarget) {
                coords = $(this.options.modalTarget).getCoordinates();
                this.layer.setStyles({
                    'width': coords.width,
                    'height': coords.height
                });
                this.bg.setStyles({
                    'width': coords.width,
                    'height': coords.height
                });
            }
            this.frame.frame.setStyles({
                'width': coords.width,
                'height': coords.height
            });
        }
    },

    resize: function(w, h) {
        if (this.overlay) {
            this.overlay.setStyle('display', 'none');
            this.overlay.setStyles({
                'width': window.getScrollSize().x,
                'height': window.getScrollSize().y,
                'display': 'block'
            });
        }
        if (this.frame && this.options.modal) {
            this.frame.fillPage();
        }
        if (this.options.position == 'center') {
            this.center();

        } else if (this.options.multibox) {
            if (w) {
                var top = (window.getCoordinates().height / 2) - (h / 2);
                var left = (window.getCoordinates().width / 2) - (w / 2);
                var defaults = this.container.retrieve('defaults');
                var myFx = {};
                myFx['height'] = h;
                myFx['top'] = top > 0 ? top : 0;
                myFx['width'] = w;
                myFx['left'] = left > 0 ? left : 0;
                //console.info(defaults);
                /*if(defaults){
                myFx['height'] = [defaults.height,h];
                myFx['width'] = [defaults.width,w];
                }*/

                this.fx.container.start(myFx);
            } else {
                var cont = this.container.getCoordinates();
                var top = (window.getCoordinates().height / 2) - (cont.height / 2);
                var left = (window.getCoordinates().width / 2) - (cont.width / 2);
                var myFx = {};
                myFx['top'] = top > 0 ? top : 0;
                myFx['left'] = left > 0 ? left : 0;
                this.fx.container.start(myFx);
            }
        } else {
            this.position();
        }

        this.updateFrameDimensions();
    },

    position: function(obj) {
        var control = $(this.options.control);
        var pos = this.options.position;
        var align = this.options.align;
        var center = this.options.center;
        var container = this.container;

        if (control) {
            var cPos = control.getCoordinates();
            var styles = {};

            styles.position = 'absolute';
            styles.zIndex = 3;
            styles.top = cPos.top;
            styles.left = cPos.left;

            if (pos == 'top') {
                this.options.vertical = 'up';
                styles.top = cPos.top - this.coords.height;
                styles.left = cPos.left;
                styles.width = this.coords.width;
            }
            if (pos == 'left') {
                this.options.horizontal = 'left';
                styles.top = cPos.top;
                styles.left = cPos.left - this.coords.width;
                styles.height = this.coords.height;
            }
            if (pos == 'bottom') {
                this.options.vertical = 'down';
                styles.top = cPos.bottom;
                styles.left = cPos.left;
                styles.width = this.coords.width;
            }
            if (pos == 'right') {
                this.options.horizontal = 'right';
                styles.top = cPos.top;
                styles.left = cPos.right;
                styles.height = this.coords.height;
            }
            if (pos == 'center') {
                styles.top = cPos.bottom;
                styles.width = this.coords.width;
                styles.height = this.coords.height;
            }

            if (align == 'top') {
                styles.top = cPos.top;
            }
            if (align == 'bottom') {
                styles.top = cPos.top + cPos.height - this.coords.height
            }
            if (align == 'left') {
                styles.left = cPos.left;
            }
            if (align == 'right') {
                styles.left = cPos.left + cPos.width - this.coords.width
            }

            //IE hack for positioning layer
            if (Browser.Engine.trident) {
                styles.top += $(document.body).getStyle('margin-top').toInt();
                styles.left += $(document.body).getStyle('margin-left').toInt();
            }

            if ($type(pos) == 'array') {

                styles.top += pos[1];
                styles.left += pos[0];

                if (this.options.vertical) {
                    styles.width = this.coords.width;
                }
                if (this.options.horizontal) {
                    styles.height = this.coords.height;
                }
            }
            this.container.setStyles(styles);
            this.coords.top = styles.top;
            this.coords.left = styles.left;
            this.coords.bottom = styles.top + this.coords.height;
            this.coords.right = styles.left + this.coords.width;

            if (pos == 'center') {
                this.center(true);
            }

        } else {
            if ($type(pos) == 'array') {
                this.container.setStyles({
                    'top': pos[1],
                    'left': pos[0],
                    'position': 'absolute',
                    'zIndex': 3,
                    'width': this.coords.width,
                    'height': this.coords.height
                });
            } else if (pos == 'center') {
                if (this.options.modalTarget == null) {
                    this.container.setStyles({
                        'position': 'absolute',
                        'zIndex': 3,
                        'width': this.coords.width,
                        'height': this.coords.height
                    });
                }
                this.center();
            } else if (obj) {
                //multibox
                this.container.setStyles(obj);
            } else {
                if (this.options.modalTarget == null) {
                    this.container.setStyles({
                        'width': this.coords.width,
                        'height': this.coords.height
                    });
                }
            }
        }

    },

    center: function(control) {

        var container = $(this.options.container);
        var coords = container.getCoordinates();
        var top = coords.top + (coords.height / 2) - (this.coords.height / 2);
        var left = coords.left + (coords.width / 2) - (this.coords.width / 2);

        if (this.options.modalTarget && this.content) {
            var contentCoords = this.content.getCoordinates();
            coords = this.container.getCoordinates();
            top = (coords.height / 2) - (contentCoords.height / 2);
            left = (coords.width / 2) - (contentCoords.width / 2);
        }

        //IE hack for positioning layer
        if (Browser.Engine.trident) {
            top += $(document.body).getStyle('margin-top').toInt();
            left += $(document.body).getStyle('margin-left').toInt();
        }

        if (this.options.modalTarget) {
            if (this.content) {
                if (this.options.center == 'horizontal') {
                    this.content.setStyles({ 'left': left });
                }
                if (this.options.center == 'vertical') {
                    this.content.setStyles({ 'top': top });
                }
                if (this.options.center == 'both') {
                    this.content.setStyles({ 'top': top, 'left': left });
                }
            }
        } else {
            if (this.options.center == 'horizontal') {
                this.container.setStyles({ 'left': left });
            }
            if (this.options.center == 'vertical') {
                this.container.setStyles({ 'top': top });
            }
            if (this.options.center == 'both') {
                this.container.setStyles({ 'top': top, 'left': left });
            }
        }


    },

    show: function() {
        this.doHide = false;
        if (this.frame) {
            this.frame.show();
        }

        if (this.shadow) {
            this.shadow.resize();
        }

        this.inProgress = true;

        var myFx = {};
        var styles = {};

        if (this.options.vertical) {
            myFx['height'] = [0, this.coords.height];
            if (this.options.slide) { styles.height = 0; } else { styles.height = this.coords.height }
            if (this.options.vertical == 'up') {
                myFx['top'] = [this.coords.top + this.coords.height, this.coords.top];
            }
        } else if (this.options.multibox) {
            myFx['height'] = this.options.initialHeight;
            myFx['top'] = (window.getCoordinates().height / 2) - (this.options.initialHeight / 2);
        } else {
            styles.height = this.coords.height;
        }

        if (this.options.horizontal) {
            myFx['width'] = [0, this.coords.width];
            if (this.options.slide) { styles.width = 0; } else { styles.width = this.coords.width }
            if (this.options.horizontal == 'left') {
                myFx['left'] = [this.coords.right, this.coords.left];
            }
        } else if (this.options.multibox) {
            myFx['width'] = this.options.initialWidth;
            myFx['left'] = (window.getCoordinates().width / 2) - (this.options.initialWidth / 2);
        } else {
            styles.width = this.coords.width;
        }

        if (!this.options.slide && this.options.fade && !this.options.multibox) {
            var myFx = {};
        }

        if (this.options.fade) {
            styles.opacity = 0;
            myFx['opacity'] = [0, 1];
        }
        styles.display = 'block';

        this.options.OnShow();

        this.container.setStyles(styles);

        if (!this.options.slide && !this.options.fade && !this.options.multibox) {
            this.fx.container.fireEvent('complete');
        } else {
            this.fx.container.start(myFx);
        }


        /*if(this.options.slide){
        this.fx.container.start(myFx);
        }else{
        this.fx.container.fireEvent('complete');
        }

        if (this.options.fade) {
        this.fx.layer.start('opacity', 0, 1);
        }else{
        this.fx.layer.fireEvent('complete');
        }*/
        if (this.overlay) {
            this.overlay.setStyle('display', 'block');
            this.fx.overlay.start('opacity', 0, this.options.opacity);
        }

        if ((this.frame && !this.options.modal) || this.shadow) {
            this.contentHeight = this.container.getCoordinates().height;
            //this.frameTimer = (function(){this.checkDimensions(); }).periodical(150, this);
            this.frameTimer = (function() { this.checkDimensions(); }).delay(this.options.duration, this);
        }
    },

    hide: function(obj) {
        this.doHide = true;
        this.doBlur = false;
        this.inProgress = true;
        var myFx = {};
        var coords = this.layerRef.getCoordinates();

        window.removeEvent('resize', this.resize.bind(this));

        if (this.frameTimer) {
            $clear(this.frameTimer);
        }

        if (!this.options.multibox) {
            this.container.setStyles({
                'overflow': 'hidden',
                'width': coords.width,
                'height': coords.height
            });
        }

        if (this.options.vertical) {
            myFx['height'] = 0;
            if (this.options.vertical == 'up') {
                myFx['top'] = this.coords.bottom;
            }
        }
        if (this.options.horizontal) {
            myFx['width'] = 0;
            if (this.options.horizontal == 'left') {
                myFx['left'] = this.coords.right;
            }
        }
        if (this.options.multibox) {
            /*myFx['width'] = [this.container.getStyle('width'),0];
            myFx['height'] = [this.container.getStyle('height'),0];
            myFx['top'] = this.coords.top;
            myFx['left'] = this.coords.left;*/
            myFx['width'] = obj.width;
            myFx['height'] = obj.height;
            myFx['top'] = obj.top;
            myFx['left'] = obj.left;
        }

        if (this.options.slide || this.options.multibox) {
            this.fx.container.start(myFx);
        } else if (this.options.fade) {
            this.fx.container.fireEvent('complete', this, this.options.duration);
        } else {
            this.fx.container.fireEvent('complete');
        }

        this.options.OnHide();

        if (this.options.fade) {
            this.fx.layer.start('opacity', 0);
        } else {
            this.fx.layer.fireEvent('complete');
        }
        if (this.overlay) {
            this.fx.overlay.cancel();
            this.fx.overlay.start('opacity', 0);
        }

    },

    createDropshadow: function() {
        return new Element('div', {
            'class': 'ezLayer-upperRight'
        }).wraps(
		new Element('div', {
		    'class': 'ezLayer-lowerLeft'
		}).wraps(
		new Element('div', {
		    'class': 'ezLayer-shadow'
		}).wraps(
		new Element('div', {
		    'class': 'ezLayer-wrapper'
		}).wraps(this.layer)
		)))
    },

    createShadow: function() {
        var num = this.options.shadowSize;
        var padding = '';
        if (this.options.shadow == 'glow') {
            padding = num + 'px'
        }
        if (this.options.shadow == 'drop') {
            padding = '0px ' + num + 'px ' + num + 'px 0px';
        }
        var div = new Element('div', {
            'class': 'ezLayerShadow'
        }).wraps(
		new Element('div', {
		    'class': 'ezLayerWrapper',
		    'styles': {
		        'padding': padding
		    }
		}).wraps(this.layer)
		);
        this.shadow = new canvasBox({
            shadowType: this.options.shadow,
            shadowBlur: num,
            container: div,
            size: this.coords
        });
        return div;
    },

    checkDimensions: function() {
        if (this.contentHeight != this.container.getCoordinates().height) {
            this.contentHeight = this.container.getCoordinates().height;
            if (this.frame) {
                this.updateFrameDimensions();
            }
            if (this.shadow) {
                this.shadow.options.size = this.container.getCoordinates();
                this.shadow.resize();
            }
        }
        this.frameTimer = this.checkDimensions.delay(150, this);
    }

});