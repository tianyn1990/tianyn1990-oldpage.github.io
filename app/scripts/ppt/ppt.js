require(
    [
        //本应用需要使用requireJs引入如下js文件
        "angular",
        "ngRoute",
        "ngSanitize",
        "ngAnimate",
        "ngResource",
        "jquery",
        "jqCookie",
        "alertify",
        "jqParallax",

        "ngCheck",
        "ngConsole",
        "ngStorage",
        "ngDirective",
        "baseInterceptor",
        "defInterceptor",

        "pathConfig",
        "devConfig",

        "ppt/ppt-module",
        "ppt/ctrl/ppt-welcome-ctrl",
        "ppt/ctrl/ppt-beach-ctrl",
        "ppt/ctrl/ppt-1-ctrl",
        "ppt/ctrl/ppt-2-ctrl",
        "ppt/ctrl/ppt-3-ctrl",
        "ppt/ctrl/ppt-4-ctrl",
        "ppt/ctrl/ppt-5-ctrl",
        "ppt/ctrl/ppt-6-ctrl",
        "ppt/ctrl/ppt-7-ctrl",
        "ppt/ctrl/ppt-8-ctrl",
        "ppt/ctrl/ppt-9-ctrl",
        "ppt/ctrl/ppt-10-ctrl"
    ],
    function (ng) {
        ng.bootstrap(document, ["ppt-module"]);
    },
    function (err) {
        console && console.log(err);
        var failedId = err.requireModules && err.requireModules[0];
        if (failedId) {
            requirejs.undef(failedId); //在模块载入失败回调中使用undef函数移除模块的注册
        }
    }
);
