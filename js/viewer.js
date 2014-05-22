var $ = jQuery;
$(document).ready(function () {
    var imageViewer;
    $(".thumbnail .image").click(function () {
        $( ".iviewer" ).fadeIn( 1000, function() {
            $( ".image" ).fadeIn( 100 );
        });

        var self = this;
        imageViewer = $("#viewer").iviewer({
            src: $(this).attr('orig-src'),
            ui_disabled: $(this).attr("ui-disabled"),
            update_on_resize: $(this).attr("update-on-resize") || false,
            zoom: $(this).attr("zoom") || 100,
            zoom_max: $(this).attr("zoom-max"),
            zoom_min: $(this).attr("zoom-min"),
            zoom_base: $(this).attr("zoom-base"),
            zoom_delta: $(this).attr("zoom-delta"),
            zoom_animation: $(this).attr("zoom-animation") || true,
            mousewheel: false,
            onFinishLoad: function (ev, src) {
                if($('#viewer').find('img').width() > $(window).width() || $('#viewer').find('img').height() > $(window).height()) {
                    imageViewer.iviewer("fit");
                }
            }
        });
        $(".close").click(function () {
            if($("#viewer").data('ui-iviewer')) {
                imageViewer.iviewer("destroy");
            }
            $(".iviewer").hide();
        });
            imageViewer.on('DOMMouseScroll mousewheel', function (e) {
                if(!$(self).attr("ui-disabled")) {

                    if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
                    //alternative options for wheelData: wheelDeltaX & wheelDeltaY
                    //scroll down
                    console.log('Down');
                    imageViewer.iviewer('zoom_by', Math.abs($(self).attr("zoom-delta")) || 1.4);
                } else {
                    //scroll up
                    console.log('Up');
                    imageViewer.iviewer('zoom_by', -Math.abs($(self).attr("zoom-delta"))  || -1.4);
                }
                }
                //prevent page fom scrolling
                return false;
            });
    });

});