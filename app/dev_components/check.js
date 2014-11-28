
define(['angular'],function(ng){
    'use strict';
    ng.module('ngCheck', [])
        .factory('$$check', [function(){
            return {
                //校验是否为联通号码
                checkUnicomMobile:function (num) {
                    return /^((13|15|18|14|17)+\d{9})$/.test(num);
                },
                //校验是否为手机号码
                checkMobile:function (num) {
                    return /^((1)+\d{10})$/.test(num);
                },
                //邮箱验证
                checkEmail:function(email){
                    return (/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(email);
                },
                //校验可能用到的方法集合
                stringHelper:{
                    //检查是否有下列非法字符
                    checkScript:function(text) {
                        //undefind的时候，表明前面的校验已经错误，所以模拟校验通过就好了
                        if(angular.isUndefined(text))
                            return false;
                        var flag = false;
                        //var scriptWord = "<|>|script|alert|{|}|#|$|'|\"|:|;|&|*|@|!|！|￥|……|——|，|。|、|：|‘|“|【|】|｛|｝|〈|〉|？|~|(|)|（|）|[|]|-|=|+|_|%|^|?|\\|/|,|.|`";
                        var scriptWord = "<|>|script|alert|{|}|#|$|'|\"|:|;|&|*|@@|%|^|?";
                        var words = scriptWord.split('|');
                        for ( var i = 0; i < words.length; i++) {
                            if (text.indexOf(words[i]) != -1) {
                                flag = true;
                                break;
                            }
                        }
                        return flag;
                    },
                    //返回字符串字节数
                    cnLength:function(Str) {
                        if(angular.isUndefined(Str))
                            return 0;
                        var escStr = escape(Str);
                        var numI = 0;
                        var escStrlen = escStr.length;
                        for (var i = 0; i < escStrlen; i++)
                            if (escStr.charAt(i) == '%')
                                if (escStr.charAt(++i) == 'u')
                                    numI++;
                        return Str.length + numI;
                    },
                    //判断单个字符是否是中文
                    isCharCn:function(str){
                        var ecsStr,ret=false;
                        if(typeof str !== 'string')
                            return ret;
                        ecsStr = escape(str);
                        if(ecsStr.charAt(0)=="%"&&ecsStr.charAt(1)=="u")
                            ret = true;
                        return ret;
                    }
                }
            }
        }])
        //自定义校验指令
        //校验最大长度（中文代表两个）
        .directive('checkMaxLength',['$$check',function($$check){
            return {
                require:"ngModel",
                link:function(scope, elm, attrs, ctrl){
                    ctrl.$parsers.push(function(viewValue) {
                        var maxLen = parseInt(attrs['mallCheckMaxlength']||100);
                        if ($$check.stringHelper.cnLength(viewValue)>maxLen) {//校验失败
                            ctrl.$setValidity('checkMaxlength', false);
                            return undefined;
                        }else {
                            ctrl.$setValidity('checkMaxlength', true);//校验成功
                            return viewValue;
                        }
                    });
                }
            }
        }])
        //校验最小长度（中文代表两个）
        .directive('checkMinLength',['$$check',function($$check){
            return {
                require:"ngModel",
                link:function(scope, elm, attrs, ctrl){
                    ctrl.$parsers.push(function(viewValue) {
                        var minLen = parseInt(attrs['mallCheckMinlength']||4);
                        if ($$check.stringHelper.cnLength(viewValue)<minLen) {//校验失败
                            ctrl.$setValidity('checkMinlength', false);
                            return undefined;
                        }else {
                            ctrl.$setValidity('checkMinlength', true);//校验成功
                            return viewValue;
                        }
                    });
                }
            }
        }])
        //校验非法字符
        //  <|>|script|alert|{|}|#|$|'|\"|:|;|&|*|@|
        //  !|！|￥|……|——|，|。|、|：|‘|“|【|】|｛|｝|〈|〉|
        //  ？|~|(|)|（|）|[|]|-|=|+|_|%|^|?|\\|/|,|.|`
        .directive('checkIllegalStr',['$$check',function($$check){
            return {
                require:"ngModel",
                link:function(scope, elm, attrs, ctrl){
                    ctrl.$parsers.push(function(viewValue) {
                        if ($$check.stringHelper.checkScript(viewValue)) {//校验失败
                            ctrl.$setValidity('checkIllegalStr', false);
                            return undefined;
                        }else {
                            ctrl.$setValidity('checkIllegalStr', true);//校验成功
                            return viewValue;
                        }
                    });
                }
            }
        }]);
});
