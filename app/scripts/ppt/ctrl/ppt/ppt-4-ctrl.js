define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-4-module", []).controller("ppt-4-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                        step: 1,
                        qnCount: 0,
                        qnPc: 0
                    };
                    ff.pageSlideRight().nextPageAnimate().pageSlideRight();

                    $scope.chooseQn = function (e) {
                        e = $(e.target);
                        s.qnCount = e.hasClass("sq-hover") ? s.qnCount - 1 : s.qnCount + 1;
                        e.toggleClass("sq-hover");
                    };

                    $scope.preStep = function () {
                        s.step--;
                        if (s.step < 1) {
                            $location.path("/ppt/3");
                        }
                    };
                    $scope.nextStep = function () {
                        s.step++;
                        if (s.step === 12) {
                            $location.path("/ppt/5");
                        }
                    };

                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });
                }]);

    }
);
