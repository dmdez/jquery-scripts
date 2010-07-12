/*
* jQuery class changer plug-in 1.0
*
* Copyright (c) 2006 - 2010 Digital Evolution Group
*
*/
(function ($) {
    $.fn.changeClass = function (options) {
        var cfg = {
            levels: 4,
            addTo: 'body',
            classPrefix: 'changeClassTo',
            buttonText: 'A'
        };
        // override configuration options with user supplied object
        cfg = $.extend(cfg, options);
        var cookiePrefix = "__" + cfg.classPrefix;
        var cookieVal;
        if ($.cookie) cookieVal = $.cookie(cookiePrefix, undefined);

        return this.each(function (idx, element) {
            var buttons = [];
            for (var i = 0; i < cfg.levels; i++) {
                var button = $('<a>' + cfg.buttonText + '</a>')
                          .attr('href', 'javascript:void(0)')
                          .addClass(cfg.classPrefix + (i + 1))
                          .bind('click', { idx: i }, function (event) {
                              $(buttons).each(function (i, el) {
                                  $(el).removeClass(cfg.classPrefix + '_active');
                              });
                              $(cfg.addTo).removeClass($.proxy(function () {
                                  return $.map(this.buttons, function (el) {
                                      return el.attr('class');
                                  }).join(' ');
                              }, { buttons: buttons }));
                              $(cfg.addTo).addClass(cfg.classPrefix + (event.data.idx + 1));
                              if ( $.cookie ) $.cookie(cookiePrefix, event.data.idx.toString(), { expires: 1, path: "/" });
                              $(this).addClass(cfg.classPrefix + '_active');
                          });
                if (cookieVal == i) button.click();
                buttons.push(button);
                $(element).append(button);
            }
        });

    };
})(jQuery);
