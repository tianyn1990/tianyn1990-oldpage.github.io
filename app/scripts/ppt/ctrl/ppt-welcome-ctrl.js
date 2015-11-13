define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-welcome-module", []).controller("ppt-welcome-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                    };
                    ff.pageSlideRight().nextPageAnimate().pageSlideLeft();

                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });
                }]);

    }
);
