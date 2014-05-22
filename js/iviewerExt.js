/*iviewer extension for autodesk
 * binds click event for anchors that have iviewer associated with them(has class "iviewerenabled").
 * on click of anchor image is opened in full screen with zoom-in, zoom-out, fit to width and 1:1 controls.
 * */


(function (jQuery) {
    var viewer = {
        initialize: function (format, options) {
            var self = this;
            this.body = jQuery("body");
            options = jQuery.extend({

            }, options || {});
            /*supported formats*/
            var supportedFormats = ['png', 'jpeg', 'jpg', 'gif', 'bmp'];
            this.wrapper = this.body.find('.wrapper');
            if (this.wrapper.length === 0) {
                this.wrapper = this.constructViewer();
            }
            jQuery.getJSON("../lang/messages.json", function (data) {
                self.messages = data;
            });

            this.imgcontainer = this.wrapper.find('.viewer');

            this.loader = this.imgcontainer.find('.loader');
            this.message = this.loader.find('span');
            this.previewImage = jQuery('a.iviewerenabled');

            //if(supportedFormats.indexOf(format) !== -1) {
            /*binding click event for anchors that have iviewer associated with them*/
            jQuery(document).on("click", 'a.iviewerenabled', function (e) {
                e.stopPropagation();
                self.imgcontainer.show();
                self.requestFullscreen();
                self.start(jQuery(e.currentTarget).attr('data-orig'));
                return false;
            });
            //} else {
            /*    this.previewImage.click(function(e){
             e.stopPropagation();
             return false;

             });
             jQuery('.mk_viewDoc a span.bMrTAbs').hide();
             }*/
        },
        constructViewer: function () {
            return jQuery('<div class="wrapper" id="wrapper">' +
                '<div id="viewer" class="viewer">' +
                '<div class="loader">' +
                '<div class="iviewer-spinner">' +
                '</div>' +
                '<span></span>' +
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
                    self.loader.show();
                    self.message.text(self.messages.LOADING_MESSAGE);
                },
                onFinishLoad: function (ev, src) {
                    if (self.imageViewer.data('uiIviewer')) {
                        self.imgcontainer.show();
                        setTimeout(function () {
                            self.imageViewer.iviewer('update');
                            self.imageViewer.iviewer("fit");
                            self.imageViewer.iviewer("zoom_by", -1);
                            self.loader.hide();
                        }, 100);
                        self.imgcontainer.find('.iviewerClose').attr('title', self.messages.EXIT_FULLSCREEN);
                        self.imgcontainer.find('.iviewer_zoom_in').attr('title', self.messages.ZOOM_IN);
                        self.imgcontainer.find('.iviewer_zoom_out').attr('title', self.messages.ZOOM_OUT);
                        self.imgcontainer.find('.iviewer_zoom_zero').attr('title', self.messages.ACTUAL_SIZE);
                        self.imgcontainer.find('.iviewer_zoom_fit').attr('title', self.messages.FIT_TO_SCREEN);
                        self.imgcontainer.find('.iviewer_button').wrapAll('<div id="viewerControlContainer"></div>');
                        self.imgcontainer.find('.iviewer_button').show();
                    }
                },
                onErrorLoad: function (ev, src) {
                    self.loader.find('.iviewer_spinner').hide();
                    self.message.text(self.messages.LOAD_ERROR_MESSAGE);
                }
            }, self.options));
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
            this.imageViewer.iviewer("destroy");
            this.imgcontainer.hide();
            jQuery(document).unbind("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange");
            this.imgcontainer.find('.iviewerClose').unbind('click');
            jQuery(document).unbind('keyup.iviewer');
            jQuery('#viewerControlContainer').remove();
            setTimeout(function () {
                jQuery(window).trigger('resize');
            }, 300)
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
    jQuery(document).ready(function () {
        viewer.initialize();
    });
    return viewer;
})(jQuery);
