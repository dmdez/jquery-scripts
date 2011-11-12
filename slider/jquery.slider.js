(function ($) {

    $.fn.slider = function (options) {

        var settings = {
            'speed': 400,
            'startIndex': 0,
            'viewportWidth': '70%',
            'onWindowResize': function () { }
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

                var viewportWidthNum = settings.viewportWidth.replace('%', '');
                var adjustedViewportWidthNum = viewportWidthNum / 1.2;

                var closed_width = (100 - viewportWidthNum) / (count - 1);

                //closed_width = closed_width / 1.2;
                viewportWidthNum = viewportWidthNum / 1.2;
                closed_width = closed_width / 1.2;

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

                    if (current_index == active_index)
                        return;

                    $lists.each(function (i) {
                        if (i != current_index) {
                            $(this).stop().animate({ 'width': closed_width + '%' }, {
                                duration: settings.speed
                            });
                        }
                    });
                    current_item.stop().animate({ 'width': viewportWidthNum + '%' }, {
                        duration: settings.speed
                    });

                    active_index = current_index;

                    return false;
                };

                // create wrapper
                $wrap
                    .css({ 'overflow': 'hidden' });

                // container formatting and add wrapper
                var containerCss = stripListCss;
                containerCss.overflow = "hidden";
                $container
                    .wrap($wrap)
                    .css(containerCss);

                $container.css({ width: '120%' });
                function checkAnimation() {
                    setInterval(function () {
                        if ($lists.is(":animated")) {
                            $container.stop().animate({ width: '130%' }, settings.speed);
                        } else {
                            $container.stop().animate({ width: '120%' }, settings.speed);
                        }
                    }, 20);
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
                        'width': viewportWidthNum + '%'
                    });
            }).trigger('slider.sizing');

            $(window).bind('resize', function () {
                var newWidth = settings.onWindowResize($(this).width());
            });
        });
    };
})(jQuery);