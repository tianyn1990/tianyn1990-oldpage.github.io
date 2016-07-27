var rect = $$tool.getRect('body'),
  c = createjs,
  stage = new c.Stage('cvs'),
  canvas = stage.canvas,
  cw = canvas.width = rect.width,   // canvas width
  ch = canvas.height = rect.height; // canvas height

c.Ticker.timingMode = c.Ticker.RAF;

c.Ticker.on('tick', function (evt) {
  updatePoint();
  updateLine();
  stage.update(evt);
});

var data = {
  pointNum: 0, // 点的个数
  pointWidth: 1,
  points: [],
  mousePoint: undefined,
  isMoving: false,
  maxGravityLen: 90, // 最远吸引距离
  lines: [],
  color: '#000'
};
data.pointNum = ~~(cw * ch / 6000);

var $$body = document.querySelector("body");
$$body.addEventListener('mousemove', function (evt) {
  data.isMoving = true;
  var mx = evt.clientX - rect.left,
    my = evt.clientY - rect.top;
  if (!data.mousePoint) {
    data.mousePoint = new Point(mx, my, data.color, 0);
    data.mousePoint.vx = 0;
    data.mousePoint.vy = 0;
    data.points.push(data.mousePoint);
    stage.addChild(data.mousePoint.point);
    return;
  }
  data.mousePoint.update(mx, my);
});

function updatePoint() {
  if(!data.pointNum) return;
  var p, x, y, l;
  if (data.points.length < data.pointNum) {
    for (l = data.pointNum; l; l--) {
      p = new Point($$tool.random(0, cw), $$tool.random(0, ch), data.color, data.pointWidth);
      data.points.push(p);
      stage.addChild(p.point);
    }
  }
  for (l = data.points.length; l; l--) {
    p = data.points[l - 1];
    x = p.x + p.vx;
    y = p.y + p.vy;
    if (x < -10 || x > cw + 10 || y < -10 || y > ch + 10) {
      x = $$tool.random(0, cw);
      y = $$tool.random(0, ch);
      p.vx = calcPointV();
      p.vy = calcPointV();
    }
    p.update(x, y);
  }
}

function updateLine() {
  var p1, p2, line, lineIdx = 0, dis, width, dx, dy, color;
  for (var i = 0, l = data.points.length; i < l; i++) {
    p1 = data.points[i];
    for (var j = i + 1; j < l; j++) {
      p2 = data.points[j];
      dis = disPoints(p1, p2) || Infinity;
      if (dis < data.maxGravityLen) {
        color = data.color;
        line = data.lines[lineIdx++];
        width = Math.abs(data.maxGravityLen - dis) / data.maxGravityLen / 2;
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
        if (dis > data.maxGravityLen / 5 * 4) {
          color = 'red';
          width += .1;
          p1.x -= (dx * (dis - data.maxGravityLen / 5 * 4) / 12000);
          p1.y -= (dy * (dis - data.maxGravityLen / 5 * 4) / 12000);
        } else {
          dx = p1.x - p2.x;
          dy = p1.y - p2.y;
          p1.x += (dx * (data.maxGravityLen / 5 - dis) / 12000);
          p1.y += (dy * (data.maxGravityLen / 5 - dis) / 12000);
        }
        if (p2 == data.mousePoint && data.isMoving) {
          color = 'rgba(0,0,0,0)';
          dx = p1.x - p2.x;
          dy = p1.y - p2.y;
          p1.vx += (dx * .05);
          p1.vy += (dy * .05);
        }
        if (!line) {
          line = new Line(p1.x, p1.y, p2.x, p2.y, width, color);
          stage.addChild(line.line);
          data.lines.push(line);
        } else {
          line.update(p1.x, p1.y, p2.x, p2.y, width, color);
        }
        line.show();
      }
    }
  }
  for (; lineIdx < data.lines.length; lineIdx++) {
    data.lines[lineIdx].hide();
  }
  data.isMoving = false;
}

function disPoints(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function Line(x1, y1, x2, y2, w, color) {
  if (!x1 || !y1 || !x2 || !y2 || !w) return;
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.w = w;
  this.color = color || '#000';
  this.line = new c.Shape();
  this.line.graphics.setStrokeStyle(w).beginStroke(this.color).moveTo(x1, y1).lineTo(x2, y2).endStroke();
}
Line.prototype.update = function (x1, y1, x2, y2, w, color) {
  this.x1 = x1 || this.x1;
  this.y1 = y1 || this.y1;
  this.x2 = x2 || this.x2;
  this.y2 = y2 || this.y2;
  this.w = w || this.w;
  this.color = color || this.color;
  this.line.graphics.clear().setStrokeStyle(this.w)
    .beginStroke(this.color).moveTo(this.x1, this.y1).lineTo(this.x2, this.y2).endStroke();
  return this;
};
Line.prototype.hide = function () {
  this.line.visible = false;
  return this;
};
Line.prototype.show = function () {
  this.line.visible = true;
  return this;
};

function calcPointV() {
  var v = $$tool.random(-200, 400) / 300;
  if (Math.abs(v) < .2) {
    return calcPointV();
  }
  return v;
}

function Point(x, y, color, r) {
  this.x = x;
  this.y = y;
  this.vx = calcPointV();
  this.vy = calcPointV();
  this.color = color || '#000';
  this.r = r || 1;
  this.point = new c.Shape().set({x: x, y: y});
  this.point.offsetX = -this.r / 2;
  this.point.offsetY = -this.r / 2;
  this.point.graphics.f(this.color).dr(0, 0, this.r, this.r);
}
Point.prototype.update = function (x, y, color, r) {
  this.x = x || this.x;
  this.y = y || this.y;
  this.point.x = this.x;
  this.point.y = this.y;
  this.point.offsetX = -this.r / 2;
  this.point.offsetY = -this.r / 2;
  if (!!color || !!r) {
    this.color = this.color || color;
    this.r = this.r || r;
    this.point.graphics.clear().f(this.color).dr(0, 0, this.r, this.r);
  }
};
