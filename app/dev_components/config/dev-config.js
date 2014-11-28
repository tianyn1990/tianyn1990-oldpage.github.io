define(["angular", "alertify"], function (ng, alertify) {
    'use strict';

    /*控制台日志的打印级别
     {false:'never print log',true:'print all'log:'>=log',info:'>=info',warn:'>=warn',error:'>=error'}*/
    var consoleLevel = "log";

    //请求超时时间
    var timeout = 5000;

    //alertify插件配置
    var alertifyConf = {
        delay: 4000,       //默认5000
        labels: {
            ok: "确定",     //默认OK
            cancel: "取消"  //默认Cancel
        },
        buttonFocus: "none", //"none","ok","cancel" 默认"ok"
        buttonReverse: true  // true, false（按钮反转,手机端适用false）
    };

    return {
        alertifyConf: alertifyConf,
        consoleLevel: consoleLevel,
        timeout: timeout,

        /*配置通用拦截器
         * */
        addTransformResponses: function (addTrans) {
            return [this.parseResponseJson, this.parseResponseArray]
                .concat(addTrans);
        },
        //解析返回的json数据
        parseResponseJson: function (data, getHeaders) {
            //返回的“第一个”拦截地点：通用的处理返回
            //consoleLevel==="log" && console.log("返回的“第一个”拦截地点：通用的处理返回");
            try {
                return ng.fromJson(data);
            } catch (e) {
                console && console.error("返回数据不是json格式!");
                return data;
            }
        },
        //将返回的array数据封装为：{"array":arrayObj}
        parseResponseArray: function (data, getHeaders) {
            if (ng.isArray(data)) {
                return {"array": data};
            }
            return data;
        }
    };

});