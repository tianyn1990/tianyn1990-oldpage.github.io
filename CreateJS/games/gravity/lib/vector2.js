(function (window) {


  // 注意：为了性能考虑，尽量避免创建新的 vector 对象
  var $$vector2 = $$klass({
    initialize: function (x, y) {
      this.x = x;
      this.y = y;
    },
    /**
     * 复制
     * @returns {$$vector2}
     */
    clone: function () {
      return new $$vector2(this.x, this.y);
    },
    /**
     * 求长度
     * @returns {number}
     */
    length: function () {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    /**
     * 求单位向量
     * @returns {$$vector2}
     */
    normalize: function () {
      var inv = 1 / this.length();
      this.x *= inv;
      this.y *= inv;
      return this;
    },
    /**
     * 相加
     * @param v
     * @returns {$$vector2}
     */
    add: function (v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    },
    /**
     * 相乘
     * @param f
     * @returns {$$vector2}
     */
    multiply: function (f) {
      this.x *= f;
      this.y *= f;
      return this;
    },
    /**
     * 求点积
     * @param v
     * @returns {number}
     */
    dot: function (v) {
      return this.x * v.x + this.y * v.y;
    },
    dotXY: function (x, y) {
      return this.x * x + this.y * y;
    },
    /**
     * 求两个向量夹角
     * @param v
     * @returns {number}
     */
    angle: function (v) {
      return Math.acos(this.dot(v) / (this.length() * v.length())) * 180 / Math.PI;
    },
    /**
     * 求距离的平方
     * @param vector2
     * @returns {number}
     */
    distanceSquare: function (vector2) {
      var disx = Math.abs(this.x - vector2.x),
        disy = Math.abs(this.y - vector2.y);
      return disx * disx + disy * disy;
    }
  });


  //============
  // AMD/REQUIRE
  //============
  if (typeof define === 'function' && define.amd) {
    define(function (require) {
      return $$vector2;
    });
  }
  //========
  // BROWSER
  //========
  else if (typeof window !== 'undefined') {
    window.$$vector2 = $$vector2;
  }
})(window, undefined);
