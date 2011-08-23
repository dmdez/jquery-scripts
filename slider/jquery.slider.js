(function ($) {

    $.fn.slider = function (options) {

        var settings = {
            'speed': 400,
            'startIndex': 0,
            viewportWidth: '70%'
        };

        // if user defined options exists, extend settings
        if (options)
            $.extend(settings, options);

        return this.each(function (i, el) {

            $(el).bind('slider.sizing', function () {
                var 
                // elements
                    $container = $(this),
                    $wrap = $('<div class="slider-wrap" />'),
                    $lists = $container.find('li'),
                    $images = $lists.find('img'),
                    $first_list_item = $($lists[settings.startIndex]),

                // internal variables
                    width = $container.width(),
                    //height = $container.height(),
                    count = $lists.size(),
                    overflow_list_width = 90000,
                    active_index = settings.startIndex,
                    actionEvent = ('ontouchstart' in window) ? "click" : "mouseover";

                if (settings.viewportWidth.toString().indexOf("%") == -1)
                    settings.viewportWidth += "%";

                var closed_width = Math.round((width - settings.viewportWidth) / (count - 1));
                closed_width = (100 - settings.viewportWidth.replace('%', '')) / (count - 1);

                var stripListCss = { margin: '0', padding: '0', 'listStyleType': 'none' };

                var listProperties = stripListCss;
                listProperties = {
                    'float': 'left',
                    'overflow': 'hidden',
                    'width': closed_width + '%'
                };

                var action = function () {
                    var current_index = $(this).index();
                    var current_item = $(this);

                    $lists.each(function (i) {
                        if (i != current_index) {
                            $(this).stop().animate({ 'width': closed_width + '%' }, {
                                duration: settings.speed,
                            }, 'easeOutQuint');
                        }
                    });
                    current_item.stop().animate({ 'width': settings.viewportWidth }, {
                        duration: settings.speed
                    }, 'easeOutQuint');

                    active_index = current_index;
                    
                    return false;
                };

                // create wrapper
                $wrap
                    .css({ 'overflow': 'hidden' });

                // container formatting and add wrapper
                $container
                    .wrap($wrap)
                    .css(stripListCss);

                function checkAnimation() {
                  setInterval(function() {
                  	if( $lists.is(":animated") ) {
                      $container.stop().animate({width: '104%'}, 400);
                  	} else {
                      $container.stop().animate({width: '100%'}, 400);
                    }
                  }, 200);
                }
                checkAnimation();


                // Image formatting
                $images.css({ 'border': 0 });

                // list formatting and event handling
                $lists
                    .css(listProperties)
                    .bind(actionEvent, action);

                $first_list_item
                    .css({
                        'width': settings.viewportWidth
                    });
            }).trigger('slider.sizing');
        });
    };
})(jQuery);