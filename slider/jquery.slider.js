(function ($) {
    $.fn.slider = function (options) {

        var settings = {
            'speed': 400,
            'align': 'left',
            'marginX': 0,
            'startIndex': 0
        };

        // if user defined options exists, extend settings
        if (options)
            $.extend(settings, options);

        return this.each(function (i, el) {

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
                total_margin_x = settings.marginX * count,
                closed_width = Math.round((width - settings.viewportWidth - total_margin_x) / (count - 1)),
                overflow_list_width = 2000,
                active_index = settings.startIndex;

            var listProperties = {
                'float': 'left',
                'overflow': 'hidden',
                'width': closed_width,
                'marginRight': settings.marginX
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
                .wrap($wrap);

            // Image formatting
            $images
                .width(settings.viewportWidth)
                .css({ 'float': settings.align, 'border': 0 });

            // list formatting and event handling
            $lists
                .css(listProperties)
                .height(height)
                .bind('mouseover', action)
                .bind('click', action);

            $first_list_item
                .css({
                    'width': settings.viewportWidth
                });
        });
    };
})(jQuery);