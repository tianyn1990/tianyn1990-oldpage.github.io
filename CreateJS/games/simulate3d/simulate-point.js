/*

参考：
 关于 3d 投影到 2d 平面（2d 模拟 3d）
 1、摄像机、投影、3D旋转、缩放：http://www.cnblogs.com/iamzhanglei/archive/2011/09/23/2185627.html
 2、事情没有那么难—JX官网首页3D粒子效果：http://www.cnblogs.com/hongru/archive/2012/03/28/2420415.html、http://www.cnblogs.com/axes/p/3500655.html
 3、另外，上面两个文章中的三维图形变换，可以使用「三维矩阵变换」来完成，公式：http://blog.sina.com.cn/s/blog_620bf89501011fl8.html

 一点心得：
 1、虽然是「点」，但连接在一起就是「面」，帖上图片之后，就是三维物体
 2、运用了「三维变换矩阵」，可以进行更灵活的控制：旋转、缩放、位移
 3、发现一些canvas 2d模拟3d场景的框架，比如：http://www.kevs3d.co.uk/dev/phoria/。缺点是性能更差，不适宜复杂场景，优势是兼容性比webgl更好
 4、另外有一些框架是2d、3d同时支持的，想必是有两套逻辑

 * */

//--- 2D canvas 模拟 3D 效果 -- 点（->线->面） ----------------------------------------------------------------------

// parameters

var rect = $$tool.getRect('body'),
  c = createjs,
  stage = new c.Stage('cvs'),
  canvas = stage.canvas,
  cw = canvas.width = rect.width,   // canvas width
  ch = canvas.height = rect.height, // canvas height
  focalLen = 1280,                   // focal length in z axis
  FPS = 30,
  TICK_ITV_TIME = 1000 / 60;        // interval time between frames in theory


// loop function
var loop = {
  draw: $$tool.noop,
  update: $$tool.noop,
  globalUpdate: $$tool.noop,
  stateCurrentTime: 0,
  totalTime: 0
};

// data storage
var gdata = {
  currentShape: 0,
  shapes: [
    {name: 'Hi~', fontSize: ~~(ch / 1.3)},
    {name: '618', fontSize: ~~(ch / 1.3)},
    {name: '天呐', fontSize: ~~(ch / 1.2)},
    {name: 'Fight', fontSize: ~~(ch / 1.5)},
    {name: '考拉', fontSize: ~~(ch / 1.2)}
  ],

  shapePos: [],
  shapeZ: 500,

  ballParas: [],
  backgroundParas: [],

  rotsV: [0, 0, 0],
  rots: [0, 0, 0],
  maxRots: [50, 30, 50],
  minRots: [-50, -30, -50],

  translate: [0, 0, 0],
  globalTrans: [0, 0, 0],
  r: 8
};

//---------------------------------------------------------------------------

// finite state machine 有限状态机，便于控制状态的切换

