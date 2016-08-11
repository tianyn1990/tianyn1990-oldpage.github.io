(function (window) {

  var $$gravity = {
    BODY_TYPE_STATIC: 0,  // 静止的物体
    BODY_TYPE_DYNAMIC: 1  // 运动的物体
  };

  /*
   物理引擎的构成要素：世界 World、形状 Shape(Circle..)、刚体 Body、贴图
   */


  // 世界
  $$gravity.World = $$klass({
    initialize: function (selector, spec) {
      this.timeStep = 1000 / 60; // 最小时间片段（物理引擎不涉及绘制操作，纯算法，因此设置刷新的时间是等长的，无论浏览器性能如何）
      this.bounceRatio = .93;    // 弹力系数
      this.speedUpTimes = 10;    // 计算加速倍数

      this.bodies = [];          // 世界中所有的物体
      this.bodiesLen = 0;
      this._lastTime = 0;
      this._pause = false;
      this._stop = false;

      this.rect = $$tool.getRect('body');
      this.canvas = document.querySelector(selector);
      this.ctt = this.canvas.getContext('2d');
      this.cw = this.canvas.width = this.rect.width;   // canvas width
      this.ch = this.canvas.height = this.rect.height; // canvas height

      // spec 赋值
      for (var key in spec) {
        if (spec.hasOwnProperty(key) && this.hasOwnProperty(key)) {
          this[key] = spec[key];
        }
      }
    },

    // 向世界添加物体
    add: function (body) {
      this.bodies.push(body);
      this.bodiesLen = this.bodies.length;
      body.world = this;  // 相互添加引用
    },

    // 处理世界上发生的所有事情：每个物体的 tick 、重力处理、AABB优化、碰撞检测、碰撞处理、重叠处理、休眠处理
    tick: function (deltaTime) {
      for (var l = this.bodiesLen; l--;) {
        this.bodies[l].tick(deltaTime);
      }
    },
    start: function () {
      var self = this, sto;
      if (self._stop) return;
      self._stop = false;
      sto = this._ticker(function (deltaTime) {
        self.tick(deltaTime);
      }.bind(this));
      !!self._pause && clearTimeout(sto);
      return self;
    },
    pause: function () {
      this._pause = true;
    },
    stop: function () {
      this._stop = true;
    },
    /*
     这里不使用requestAnimationFrame的，用智能的setTimeout。
     因为tick里面以后会包含很多逻辑，如重力处理、AABB优化、碰撞检测、碰撞处理、重叠处理、休眠处理，
     requestAnimationFrame里的函数是在repaint之前调用，和复杂且耗时的程序逻辑混在一起会导致帧率下降，起反作用。
     并且tick当中所有的操作都不（应该）涉及到绘制，因此不用考虑浏览器的性能和帧率如何。
     */
    _ticker: function (callback) {
      var self = this,
        delta = +new Date() - self._lastTime,
        time2Call = Math.max(0, self.timeStep - delta);
      self._lastTime += delta;
      return setTimeout(function () {
        if (delta < (self.timeStep * 2)) {
          callback(self.timeStep / 1000); // 单位：毫秒 -> 秒
        } else {
          // 离开页面之后，setTimeout 频率下降，大于 2 倍的 timeStep
        }
        self.start();
      }, time2Call);
    }
  });


  //============
  // AMD/REQUIRE
  //============
  if (typeof define === 'function' && define.amd) {
    define(function (require) {
      return $$gravity;
    });
  }
  //========
  // BROWSER
  //========
  else if (typeof window !== 'undefined') {
    window.$$gravity = $$gravity;
  }
})(window, undefined);
