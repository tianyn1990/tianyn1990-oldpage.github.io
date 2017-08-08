var FreeDraw = {
    E: '',
    idprefix: 'FD' + (+new Date).toString(36),
    idgen: 0, // id generator
    ID: function (el) {
        return (el.tagName ? el.tagName : FreeDraw.E) + FreeDraw.idprefix + (FreeDraw.idgen++).toString(36);
    },
    is: function (o, type) {
        return Object.prototype.toString.call(o).slice(8, -1).toLowerCase()
            === String.prototype.toLowerCase.call(type);
    },
    ajax: function (url, postData, callback, scope) {
        var req = new XMLHttpRequest,
            eve, pd;
        if (req) {
            if (FreeDraw.is(postData, 'object')) {
                pd = [];
                for (var key in postData) if (postData.hasOwnProperty(key)) {
                    pd.push(encodeURIComponent(key) + '=' + encodeURIComponent(postData[key]));
                }
                postData = pd.join('&');
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                req.open('POST', url, true);
            } else {
                req.open('GET', url, true);
            }
            eve = [];
            eve['0'] = eve['200'] = eve['304'] = callback;
            req.onreadystatechange = function () {
                if (req.readyState != 4) return;
                eve[req.status] && eve[req.status].call(scope, req);
            };
            if (req.readyState == 4) {
                return req;
            }
            req.send(postData);
            return req;
        }
    },
    Fragment: (function () {
        function F(frag) {
            this.node = frag;
        }

        var fproto = F.prototype;
        fproto.append = function (f) {
            this.node.appendChild(f.node || f);
            return this;
        };
        fproto.select = function (selector) {
            return new F(this.node.querySelector(selector));
        };
        fproto.selectAll = function (selector) {
            var list = this.node.querySelectorAll(selector) || [];
            list = Array.prototype.slice.call(list, 0);
            return list.map(function (_node) {
                return new F(_node);
            });
        };
        fproto.getTotalLength = function () {
            return this.node.getTotalLength && this.node.getTotalLength();
        };
        fproto.attr = function (params, value) {
            var node = this.node;
            if (!params) {
                if (node.nodeType !== 1) {
                    return {text: node.nodeValue};
                }
                var out = {};
                (node.attributes || []).forEach(function (_attr) {
                    out[_attr.nodeName] = _attr.nodeValue;
                });
                return out;
            }
            if (FreeDraw.is(params, 'string')) {
                if (arguments.length === 1) {
                    return node.getAttribute(params);
                }
                var _params = {};
                _params[params] = value;
                params = _params;
            }
            var val;
            for (var key in params) if (params.hasOwnProperty(key)) {
                val = String(params[key]);
                if (val) {
                    if (key.substring(0, 6) == "xlink:") {
                        node.setAttributeNS(FreeDraw.xlink, key.substring(6), val);
                    } else if (key.substring(0, 4) == "xml:") {
                        node.setAttributeNS(FreeDraw.xmlns, key.substring(4), val);
                    } else {
                        node.setAttribute(key, val);
                    }
                } else {
                    node.removeAttribute(key, val);
                }
            }
            return this;
        };
        return F;
    })(),
    xlink: "http://www.w3.org/1999/xlink",
    xmlns: "http://www.w3.org/2000/svg",
    parse: function (svg) {
        //createDocumentFragment 对比 createElement 1.innerHTML无效; 2.只能插入页面一次;
        var f = document.createDocumentFragment(),
            full = true,
            div = document.createElement('div');
        svg = String(svg);
        if (!svg.match(/^\s*<\s*svg(?:\s|>)/)) {
            full = false;
            svg = '<svg>' + svg + '</svg>';
        }
        div.innerHTML = svg;
        svg = div.getElementsByTagName('svg')[0];
        if (svg) {
            if (full) {
                f = svg;
            } else {
                while (svg.firstChild) {
                    f.appendChild(svg.firstChild);
                }
            }
        }
        div.innerHTML = FreeDraw.E;
        return new FreeDraw.Fragment(f);
    },
    load: function (url, postData, callback, scope) {
        FreeDraw.ajax(url, postData, function (req) {
            var s = FreeDraw.parse(req.responseText);
            scope ? callback.call(scope, s) : callback(s);
        });
    },
    clone: function (o) {
        if (typeof o === 'function' || Object(o) !== o) {
            return o;
        }
        var res = new o.constructor;
        for (var k in o) if (o.hasOwnProperty(k)) {
            res[k] = FreeDraw.clone(o[k]);
        }
        return res;
    },
    f: function (num, n) {
        return +(+num).toFixed(n);
    },
    f3: function (num) {
        return FreeDraw.f(num, 3);
    },
    // 缓存「纯函数」执行的结果
    cacher: function (f, scope, postprocesser) {
        function newf() {
            var arg = Array.prototype.slice.call(arguments, 0),
                args = arg.join('\u2400'),
                count = newf.count = newf.count || [],
                cache = newf.cache = newf.cache || {};
            if (cache.hasOwnProperty(args)) {
                count.some(function (_args, _id) {
                    if (_args === args) {
                        return count.push(count.splice(_id, 1)[0]);
                    }
                });
                return postprocesser ? postprocesser(cache[args]) : cache[args];
            }
            count.length > 1e3 && delete cache[count.shift()];
            count.push(args);
            cache[args] = f.apply(scope, arg);
            return postprocesser ? postprocesser(cache[args]) : cache[args];
        }

        return newf;
    },
    createSVG: function (attr, parentNode) {
        attr.width = attr.width || attr.w;
        attr.height = attr.height || attr.h;
        if (!attr.width || !attr.height) {
            throw '.createSVG#attr need width and height params';
        }
        var el = document.createElementNS(FreeDraw.xmlns, 'svg');
        parentNode = document.querySelector(parentNode || 'body');
        parentNode.appendChild(el);
        var fel = new FreeDraw.Fragment(el);
        attr.version = 1.1;
        attr.xmlns = FreeDraw.xmlns;
        fel.attr(attr);
        return fel;
    }
};

FreeDraw.load('../images/xmark.svg', null, function (f) {
    var svg = FreeDraw.createSVG({w: 190, h: 205}, '#svgwrap'),
        g = f.select('g'),
        ps = f.selectAll('path') || [];
    if (!g || !ps.length) {
        throw '<g> or <path> is not found';
    }
    svg.append(g);

    ps.forEach(function (p) {
        var l = p.getTotalLength();
        p.attr({
            'stroke-dasharray': l,
            'stroke-dashoffset': l
        });
    });
});