var fsm = StateMachine.create({
  initial: {state: 'aggregation', defer: true, event: 'init'},
  events: [
    {name: 'explosion', from: '*', to: 'separate'},
    {name: 'rebuild', from: '*', to: 'aggregation'},
    {name: 'calm', from: '*', to: 'stable'}
  ],
  callbacks: {
    // init
    "oninit": function (event, from, to) {
      //console.log('event: ' + event + ', ' + from + '->' + to);

      initRot();
      // calc txt pos
      calcPos(gdata.shapes[gdata.currentShape].name, gdata.shapes[gdata.currentShape].fontSize || ~~(ch / 1.2));
      gdata.currentShape++;
      // generate balls in stage.children 生成小球
      generateBalls(gdata.ballParas, gdata.shapePos.length);
      generateBalls(gdata.backgroundParas, 500);
      // 入场动画 update 函数
      loop.update = rebuildUpdate;
      // 通用 draw 方法
      loop.draw = generalDraw;
      // 全局 update 函数
      loop.globalUpdate = globalUpdate;
      // tick
      startTick();
    },

    // global
    "onleavestate": function (event, from, to) {
      if (event == 'init') return;
      //console.log('leaving : ' + from);

      // reset state time
      loop.stateCurrentTime = 0;
      loop.waitTime = 0;
    },
    "onenterstate": function (event, from, to) {
      if (event == 'init') return;
      //console.log('enter : ' + to);
    },

    // prototype
    "oncalm": function (event, from, to) {
      //console.log('event: ' + event + ', ' + from + '->' + to);
      if (from == 'aggregation') {
        loop.nextEvent = 'explosion';
      } else if (from == 'separate') {
        loop.nextEvent = 'rebuild';
      }
      loop.waitTime = arguments[3];
      loop.update = calmUpdate;
      loop.draw = generalDraw;
    },
    "onexplosion": function (event, from, to) {
      //console.log('event: ' + event + ', ' + from + '->' + to);
      resetPos();
      loop.update = explosionUpdate;
      loop.draw = generalDraw;
    },
    "onrebuild": function (event, from, to) {
      //console.log('event: ' + event + ', ' + from + '->' + to);
      calcPos(gdata.shapes[gdata.currentShape].name, gdata.shapes[gdata.currentShape].fontSize || ~~(ch / 1.4));
      gdata.currentShape++;
      if (!gdata.shapes[gdata.currentShape]) gdata.currentShape = 0;

      generateBalls(gdata.backgroundParas, gdata.shapePos.length, true);
      var ballsArr = adjustBalls(gdata.ballParas, gdata.shapePos.length, gdata.backgroundParas);
      gdata.ballParas = ballsArr[0];
      gdata.backgroundParas = ballsArr[1];

      loop.update = rebuildUpdate;
      loop.draw = generalDraw;
    }
  }
});

//---------------------------------------------------------------------------

// functions

// 开始 tick 主循环
function startTick() {
  c.Ticker.timingMode = c.Ticker.RAF_SYNCHED;
  c.Ticker.setFPS(FPS);
  c.Ticker.on('tick', function (evt) {

    // calc times
    var delta = evt.delta,
      timeScale = delta * FPS / 1000; // > 1 表示循环变慢
    timeScale = timeScale < 1 ? 1 : timeScale;
    loop.totalTime += delta;          // 总时间
    loop.stateCurrentTime += delta;   // 当前状态时间

    // update
    var currentFrame = ~~(loop.stateCurrentTime / TICK_ITV_TIME); // 当前状态帧数
    loop.globalUpdate(delta, timeScale, currentFrame);            // 全局 update 函数
    loop.update(delta, timeScale, currentFrame);                  // 当前状态的 update 函数

    // draw
    loop.draw();

    stage.update(evt);
  });
}

var getRandomXYZ = (function () {
  var randomxyz = [0, 0, 0];
  var long = Math.max(cw, ch, focalLen);
  return function () {
    randomxyz[0] = $$tool.random(-long * 2 / 3 + cw / 2, long * 4 / 3);
    randomxyz[1] = $$tool.random(-long * 2 / 3 + ch / 2, long * 4 / 3);
    randomxyz[2] = $$tool.random(-long * 2 / 3, long * 4 / 3);
    return randomxyz;
  };
})();

// 获取文本 txt 对应图形的坐标
function calcPos(txt, fontSize) {
  gdata.shapePos = $$tool.getParticlePos($$tool.createTxtCanvas(txt, cw, ch, 'bold ' + fontSize + 'px Arial'), 127, 19);
}

function resetPos() {
  for (var l = gdata.shapePos.length, pos, _pos; l; l--) {
    _pos = getRandomXYZ();
    pos = gdata.shapePos[l - 1];
    pos.x = _pos[0];
    pos.y = _pos[1];
    pos.z = _pos[2];
  }
}

// 从 backupBalls 中抽取 num 个补充到 balls 中，balls 原来的都放到 backupBalls 中
function adjustBalls(balls, num, backupBalls) {
  var ballsNew, num2;
  ballsNew = [];
  num2 = backupBalls.length; // num2 一定大于 num
  var ratio = num2 / num;
  for (var i = 0, n, pick; i < num2; i++) {
    n = ~~(i * ratio);
    pick = backupBalls[n];
    if (!!pick) {
      backupBalls[n] = backupBalls[ballsNew.length];
      backupBalls[ballsNew.length] = pick;
      ballsNew.push(pick);
    }
  }
  backupBalls.splice(0, ballsNew.length);
  return [ballsNew, backupBalls.concat(balls)];
}

