define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-2-module", []).controller("ppt-2-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                        step: 1,
                        qnCount: 0,
                        qnPc: 0
                    };

                    ff.pageSlideUp().nextPageAnimate().pageSlideLeft();

                    $scope.chooseQn = function (e) {
                        e = $(e.target);
                        s.qnCount = e.hasClass("sq-hover") ? s.qnCount - 1 : s.qnCount + 1;
                        e.toggleClass("sq-hover");
                    };

                    $scope.preStep = function () {
                        s.step--;
                        if (s.step < 1) {
                            $location.path("/ppt/1");
                        }
                    };
                    $scope.nextStep = function () {
                        s.step++;
                        if (s.step === 6) {
                            ff.alert("所有的选择器中，咱们只关注最常用的，不够常用的仅供了解");
                        }
//                        if (s.step === 12) {
//                            s.qnPc = parseInt(s.qnCount * 100 / 20);
//                        }
                        if (s.step === 19) {
                            ff
                                .then(function(data,defer){
                                    ff.error("Sith Principle（西斯）");
                                    defer.resolve();
                                })
                                .then(function(data,defer){
                                    ff.error("Peace is a lie. There is only Passion.（平和只是谎言。狂热才是真谛。）");
                                    defer.resolve();
                                },5000)
                                .then(function(data,defer){
                                    ff.error("Through Passion,I gain Strength.（狂热使我变得强壮。）");
                                    defer.resolve();
                                },5000)
                                .then(function(data,defer){
                                    ff.error("Through Strength,I gain Power.（强壮使我得到力量。）");
                                    defer.resolve();
                                },5000)
                                .then(function(data,defer){
                                    ff.error("Through Power,I gain Victory.（力量使我获得胜利。）");
                                    defer.resolve();
                                },5000)
                                .then(function(data,defer){
                                    ff.error("Through Victory,my Chains are broken.（胜利使我打破枷锁。）");
                                    defer.resolve();
                                },5000)
                                .then(function(data,defer){
                                    ff.error("The Force shall free me.（原力任我自由。）");
                                    defer.resolve();
                                },5000)
                                .go();
                        }
                        if (s.step === 21) {
                            $location.path("/ppt/3");
                        }
                    };

                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });
                }]);

    }
);
