import { effect } from "./effect";

export function computed(getter) {
    let dirty = true;
    let cacheVal;
    const effectFn = effect(getter, {
        lazy: true,
        scheduler() {
            dirty = true
        }
    })

    const res = {
        get value() {
            if (dirty) {
                cacheVal = effectFn();
                dirty = false;
            }
            return cacheVal
        }
    }

    return res;
}