var s = new Snap(190.4, 205.8),
  xmark;

Snap.load('../images/xmark.svg', function (f) {
  xmark = f.select('g');
  s.append(xmark);
  start();
});


function start() {
  var p1 = s.select('path:nth-child(1)'),
    p2 = s.select('path:nth-child(2)'),
    p3 = s.select('path:nth-child(3)'),
    p4 = s.select('path:nth-child(4)');
  var p1l = p1.getTotalLength(),
    p2l = p2.getTotalLength(),
    p3l = p3.getTotalLength(),
    p4l = p4.getTotalLength();
  p1.attr({
    'stroke-dasharray': p1l,
    'stroke-dashoffset': p1l
  });
  p2.attr({
    'stroke-dasharray': p2l,
    'stroke-dashoffset': p2l
  });
  p3.attr({
    'stroke-dasharray': p3l,
    'stroke-dashoffset': p3l
  });
  p4.attr({
    'stroke-dasharray': p4l,
    'stroke-dashoffset': p4l
  });
  setTimeout(function () {
    p1.animate({'stroke-dashoffset': 0}, 300, mina.easeInOut, function () {
        setTimeout(function () {
          p2.animate({'stroke-dashoffset': 0}, 70, mina.linear, function () {
              setTimeout(function () {
                p3.animate({'stroke-dashoffset': 0}, 70, mina.linear, function () {
                    setTimeout(function () {
                      p4.animate({'stroke-dashoffset': 0}, 1000, mina.linear);
                    }, 200);
                  }
                );
              }, 150);
            }
          );
        }, 200);
      }
    );
  }, 1000);
}