// 初始化一定数量的小球，坐标随机
function generateBalls(balls, num, isFar) {
  var _num = balls.length;
  if (_num >= num) return;
  var colors = [255, 0, 0];
  for (var l = num - _num, x, y, z, ball, _pos; l; l--) {
    _pos = getRandomXYZ();
    x = _pos[0];
    y = _pos[1];
    z = _pos[2];
    ball = addBall();
    if (!!isFar) {
      x = x > cw / 2 ? x + cw / 2 : x - cw / 2;
      y = y > ch / 2 ? y + ch / 2 : y - ch / 2;
    }
    balls.push({
      x: x, y: y, z: z, colors: colors, ball: ball,
      backupPos: {x: x, y: y, z: z},      // 备份初始坐标数据，用于 tween 缓动函数的计算
      transPos: {x: x, y: y, z: z}        // 存储经过图形变换矩阵变换之后的坐标
    });
  }
}

// 添加一个空白 ball
function addBall() {
  var b = new c.Shape();
  b.graphics.f('rgba(255,255,255,0)').dc(0, 0, 0);
  stage.addChild(b);
  return b;
}
// 更新 ball 的坐标、大小、颜色
function resetBall(ball, x, y, z, colors, scale) {
  ball.x = x;
  ball.y = y;
  ball._z = z;
  ball.graphics.clear()
    .f('rgba(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ', 1)')
    .dc(0, 0, gdata.r * scale);
}

function syncBackup() {
  for (var l = gdata.ballParas.length, para, backup; l; l--) {
    para = gdata.ballParas[l - 1];
    backup = para.backupPos;
    backup.x = para.x;
    backup.y = para.y;
    backup.z = para.z;
  }
}

// 通用 draw 方法
function generalDraw() {
  var centers = [
      cw / 2 + gdata.translate[0] + gdata.globalTrans[0],
      ch / 2 + gdata.translate[1] + gdata.globalTrans[1],
      gdata.shapeZ + gdata.translate[2] + gdata.globalTrans[2]
    ],
    matrix2Trans = $$tool.matrixMultipy(
      $$tool.rotate(gdata.rots[0], gdata.rots[1], gdata.rots[2]),
      $$tool.translate(centers[0] - cw / 2, centers[1] - ch / 2, centers[2])
    );
  for (var l = gdata.ballParas.length, pos, para, i = 0; i < l; i++) {
    para = gdata.ballParas[i];
    para.transPos = $$tool.getTransPos(para, centers, matrix2Trans);       // 经过图形变换矩阵变换之后的坐标
    pos = $$tool.get3dPos(para.transPos, focalLen, para.colors, centers);  // 施加 z 坐标对 x、y、colors 的影响
    resetBall(para.ball, pos.pos.x, pos.pos.y, para.transPos.z, pos.colors, pos.scale);
  }
  for (l = gdata.backgroundParas.length, i = 0; i < l; i++) {
    para = gdata.backgroundParas[i];
    para.transPos = $$tool.getTransPos(para, centers, matrix2Trans);
    pos = $$tool.get3dPos(para.transPos, focalLen, para.colors, centers);
    resetBall(para.ball, pos.pos.x, pos.pos.y, para.transPos.z, pos.colors, pos.scale);
  }
  stage.children.sort(function (a, b) {
    return b._z - a._z;
  });
}

// 全局 update 方法
function globalUpdate(delta, timeScale, currentFrame) {
  var vScale = delta / TICK_ITV_TIME;       // 将增量跟时间关联，保证任意 FPS 下速率不变

  gdata.rots[0] += gdata.rotsV[0] * vScale;
  gdata.rots[1] += gdata.rotsV[1] * vScale;
  gdata.rots[2] += gdata.rotsV[2] * vScale;
  gdata.rots[0] = Math.max(Math.min(gdata.rots[0], gdata.maxRots[0]), gdata.minRots[0]);
  gdata.rots[1] = Math.max(Math.min(gdata.rots[1], gdata.maxRots[1]), gdata.minRots[1]);
  gdata.rots[2] = Math.max(Math.min(gdata.rots[2], gdata.maxRots[2]), gdata.minRots[2]);
}

// calm update
function calmUpdate(delta, timeScale, currentFrame) {
  var totalFrame = ~~((loop.waitTime || 5000) / TICK_ITV_TIME);
  if (currentFrame - totalFrame > 0) {
    !!loop.nextEvent && fsm[loop.nextEvent]();
  }
}

