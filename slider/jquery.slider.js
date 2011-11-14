(function ($) {

	$.easing.customSlideIn = function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	};
	
    $.fn.slider = function (options) {

        var settings = {
            'speed': 400,
            'startIndex': 0,
            'horizontal': true,
			'easing': 'customSlideIn'
        };
		
		var createMatrix = function(n, n1, n2) {
			var matrix = [];
			for ( var i=0; i < n; i++ ) {
				matrix[i] = [];
				var iii = 0;
				for ( var ii=0; ii < n; ii++ ) {
					matrix[i][ii] = iii;
					iii += i == ii ? (n1) : n2;
				}
			}
			return matrix;
		};

        if (options)
            $.extend(settings, options);

        return this.each(function (i, el) {
			
			$(el).css({ 
				'overflow': 'hidden', 
				'position' : 'relative',
				'listStyleType': 'none',
				'margin': 0,
				'padding': 0
			});			
			$(el).find('li').css({ 
				'position' : 'absolute', 
				'overflow': 'hidden', 
				'top': 0, 
				'left': 0 ,
				'listStyleType': 'none',
				'margin': 0,
				'padding': 0
			});
			
            $(el).bind('slider.sizing', function () {
                
				var 
					// elements
                    $container = $(this),
                    $lists = $container.find('li'),
                    
					// internal variables
					count = $lists.size(),
					actionEvent = ('ontouchstart' in window) ? "click" : "mouseover",
					activeIndex = settings.startIndex;					
				
				// reset the width for resizing adjustments
				$lists.css('width', '');
				
				var viewportSizeNum = Math.round(($lists.width() / $container.width()) * 100);					
				var closedSize = (100 - viewportSizeNum) / (count - 1);
				var viewportAddition = viewportSizeNum - closedSize;				
				var matrix = createMatrix(count, viewportSizeNum, closedSize);				
				
				$lists.css({ 'width': (settings.horizontal ? viewportSizeNum : "100") + '%' });				
				
				var setPosition = function(elem, idx) {
					var siblings = elem.siblings();
					var thisIndex = idx == undefined ? elem.index() : idx;
					$lists.each(function(i) {
						if ( settings.horizontal )
							$(this).stop().animate({ left: matrix[thisIndex][i] + '%' }, settings.speed, settings.easing);
						else
							$(this).stop().animate({ top: matrix[thisIndex][i] + '%' }, settings.speed, settings.easing);
					});
					activeIndex = thisIndex;
				};
				
				$lists.each(function() {
					setPosition($(this), activeIndex);
				}).unbind(actionEvent).bind(actionEvent, function() {
					var allowEvent = $(this).index() == activeIndex;
					setPosition($(this));					
					return allowEvent;
				});
				
				
            }).trigger('slider.sizing');

            $(window).bind('resize', function () {
                $(el).trigger('slider.sizing');
            });
        });
    };
})(jQuery);