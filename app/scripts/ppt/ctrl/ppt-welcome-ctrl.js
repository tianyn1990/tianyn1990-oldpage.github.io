define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-welcome-module", []).controller("ppt-welcome-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                        click: false,
                        shake: "shake-soft-active",
                        active: "",
                        _1: {
                            show: true,
                            animate: "fade",//fade,from-top,from-bottom
                            msg: ""
                        },
                        _2: {
                            show: false,
                            animate: "fade",//fade,from-top,from-bottom
                            msg: ""
                        }
                    };
                    ff.pageSlideUp().nextPageAnimate().pageSlideUp();

                    if (ff.isAllViewSwitchAnimateFinished) {
                        ff
                            .then(function (data, defer) {
                                s._1.msg = "返回";
                                var itv = $interval(function () {
                                    if (s.click) {
                                        window.location.href = "/index.html";
                                        $interval.cancel(itv);
                                        defer.resolve();
                                    }
                                }, 100);
                            }, 500)
                            .go();
                    } else {
                        ff
                            .then(function (data, defer) {
                                s._1.msg = "点我";
                                s._1.animate = "from-bottom";
                                s._2.msg = "即将";
                                s._2.animate = "from-top";
                                var itv = $interval(function () {
                                    if (s.click) {
                                        s.shake = "ng-view";
                                        s.active = "active";
                                        $interval.cancel(itv);
                                        defer.resolve();
                                    }
                                }, 100);
                            }, 500)
                            .then(function (data, defer) {
                                s._1.show = false;
                                s._2.show = true;
                                defer.resolve();
                            }, 200)
                            .then(function (data, defer) {
                                s._1.msg = "展示";
                                s._1.animate = "from-top";
                                s._2.animate = "from-bottom";
                                defer.resolve();
                            }, 800)
                            .then(function (data, defer) {
                                s._1.show = true;
                                s._2.show = false;
                                defer.resolve();
                            }, 200)
                            .then(function (data, defer) {
                                s._2.msg = "页面";
                                s._1.animate = "from-bottom";
                                s._2.animate = "from-top";
                                defer.resolve();
                            }, 800)
                            .then(function (data, defer) {
                                s._1.show = false;
                                s._2.show = true;
                                defer.resolve();
                            }, 200)
                            .then(function (data, defer) {
                                s._1.msg = "切换";
                                s._1.animate = "from-top";
                                s._2.animate = "from-bottom";
                                defer.resolve();
                            }, 800)
                            .then(function (data, defer) {
                                s._1.show = true;
                                s._2.show = false;
                                defer.resolve();
                            }, 200)
                            .then(function (data, defer) {
                                s._2.msg = "效果";
                                s._1.animate = "from-bottom";
                                s._2.animate = "from-top";
                                defer.resolve();
                            }, 800)
                            .then(function (data, defer) {
                                s._1.show = false;
                                s._2.show = true;
                                defer.resolve();
                            }, 200)
                            .then(function (data, defer) {
                                s._1.msg = "再点";
                                s._1.animate = "from-top";
                                s._2.animate = "from-bottom";
                                defer.resolve();
                            }, 800)
                            .then(function (data, defer) {
                                s._1.show = true;
                                s._2.show = false;
                                defer.resolve();
                            }, 200)
                            .then(function () {
                                s.active = "";
                                s.shake = "shake-soft-active";
                                s.click = false;
                                var itv = $interval(function () {
                                    if (s.click) {
                                        $interval.cancel(itv);
                                        ff.showAllViewSwitchAnimate();
                                    }
                                }, 100);
                            }, 500)
                            .go();
                    }

                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });
                }]);

    }
);
