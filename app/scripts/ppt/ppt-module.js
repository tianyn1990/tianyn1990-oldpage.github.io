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
                "ppt-1-module"
            ])
        .config(["$routeProvider", function ($routeProvider) {
            $routeProvider
                .when('/1', {
                    templateUrl: 'ppt-1.html',
                    controller: 'ppt-1-ctrl'
                })
                .otherwise({
                    redirectTo: '/1'
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
            ['$scope', '$http', '$location', '$timeout', '$q',
                function ($scope, $http, $location, $timeout, $q) {

                    //父controller(mo-ctrl)的对象
                    $scope._s = {
                        title: "订单管理"
                    };
                    //父controller(mo-ctrl)的方法
                    var ff = $scope._f = {

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
                        }
                        //defer链式调用 -- END
                    };

                    //当路由发生变化时，控制是否展示loading页
                    $scope.$on('$routeChangeSuccess', function (next, current) {
                        window.scrollTo(0, 0);
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
