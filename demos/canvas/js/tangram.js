/**
 * 七巧板
 * @param spec id,x,y,width,strokeStyle,lineWidth,colors
 */
var drawTangram = function (spec) {
    var id = spec.id,
        w = spec.width || 100,
        strokeStyle = spec.strokeStyle || "#333",
        lineWidth = spec.lineWidth || 0,
        x = spec.x + lineWidth || lineWidth,
        y = spec.y + lineWidth || lineWidth,
        colors = spec.colors || ["red", "#fdaf17", "#c3d946", "#00bdd0", "#5dbe79", "#ffdd01", "#0177bf"],
        cavW, cavH,
        i, il, j, jl;
    var pan = [
        {
            path: [
                {x: 0, y: 0},
                {x: w, y: 0},
                {x: w / 2, y: w / 2},
                {x: 0, y: 0}
            ],
            color: colors[0]
        },
        {
            path: [
                {x: 0, y: 0},
                {x: w / 2, y: w / 2},
                {x: 0, y: w},
                {x: 0, y: 0}
            ],
            color: colors[1]
        },
        {
            path: [
                {x: w / 2, y: w / 2},
                {x: 3 / 4 * w, y: 3 / 4 * w},
                {x: w / 2, y: w},
                {x: w / 4, y: 3 / 4 * w},
                {x: w / 2, y: w / 2}
            ],
            color: colors[2]
        },
        {
            path: [
                {x: w / 2, y: w / 2},
                {x: 3 / 4 * w, y: w / 4},
                {x: 3 / 4 * w, y: 3 / 4 * w},
                {x: w / 2, y: w / 2}
            ],
            color: colors[3]
        },
        {
            path: [
                {x: w / 4, y: 3 / 4 * w},
                {x: w / 2, y: w},
                {x: 0, y: w},
                {x: w / 4, y: 3 / 4 * w}
            ],
            color: colors[4]
        },
        {
            path: [
                {x: w, y: 0},
                {x: w, y: w / 2},
                {x: 3 / 4 * w, y: 3 / 4 * w},
                {x: 3 / 4 * w, y: w / 4},
                {x: w, y: 0}
            ],
            color: colors[5]
        },
        {
            path: [
                {x: w, y: w / 2},
                {x: w, y: w},
                {x: w / 2, y: w},
                {x: w, y: w / 2}
            ],
            color: colors[6]
        }
    ], path;
    for (i = 0, il = pan.length; i < il; i++) {
        path = pan[i].path;
        for (j = 0, jl = path.length; j < jl; j++) {
            path[j].x += x;
            path[j].y += y;
        }
    }
    var canvas = document.getElementById(id),
        ctt = canvas.getContext("2d");
    if (ctt) {
        /**读取&设置宽高*/
        cavW = canvas.width;
        cavH = canvas.height;
        canvas.width = cavW > (w + x * 2) ? cavW : (w + x * 2);
        canvas.height = cavH > (w + y * 2) ? cavH : (w + y * 2);

        /**绘制七巧板*/
        for (i = 0, il = pan.length; i < il; i++) {
            draw(pan[i], ctt);
        }

        /**绘制其中的一块*/
        function draw(piece, ctt) {
            var ps = piece.path,
                p0 = ps[0],
                i, l;

            //状态设置
            ctt.beginPath();
            ctt.moveTo(p0.x, p0.y);
            for (i = 1, l = ps.length; i < l; i++) {
                ctt.lineTo(ps[i].x, ps[i].y);
            }
            ctt.closePath();

            //根据之前的状态绘制
            if (strokeStyle || lineWidth) {
                ctt.strokeStyle = strokeStyle || "#333";
                ctt.lineWidth = lineWidth || 1;
                ctt.stroke();
            }
            ctt.lineCap = "round";
            ctt.fillStyle = piece.color;
            ctt.fill();
        }

    } else {
        alert("explore not support canvas.");
    }
};