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
                    if (this.isSupportLocalStorage()) {
                        if (typeof name !== "string" && name.length && name.length > 0) {
                            name.forEach(function(elem,index){
                                localStorage.removeItem(elem);
                            });
                        } else
                            localStorage.removeItem(name);
                    } else {
                        $$console.info('浏览器不支持html5的本地存储！');
                        return false;
                    }
                    return true;
                },
                /**
                 * 判断浏览器是否直接html5本地存储
                 */
                isSupportLocalStorage: function () {
                    var ls = this, is = ls.IS_HAS_LOCAL_STORAGE;
                    if (is == null) {
                        if (window.localStorage) {
                            is = ls.IS_HAS_LOCAL_STORAGE = true;
                        }
                    }
                    return is;
                },
                IS_HAS_LOCAL_STORAGE: null
            }
        }]);
});
