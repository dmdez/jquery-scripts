(function ($) {

	$.easing.customSlideIn = function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	};
	
    $.fn.slider = function (options) {
		
		if ( typeof options == "string" ) {
			switch(options) {
				case "goto":
					if ( arguments[1]) {
						alert(arguments[1]);
					}
					break;
			}
			return;
		}
		
        var settings = {
            'speed': 400,
            'startIndex': 0,
            'horizontal': true,
			'easing': 'customSlideIn'
        };
		
		var createSizingMatrix = function(n, n1, n2) {
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
		
		var calculateWidthPercentage = function(container, lists) {
			return Math.round((lists.width() / container.width()) * 100);
		}
		
        if (options)
            $.extend(settings, options);

        return this.each(function (i, el) {
			var _el = $(el);
			var _elLists = _el.find('li');
			_el.css({ 
				'overflow': 'hidden', 
				'position' : 'relative',
				'listStyleType': 'none',
				'margin': 0,
				'padding': 0
			});			
			_elLists.css({ 
				'position' : 'absolute', 
				'overflow': 'hidden', 
				'top': 0, 
				'left': 0 ,
				'listStyleType': 'none',
				'margin': 0,
				'padding': 0
			});
			
            _el.bind('slider.sizing', function () {
                
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
				
				var viewportSizeNum = calculateWidthPercentage($container, $lists);
				var closedSize = (100 - viewportSizeNum) / (count - 1);
				var viewportAddition = viewportSizeNum - closedSize;				
				var matrix = createSizingMatrix(count, viewportSizeNum, closedSize);				
				
				$container.data('viewportSizeNum', viewportSizeNum);
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
				_el.trigger('slider.sizing');
            });
        });
    };
})(jQuery);