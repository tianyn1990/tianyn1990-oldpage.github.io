"use strict";
(function () {

  /**
   * 获取DOM节点的位置信息
   *
   * 注意：如果在除了body外的父节点中存在滚动条，则scrollTop/scrollLeft/x/y不再准确
   *
   * @param elem DOM节点
   *
   * @returns {{top: Number, bottom: Number, left: Number, right: Number, width: (Number|number), height: (Number|number), scrollTop: (*|number), scrollLeft: (*|number|HTMLElement.scrollLeft), x: *, y: *}}
   *      top/bottom/left/right: 距viewport的上下左右距离
   *      width/height: 宽高
   *      scrollTop/scrollLeft: body上的滚动条遮住的上/左距离
   *      x/y: body左上角为坐标系原点，xy值
   */
  HTMLElement.prototype.$getRect = function (elem) {
    var rect = elem.getBoundingClientRect(),
      scroll_top = document.documentElement.scrollTop || document.body.scrollTop,
      scroll_left = document.documentElement.scrollLeft || document.body.scrollLeft;
    return {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      width: rect.width || rect.right - rect.left,
      height: rect.height || rect.bottom - rect.top,
      scrollTop: scroll_top,
      scrollLeft: scroll_left,
      x: rect.left + scroll_left,
      y: rect.top + scroll_top
    };
  };

  //提升运算性能
  window.parseInt = function (num) {
    return ~~num;
  };
  Math.round = function (num) {
    return (0.5 + num) << 0;// or  ~~ (0.5 + num);  or  (0.5 + num) | 0;
  };
  Math.abs = function (num) {
    return num > 0 ? num : -num;
  };

})();
