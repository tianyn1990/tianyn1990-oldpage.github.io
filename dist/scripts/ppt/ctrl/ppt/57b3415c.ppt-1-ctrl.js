define(["angular","devConfig","pathConfig","jquery"],function(t,n,e,o){t.module("ppt-1-module",[]).controller("ppt-1-ctrl",["$scope","$location","$$console","$timeout","$interval","$$ls","$q",function(t,n,e,p,s){var a=t._f,i=t.s={step:1,qnCount:0,qnPc:0};a.pageSlideUp().nextPageAnimate().pageSlideUp(),1===i.step&&p(function(){a.alert("这是开始之前的一个小测试，请选择你所“了解”的知识，并点击“下一步”。")},1e3),t.chooseQn=function(t,n){n=n||1,t=o(t.target),i.qnCount=t.hasClass("sq-hover")?i.qnCount-n:i.qnCount+n,t.toggleClass("sq-hover")},t.preStep=function(){i.step--,i.step<1&&window.history.go(-1)},t.nextStep=function(){i.step++,3===i.step&&(i.qnPc=parseInt(100*i.qnCount/39)),4===i.step&&a.alert("下面正式开始了！"),13===i.step&&n.path("/ppt/2")},t.$on("$destroy",function(){s.cancel()})}])});