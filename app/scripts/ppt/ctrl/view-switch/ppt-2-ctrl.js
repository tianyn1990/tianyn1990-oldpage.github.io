define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("switch-view-2-module", []).controller("switch-view-2-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                    };
                    ff.pageSlideDown().nextPageAnimate().pageSlideLeft();
                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });
                }]);

    }
);
