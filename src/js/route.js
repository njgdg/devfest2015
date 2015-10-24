if (!window.Txbb) window.Txbb = {};
(function (root) {

    'use strict';

    var funcs = {};

    var pathCache = [];

    function log() {
        var arr = ['Txbb.Router Component:'];
        arr = arr.concat(arguments);
        console.log.apply(console, arr);
    }

    if (window.location.hash) {
        pathCache.push(window.location.hash.substring(1));
        log('Path in Cache', pathCache);
    }

    // 转换url规则
    // /url/:param1/:param2
    function convertHash(hash) {
        var arr = [];
        var pathname = hash.replace(/#/g, '');

        if (pathname.indexOf(':') > -1) {
            arr = pathname.split(':');
            pathname = arr.shift();
        }

        return {
            url: pathname,
            params: arr
        };
    }

    // 提取url，params，search
    function convertPath(path) {
        path = path
            .replace(/#/g, '')
            .replace(/^\//, '');

        var urlPath = path;
        var urlRuleArr = '';
        var search = {};
        var searchParamGroupArr;

        if (path.indexOf('?') > -1) { // 存在 search 参数
            urlRuleArr = path.split('?');
            urlPath = urlRuleArr[0];
            searchParamGroupArr = urlRuleArr[1].split('&');
            searchParamGroupArr.map(function (item) {
                var arr = item.split('=');
                search[arr[0]] = arr[1];
            });
        }

        var arr = urlPath.split('/');

        if (arr.length > 1 && arr[1]) {
            arr.push(search);
            return {
                url: '/' + arr.shift() + '/',
                params: arr
            };
        } else {
            return {
                url: '/' + arr[0],
                params: [search]
            };
        }
    }

    //console.debug(convertHash('#/app/:id/:type'));
    //console.debug(convertHash('#/app'));
    //console.debug(convertHash('#/'));
    //
    //console.debug(convertPath('/app/id/type'));
    //console.debug(convertPath('/app'));
    //console.debug(convertPath('/'));

    window.onhashchange = function (hashChangeEvent) {
        var hash = hashChangeEvent.newURL.split('#')[1];

        // 检测到缓存中有此路径
        if (pathCache.indexOf(hash) > -1) {
            var pos = pathCache.indexOf(hashChangeEvent.oldURL.split('#')[1]);
            pathCache.splice(pos, 1);
            // Sps.prev();
            before();
            log('Path in Cache: ', pathCache);
            // return;
        } else {
            pathCache.push(hash);
            log('Path in Cache: ', pathCache);
        }

        if (!hash) {
            window.location.href = '#/';
            return;
        }

        var rule = convertPath(hash);

        if (!funcs[rule.url]) {
            funcs['404'].call();
        } else if (beforeExcept.indexOf(rule.url) > -1 || before()) {
            funcs[rule.url].apply(null, rule.params);
        }
    };

    function route(url, handler) {
        if (typeof url === 'function') {
            funcs['404'] = url;
            return;
        }

        var rule = convertHash(url);
        funcs[rule.url] = handler;
    }

    var before = function () {
        return true;
    };
    var beforeExcept = [];

    root.Router = {
        route: route,
        endRoute: function () {
            var hash = window.location.hash;
            var currentRule = convertPath(hash);
            if (!hash)
                window.location.href = '#/';
            else if (hash && funcs[currentRule.url])
                if (beforeExcept.indexOf(currentRule.url) > -1 || before())
                    funcs[currentRule.url].apply(null, currentRule.params);
                else if (hash && !funcs[currentRule.url])
                    funcs['404'].apply(null, currentRule.params);
        },
        before: function (callback, option) {
            before = callback;
            beforeExcept = option.except;
        },
        debug: function () {
            log('All Controllers: ', funcs);
        }
    };
}(window.Txbb));
