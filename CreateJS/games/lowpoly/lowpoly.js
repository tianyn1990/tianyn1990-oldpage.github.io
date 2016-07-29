var rect = $$tool.getRect('body'),
  canvas = document.querySelector('#cvs'),
  inputFile = document.querySelector('#inputFile'),
  tutorial = document.querySelector('.j-tutorial'),
  ctt = canvas.getContext('2d'),
  cw = canvas.width = rect.width,   // canvas width
  ch = canvas.height = rect.height; // canvas height

// 事件
tutorial.onclick = function () {
  inputFile.click();
};
inputFile.onchange = function (evt) {
  var file = evt.target.files[0];

  if (!file) return;
  if (!/\/(?:jpeg|png)/i.test(file.type || 'abc')) throw Error("图片需为JPG或者PNG格式");

  var reader = new FileReader();
  reader.onload = function () {
    parseImage2Lowpoly(reader.result, initImageCallback, cw);
  };
  reader.readAsDataURL(file);

};

var imageData,
  edgePos,
  triangles;

// 加载图片
parseImage2Lowpoly("./img/horse.jpg", initImageCallback, cw);

// 加载图片回调
function initImageCallback(data) {

  // 获取图片像素点信息
  imageData = data.ctt.getImageData(0, 0, data.width, data.height);

  // 通过 sobel 边缘检测算法（经过修改），随机的获取一部分的边缘坐标点 https://github.com/miguelmota/sobel
  edgePos = getPoints(imageData, data.width, data.height);

  // 通过 delaunay 三角化算法，将边缘点坐标排序
  triangles = Delaunay.triangulate(edgePos);

  // 绘制图片，填充色块之间的缝隙
  ctt.drawImage(data.canvas, 0, 0, data.width, data.height);

  // 绘制分割三角形（测试用）
  //drawTriangleLine();

  // 绘制 lowpoly
  drawLowpoly();
}

function drawLowpoly() {
  var sortData = $$tool.setImageData(imageData);
  var x1, y1, x2, y2, x3, y3;
  for (var i = triangles.length, avgPoint; i;) {
    x1 = edgePos[triangles[--i]][0];
    y1 = edgePos[triangles[i]][1];
    x2 = edgePos[triangles[--i]][0];
    y2 = edgePos[triangles[i]][1];
    x3 = edgePos[triangles[--i]][0];
    y3 = edgePos[triangles[i]][1];
    avgPoint = calc3PointAvg(sortData, x1, y1, x2, y2, x3, y3);
    ctt.beginPath();
    ctt.strokeStyle = '#333';
    ctt.lineWidth = 0;
    ctt.fillStyle =
      'rgba(' + avgPoint[0] + ',' + avgPoint[1] + ',' + avgPoint[2] + ',' + avgPoint[3] + ')';
    ctt.moveTo(x1, y1);
    ctt.lineTo(x2, y2);
    ctt.lineTo(x3, y3);
    ctt.closePath();
    ctt.fill();
  }
}

function calc3PointAvg(sortData, x1, y1, x2, y2, x3, y3) {
  var cx = ~~((x1 + x2 + x3) / 3),
    cy = ~~((y1 + y2 + y3) / 3);
  return sortData.pointAt(cx, cy);
}

function drawTriangleLine() {
  ctt.strokeStyle = '#000';
  ctt.lineWidth = .5;
  for (var i = triangles.length; i;) {
    ctt.beginPath();
    ctt.moveTo(edgePos[triangles[--i]][0], edgePos[triangles[i]][1]);
    ctt.lineTo(edgePos[triangles[--i]][0], edgePos[triangles[i]][1]);
    ctt.lineTo(edgePos[triangles[--i]][0], edgePos[triangles[i]][1]);
    ctt.closePath();
    ctt.stroke();
  }
}

function getPoints(imageData, width, height) {
  var edgePos = [], collectors = [],
    imageWidth = imageData.width;

  // 取得色值大于 40 的边缘点坐标
  Sobel(imageData, function (magnitude, x, y) {
    magnitude > 40 && collectors.push([x, y]);
  });

  // 随机取收集到的点
  for (var i = 0, n = collectors.length, l = imageWidth * 3, random, tmp; i < l; i++) {
    random = $$tool.random(i, n - i);
    tmp = collectors[random];
    collectors[random] = collectors[i];
    collectors[i] = tmp;
    edgePos.push(tmp);
  }

  // 添加一些随机点
  for (l = ~~(imageWidth / 2); l; l--) {
    edgePos.push([$$tool.random(0, width), $$tool.random(0, height)])
  }

  // 四个顶点
  edgePos.push([0, 0], [0, height], [width, 0], [width, height]);

  // 上下两个边上的点
  for (i = 0, l = ~~(imageWidth / 15); i < l; i++) {
    edgePos.push([i * 15, 0]);
    edgePos.push([i * 15, height]);
  }

  return edgePos;
}

function parseImage2Lowpoly(imgSrc, callback, maxWidth) {
  ctt.clearRect(0, 0, cw, ch);
  var offCvs = document.createElement('canvas'),
    offContext = offCvs.getContext('2d'),
    img = new Image(),
    w, nw, h;
  img.src = imgSrc;
  img.onload = function () {
    w = img.width;
    h = img.height;
    if (!!maxWidth) {
      nw = w > maxWidth ? maxWidth : w;
      h = h * nw / w;
      w = nw;
    }
    offCvs.width = w;
    offCvs.height = h;
    offContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
    callback({
      canvas: offCvs,
      ctt: offContext,
      image: img,
      width: w,
      height: h
    });
  };
}