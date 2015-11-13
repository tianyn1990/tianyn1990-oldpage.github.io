define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-beach-module", []).controller("ppt-beach-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                        toggle: true,
                        panel: false,
                        wind: 0,
                        state: -1
                    };
                    var winds = $scope.winds = ["小疯", "大疯", "狂疯", "地震", "淹没"];

                    //加载视差效果
                    $("#parallax-beach").parallax();
                    ff.success("卡死卡死卡死卡死卡死卡死...");

                    $scope.toggle = function () {
                        s.toggle = !s.toggle;
                        s.panel = !s.panel;
                    };
                    $scope.changeWind = function (index, isAct) {
                        if (index === 4) {
                            if (isAct) {
                                s.state = -1;
                                return;
                            }
                            s.state = index;
                            ff.error("淹死TA淹死TA淹死TA淹了TA");
                            var waveWidth = 10;
                            var waveCount = Math.floor(window.innerWidth / waveWidth);
                            var ocean = $("#ocean");
                            for (var i = 0; i < waveCount; i++) {
                                var div = $("<div class='wave'></div>");
                                div.css({
                                    left: i * waveWidth + "px",
                                    "animation-delay": (i / 100) + "s",
                                    "-webkit-animation-delay": (i / 100) + "s"
                                });
                                ocean.append(div);
                            }
                        } else if (index === 3) {
                            s.state = isAct ? -1 : index;
                        } else {
                            if (isAct) {
                                s.wind = -1;
                                return;
                            }
                            s.wind = index;
                            ff.log(winds[index] + winds[index] + "~~~~");
                        }
                    };

                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });
                }]);

    }
);
