define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("ppt-game-module", []).controller("ppt-game-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q',

                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                        timeSpend: 0,
                        "ppt-page-num": "ppt-page-num-1"
                    };

                    ff.pageSlideLeft().nextPageAnimate().pageSlideRight();
                    ff.alert("建议直接点击“开始”试试吧～～");

                    //变色背景
                    var startTime = new Date().getTime();
                    var itv1 = $interval(function () {
                        var diff = new Date().getTime() - startTime;
                        s.timeSpend = Math.floor(diff / 1000);
                        var tenSec = parseInt(s.timeSpend / 30 % 10) + 1;
                        s["ppt-page-num"] = "ppt-page-" + tenSec;
                    }, 1000);

                    //细胞机器人
                    $scope._s.title = "细胞机器人";
                    var t = $scope.t = {
                        cellRow: 80,
                        cellCol: 100,
                        itvTimePre: 100,
                        itvTime: 100,
                        cells: [],
                        oneRow: [],
                        setItvTime: function () {
                            t.itvTime = t.itvTimePre;
                            t.spawnPause();
                            t.spawnBegin();
                        },
                        initCells: function () {
                            for (var j = 0; j < this.cellCol; j++) {
                                this.oneRow[j] = {alive: false};
                            }
                            for (var i = 0; i < this.cellRow; i++) {
                                this.cells[i] = ng.copy(this.oneRow);
                            }
                        },
                        alive: function (r, c) {
                            if (ng.isNumber(r) && ng.isNumber(c))
                                this.cells[r][c].alive = true;
                            return this;
                        },
                        die: function (r, c) {
                            if (ng.isNumber(r) && ng.isNumber(c))
                                this.cells[r][c].alive = false;
                            return this;
                        },
                        putPointGroup: function (positions, r, c) {
                            // 1:Point 2:Beehive 3:Glinder 4:Beacon 5:LWSS 6:Block 7:GliderGun
                            positions = positions || [0, 0];
                            r = r || 10;
                            c = c || 10;
                            for (var i = 0; i < positions.length; i += 2) {
                                var row = positions[i] + r;
                                var col = positions[i + 1] + c;
                                this.alive(row, col);
                            }
                        },
                        makeBeehive: function (row, col) {
                            row = row || 10;
                            col = col || 10;
                            this.putPointGroup([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 2], row, col);
                        },
                        makeGlinder: function (row, col) {
                            row = row || 10;
                            col = col || 10;
                            this.putPointGroup([0, 1, 1, 2, 2, 0, 2, 1, 2, 2], row, col);
                        },
                        makeBeacon: function (row, col) {
                            row = row || 10;
                            col = col || 10;
                            this.putPointGroup([0, 0, 0, 1, 1, 0, 1, 1, 2, 2, 2, 3, 3, 2, 3, 3], row, col);
                        },
                        makeLWSS: function (row, col) {
                            row = row || 10;
                            col = col || 10;
                            this.putPointGroup([0, 0, 0, 3, 1, 4, 2, 0, 2, 4, 3, 1, 3, 2, 3, 3, 3, 4], row, col);
                        },
                        makeBlock: function (row, col) {
                            row = row || 10;
                            col = col || 10;
                            this.putPointGroup([0, 0, 0, 1, 1, 0, 1, 1], row, col);
                        },
                        makeGliderGun: function (row, col) {
                            row = row || 10;
                            col = col || 10;
                            this.putPointGroup([
                                0, 24, 1, 22, 1, 24, 2, 12, 2, 13, 2, 20, 2, 21, 2, 34, 2, 35, 3, 11, 3, 15, 3, 20, 3, 21,
                                3, 34, 3, 35, 4, 0, 4, 1, 4, 10, 4, 16, 4, 20, 4, 21, 5, 0, 5, 1, 5, 10, 5, 14, 5, 16, 5, 17,
                                5, 22, 5, 24, 6, 10, 6, 16, 6, 24, 7, 11, 7, 15, 8, 12, 8, 13
                            ], row, col);
                        },
                        judgeLive: function (r, c) {
                            var live = 0, map = this.cells, isAlive = map[r][c].alive, rs = this.cellRow, cs = this.cellCol;
                            if (map[r][(c - 1 + cs) % cs].alive == true)
                                live++;
                            if (map[r][(c + 1) % cs].alive == true)
                                live++;
                            if (map[(r - 1 + rs) % rs][c].alive == true)
                                live++;
                            if (map[(r + 1) % rs][c].alive == true)
                                live++;
                            if (map[(r + 1) % rs][(c + 1) % cs].alive == true)
                                live++;
                            if (map[(r - 1 + rs) % rs][(c + 1) % cs].alive == true)
                                live++;
                            if (map[(r + 1) % rs][(c - 1 + cs) % cs].alive == true)
                                live++;
                            if (map[(r - 1 + rs) % rs][(c - 1 + cs) % cs].alive == true)
                                live++;
                            if (isAlive == true && (live < 2 || live > 3))
                                map[r][c].prepareToLive = false;
                            if (isAlive == false && live == 3)
                                map[r][c].prepareToLive = true;
                        },
                        nextStep: function () {
                            for (var r = 0; r < t.cells.length; r++) {
                                var cells = t.cells[r];
                                for (var c = 0; c < cells.length; c++) {
                                    t.judgeLive(r, c);
                                }
                            }
                            for (var r2 = 0; r2 < t.cells.length; r2++) {
                                var cells2 = t.cells[r2];
                                for (var c2 = 0; c2 < cells2.length; c2++) {
                                    var b = t.cells[r2][c2].prepareToLive;
                                    if (b === false) {
                                        t.die(r2, c2);
                                    } else if (b === true) {
                                        t.alive(r2, c2);
                                    }
                                    t.cells[r2][c2].prepareToLive = undefined;
                                }
                            }
                        },
                        pattern: "Point",
                        clickCell: function (r, c) {
                            if (t.pattern === "Point") {
                                ng.isNumber(r) && ng.isNumber(c) && t.cells[r][c].alive ? t.die(r, c) : t.alive(r, c);
                            } else {
                                t["make" + t.pattern](r, c);
                            }
                        },
                        itv2: undefined,
                        spawnBegin: function () {
                            t.itv2 = $interval(function () {
                                t.nextStep();
                            }, t.itvTime);
                        },
                        spawnPause: function () {
                            $interval.cancel(t.itv2);
                        },
                        spawnReset: function () {
                            t.spawnPause();
                            for (var r = 0; r < t.cells.length; r++) {
                                var cells = t.cells[r];
                                for (var c = 0; c < cells.length; c++) {
                                    t.die(r, c);
                                }
                            }
                        }
                    };
                    $scope.clickCell = t.clickCell;
                    $scope.nextStep = t.nextStep;
                    $scope.spawnBegin = t.spawnBegin;
                    $scope.spawnPause = t.spawnPause;
                    $scope.spawnReset = t.spawnReset;
                    $scope.toWelcome = function () {
                        $location.path("/welcome");
                    };
                    t.initCells();
                    // 0:Point 1:Beehive 2:Glinder 3:Beacon 4:LWSS 5:Block 6:GliderGun
                    //t.makeBeehive(5,1);
                    t.makeGlinder(5, 35);
                    //t.makeBeacon(5,30);
                    t.makeLWSS(20, 26);
                    t.makeBlock(20, 55);
                    //t.makeGliderGun(45,1);

                    $scope.$on('$destroy', function () {
                        $interval.cancel(itv1);
                        $interval.cancel(t.itv2);
                    });
                }]);
    }
);












