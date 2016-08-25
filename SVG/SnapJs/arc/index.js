var s = new Snap(400, 400);

var arc = describeArc(100, 100, 100, 0, 170);
s.path('M' + arc.M.join(' ') + 'A' + arc.A.join(' ') + 'z').attr({
  fill: 'lightpink',
  stroke: '#555',
  strokeWidth: 5
});

function describeArc(x, y, radius, startAngle, endAngle) {

  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  return {
    "M": [start.x, start.y],
    // 长轴半径、短轴半径、旋转角度、长or短弧、顺or逆时针、结束点x、结束点y
    "A": [radius, radius, 0, arcSweep, 0, end.x, end.y]
  };

}
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}