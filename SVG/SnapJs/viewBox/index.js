var s = new Snap(800, 800),
  xmark;

var srcArea = [0, 0, 800, 800],
  tarArea = [235, 100, 32, 32],
  begin = 0,
  end = 1000,
  dis = Math.abs(begin - end),
  ratio;

Snap.load('../images/wedding.svg', function (f) {
  xmark = f.selectAll('g');
  s.append(xmark);
  s.attr({
    viewBox: srcArea[0] + ' ' + srcArea[1] + ' ' + srcArea[2] + ' ' + srcArea[3],
    preserveAspectRatio: 'meet'
  });
  ani();
});

function ani() {
  Snap.animate(begin, end, function (val) {
    ratio = val / dis;
    s.attr({
      viewBox: '' +
      (srcArea[0] + (tarArea[0] - srcArea[0]) * ratio) +
      ' ' +
      (srcArea[1] + (tarArea[1] - srcArea[1]) * ratio) +
      ' ' +
      (srcArea[2] + (tarArea[2] - srcArea[2]) * ratio) +
      ' ' +
      (srcArea[3] + (tarArea[3] - srcArea[3]) * ratio)
    });
  }, 1000, mina.easeinout, function () {
    var tmp = begin;
    begin = end;
    end = tmp;
    setTimeout(function () {
      ani();
    }, 1000);
  });
}
