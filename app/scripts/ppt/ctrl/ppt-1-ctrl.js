define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-1-module", []).controller("ppt-1-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                        itv: undefined
                    };

                    ff
                        .then(function (data, defer) {
                            ff.log("原数据：" + data);
                            ff.alert("data乘以2", function () {
                                defer.resolve(data * 2);
                            });
                        }, 1000)
                        .then(function (data, defer) {
                            ff.log("乘以2结果：" + data);
                            ff.prompt("请输入：", function (e, str) {
                                if (e) {
                                    ff.success("你输入了：" + str);
                                    data = parseInt(str, 10);
                                } else {
                                    ff.error("你取消了输入。");
                                }
                                var c = 5;
                                defer.resolve(data);
                                s.itv = $interval(function () {
                                    if (--c === 0) {
                                        $interval.cancel(s.itv);
                                    } else {
                                        ff.log(c.toString());
                                    }
                                }, 1000);
                            }, data.toString());
                        }, 1000)
                        .then(function (data) {
                            ff.confirm("是否继续乘以2？", function (e) {
                                data = e ? data * 2 : data;
                                ff.log("最终结果：" + data);
                            });
                        }, 5000)
                        .go(111);

                    $scope.$on('$destroy', function () {
                        $interval.cancel(s.itv);
                    });
                }]);

    }
);
