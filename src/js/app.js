/* jshint multistr:true */

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

    var win = $(window);
    var bod = $('body');
    var articles = $('#articles');
    var article = $('#article');
    var globalSections = $('.global-section');
    var latestnews = $('#latestnews');
    var articleList = $('#articleList');
    var articleDetail = $('#articleDetail');

    // win.on('resize', function(){
    //     globalSections.height(win.height());
    // });
    // globalSections.height(win.height());

    // hash 路由
    Txbb.Router.route('/', showIndex);
    Txbb.Router.route('/posts', showArticles);
    Txbb.Router.route('/post/:id', showArticle);
    Txbb.Router.endRoute();

    function toTop() {
        bod.css('overflow', 'hidden');
        bod.scrollTop(0);
    }

    function showIndex() {
        bod.css('overflow', 'auto');
        globalSections.css('display', 'none');
        $.get('data/posts.json', function(resp){
            var data = resp.data.slice(0, 2);
            var tmpl = compileTmpl('each', 'tmplPostItem', data);
            latestnews.html(tmpl);
        }, 'json');
    }

    function showArticles() {
        toTop();
        globalSections.css('display', 'none');
        articles.css('display', 'block');
        $.get('data/posts.json', function(resp){
            var tmpl = compileTmpl('each', 'tmplPostCard', resp.data);
            articleList.html(tmpl);
        }, 'json');
    }

    function showArticle(name) {
        toTop();
        globalSections.css('display', 'none');
        article.css('display', 'block');
        $.get('posts/'+ name +'.md', function(resp){
            var html = marked(resp);
            articleDetail.html(html);
        });
    }

    var tmpls = {};

    tmpls.tmplPostItem = '<div class="am-u-md-6"> \
        <a href="{{url}}" class="article-card"> \
            <h1 class="title">{{title}}</h1> \
            <p class="desc">{{brief}}</p> \
            <p class="more"><a href="{{url}}">阅读更多</a></p> \
        </a> \
    </div>';

    tmpls.tmplPostCard = '<li> \
        <div class="article-card"> \
            <a href="{{url}}"><h1 class="title">{{title}}</h1></a> \
            <p class="time">发布于 {{createdAt}}</p> \
            <p class="desc">{{brief}}</p> \
            <a class="link" href="{{url}}">阅读更多</a> \
        </div> \
    </li>';

    function compileTmpl(type, tmplName, data) {
        var back = '';
        if (type === 'each') {
            data.forEach(function(item){
                back +=
                tmpls[tmplName].replace(/\{\{url\}\}/g, item.url)
                    .replace(/\{\{title\}\}/g, item.title)
                    .replace(/\{\{brief\}\}/g, item.brief)
                    .replace(/\{\{createdAt\}\}/g, item.createdAt);
            });
        } else if (type === 'with') {

        }
        return back;
    }
}());
