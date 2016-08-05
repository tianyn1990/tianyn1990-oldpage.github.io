/*
 * 力
 *  - 力：force
 *  - 冲量：impulse
 * */

// 重力 F = m * a
$$gravity.World.Gravity = $$klass({
  acceleration: 9.80665,                 // 重力加速度：9.80665 m/s2
  initialize: function (spec) {
    this.position = new $$vector2(0, 1); // 重力方向，默认 x 无，y 为 1 表示正方向向下
    if (spec.position && spec.position instanceof $$vector2) {
      this.position = spec.position;
    }
    this.mass = spec.mass || spec;       // 质量
    this.x = this.position.x * this.mass * this.acceleration;
    this.y = this.position.y * this.mass * this.acceleration;
  }
});

// 冲量：I = F * △t = m * △v = △P （P：动量）
$$gravity.World.Impulse = $$klass({
  
});
