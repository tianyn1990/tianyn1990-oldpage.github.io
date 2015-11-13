define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-3-module", []).controller("ppt-3-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                        step: 1,
                        qnCount: 0,
                        qnPc: 0
                    };

                    $scope.chooseQn = function (e) {
                        e = $(e.target);
                        s.qnCount = e.hasClass("sq-hover") ? s.qnCount - 1 : s.qnCount + 1;
                        e.toggleClass("sq-hover");
                    };

                    $scope.preStep = function () {
                        s.step--;
                        if (s.step < 1) {
                            $location.path("/ppt/2");
                        }
                    };
                    $scope.nextStep = function () {
                        s.step++;
                        if (s.step === 15) {
                            $location.path("/ppt/4");
                        }
                    };

                    ff.pageFlipX().nextPageAnimate().pageSlideRight();

                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });

                }]);

    }
);
