var rect = $$tool.getRect('body'),
  canvas = document.querySelector('#cvs'),
  ctt = canvas.getContext('2d'),
  cw = canvas.width = rect.width,   // canvas width
  ch = canvas.height = rect.height; // canvas height

var width, height,        // 每个小格子的宽高
  wNum = 100, hNum = 200; // 网格为 100 * 100

