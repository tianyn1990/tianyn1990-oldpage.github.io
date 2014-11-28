define(['angular', 'ngConsole'], function (ng) {
    'use strict';
    ng.module('ngStorage', ['ngConsole'])
        .factory('$$ls', ['$$console', function ($$console) {
            return {
                /**
                 * 获取/设置存储字段
                 */
                item: function (name, value) {
                    var val = null;
                    if (value) {
                        localStorage.setItem(name, value);
                        val = value;
                    } else {
                        val = localStorage.getItem(name);
                    }
                    return val;
                },
                /**
                 * 移除指定name的存储
                 */
                removeItem: function (name) {
                    localStorage.removeItem(name);
                }
            }
        }]);
});
