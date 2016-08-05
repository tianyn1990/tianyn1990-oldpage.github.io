var world = new $$gravity.World('#cvs').start();
new $$gravity.Render(world).tick(function () {
});
function createCircle(x, y, vx, vy) {
  return new $$gravity.Body.Circle({
    position: new $$vector2(x || $$tool.random(0, 1000), y || 0),
    linearVelocity: new $$vector2(vx || $$tool.random(-150, 150), vy || $$tool.random(0, 10)),
    angularVelocity: Math.PI * $$tool.random(-5, 10),
    r: $$tool.random(30, 20)
  });
}
for (var l = 3; l--;) {
  world.add(createCircle());
}

document.querySelector('body').addEventListener('click', function (evt) {
  var rect = world.rect,
    mx = evt.clientX - rect.left,
    my = evt.clientY - rect.top;
  world.add(createCircle(mx, my, 0, $$tool.random(0, 10)));
});