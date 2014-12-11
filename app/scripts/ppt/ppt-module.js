define(["angular", "alertify", "devConfig", "jquery"], function (ng, alertify, config, $) {
    "use strict";
    //定义本“单页面应用”的angular模块名为“mo-module”
    ng.module("ppt-module",
            [
                //"ppt-module"模块引用了angular的许多其他模块
                //但前提是已经使用requireJs引入了该模块所在的js文件
                //第三方angular模块
                "ngRoute",
                "ngAnimate",
                "ngSanitize",
                "ngResource",
                //自定义angular模块
                "ngCheck",
                "ngConsole",
                "ngStorage",
                "ngDirective",
                "baseInterceptor",
                "defInterceptor",
                //引用本应用所有控制器
                "ppt-welcome-module",
                "ppt-beach-module",
                "ppt-1-module",
                "ppt-2-module",
                "ppt-3-module",
                "ppt-4-module",
                "ppt-5-module",
                "ppt-6-module",
                "ppt-7-module",
                "ppt-8-module",
                "ppt-9-module",
                "ppt-10-module"
            ])
        .config(["$routeProvider", function ($routeProvider) {
            $routeProvider
                .when('/welcome', {
                    templateUrl: 'ppt-welcome.html',
                    controller: 'ppt-welcome-ctrl'
                })
                .when('/beach', {
                    templateUrl: 'ppt-beach.html',
                    controller: 'ppt-beach-ctrl'
                })
                .when('/1', {
                    templateUrl: 'ppt-1.html',
                    controller: 'ppt-1-ctrl'
                })
                .when('/2', {
                    templateUrl: 'ppt-2.html',
                    controller: 'ppt-2-ctrl'
                })
                .when('/3', {
                    templateUrl: 'ppt-3.html',
                    controller: 'ppt-3-ctrl'
                })
                .when('/4', {
                    templateUrl: 'ppt-4.html',
                    controller: 'ppt-4-ctrl'
                })
                .when('/5', {
                    templateUrl: 'ppt-5.html',
                    controller: 'ppt-5-ctrl'
                })
                .when('/6', {
                    templateUrl: 'ppt-6.html',
                    controller: 'ppt-6-ctrl'
                })
                .when('/7', {
                    templateUrl: 'ppt-7.html',
                    controller: 'ppt-7-ctrl'
                })
                .when('/8', {
                    templateUrl: 'ppt-8.html',
                    controller: 'ppt-8-ctrl'
                })
                .when('/9', {
                    templateUrl: 'ppt-9.html',
                    controller: 'ppt-9-ctrl'
                })
                .when('/10', {
                    templateUrl: 'ppt-10.html',
                    controller: 'ppt-10-ctrl'
                })
                .otherwise({
                    redirectTo: '/welcome'
                });
        }])
        //添加通用的拦截器
        .config(["$httpProvider", function ($httpProvider) {
            $httpProvider.interceptors.push("baseInterceptor");
        }])
        //路由类型
        .config(['$locationProvider', function ($locationProvider) {
            $locationProvider.html5Mode(false);
        }])
        //最外围的controller,使用在了html上
        .controller("mo-ctrl",
            ['$scope', '$http', '$location', '$timeout', '$q', '$$ls', '$interval',
                function ($scope, $http, $location, $timeout, $q, $$ls, $interval) {

                    //父controller(mo-ctrl)的对象
                    $scope._s = {

                        //设置<title>标签
                        title: "css基础",

                        //设置view页切换动画
                        bodyOh: false,
                        viewSwitchAnimate: -1,
                        viewSwitchTransform: false

                    };
                    //父controller(mo-ctrl)的方法
                    var ff = $scope._f = {

                        //设置view页切换动画
                        viewSwitchAnimate: function (num) {
                            if ($scope._s.viewSwitchTransform) {
                                $timeout(function () {
                                    $scope._s.viewSwitchAnimate = num;
                                }, 1100);
                                $scope._s.viewSwitchTransform = false;
                                return this;
                            }
                            $scope._s.viewSwitchAnimate = num;
                            return this;
                        },
                        nextPageAnimate: function () {
                            $scope._s.viewSwitchTransform = true;
                            return this;
                        },
                        pageSlideLeft: function () {
                            return ff.viewSwitchAnimate(0);
                        },
                        pageSlideRight: function () {
                            return ff.viewSwitchAnimate(1);
                        },
                        pageSlideUp: function () {
                            return ff.viewSwitchAnimate(2);
                        },
                        pageSlideDown: function () {
                            return ff.viewSwitchAnimate(3);
                        },
                        pagePop: function () {
                            return ff.viewSwitchAnimate(4);
                        },
                        pageFade: function () {
                            return ff.viewSwitchAnimate(5);
                        },
                        pageFlipX: function () {
                            return ff.viewSwitchAnimate(6);
                        },
                        pageFlipY: function () {
                            return ff.viewSwitchAnimate(7);
                        },
                        pageRotate: function () {
                            return ff.viewSwitchAnimate(8);
                        },
                        pageSlideLeftPop: function () {
                            return ff.viewSwitchAnimate(9);
                        },

                        //设置头部title的值
                        title: function (title) {
                            $scope._s.title = title;
                            return this;
                        },
                        //只刷新子页面
                        refresh: function (path) {
                            var sign = $location.search()['refresh_sign'];
                            sign = sign ? window.parseInt(sign) + 1 : 1;
                            path && typeof path === "string" ? $location.path(path) : "";
                            $location.search("refresh_sign", sign);
                            return this;
                        },

                        //对alertify的封装 -- BEGIN
                        alert: function () {
                            alertify.alert.apply(this, arguments);
                            return this;
                        },
                        prompt: function () {
                            alertify.prompt.apply(this, arguments);
                            return this;
                        },
                        confirm: function () {
                            alertify.confirm.apply(this, arguments);
                            return this;
                        },
                        log: function () {
                            alertify.log.apply(this, arguments);
                            return this;
                        },
                        success: function () {
                            alertify.success.apply(this, arguments);
                            return this;
                        },
                        error: function () {
                            alertify.error.apply(this, arguments);
                            return this;
                        },
                        //对alertify的封装 -- END

                        //defer链式调用 -- BEGIN
                        defers: [],
                        deferPre: $q.defer(),
                        catchFun: function (data) {
                        },
                        then: function (func, delay) {
                            var defers = this.defers;
                            defers[defers.length] = {
                                func: func,
                                delay: delay || 0
                            };
                            return this;
                        },
                        catch: function (func) {
                            this.catchFun = typeof func === "function" ? func : this.catchFun;
                            return this;
                        },
                        go: function (data) {
                            var that = this;
                            var len = that.defers.length;
                            that.defers.forEach(function (e, index) {
                                var dPre = that.deferPre;
                                var dNext = $q.defer();
                                var func = e.func;
                                var delay = e.delay;
                                dPre.promise.then(function (data) {
                                    var defer = $q.defer();
                                    $timeout(function () {
                                        return func(data, defer);
                                    }, delay);
                                    defer.promise
                                        .then(function (data) {
                                            dNext.resolve(data);
                                        })
                                        .catch(function (data) {
                                            that.catchFun(data);
                                        });
                                });
                                that.deferPre = dNext;
                                if (index === 0) {
                                    dPre.resolve(data);
                                }
                                if (index + 1 === len) {
                                    that.defers = [];
                                    that.deferPre = $q.defer();
                                }
                            });
                        },
                        ajaxConc: {
                            waitForAjaxReturn: false,
                            ajaxNumInRoute: -1
                        },
                        htmlConc: {
                            isAllViewSwitchAnimateFinished: false,
                            waitForAjaxHtmlReturn: false,
                            ajaxHtmlNumInRoute: -1
                        },
                        ajaxRetDefer:function(){
                            var that = this;
                            var itv = $interval(function () {
                                if (that.htmlConc.waitForAjaxReturn) {
                                    $interval.cancel(itv);
                                    defer.resolve();
                                }
                            }, 100);
                        },
                        ajaxHtmlRetDefer:function(defer){
                            var that = this;
                            var itv = $interval(function () {
                                if (that.htmlConc.waitForAjaxHtmlReturn) {
                                    $interval.cancel(itv);
                                    defer.resolve();
                                }
                            }, 100);
                        },
                        showAllViewSwitchAnimate: function () {
                            var that = this;
                            that.htmlConc.ajaxHtmlNumInRoute = 1;
                            that
                                .then(function (data, defer) {
                                    $location.path("/1");
                                    that.ajaxHtmlRetDefer(defer);
                                }, 1200)
                                .then(function (data, defer) {
                                    $location.path("/2");
                                    that.ajaxHtmlRetDefer(defer);
                                }, 1200)
                                .then(function (data, defer) {
                                    $location.path("/3");
                                    that.ajaxHtmlRetDefer(defer);
                                }, 1200)
                                .then(function (data, defer) {
                                    $location.path("/4");
                                    that.ajaxHtmlRetDefer(defer);
                                }, 1200)
                                .then(function (data, defer) {
                                    $location.path("/5");
                                    that.ajaxHtmlRetDefer(defer);
                                }, 1200)
                                .then(function (data, defer) {
                                    $location.path("/6");
                                    that.ajaxHtmlRetDefer(defer);
                                }, 1200)
                                .then(function (data, defer) {
                                    $location.path("/7");
                                    that.ajaxHtmlRetDefer(defer);
                                }, 1200)
                                .then(function (data, defer) {
                                    $location.path("/8");
                                    that.ajaxHtmlRetDefer(defer);
                                }, 1200)
                                .then(function (data, defer) {
                                    $location.path("/9");
                                    that.ajaxHtmlRetDefer(defer);
                                }, 1200)
                                .then(function (data, defer) {
                                    $location.path("/10");
                                    that.ajaxHtmlRetDefer(defer);
                                }, 1200)
                                .then(function (data, defer) {
                                    that.htmlConc.isAllViewSwitchAnimateFinished = true;
                                    $location.path("/welcome");
                                    that.htmlConc.ajaxHtmlNumInRoute = -1;
                                    defer.resolve();
                                }, 1200)
                                .go();
                        }
                        //defer链式调用 -- END
                    };

                    //当路由发生变化时，控制...
                    $scope.$on('$routeChangeStart', function (next, current) {
                        $scope._s.bodyOh = true;
                        $scope._s.waitForAjaxReturn = false;

                        var reqHtml = "_html_ajax_request_in_route_count";
                        var rspHtml = "_html_ajax_response_in_route_count";
                        $$ls.removeItem([reqHtml, rspHtml]);
                        var itv2 = $interval(function () {
                            var reqHtmlNum = parseInt($$ls.item(reqHtml));
                            var rspHtmlNum = parseInt($$ls.item(rspHtml));
                            if (reqHtmlNum === rspHtmlNum && rspHtmlNum === ff.htmlConc.ajaxHtmlNumInRoute) {
                                ff.htmlConc.waitForAjaxHtmlReturn = true;
                                $interval.cancel(itv2);
                            }
                        }, 100);
                    });
                    $scope.$on('$routeChangeSuccess', function (next, current) {
                        window.scrollTo(0, 0);
                        var req = "_ajax_request_in_route_count";
                        var rsp = "_ajax_response_in_route_count";
                        $$ls.removeItem([req, rsp]);
                        var itv = $interval(function () {
                            var reqNum = parseInt($$ls.item(req));
                            var rspNum = parseInt($$ls.item(rsp));
                            if (reqNum === rspNum && rspNum === ff.ajaxNumInRoute) {
                                ff.waitForAjaxReturn = true;
                                $interval.cancel(itv);
                            }
                        }, 100);
                        $timeout(function () {
                            $scope._s.bodyOh = false;
                        }, 1100);
                    });

                }]);

    //弹出控件设置
    alertify.set(config.alertifyConf);

    //自定义函数
    /**
     * 对于类似于[{},{},etc]的数组，找到包含{key:value}的对象，返回数组
     */
    Array.prototype.grep = function (key, value) {
        var that = this, ret = [];
        this.forEach(function (elem, index) {
            if (elem[key] === value) {
                ret.push(that[index]);
            }
        });
        return ret;
    };
    /**
     * 解析string为date，string举例：
     * yyyy-MM-dd HH:mm:ss
     * yyyy-MM-dd
     * yyyy年MM月dd日 HH时mm分ss秒 等
     */
    String.prototype.toDate = function () {
        var that = this, num;
        num = Date.parse(that);
        //Safari 或 中文
        if (isNaN(num)) {
            var a = that.split(/[^0-9]/).map(function (s) {
                return parseInt(s, 10)
            });
            return a.length > 1 ?
                new Date(a[0], a[1] - 1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0) :
                new Date();
        }
        return new Date(num);
    };
    /**
     * 解析date为string，string格式由入参决定，默认为yyyy年MM月dd日
     */
    Date.prototype.format = function (fmt) {
        fmt = fmt && typeof fmt === "string" ? fmt : "yyyy年MM月dd日";
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    //jQuery 事件绑定（尽量少用，仅用于用户使用优化，稍复杂的请使用directive）

});
