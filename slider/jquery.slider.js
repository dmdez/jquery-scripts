(function ($) {

    $.fn.slider = function (options) {

        var settings = {
            'speed': 400,
            'startIndex': 0,
            'viewportWidth': '70%',
            'onWindowResize': function () { }
        };
		
		var makePercentage = function(num) {
			if (num.toString().indexOf("%") == -1)
				num += "%";
			return num;
		};
		
        // if user defined options exists, extend settings
        if (options)
            $.extend(settings, options);

        return this.each(function (i, el) {
			
			var $wrap = $('<div class="slider-wrap" />');
			$(el).css({ 'overflow': 'hidden', 'position' : 'relative' }).wrap($wrap);			
			$(el).find('li').css({ 'position' : 'absolute', 'overflow': 'hidden', 'top': 0, 'left': 0 });
			
            $(el).bind('slider.sizing', function () {
                
				var 
					// elements
                    $container = $(this),
                    $lists = $container.find('li'),
                    viewportWidth = makePercentage(settings.viewportWidth),
					viewportWidthNum = parseFloat(settings.viewportWidth.replace('%','')),
				
					// internal variables
					count = $lists.size(),
					matrix = [],
                    actionEvent = ('ontouchstart' in window) ? "click" : "mouseover";

				var closedWidth = (100 - viewportWidth.replace('%', '')) / (count - 1);
				var viewportAddition = viewportWidthNum - closedWidth;				
				$lists.css({ 'width': viewportWidth });
				
				for ( var i=0; i < count; i++ ) {
					matrix[i] = [];
					var iii = 0;
					for ( var ii=0; ii < count; ii++ ) {
						matrix[i][ii] = iii;
						iii += i == ii ? (viewportWidthNum) : closedWidth;
					}
				}
				
				var setPosition = function(elem, idx) {
					var siblings = elem.siblings();
					var thisIndex = idx == undefined ? elem.index() : idx;
					$lists.each(function(i) {
						$(this).stop().animate({
							left: matrix[thisIndex][i] + '%'
						}, '200');
					});
				};
				
				$lists.each(function() {
					setPosition($(this), settings.startIndex);
				}).unbind('mouseover').bind('mouseover', function() {
					setPosition($(this));
				});
				
				
            }).trigger('slider.sizing');

            $(window).bind('resize', function () {
                var newWidth = settings.onWindowResize($(this).width());
				if ( newWidth ) {
					settings.viewportWidth = newWidth.toString();
					$(el).trigger('slider.sizing');
				}
            });
        });
    };
})(jQuery);