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