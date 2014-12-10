//require配置
requirejs.config({
    //仅开发使用，防止了缓存
    urlArgs: "rand=" + (new Date()).getTime(),

    //定义根目录为app
    baseUrl: "../../scripts",

    //定义文件路径，定位到文件（不写.js）
    paths: {
        //第三方模块，由bower.json管理
        "jquery": "../bower_components/jquery/jquery",
        "jqCookie": "../bower_components/jquery-cookie/jquery.cookie",
        "angular": "../bower_components/angular/angular",
        "ngRoute": "../bower_components/angular-route/angular-route",
        "ngSanitize": "../bower_components/angular-sanitize/angular-sanitize",
        "ngResource": "../bower_components/angular-resource/angular-resource",
        "ngAnimate": "../bower_components/angular-animate/angular-animate",

        "jqParallax": "../dev_components/parallax/jquery.parallax",

        //修改的第三方组件
        "alertify": "../dev_components/alertify",

        //自己开发的组件模块
        "ngCheck": "../dev_components/check",
        "ngConsole": "../dev_components/console",
        "ngStorage": "../dev_components/storage",
        "ngDirective": "../dev_components/directive",
        //拦截器
        "baseInterceptor": "../dev_components/interceptor/base-interceptor",
        "defInterceptor": "../dev_components/interceptor/def-interceptor",

        //配置模块
        "devConfig": "../dev_components/config/dev-config",
        "pathConfig": "../dev_components/config/path-config"

    },

    //管理依赖关系
    shim: {
        "jquery": {exports: "jquery"},
        "jqCookie": {deps: ["jquery"]},
        "jqParallax": {deps: ["jquery"]},

        "angular": {exports: "angular"},
        "ngRoute": {deps: ["angular"]},
        "ngAnimate": {deps: ["angular"]},
        "ngResource": {deps: ["angular"]},
        "ngSanitize": {deps: ["angular"]},

        "ngCheck": {deps: ["angular"]},
        "ngConsole": {deps: ["angular"]},
        "ngStorage": {deps: ["angular"]},
        "ngDirective": {deps: ["angular"]},
        "baseInterceptor": {deps: ["angular"]},
        "defInterceptor": {deps: ["angular"]},
        "devConfig": {deps: ["jquery", "angular"]}
    }
});