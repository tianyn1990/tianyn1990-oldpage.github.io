/*
 * 绘制
 * */

$$gravity.Render = $$klass({
  initialize: function (world) {
    this.canvas = world.canvas;
    this.ctt = world.ctt;
    this.cw = world.cw;
    this.ch = world.ch;
    this.world = world || {bodies: []};
  },
  clear: function () {
    this.ctt.clearRect(0, 0, this.cw, this.ch);
  },
  shapes: ['Circle', 'Rect'],
  draw: function (shape) {
    for (var l = this.shapes.length, shapeType; l--;) {
      shapeType = this.shapes[l] + '';
      if (!!$$gravity.Body[shapeType] && shape instanceof $$gravity.Body[shapeType]) {
        this['_' + 'draw' + shapeType](shape);
      }
    }
  },
  tick: function (callback) {
    this.callback = callback;
    this.start();
  },
  start: function () {
    var self = this,
      callee = arguments.callee.bind(self),
      world = self.world;
    requestAnimationFrame(function () {
      self.clear();
      for (var l = world.bodiesLen, c; l--;) {
        c = world.bodies[l];
        self.draw(c);
      }
      self.callback && self.callback();
      callee();
    });
  },
  _drawCircle: function (shape) {
    var ctt = this.ctt;
    var rotation = shape.rotation / 180 * Math.PI,
      x = shape.position.x,
      y = shape.position.y,
      r = shape.r;

    ctt.save();
    ctt.beginPath();

    shape.strokeStyle = shape.strokeStyle || 'rgba(255,255,255,1)';
    shape.fillStyle = shape.fillStyle ||
    'rgba(' + $$tool.random(0, 255) + ','
    + $$tool.random(0, 255) + ','
    + $$tool.random(0, 255) + ',1)';

    ctt.strokeStyle = shape.strokeStyle;
    ctt.lineWidth = 0;
    ctt.fillStyle = shape.fillStyle;

    ctt.transform(
      Math.cos(rotation),       // a
      Math.sin(rotation),       // b
      -1 * Math.sin(rotation),  // c
      Math.cos(rotation),       // d
      x, y);                    // e, f

    ctt.arc(0, 0, r, 0, Math.PI * 2);
    ctt.fill();
    ctt.lineTo(0, 0);
    ctt.arc(0, 0, 4, 0, Math.PI * 2);
    ctt.stroke();

    ctt.restore();
  },
  _drawRect: function (shape) {
  }
});