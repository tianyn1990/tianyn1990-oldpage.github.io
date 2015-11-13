/**
 * canvas倒计时
 * 注:目前支持最大99:59:59的倒计时
 * @param tx
 * @param ty
 * @param wAll
 * @param ctt
 * @returns {{}}
 */
var timeAnnouncement = function (tx, ty, wAll, ctt) {
    var that = {};

    var balls = [],
        wUnit,
        colors = ["#428bca", "#5cb85c", "#5bc0de", "#f0ad4e", "#d9534f"],
        vxs = [-8],
        vys = [-23];

    balls.w = 0;
    balls.marginLeft = 0;

    var countDown = function (duringTime) {
        var date1,
            date2,
            during = {
                hours: 0,
                minutes: 0,
                seconds: 0
            },
            diffTime = 0,
            num = 1,
            od = during,
            nd = during;
        date1 = new Date().getTime();
        parseDuring(during, duringTime);
        raf();
        function raf() {
            requestAnimationFrame(function () {
                date2 = new Date().getTime();
                diffTime = date2 - date1;
                if (diffTime >= 200) {
                    if (diffTime > 1500) {
                        num = parseInt(diffTime / 1000);
                    }
                    od = {
                        hours: during.hours,
                        minutes: during.minutes,
                        seconds: during.seconds
                    };
                    reduceSec(during, num);
                    nd = during;
                    date1 = date2;
                    num = 1;
                }
                renderTime(tx, ty, wAll,
                    twoDigit(during.hours) + ':' + twoDigit(during.minutes) + ':' + twoDigit(during.seconds)
                );
                updateTime();
                renderNextBalls();
                removeBalls();
                raf();
            });
        }

        function updateTime() {
            var h1, h2, m1, m2, s1, s2,
                x = tx + 10 - wUnit / 2 * (1 + 1 / 5) - 1, y = ty + 10 - wUnit / 2 * (1 + 1 / 5) - 1,
                numWidth = wUnit * (7 + 1),
                colonWidth = wUnit * (2 + 1);

            //新增小球
            if (od.hours != nd.hours) {
                h1 = parseInt(nd.hours / 10);
                h2 = parseInt(nd.hours % 10);
                if (parseInt(od.hours / 10) != h1) {
                    addBalls(x, y, h1);
                }
                if (parseInt(od.hours % 10) != h2) {
                    addBalls(x + numWidth, y, h2);
                }
            }
            if (od.minutes != nd.minutes) {
                m1 = parseInt(nd.minutes / 10);
                m2 = parseInt(nd.minutes % 10);
                if (parseInt(od.minutes / 10) != m1) {
                    addBalls(x + numWidth * 2 + colonWidth, y, m1);
                }
                if (parseInt(od.minutes % 10) != m2) {
                    addBalls(x + numWidth * 3 + colonWidth, y, m2);
                }
            }
            if (od.seconds != nd.seconds) {
                s1 = parseInt(nd.seconds / 10);
                s2 = parseInt(nd.seconds % 10);
                if (parseInt(od.seconds / 10) != s1) {
                    addBalls(x + numWidth * 4 + colonWidth * 2, y, s1);
                }
                if (parseInt(od.seconds % 10) != s2) {
                    addBalls(x + numWidth * 5 + colonWidth * 2, y, s2);
                }
            }
            od = nd;
        }
    };

    function addBalls(x, y, str) {
        var numArr = digit[str], lineArr, ball, row, col, r = wUnit / 2;
        for (row = 0; row < numArr.length; row++) {
            lineArr = numArr[row];
            for (col = 0; col < lineArr.length; col++) {
                if (lineArr[col] == 1) {
                    ball = {
                        //状态
                        x: x + (col * 2 * r + r),
                        y: y + (row * 2 * r + r),
                        r: r,
                        str: str + '',
                        color: colors[Math.floor(Math.random() * colors.length)],
                        //运动
                        vx: vxs[Math.floor(Math.random() * vxs.length)],
                        vy: vys[Math.floor(Math.random() * vys.length)],
                        g: 1.5 + Math.floor(Math.random() * 10) / 200,
                        drag: .4 + Math.floor(Math.random() * 10) / 100,
                        dragAdd: .01
                    };
                    balls.push(ball);
                }
            }
        }
    }

    function renderNextBalls() {
        var ball;
        for (var i = 0; i < balls.length; i++) {
            ball = balls[i];
            updateBall(ball);
            drawBall(ball);
        }
    }

    function drawBall(ball) {
        ctt.fillStyle = ball.color;
        ctt.beginPath();
        ctt.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
        ctt.closePath();
        ctt.fill();
    }

    function updateBall(ball) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vy += ball.g;
        if (ball.y >= ctt.canvas.height - wUnit) {
            ball.y = ctt.canvas.height - wUnit;
            ball.vy = -ball.vy * (1 - ball.drag);
            ball.drag += ball.dragAdd;
        }
    }

    function removeBalls() {
        var i, l, ball, keepIndex = 0;
        for (i = 0, l = balls.length; i < l; i++) {
            ball = balls[i];
            if (ball.x - wUnit / 2 < ctt.canvas.width && ball.x + wUnit / 2 > 0) {
                balls[keepIndex++] = balls[i];
            }
        }
        balls.splice(Math.min(500, keepIndex), balls.length - Math.min(500, keepIndex));
    }

    //endDate: new Date(2015,7-1,4,8,30,0)
    function parseDuring(d, endDate) {
        var nowTime = new Date().getTime(),
            endTime = endDate.getTime();
        reduceSec(d, -(endTime - nowTime) / 1000);
    }

    function reduceSec(d, num) {
        num = num || 1;
        var tSecs = d.hours * 60 * 60 + d.minutes * 60 + d.seconds,
            newTSecs = tSecs > num ? tSecs - num : 0,
            hours = parseInt(newTSecs / 60 / 60),
            minutes = parseInt((newTSecs -= hours * 60 * 60) / 60),
            seconds = parseInt(newTSecs - minutes * 60);
        d.hours = hours;
        d.minutes = minutes;
        d.seconds = seconds;
    }

    function twoDigit(num) {
        return num < 10 ? '0' + num : num + '';
    }

    function renderTime(x, y, wAll, timeStr) {
        ctt.clearRect(0, 0, ctt.canvas.width, ctt.canvas.height);
        drawBackground(wUnit, 10);
        timeStr += '';
        var colonNum = timeStr.split(/:/).length - 1, //冒号数量
            digitNum = timeStr.length - colonNum, //数字数量
            i, l, str, w;

        wUnit = wAll / (colonNum + digitNum * 7 / 2 + timeStr.length / 2) / 2; //冒号宽度1/2 或 数字宽度的1/7

        for (i = 0, l = timeStr.length; i < l; i++) {
            w = wUnit * 2;
            str = timeStr.charAt(i);
            if (str != ':') {
                w *= 7 / 2;
            }
            drawNum(x, y, str, w);
            x += w + wUnit;
        }
    }

    function drawBackground(wUnit, padding) {
        ctt.fillStyle = "#000";
        ctt.beginPath();
        //ctt.rect(tx - padding, ty - padding, wAll + padding * 2, 10 * wUnit + padding * 2);
        ctt.rect(0, 0, ctt.canvas.width, ctt.canvas.height);
        ctt.fill();
    }

    function drawNum(x, y, str, width, color) {
        color = color || "#fff";
        var i, row, col, numArr, lineArr, r;
        for (i = 0; i < digit.length; i++) {
            if (str == i + '') {
                numArr = digit[i];
                r = width / 7 / 2;
            } else if (str == ':') {
                numArr = digit[(i = 10)];
                r = width / 2 / 2;
            } else {
                continue;
            }
            for (row = 0; row < numArr.length; row++) {
                lineArr = numArr[row];
                for (col = 0; col < lineArr.length; col++) {
                    ctt.fillStyle = color || "#fff";
                    if (lineArr[col] == 1) {
                        ctt.beginPath();
                        ctt.arc(x + (col * 2 * r + r), y + (row * 2 * r + r), r * 4 / 5, 0, 2 * Math.PI);
                        ctt.fill();
                    }
                }
            }
        }
    }

    that.countDown = countDown;
    return that;
};
