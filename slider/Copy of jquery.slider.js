(function ($) {
    $.fn.slider = function (options) {

        var settings = {
            'speed': 400,
            'startIndex': 0
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
                    height = $container.height(),
                    count = $lists.size(),
                    overflow_list_width = 2000,
                    active_index = settings.startIndex;

                // calculate total margin,padding,border widths for sizing
                var outer_x = 0;
                var lrgr_outer_y = 0;
                $lists.each(function () {
                    outer_x += $(this).outerWidth(true) - $(this).width();
                    var y_space = $(this).outerHeight(true) - $(this).height();
                    if (lrgr_outer_y < y_space) {
                        lrgr_outer_y = y_space;
                    }
                });

                var closed_width = Math.round((width - settings.viewportWidth - outer_x) / (count - 1));

                var stripListCss = { margin: '0', padding: '0', 'listStyleType': 'none' };

                var listProperties = stripListCss;
                listProperties = {
                    'float': 'left',
                    'overflow': 'hidden',
                    'width': closed_width
                };

                var action = function () {
                    var current_index = $(this).index();

                    $(this)
                        .stop()
                        .animate({
                            'width': settings.viewportWidth
                        }, settings.speed, 'easeOutQuint');

                    $lists.each(function (i) {
                        if (i != current_index) {
                            $(this)
                            .stop()
                            .animate({
                                'width': closed_width
                            }, settings.speed, 'easeOutQuint');
                        }
                    });

                    active_index = current_index;
                };

                // create wrapper
                $wrap
                    .width(width)
                    .height(height)
                    .css({ 'overflow': 'hidden' });

                // container formatting and add wrapper
                $container
                    .width(overflow_list_width)
                    .wrap($wrap)
                    .css(stripListCss);

                // Image formatting
                $images
                    .width(settings.viewportWidth)
                    .css({ 'border': 0 });

                // list formatting and event handling
                $lists
                    .css(listProperties)
                    .height(height - lrgr_outer_y)
                    .bind('mouseover', action)
                    .bind('click', action);

                $first_list_item
                    .css({
                        'width': settings.viewportWidth
                    });
            }).trigger('slider.sizing');
        });
    };
})(jQuery);