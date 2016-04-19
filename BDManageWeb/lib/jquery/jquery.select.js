(function ($) {

    jQuery.fn.select = function (options, body, callBack) {
        return this.each(function () {
            var $this = $(this);
            var $shows = $this.find(".shows");
            var $selectOption = $this.find(".selectOption");
            var $el = $(body).find("ul > li");

            $this.click(function (e) {
                $(this).toggleClass("zIndex");
                $(body).find("ul").toggleClass("zIndex");
                $(body).find("ul").toggleClass("dis");
                e.stopPropagation();
            });

            $el.bind("click", function () {
                var $this_ = $(this);

                $this.find("span").removeClass("gray");
                $this.find(".selectOption").text($this_.text());
                callBack($this_.text(), $this_.attr("value"));
            });

            $("body").bind("click", function () {
                $this.removeClass("zIndex");
                $(body).find("ul").removeClass("zIndex");
                $(body).find("ul").removeClass("dis");
            })

            //eahc End    
        });

    }

})(jQuery); 