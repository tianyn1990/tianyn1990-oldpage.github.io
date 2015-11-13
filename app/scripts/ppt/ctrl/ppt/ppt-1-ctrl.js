define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-1-module", []).controller("ppt-1-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                        step: 1,
                        qnCount: 0,
                        qnPc: 0
                    };
                    ff.pageSlideUp().nextPageAnimate().pageSlideUp();

                    if (s.step === 1) {
                        $timeout(function () {
                            ff.alert("这是开始之前的一个小测试，请选择你所“了解”的知识，并点击“下一步”。");
                        }, 1000);
                    }

                    $scope.chooseQn = function (e, num) {
                        num = num || 1;
                        e = $(e.target);
                        s.qnCount = e.hasClass("sq-hover") ? s.qnCount - num : s.qnCount + num;
                        e.toggleClass("sq-hover");
                    };

                    $scope.preStep = function () {
                        s.step--;
                        if (s.step < 1) {
                            window.history.go(-1);
                        }
                    };
                    $scope.nextStep = function () {
                        s.step++;
                        if (s.step === 3) {
                            s.qnPc = parseInt(s.qnCount * 100 / 39);
                        }
                        if (s.step === 4) {
                            ff.alert("下面正式开始了！");
                        }
                        if (s.step === 13) {
                            $location.path("/ppt/2");
                        }
                    };

                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });
                }]);

    }
);








