(function(){
    'use strict';

    var map = new AMap.Map('map', {
        zoom: 14,
        animateEnable: false,
        scrollWheel: false
    });
    new AMap.Marker({
        position: new AMap.LngLat(118.76471758, 31.97140463),
        title: '活动地点',
        map: map
    });
    map.panTo(new AMap.LngLat(118.76471758 + 0.03, 31.97140463));

    $.fn.zyShow = function() {
        var _this = this;
        _this.css({
            display: 'block',
            opacity: 0,
            transform: 'translateX(100%)',
            transition: 'none'
        });
        setTimeout(function(){
            _this.css({
                opacity: 1,
                transform: 'translateX(0)',
                transition: 'all .5s ease'
            });
        }, 16);
    };

    $.fn.zyHide = function() {
        var _this = this;
        _this.css({
            opacity: 0,
            transform: 'translateX(100%)',
            transition: 'all .5s ease'
        });
        setTimeout(function(){
            _this.css({
                display: 'none'
            });
        }, 600);
    };

    window.showHeader = function(){
        $('#header').addClass('active');
    };

    window.hideHeader = function() {
        $('#header').removeClass('active');
    };
}());
