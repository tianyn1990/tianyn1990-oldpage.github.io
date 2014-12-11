$(function () {
    //是否为chrome
    var isGoo = !!navigator.userAgent.match(/AppleWebKit\b/img);
    //取元素的页面绝对 Y位置
    var getTop = function (El) {
        var top = 0;
        do {
            top += El.offsetTop;
            if (!El.offsetParent)break;
        } while ((El = El.offsetParent).nodeName != 'BODY');
        return top;
    };
    var imgs = $(".parallax-img");

    $(window).scroll(function () {
        imgs.each(function (index) {
            var $this = $(this);
            //滚过的高度
            var scrollTop = isGoo ? document.body.scrollTop : document.documentElement.scrollTop;
            //距离最顶端高度
            var fromTop = getTop(this);
            //屏幕高度
            var screenHeight = window.screen.availHeight;
            var bgy = 0;
            if (index === 0 && fromTop < scrollTop) {
                bgy = (scrollTop - fromTop) * 200 / 800;
                $this.css({
                    "background-position-y": -bgy + "px"
                });
            } else if (index !== 0 && fromTop < (scrollTop + screenHeight)) {
                bgy = (scrollTop + screenHeight - fromTop) * 200 / 800;
                $this.css({
                    "background-position-y": -bgy + "px"
                });
            }
        });
    });

    var pos = true;
//    setTimeout(scrollAuto,0);
//    var scrollItv = setInterval(scrollAuto,10000);
    function scrollAuto(){
        pos?$("html,body").animate({scrollTop: $("#last").offset().top}, 10000,"linear"):
            $("html,body").animate({scrollTop: $("#first").offset().top}, 10000,"linear");
        pos = !pos;
    }

});