define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-10-module", []).controller("ppt-10-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                    };
                    ff.pageSlideLeftPop().nextPageAnimate().pageSlideUp();
                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });
                }]);

    }
);
