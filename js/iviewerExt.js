jQuery(document).ready(function() {
   jQuery('div').viewerExt();
});
/*iviewer extension for autodesk
 * binds click event for anchors that have iviewer associated with them(has class "iviewerenabled").
 * on click of anchor image is opened in full screen with zoom-in, zoom-out, fit to width and 1:1 controls.
 * */


(function (jQuery) {
    var messages = {
        fullscreen: "Full Screen",
        exit_fullscreen: "Exit Fullscreen",
        zoom_in: "Zoom in",
        zoom_out: "Zoom out",
        actual_size: "Actual Size",
        fit_to_screen: "Fit To Screen",
        loading_message: "Loading...",
        load_error_message: "Error in loading image..."
    };

    jQuery.fn.viewerExtLocalization = function (msgs) {
        jQuery.extend(true, messages, msgs);
    };
    jQuery.fn.viewerExt = function (options) {
        var viewer = {
            initialize: function (element) {
                var self = this;
                this.body = jQuery("body");
                this.options = jQuery.extend({

                }, options || {});
                this.messages = messages;
                /*supported formats*/
                var supportedFormats = ['png', 'jpeg', 'jpg', 'gif', 'bmp'];
                this.wrapper = this.body.find('.wrapper');
                if (this.wrapper.length === 0) {
                    this.wrapper = this.constructViewer();
                }


                this.imgcontainer = this.wrapper.find('.viewer');

                this.loader = this.imgcontainer.find('.loader');
                this.message = this.loader.find('span');

                /*binding click event for anchors that have iviewer associated with them*/
                jQuery(element).on("click", 'a.iviewerenabled', function (e) {
                    e.stopPropagation();
                    var src = jQuery(e.currentTarget).attr('data-orig');
                    var format = src.substring(src.lastIndexOf(".") + 1);
                    if (supportedFormats.indexOf(format) !== -1) {
                        self.imgcontainer.show();
                        self.requestFullscreen();
                        self.start(src);
                    } else {
                        self.imgcontainer.find('span.bMrTAbs').hide();
                    }
                    return false;
                });
            },
            constructViewer: function () {
                return jQuery('<div class="wrapper" id="wrapper">' +
                    '<div id="viewer" class="viewer">' +
                    '<div class="loader">' +
                    '<div class="iviewer-spinner">' +
                    '</div>' +
                    '<span>' +
                    '</span>'+
                    '</div>' +
                    '</div>' +
                    '</div>')
                    .appendTo(this.body);
            },
            start: function (imgUrl) {
                var self = this;
                self.imageViewer = self.imgcontainer.iviewer(jQuery.extend({
                    src: imgUrl,
                    zoom_min: 5,
                    zoom_delta: 1.5,
                    ui_disabled: false,
                    zoom: "fit",
                    onStartLoad: function (ev, src) {
                        jQuery('<div class="iviewerClose iviewer_button"></div>').appendTo(self.imgcontainer);
                        /*handle all events for the viewer*/
                        self.handleEvents();
                        /*self.imgcontainer.css('z-index', E2O.util.domMaxZindex + 4);
                        self.imgcontainer.find('.iviewerClose').first().css('z-index', E2O.util.domMaxZindex + 5);
                        */self.loader.show();
                        self.message.text(self.messages.loading_message);
                    },
                    onFinishLoad: function (ev, src) {
                        if (self.imageViewer.data('uiIviewer')) {
                            self.imgcontainer.show();
                            self.imgcontainer.find('.iviewerClose').attr('title', self.messages.exit_fullscreen);
                            self.imgcontainer.find('.iviewer_zoom_in').attr('title', self.messages.zoom_in);
                            self.imgcontainer.find('.iviewer_zoom_out').attr('title', self.messages.zoom_out);
                            self.imgcontainer.find('.iviewer_zoom_zero').attr('title', self.messages.actual_size);
                            self.imgcontainer.find('.iviewer_zoom_fit').attr('title', self.messages.fit_to_screen);
                            self.imgcontainer.find('.iviewer_button').wrapAll('<div id="viewerControlContainer"></div>');
                            self.imgcontainer.find('.iviewer_button').show();
                            setTimeout(function() {
                                self.loader.hide();
                                self.imageViewer.iviewer('update');
                                self.imageViewer.iviewer("fit");
                                //self.imageViewer.iviewer("zoom_by", -1);
                            }, 0);
                        }
                    },
                    onErrorLoad: function (ev, src) {
                        self.loader.find('.iviewer_spinner').hide();
                        self.message.text(self.messages.load_error_message);
                    }
                }));
            },
            handleEvents: function () {
                var self = this;
                if (!Modernizr.fullscreen) {
                    jQuery(document).on('keyup.iviewer', function (event) {
                        //to avoid the event trigger when not in full screen
                        if (event.keyCode === 27) {
                            self.destroyViewer();
                        }

                    });
                }
                /*on fullscreen callback*/
                jQuery(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", function (event) {
                    if (document.webkitFullscreenElement || document.mozFullScreenElement || document.fullscreenElement || document.msFullscreenElement || document.webkitIsFullScreen) {
                        /*do nothing when enter fullscreen*/
                    } else {
                        /*destroy viewer when exit fullscreen*/
                        self.destroyViewer();
                    }
                });
                this.imgcontainer.find('.iviewerClose').click(function () {
                    self.exitFullscreen();
                });
            },

            destroyViewer: function () {
                jQuery(document).unbind("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange");
                this.imgcontainer.find('.iviewerClose').unbind('click');
                jQuery(document).unbind('keyup.iviewer');
                this.imgcontainer.hide();
                this.imgcontainer.find('#viewerControlContainer').remove();
                this.imageViewer.iviewer("destroy");
            },
            exitFullscreen: function () {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                if (!Modernizr.fullscreen) {
                    this.imgcontainer.removeClass('ieFullScreen');
                    this.destroyViewer();
                }
            },
            requestFullscreen: function () {
                var element = this.imgcontainer[0];
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
                if (!Modernizr.fullscreen) {
                    this.imgcontainer.addClass('ieFullScreen');
                }
            }
        };
        viewer.initialize(this);
        return viewer;
    }
})(jQuery);