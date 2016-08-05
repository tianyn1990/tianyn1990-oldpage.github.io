/*
 * 形状 Shape(Circle, Rect ..)
 * */


$$gravity.Body = $$klass({
  initialize: function (spec) {
    this.bodyType = $$gravity.BODY_TYPE_DYNAMIC;
    this.position = new $$vector2(0, 0);       // 位置（重心）
    this.linearVelocity = new $$vector2(0, 0); // 线速度
    this.rotation = 0;                         // 角度，单位：度
    this.angularVelocity = 0;                  // 角速度，单位：弧度，PI
    this.density = this.density || 1;          // 密度
    this.mass = this.massRatio * this.density; // 质量

    // spec 赋值
    for (var key in spec) {
      if (spec.hasOwnProperty(key) && this.hasOwnProperty(key)) {
        this[key] = spec[key];
      }
    }

    this.boundary = {t: this.r, r: this.r, b: this.r, l: this.r};

    // 受力 F = m * a
    // 重力
    this.force = new $$gravity.World.Gravity(this.mass);

    // 质量的倒数
    //  - 静止的物体，设为0
    this.invMass =
      this.bodyType == $$gravity.BODY_TYPE_STATIC ? 0 : 1 / this.mass;

  },
  integrateVelocity: function (delta, times) {
    // a = F / m
    // v = a * t
    this.linearVelocity.x += this.force.x * this.invMass * delta * times;
    this.linearVelocity.y += this.force.y * this.invMass * delta * times;
  },
  integratePosition: function (delta, times) {
    // s = v * t
    this.position.x += this.linearVelocity.x * delta * times;
    this.position.y += this.linearVelocity.y * delta * times;
  },
  integrateRotation: function (delta) {
    if (Math.abs(this.rotation) > 360) this.rotation %= 360;
    this.rotation += this.angularVelocity * 180 / Math.PI * delta;
  },
  integrateRebound: function () {
    var world = this.world;
    if (!world) return;
    var cc = this,
      t = cc.boundary.t || 0,
      r = world.cw - cc.boundary.r || 0,
      b = world.ch - cc.boundary.b || 0,
      l = cc.boundary.l || 0;

    var bounceRatio = world.bounceRatio; // 弹力系数

    // 碰壁反弹
    var revert = 1;
    if (cc.position.x < l) {
      revert = cc.linearVelocity.x > 0 ? 1 : -1;
      revert == -1 && (cc.angularVelocity *= bounceRatio);
      cc.linearVelocity.x *= revert * bounceRatio;
      cc.position.x = l;
    } else if (cc.position.x > r) {
      revert = cc.linearVelocity.x < 0 ? 1 : -1;
      revert == -1 && (cc.angularVelocity *= bounceRatio);
      cc.linearVelocity.x *= revert * bounceRatio;
      cc.position.x = r;
    }
    if (cc.position.y < t) {
      revert = cc.linearVelocity.y > 0 ? 1 : -1;
      revert == -1 && (cc.angularVelocity *= bounceRatio);
      cc.linearVelocity.y *= revert * bounceRatio;
      cc.position.y = t;
    } else if (cc.position.y > b) {
      revert = cc.linearVelocity.y < 0 ? 1 : -1;
      revert == -1 && (cc.angularVelocity *= bounceRatio);
      cc.linearVelocity.y *= revert * bounceRatio;
      cc.position.y = b;
    }

  },
  // 碰撞检测 todo
  checkCollision: function (s1, s2) {
    // 圆与圆
    if (s1 instanceof $$gravity.Body.Circle
      && s2 instanceof $$gravity.Body.Circle) {
      var dis = Math.sqrt(s1.position.distanceSquare(s2.position))
        - Math.sqrt((s1.r + s2.r) * (s1.r + s2.r));
      if (dis < 0) {
        s1.collisionDis = s2.collisionDis = dis;
        return true;
      }
    }
    return false;
  },
  tick: function (deltaTime) {
    var times = (this.world && this.world.speedUpTimes) || 10;

    // 自然运动，重力影响
    this.integrateVelocity(deltaTime, times);
    this.integratePosition(deltaTime, times);
    this.integrateRotation(deltaTime);

    // 反弹
    //  - 四壁
    this.integrateRebound && this.integrateRebound();
    //  - 相互
    this.integrateCollision && this.integrateCollision();
  }
});


