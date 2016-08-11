var s = new Snap(800, 600);
var bigCircle = s.circle(150, 150, 100);
bigCircle.attr({
  strokeWidth: 5,
  fill: '#bada55',
  stroke: '#000'
});

var smallCircle = s.circle(100, 150, 70);
var group = s.group(smallCircle, s.circle(200, 150, 70));
group.attr({fill: '#fff'});

bigCircle.attr({mask: group});

smallCircle.animate({r: 50}, 1000);
group.select('circle:nth-child(2)').animate({r: 50}, 1000);


var p = s.path("M10 -5,-10 15 M15 0,0 15 ").attr({
  fill: "none",
  stroke: "#bada55",
  strokeWidth: 5
}).pattern(0, 0, 10, 10);
bigCircle.attr({
  fill: p
});
group.attr({fill: new Snap("#pattern")});
group.attr({fill: 'r()#fff-#000'});
group.attr({fill: 'R(150,150,100)#fff-#000'});
p.select('path').animate({stroke: '#f00'}, 1000);

Snap.load('../images/mascot.svg', function (f) {
  f.selectAll('polygon[fill="#09B39C"]').attr({fill: '#bada55'});
  var g = f.select('g');
  s.append(g);
  g.drag();
});

s.text(200, 100, 'Snap.svg');
var t = s.text(200, 120, ['Snap', '.', 'svg']);
t.selectAll('tspan:nth-child(3n)').attr({
  'font-size': '20px',
  fill: '#900'
});