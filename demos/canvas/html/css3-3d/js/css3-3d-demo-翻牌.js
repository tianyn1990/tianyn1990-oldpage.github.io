window.onload = function () {
    var cards = document.querySelectorAll(".m-card-eye .card");
    cards = [].slice.apply(cards);

    var delayTmp = 0;

    function changeClassAll(addCls, delay) {
        //changeClass(cards[0], addCls);
        cards.forEach(function (card) {
            if (!!delay) {
                setTimeout(function () {
                    changeClass(card, addCls);
                }, delayTmp);
                delayTmp += delay;
            } else {
                changeClass(card, addCls);
            }
        });
    }

    function changeClass(card, addCls) {

        fastDom.read(function () {
            console.log('read1');
            var cls = card.getAttribute("class");
            cls = cls.replace(/(stay\-front|stay\-back|center\-back)/g, "").trim();

            fastDom.write(function () {
                console.log('write1');
                card.setAttribute("class", cls + ' ' + addCls);

                fastDom.read(function () {
                    console.log('read2');

                    fastDom.write(function () {
                        console.log('write2');
                    }, this);

                }, this);

            }, this);
        }, this);
    }

    var states = {
        "stay-back": function (delay) {
            changeClassAll("stay-back", delay);
        },
        "stay-front": function (delay) {
            changeClassAll("stay-front", delay);
        },
        "center-back": function (delay) {
            changeClassAll("center-back", delay);
        }
    };
    window.changeState = function (sta) {
        states[sta]();
    };

    window.begin = function () {
        cards.forEach(function (card) {
            card.addEventListener("transitionend", function () {
                var t = this;
                if (t.classList.contains("game-end")) {
                    t.classList.remove("game-end");
                    return;
                }
                if (t.classList.contains("stay-back")) {
                    setTimeout(function () {
                        t.classList.remove("stay-back");
                        t.classList.add("center-back");
                    }, 300);
                    return;
                }
                if (t.classList.contains("center-back")) {
                    setTimeout(function () {
                        t.classList.remove("center-back");
                        t.classList.add("stay-back");
                    }, 300);
                    t.classList.add("game-end");
                }
            });
        });
        states["stay-back"](30);
        //setTimeout(function () {
        //    states["center-back"](80);
        //}, 1000);
        //setTimeout(function () {
        //    states["stay-back"](80);
        //}, 2000);
    };

    //初始化
    setTimeout(function () {
        states["stay-front"]();
    }, 1000);

    //事件绑定
    cards.forEach(function (card) {
        card.onclick = function (e) {
            var cls = card.getAttribute("class");
            if (cls.indexOf("stay-back") > -1) {
                changeClass(card, "stay-front");
            } else if (cls.indexOf("stay-front") > -1) {
                changeClass(card, "stay-back");
            }
        };
    });
};

//a simplified fastDom.js
var fastDom = (function () {
    var that = {},
        reads = [],
        writes = [],
        rafFn = requestAnimationFrame,
        isActing = false;
    that.read = function (rcb, t) {
        reads.push({
            "callback": rcb,
            "this": t
        });
        toRaf();
    };
    that.write = function (wcb, t) {
        writes.push({
            "callback": wcb,
            "this": t
        });
        toRaf();
    };
    function toRaf() {
        if (isActing) {
            return;
        }
        isActing = true;
        rafFn(function () {
            var i, lread, lwrite, read, write;

            lread = reads.length;
            for (i = 0; i < lread; i++) {
                read = reads[i];
                read["callback"].apply(read["this"], []);
            }
            reads.splice(0, lread);

            lwrite = writes.length;
            for (i = 0; i < lwrite; i++) {
                write = writes[i];
                write["callback"].apply(write["this"], []);
            }
            writes.splice(0, lwrite);

            isActing = false;
            if (reads.length > 0 || writes.length > 0) {
                toRaf();
            }
        });
    }

    return that;
})();

function getBoundingClientRect(elem) {
    var rect = elem.getBoundingClientRect(),
        scroll_top = document.documentElement.scrollTop || document.body.scrollTop,
        scroll_left = document.documentElement.scrollLeft || document.body.scrollLeft;
    return {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width || rect.right - rect.left,
        height: rect.height || rect.bottom - rect.top,
        x: rect.left + scroll_left,
        y: rect.top + scroll_top
    };
}