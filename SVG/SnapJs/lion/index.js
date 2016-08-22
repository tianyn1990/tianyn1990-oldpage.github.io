var s, polys;
var stat2 = {
    opacity: 1,
    transform: 'scale(1,1,0,0)'
  },
  stat1 = {
    opacity: 0,
    transform: 'scale(0,0,0,0)'
  };
Snap.load('../images/lion.svg', function (f) {
  var node = f.node;
  if (!node) return;
  var w = node.getAttribute('w') || 800,
    h = node.getAttribute('h') || 800;
  s = new Snap(w, h);
  polys = f.selectAll('polygon');
  polys.attr(stat1);
  s.append(polys);
  setTimeout(function () {
    ani();
  }, 1000);
});

var waitInterval = 4,
  wait = 0,
  reverse = false,
  during = 500,
  easing = mina.backout,
  len;
function ani() {
  len = polys.length;
  polys.forEach(function (pl, idx) {
    if (reverse)
      wait -= waitInterval;
    else
      wait += waitInterval;
    setTimeout(function () {
      pl.animate(stat2, during, easing);
      if ((!reverse && len - 1 == idx) || (reverse && idx == 0)) {
        lastCallBack();
      }
    }, wait);
  });
}

function lastCallBack() {
  var tmp = stat1;
  stat1 = stat2;
  stat2 = tmp;
  reverse = !reverse;
  easing = easing == mina.backout ? mina.backin : mina.backout;
  setTimeout(function () {
    ani();
  }, 1000);
}
