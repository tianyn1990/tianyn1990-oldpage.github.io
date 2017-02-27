(function () {

  /**
   * Tween.js
   * t: current time（当前时间）
   * b: beginning value（初始值）
   * c: change in value（变化量）
   * d: duration（持续时间）。
   * you can visit 'http://easings.net/zh-cn' to get effect
   */
  var Tween = {
    Linear: function (t, b, c, d) {
      return c * t / d + b;
    },
    Quad: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t + b;
      },
      easeOut: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      }
    },
    Cubic: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
      },
      easeOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }
    },
    Quart: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
      },
      easeOut: function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      }
    },
    Quint: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
      },
      easeOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      }
    },
    Sine: {
      easeIn: function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      },
      easeOut: function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
      },
      easeInOut: function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      }
    },
    Expo: {
      easeIn: function (t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
      },
      easeOut: function (t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
    },
    Circ: {
      easeIn: function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
      },
      easeOut: function (t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      }
    },
    Elastic: {
      easeIn: function (t, b, c, d, a, p) {
        var s;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (typeof p == "undefined") p = d * .3;
        if (!a || a < Math.abs(c)) {
          s = p / 4;
          a = c;
        } else {
          s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      },
      easeOut: function (t, b, c, d, a, p) {
        var s;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (typeof p == "undefined") p = d * .3;
        if (!a || a < Math.abs(c)) {
          a = c;
          s = p / 4;
        } else {
          s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
      },
      easeInOut: function (t, b, c, d, a, p) {
        var s;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (typeof p == "undefined") p = d * (.3 * 1.5);
        if (!a || a < Math.abs(c)) {
          a = c;
          s = p / 4;
        } else {
          s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      }
    },
    Back: {
      easeIn: function (t, b, c, d, s) {
        if (typeof s == "undefined") s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      easeOut: function (t, b, c, d, s) {
        if (typeof s == "undefined") s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      easeInOut: function (t, b, c, d, s) {
        if (typeof s == "undefined") s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
      }
    },
    Bounce: {
      easeIn: function (t, b, c, d) {
        return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
      },
      easeOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
          return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
          return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
          return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
          return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
      },
      easeInOut: function (t, b, c, d) {
        if (t < d / 2) {
          return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
        } else {
          return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
      }
    },
    //随便写的，模拟了小球加速下落的过程，easeOut则刚好相反
    Fall: {
      easeIn: function (t, b, c, d) {
        return c * (t / d) * (t / d) + b;
      },
      easeOut: function (t, b, c, d) {
        return c * Math.sqrt(t / d) + b;
      }
    },

    //缓存
    catches: {}
  };

  /**
   *
   * author: tianyn1990(tianyanan.zero@gmail.com)
   *
   * 获取缓动函数的调用结果
   *
   * @param name 缓动动画名，需要在webApp中唯一，用于缓存参数以提升性能
   *
   * @param tweens 选择使用的缓动函数，根据Tween对象，如：['Bounce', 'easeIn'] 或者 'Linear'
   *
   * @param spec 缓动参数：
   *
   * begin: 初始值 {Number}（x,y,rotate,opacity等值）
   * end: 最终值 {Number}
   * current: 当前时间 {帧FPS} ，包含delay的时间
   *        特别注意：直接在这里传入raf循环的自增变量即可，tween方法内部会缓存初始值，
   *        并在后面的运算中抵消掉；如current第一次传入999，第二次调用（name参数相同）传入1000，
   *        那么真正参与运算的值为1
   *
   * during: 持续时间 (单位：秒)，不包含delay的时间（与css3保持一致）
   * delay: 延迟 (单位：秒)
   * fps: 帧率，默认60，最大60，可以改变帧率来改变动画速率，也可以根据当前的平均帧率，在卡顿的情况下，
   *      以牺牲动画连贯性来保证动画用时与正常情况一致，而不至于变的缓慢
   *
   * |<-延迟->|<--  持续时间  -->|
   * ---------------------------
   * |<-------         ------->|
   *              |
   *           当前时间
   *
   * @returns {Number} 计算出的当前值
   */
  Math.tween = function (name, tweens, spec) {
    var current = spec.current || 0, tweenFn,
      during, delay, begin, end, fps,
      c = Tween.catches;

    //缓存
    if (!c[name]) {
      tweens = typeof tweens == 'string' ? [tweens] : tweens;
      if (tweens.length == 1) {
        tweenFn = Tween[tweens[0]];
      } else {
        tweenFn = Tween[tweens[0]][tweens[1]];
      }
      fps = spec.fps || 60;
      c[name] = {};
      c[name].fn = tweenFn;
      c[name]["_b"] = spec.begin || 0;
      c[name]["_e"] = spec.end || 0;
      c[name]["_c"] = current;
      c[name]["_du"] = spec.during * fps;
      c[name]["_dl"] = (spec.delay || 0) * fps;
    }

    //获取缓存对象
    tweenFn = c[name].fn;
    begin = c[name]["_b"];
    end = c[name]["_e"];
    during = c[name]["_du"];
    delay = c[name]["_dl"];

    //current取得是与缓存值的「变化量」
    current -= (c[name]["_c"] || 0);

    if (current < delay)
      return begin;
    else if (current > delay + during) {
      return end;
    }

    return tweenFn(
      current - delay,
      begin,
      end - begin,
      during
    );
  };

  window.t = Tween;

})();


