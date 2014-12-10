define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-1-module", []).controller("ppt-1-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                        toggle: true,
                        panel: false,
                        wind: 0,
                        state: -1
                    };
                    var winds = $scope.winds = ["微疯", "中疯", "狂疯", "地震", "淹没"];

                    //加载视差效果
                    $("#parallax-beach").parallax();
                    ff.success("卡死卡死卡死卡死卡死卡死卡死卡死...");

                    $scope.toggle = function () {
                        s.toggle = !s.toggle;
                        s.panel = !s.panel;
                    };
                    $scope.changeWind = function (index, isAct) {
                        if (index === 4) {
                            s.state = isAct ? -1 : index;
                            ff.error("【碎碎念】淹死TA淹死TA淹死TA淹了TA");
                        } else if (index === 3) {
                            s.state = isAct ? -1 : index;
                        } else {
                            s.wind = isAct ? -1 : index;
                            ff.log(winds[index] + "啦啦啦~");
                        }
                        $timeout(function () {

                        }, 2000);
                    };

                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });
                }]);

    }
);