// 圆形
$$gravity.Body.Circle = $$gravity.Body.extend({
  initialize: function (spec) {
    this.r = spec.r || 0; // 半径
    this.massRatio = this.r; // 质量系数
    this.supr(spec);
  },
  // 相互碰撞反弹
  integrateCollision: function () {
    var self = this,
      world = self.world,
      bodies,
      s1 = self;
    if (!world) return;
    var bounceRatio = world.bounceRatio; // 弹力系数
    bodies = world.bodies;
    for (var l = world.bodiesLen, s2; l--; l) {
      s2 = bodies[l];
      if (s2 != s1) {
        if (self.checkCollision(s1, s2)) { // 发生碰撞
          var s1Pos = s1.position,
            s2Pos = s2.position,
            disNm12 = new $$vector2(s1Pos.x - s2Pos.x, s1Pos.y - s2Pos.y).normalize(), // 中心连线单位向量
            disNm21 = new $$vector2(s2Pos.x - s1Pos.x, s2Pos.y - s1Pos.y).normalize(), // 中心连线单位向量
            v2Tos1 = disNm12.dotXY( // s2-s1 的速度向量在 s1、s2 中心连线的投影
              s2.linearVelocity.x - s1.linearVelocity.x,
              s2.linearVelocity.y - s1.linearVelocity.y
            ),
            v1Tos2 = disNm21.dotXY( // s1-s2 的速度向量在 s1、s2 中心连线的投影
              s1.linearVelocity.x - s2.linearVelocity.x,
              s1.linearVelocity.y - s2.linearVelocity.y
            ),
            v2Tos1XI = v2Tos1 * disNm12.x * s2.mass, // s2 对 s1 在 x 轴方向的冲量
            v2Tos1YI = v2Tos1 * disNm12.y * s2.mass, // s2 对 s1 在 y 轴方向的冲量
            v1Tos2XI = v1Tos2 * disNm21.x * s1.mass, // s1 对 s2 在 x 轴方向的冲量
            v1Tos2YI = v1Tos2 * disNm21.y * s2.mass; // s1 对 s2 在 y 轴方向的冲量

          s1.linearVelocity.x += v2Tos1XI / s1.mass;
          s1.linearVelocity.y += v2Tos1YI / s1.mass;
          s2.linearVelocity.x += v1Tos2XI / s2.mass;
          s2.linearVelocity.y += v1Tos2YI / s2.mass;

          s1.linearVelocity.x *= bounceRatio;
          s1.linearVelocity.y *= bounceRatio;
          s2.linearVelocity.x *= bounceRatio;
          s2.linearVelocity.y *= bounceRatio;

          s1.position.x -= s1.collisionDis * disNm12.x;
          s1.position.y -= s1.collisionDis * disNm12.y;
          s2.position.x -= s1.collisionDis * disNm21.x;
          s2.position.y -= s1.collisionDis * disNm21.y;
        }
      }
    }
  },
  // 四壁反弹
  integrateRebound: function () {
    var world = this.world;
    if (!world) return;
    var cc = this,
      t = cc.boundary.t || 0,
      r = world.cw - cc.boundary.r || 0,
      b = world.ch - cc.boundary.b || 0,
      l = cc.boundary.l || 0;

    var bounceRatio = world.bounceRatio; // 弹力系数

    // 碰壁反弹
    var revert = 1;
    if (cc.position.x < l) {
      revert = cc.linearVelocity.x > 0 ? 1 : -1;
      revert == -1 && (cc.angularVelocity *= bounceRatio);
      cc.linearVelocity.x *= revert * bounceRatio;
      cc.position.x = l;
    } else if (cc.position.x > r) {
      revert = cc.linearVelocity.x < 0 ? 1 : -1;
      revert == -1 && (cc.angularVelocity *= bounceRatio);
      cc.linearVelocity.x *= revert * bounceRatio;
      cc.position.x = r;
    }
    if (cc.position.y < t) {
      revert = cc.linearVelocity.y > 0 ? 1 : -1;
      revert == -1 && (cc.angularVelocity *= bounceRatio);
      cc.linearVelocity.y *= revert * bounceRatio;
      cc.position.y = t;
    } else if (cc.position.y > b) {
      revert = cc.linearVelocity.y < 0 ? 1 : -1;
      revert == -1 && (cc.angularVelocity *= bounceRatio);
      cc.linearVelocity.y *= revert * bounceRatio;
      cc.position.y = b;
    }

  }
});