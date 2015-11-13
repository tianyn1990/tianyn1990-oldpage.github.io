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
        "ppt/ctrl/ppt-game-ctrl",
        "ppt/ctrl/view-switch/ppt-view-switch-ctrl",
        "ppt/ctrl/view-switch/ppt-1-ctrl",
        "ppt/ctrl/view-switch/ppt-2-ctrl",
        "ppt/ctrl/view-switch/ppt-3-ctrl",
        "ppt/ctrl/view-switch/ppt-4-ctrl",
        "ppt/ctrl/view-switch/ppt-5-ctrl",
        "ppt/ctrl/view-switch/ppt-6-ctrl",
        "ppt/ctrl/view-switch/ppt-7-ctrl",
        "ppt/ctrl/view-switch/ppt-8-ctrl",
        "ppt/ctrl/view-switch/ppt-9-ctrl",
        "ppt/ctrl/view-switch/ppt-10-ctrl",

        "ppt/ctrl/ppt/ppt-1-ctrl",
        "ppt/ctrl/ppt/ppt-2-ctrl",
        "ppt/ctrl/ppt/ppt-3-ctrl",
        "ppt/ctrl/ppt/ppt-4-ctrl",
        "ppt/ctrl/ppt/ppt-5-ctrl",
        "ppt/ctrl/ppt/ppt-6-ctrl",
        "ppt/ctrl/ppt/ppt-7-ctrl",
        "ppt/ctrl/ppt/ppt-8-ctrl",
        "ppt/ctrl/ppt/ppt-9-ctrl",
        "ppt/ctrl/ppt/ppt-10-ctrl",

        "ppt/ctrl/webcam/webcam-ctrl"
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
