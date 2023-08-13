import { effect, track, trigger } from "./effect";

export function computed(getter) {
    let dirty = true;
    let cacheVal;
    const effectFn = effect(getter, {
        lazy: true,
        scheduler() {
            dirty = true;
            // trigger
            trigger(res, 'value')
        }
    })

    const res = {
        get value() {
            if (dirty) {
                cacheVal = effectFn();
                dirty = false;
                track(res, 'value')
            }
            return cacheVal
        }
    }

    return res;
}


export function watch(obj, cb) {
    const isGetter = typeof obj !== 'object'
    let newVal;
    let oldVal;
    const effectFn = effect(isGetter ? obj : () => traverse(obj), {
        lazy: true,
        scheduler() {
            // 触发依赖时的调用
            newVal = effectFn()
            cb(newVal, oldVal);
            oldVal = newVal
        }
    });
    // 第一次获取初始值
    oldVal = effectFn();
}

function traverse(value, seen = new Set()) {
    // 递归调用每个属性
    if (typeof value !== 'object' || !value || seen.has(value)) {
        return
    }
    seen.add(value)
    for (const key in value) {
        traverse(value[key], seen)
    }
    return value;
}