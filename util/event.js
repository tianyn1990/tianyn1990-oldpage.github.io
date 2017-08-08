/**
 * 自定义事件
 *
 * 举例：
 *
 * ```javascript
 * import {event} from '~/helpers';
 *
 * //可传一个命名空间，不传会自动生成一个唯一的
 * let e = event();
 * let e2 = event();
 * let e3 = event('haha');
 * let e4 = event('haha');
 *
 * e !== e2; // true
 * e3 === e4; // true
 *
 * let f = msg => console.log(`f:${msg}`);
 * let f2 = (msg, msg2) => console.log(`f2:${msg},${msg2}`);
 *
 * //添加事件
 * e.on('log', f);
 *
 * //判断存在
 * e.has('log'); // true
 * e.has('log', f); // true
 * e.has('log', f2); // false
 *
 * e.on('log', f2);
 * e.has('log', f2); // true
 *
 * //触发事件
 * e.emit('log', 1, 2); // f:1  f2:1,2
 *
 * //删除f
 * e.off('log', f);
 * e.emit('log', 1, 2); // f2:1,2
 *
 * //删除全部
 * e.off('log');
 * e.emit('log', 1, 2); // undefined
 *
 * //判断存在2
 * e.has('log'); // false
 * ```
 */

let events = {};
let getName = (() => {
    let id = 0;
    return () => {
        let nspace = `__event__${id++}`;
        return events[nspace] ? getName() : nspace;
    };
})();
let setEvents = (e) => {
    if(!e || !e.on || !e.emit) {
        // 添加事件
        e.on = (ename, f) => {
            if(!e.has(ename, f)) {
                (e[ename] = e[ename] || []).push(f);
            }
        };
        // 删除事件
        // e.off(); //删除所有事件
        // e.off('ename'); //删除ename事件所有绑定的函数
        // e.off('ename', fn); //删除ename事件的绑定函数fn
        e.off = (ename, f) => {
            if(!ename) {
                e = {};
                return;
            }
            if(e.has(ename, f)) {
                e[ename] = f ? (e[ename] || []).filter(_f => _f !== f) : [];
            }
        };
        // 触发事件ename
        e.emit = (ename, ...args) => (e[ename] || []).forEach(_f => _f && _f(...args));
        // 事件ename有绑定的函数：e.has('ename');
        // 事件ename有绑定函数fn：e.has('ename', fn);
        e.has = (ename, f) => {
            let fns = e[ename];
            return (!!fns && !f && !!fns.length)
                || (!!fns && !!f && fns.some(_f => _f === f));
        };
    }
    return e;
};
export default (name) => {
    name = name || getName();
    events[name] = events[name] || {};
    return setEvents(events[name]);
};
