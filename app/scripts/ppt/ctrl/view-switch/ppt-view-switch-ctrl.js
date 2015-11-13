define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-view-switch-module", []).controller("ppt-view-switch-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                        shake: "shake-soft-active",
                        active: "",
                        switch_1_2: true,
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

                    if (ff.htmlConc.isAllViewSwitchAnimateFinished) {
                        ff
                            .then(function (data, defer) {
                                s._1.msg = "返回";
                                $scope.nextStep = function () {
                                    window.location.href = "/index.html";
//                                    $location.path("/welcome");
                                };
                            }, 500)
                            .go();
                    } else {
                        var words = ["点我", "即将", "展示", "页面", "切换", "效果", "再点"];
                        var wordIndex = 0;
                        var getNextWord = function () {
                            return words[wordIndex++];
                        };

                        ff
                            .then(function (data, defer) {
                                s._1.msg = getNextWord();
                                s._1.animate = "from-bottom";
                                s._2.msg = getNextWord();
                                s._2.animate = "from-top";
                                $scope.nextStep = function () {
                                    s.shake = "ng-view";
                                    s.active = "active";
                                    defer.resolve();
                                };
                            }, 0)
                            .then(function (data, defer) {
                                s._1.show = false;
                                s._2.show = true;
                                defer.resolve();
                            }, 500);

                        var fun1 = function () {
                            return function (data, defer) {
                                var num1 = s.switch_1_2 ? 1 : 2;
                                var num2 = !s.switch_1_2 ? 1 : 2;
                                s["_" + num1].msg = getNextWord();
                                s["_" + num1].animate = "from-top";
                                s["_" + num2].animate = "from-bottom";
                                defer.resolve();
                            };
                        };
                        var fun2 = function () {
                            return function (data, defer) {
                                var num1 = s.switch_1_2 ? 1 : 2;
                                var num2 = !s.switch_1_2 ? 1 : 2;
                                s["_" + num1].show = true;
                                s["_" + num2].show = false;
                                s.switch_1_2 = !s.switch_1_2;
                                defer.resolve();
                            };
                        };

                        for (var i = 0; i < 5; i++) {
                            ff.then(fun1(), 500).then(fun2(), 100);
                        }

                        ff.then(function () {
                            s.active = "";
                            s.shake = "shake-soft-active";
                            $scope.nextStep = function () {
                                ff.showAllViewSwitchAnimate();
                            };
                        }, 500).go();

                    }

                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });
                }]);

    }
);
