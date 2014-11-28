define(["angular", "devConfig", "pathConfig", "jquery", "ngConsole", "ngCheck"], function (ng, conf, path, $) {
    'use strict';
    ng.module("ngDirective", ["ngConsole", "ngCheck"])

    /**
     * 功能：展示的mask
     */
        .directive("moMask", ["$$console", "$rootScope", function ($$console, $rootScope) {
            return {
                priority: 9999,
                restrict: 'EA',
                replace: true,
                templateUrl: path.AppPath + 'views/directive_tpls/mask.html',
                link: function ($scope, $element, $attrs) {
                    $scope._s ? "" : $scope._s = {};
                    $scope._s.mask = {
                        show: true,
                        transparent: false
                    }
                }
            }
        }])
    /**
     * 功能：对于双向绑定的文本，超出规定长度后的内容以“某字符串”代替（默认为空，选填）
     * 使用示例：<DOM mo-cut-bind="{{scopeObj}},50,..."></DOM>
     * 参数类型：{{scopeObj}},number,string
     * 参数含义：{{scopeObj}}:$scope绑定的对象，用{{}}包裹，绑定希望显示的文本
     *         number:希望显示的最大“中文”字符数（英文字符数/2）
     */
        .directive("moCutBind", ["$$console", "$$check", function ($$console, $$check) {
            var func = function ($scope, $element, $attrs) {
                $attrs.$observe('moCutBind', function (interpolatedValue) {
                    moCut(interpolatedValue, $scope, $element, $attrs, $$console, $$check);
                });
            };
            return {
                priority: 0,
                restrict: 'A',
                link: func
            };
        }])
    /**
     * 功能：文本超出规定长度后的内容以“某字符串”代替（默认为空，选填）
     * 使用示例：<DOM mo-cut="50,...">文本</DOM>
     * 参数类型：number,要替换成的字符串
     * 参数含义：number:希望显示的最大“中文”字符数（英文字符数/2）
     */
        .directive("moCut", ["$$console", "$$check", function ($$console, $$check) {
            var func = function ($scope, $element, $attrs) {
                moCut($element.text() + "," + $attrs["moCut"], $scope, $element, $attrs, $$console, $$check);//$attrs["ngCutBind"]
            };
            return {
                priority: 0,
                restrict: 'A',
                link: func
            };
        }]);

    function moCut(param, $scope, $element, $attrs, $$console, $$check) {
        //count:展示数据的字节数，subCount:展示数据的
        var text, arrs, maxCnLen, count = 0, subCount = 0, num, addStr = "", hasCut = false;
        //解析参数
        arrs = param.split(",");
        //bind的数据
        text = arrs[0] && arrs[0].trim() !== "" ?
            arrs[0] : "";
        //希望展示的中文个数
        num = arrs[1].replace("/\\s/", "");
        num = Number(num);
        if (isNaN(num)) {
            $$console.error({info: "mo-cut[-bind]参数错误：不是一个数字"});
            return;
        }
        maxCnLen = num;
        //要替换成的字符串
        addStr = (arrs[2] && arrs[2].trim() !== "") ? arrs[2].trim() : addStr;
        for (var i = 0; i < text.length; i++) {
            var c = text.charAt(i);
            count++;
            subCount++;
            //如果是中文，增加一个字节数
            if ($$check.stringHelper.isCharCn(c)) {
                count++;
            }
            if (count >= maxCnLen * 2) {
                if (count % 2 === 1) {
                    --subCount;
                }
                hasCut = true;
                break;
            }
        }
        addStr = hasCut ? addStr : "";
        $element.text(text.substring(0, subCount) + addStr);
    }
});