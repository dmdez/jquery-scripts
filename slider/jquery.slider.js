(function($) {

	$.easing.customSlideIn = function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	};

    $.slider = function(element, options) {

        var defaults = {
            'speed': 400,
            'startIndex': undefined,
            'horizontal': true,
			'easing': 'customSlideIn',
			'eventType': 'mouseover',
			'onAfterOpen': function() {},
			'onBeforeOpen': function() {}
        }

        var slider = this;
        slider.settings = $.extend({}, defaults, options);
        
		var $element = $(element);
		var $elementLi = $('li', $element);
		var childrenCount = $elementLi.size();
		var viewportSizeNum = calculateWidthPercentage($element, $elementLi);
		var defaultClosedSize = Math.round(100 / childrenCount);
		var matrix = [];
		var closedSize = 0;
		var activeIndex = slider.settings.startIndex;
		var actionEvent = ('ontouchstart' in window) ? "click" : slider.settings.eventType;
		
		$.extend(slider, {
			init: function() {            
				$element.css({ 
					'overflow': 'hidden', 
					'position' : 'relative',
					'listStyleType': 'none',
					'margin': 0,
					'padding': 0
				});			
				$elementLi.css({ 
					'position' : 'absolute', 
					'overflow': 'hidden', 
					'top': 0, 
					'left': 0 ,
					'listStyleType': 'none',
					'margin': 0,
					'padding': 0
				});
				
				setSize();
				
				$elementLi.each(function() {
					setPosition($(this), activeIndex);
				}).bind(actionEvent, function(e) {
					var itemIndex = $(this).index();
					if ( itemIndex == activeIndex )
						return true;
					e.preventDefault();
					setPosition($(this), itemIndex);
					return false;
				});
			},
			
			goToFrame: function(idx) {
				$($elementLi[idx]).trigger('mouseover');
			},
			
			reset: function() {
				$elementLi.each(function() {
					setPosition($(this), slider.settings.startIndex);
				});
			}
		});
        
		function setPosition(elem, idx) {
			var siblings = elem.siblings();
			var useDefault = false;
			if ( idx == undefined )
				useDefault = true;
				
			$elementLi.removeClass('slide-open').each(function(i) {
				var animateSize = (useDefault ? (defaultClosedSize * i) : matrix[idx][i]) + '%';
				var animateConfig = { left: animateSize }
				
				if ( !slider.settings.horizontal ) {
					animateConfig.left = undefined;
					animateConfig.top = animateSize;
				}
				
				if ( idx == $(this).index() ) 
					slider.settings.onBeforeOpen(this);
				
				$(this)
					.stop()
					.animate(animateConfig, slider.settings.speed, slider.settings.easing, function() {
						if ( idx == $(this).index() ) {
							$(this).addClass('slide-open');
							slider.settings.onAfterOpen(this);
						}
					});
			});
			activeIndex = idx;
		}
		
		function setSize() {
			closedSize = (100 - viewportSizeNum) / (childrenCount - 1);
			matrix = buildSizingMatrix(childrenCount, viewportSizeNum, closedSize);
			$element.data('viewportSizeNum', viewportSizeNum);			
		}
				
		function buildSizingMatrix(n, n1, n2) {
			var matrix = [];
			var defaultSize = Math.round(100 / n);
			for ( var i=0; i < n; i++ ) {
				matrix[i] = [];
				var iii = 0;
				for ( var ii=0; ii < n; ii++ ) {
					matrix[i][ii] = iii;
					iii += i == ii ? (n1) : n2;
				}
			}			
			return matrix;
		}
		
		function calculateWidthPercentage(container, lists) {
			if ( slider.settings.horizontal ) {
					return Math.round((lists.width() / container.width()) * 100);
			}
			return Math.round((lists.height() / container.height()) * 100);			
		}
		
        slider.init();
		
		$(window).bind('resize', function () {
			viewportSizeNum = calculateWidthPercentage($element, $elementLi);
			setSize();
			$elementLi.each(function() {
				setPosition($(this), activeIndex);
			});
		});

    }

    $.fn.slider = function(options) {
		if ( typeof options == 'string') {
			var instance = $(this).data('slider');
			var args = Array.prototype.slice.call(arguments, 1);
			if ( instance[options] ) {
				return instance[options].apply(instance, args);
			}
			return;
		} else {
			return this.each(function() {
				if (undefined == $(this).data('slider')) {
					var plugin = new $.slider(this, options);
					$(this).data('slider', plugin);
				}
			});
		}
    }

})(jQuery);
