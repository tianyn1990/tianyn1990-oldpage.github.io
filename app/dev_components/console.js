define(['angular', 'devConfig'], function (ng, config) {
    'use strict';
    ng.module('ngConsole', [])
        .factory('$$console', [function () {
            return {
                isFirst: true,
                levelNum: 0,
                level: function () {
                    var _this = this;
                    //优化性能
                    if (_this.isFirst && typeof config.consoleLevel !== "undefined") {
                        var con = config.consoleLevel;
                        _this.isFirst = false;
                        switch (con) {
                            case false:
                                _this.levelNum = 0;
                                break;
                            case true:
                                _this.levelNum = 10;
                                break;
                            case "log":
                                _this.levelNum = 4;
                                break;
                            case "info":
                                _this.levelNum = 3;
                                break;
                            case "warn":
                                _this.levelNum = 2;
                                break;
                            case "error":
                                _this.levelNum = 1;
                                break;
                            default :
                                _this.levelNum = 0;
                        }
                    }
                    return _this.levelNum;
                },
                log: function (msg) {
                    if (this.level() >= 4) {
                        console.log(msg);
                    }
                },
                info: function (msg) {
                    if (this.level() >= 3) {
                        console.info(msg);
                    }
                },
                warn: function (msg) {
                    if (this.level() >= 2) {
                        console.warn(msg);
                    }
                },
                error: function (msg) {
                    if (this.level() >= 1) {
                        console.error(msg);
                    }
                }
            }
        }]);
});
