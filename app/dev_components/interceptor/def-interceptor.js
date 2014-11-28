define(['angular', 'devConfig', "ngConsole"], function (ng, config) {
    'use strict';
    ng.module('defInterceptor', ["ngConsole"])
        .factory('$$interceptor', ["$$console", function ($$console) {
            return {
                test: function (data, getHeaders) {
                    //返回的“第二个”拦截地点：对某个返回定制化的配置拦截器
                }
            }
        }]);
});
