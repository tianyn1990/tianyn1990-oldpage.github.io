define(["angular", "devConfig", "alertify", "ngConsole"], function (ng, cfg, alertify) {
    'use strict';
    ng.module("baseInterceptor", ["ngConsole"])
        .factory("baseInterceptor", ["$$console", "$q", "$$ls", function ($$console, $q, $$ls) {

            return {
                'request': function (config) {
                    $$console.info("============开始请求=============");

                    //设置超时时间
                    config.timeout = cfg.timeout || 5000;

                    //捕获成功请求数
                    //html
                    var url = config.url;
                    if (/^.*\.html$/.test(url)) {
                        var str = "_html_ajax_request_in_route_count";
                        var _count = $$ls.item(str) ? parseInt($$ls.item(str)) + 1 : 1;
                        $$ls.item(str, _count);
                    }
                    //ajax
                    if (!/^.*\.html$/.test(url)) {
                        var str = "_html_ajax_request_in_route_count";
                        var _count = $$ls.item(str) ? parseInt($$ls.item(str)) + 1 : 1;
                        $$ls.item(str, _count);
                    }

                    return config;
                },
                'requestError': function (rejection) {
                    $$console.info("============请求异常=============");
                    return $q.reject(rejection);
                },

                'response': function (response) {

                    //返回的“第三个”拦截地点(成功返回)：对所有的"异步"返回值进行处理(包括html，json等请求都会经过这里)

                    var url = response.config.url;
                    $$console.info("请求成功，路径：" + url);

                    //捕获成功返回数
                    //html
                    if (/^.*\.html$/.test(url)) {
                        var str = "_html_ajax_response_in_route_count";
                        var _count = $$ls.item(str) ? parseInt($$ls.item(str)) + 1 : 1;
                        $$ls.item(str, _count);
                    }
                    //ajax
                    if (!/^.*\.html$/.test(url)) {
                        var str = "_ajax_response_in_route_count";
                        var _count = $$ls.item(str) ? parseInt($$ls.item(str)) + 1 : 1;
                        $$ls.item(str, _count);
                    }

                    return response;
                },

                'responseError': function (rejection) {
                    //返回的“第三个”拦截地点(成功返回)：对所有的"异步"返回值进行处理(包括html，json等请求都会经过这里)

                    var status = rejection.status, data = rejection.data || {},
                        url = rejection.config && rejection.config.url || "";
                    $$console.error("请求:" + url + "失败");

                    //请求失败，返回状态码：
                    //600:预期格式：{code:xx,msg:xxx}，进行如下“通用”处理：
                    if (status === 600) {
                        var code = data.code;
                        var msg = data.msg;
                        if (code === "alert")
                            alertify.alert(msg);
                    }

                    return $q.reject(rejection);
                }
            };
        }]);
});