// onexplosion update
function explosionUpdate(delta, timeScale, currentFrame) {
  var totalFrame = ~~(1000 / TICK_ITV_TIME),
    remain = currentFrame - totalFrame;
  if (remain > 0 && remain < 10) {
    currentFrame = totalFrame;
  } else if (remain >= 10) {
    syncBackup();
    fsm.calm(1000);
    return;
  }
  var l = gdata.ballParas.length, para, backupPos, spara, i = 0;
  for (; i < l; i++) {
    para = gdata.ballParas[i];
    backupPos = para.backupPos;
    spara = gdata.shapePos[i];
    if (!spara) break;
    para.x = Tween.Cubic.easeInOut(currentFrame, backupPos.x, spara.x - backupPos.x, totalFrame);
    para.y = Tween.Cubic.easeInOut(currentFrame, backupPos.y, spara.y - backupPos.y, totalFrame);
    para.z = Tween.Cubic.easeInOut(currentFrame, backupPos.z, spara.z + gdata.globalTrans[2] - backupPos.z, totalFrame);
  }
}

// oninit、onrebuild update
function rebuildUpdate(delta, timeScale, currentFrame) {
  var totalFrame = ~~(2000 / TICK_ITV_TIME),
    remain = currentFrame - totalFrame;
  if (remain > 0 && remain < 10) { // 预留 10 帧，用来避免对齐问题
    currentFrame = totalFrame;
  } else if (remain >= 10) {
    showTutorial();
    syncBackup();
    fsm.calm(5000); // 进入 stable 状态
    return;
  }
  var l = gdata.ballParas.length, para, backupPos, spara, i = 0;
  for (; i < l; i++) {
    para = gdata.ballParas[i];
    backupPos = para.backupPos;
    spara = gdata.shapePos[i];
    if (!spara) break;
    para.x = Tween.Cubic.easeInOut(currentFrame, backupPos.x, spara.x - backupPos.x, totalFrame);
    para.y = Tween.Cubic.easeInOut(currentFrame, backupPos.y, spara.y - backupPos.y, totalFrame);
    para.z = Tween.Cubic.easeInOut(currentFrame, backupPos.z, gdata.globalTrans[2] - backupPos.z, totalFrame);
  }
}

// 展示「指引」
function showTutorial() {
  var $tt = document.querySelector(".m-tutorial");
  if (!$tt) return;
  $tt.setAttribute('class', 'm-tutorial z-show');
  setTimeout(function () {
    $tt.setAttribute('class', 'm-tutorial');
    setTimeout(function () {
      $tt.remove();
    }, 1000);
  }, 10000);
}

function initRot() {
  gdata.rotsV[0] = -.02;
  gdata.rotsV[1] = -.02;
}

//---------------------------------------------------------------------------

// 事件交互 Event Interaction

var $$body = document.querySelector("body"), mousedown = false, mousedownPos = [];
$$body.addEventListener('mousemove', function (evt) {
  var mx = evt.clientX - rect.left,
    my = evt.clientY - rect.top;
  if (!!mousedown) {
    gdata.translate[0] = mx - mousedownPos[0];
    gdata.translate[1] = my - mousedownPos[1];
    return;
  }
  gdata.rotsV[0] = (my - ch / 2) * .0001;
  gdata.rotsV[1] = (mx - cw / 2) * .0001;
});
$$body.addEventListener('mousedown', function (evt) {
  var mx = evt.clientX - rect.left,
    my = evt.clientY - rect.top;
  mousedownPos = [mx - gdata.translate[0], my - gdata.translate[1]];
  mousedown = true;
});
$$body.addEventListener('mouseup', function (evt) {
  mousedown = false;
});
$$body.addEventListener('keydown', function (evt) {
  switch (evt.keyCode) {
    case 87://w
      gdata.globalTrans[2] -= 5;//z--
      break;
    case 83://s
      gdata.globalTrans[2] += 5;//z++
      break;
    case 65://a
      gdata.globalTrans[0] -= 5;//x--
      break;
    case 68://d
      gdata.globalTrans[0] += 5;//x++
      break;
  }
});

//---------------------------------------------------------------------------

fsm.init();

//---------------------------------------------------------------------------
