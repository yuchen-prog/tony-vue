import { activeEffect } from "./effect";

// 设计一个bucket用于存effectFn
let bucket = new Set();

export function reactive(obj) {
    return new Proxy(obj, {
        get(target, key) {
            bucket.add(activeEffect)
            return target[key]
        },
        set(target, key, value) {
            target[key] = value;
            bucket.forEach((fn: any) => fn());
            return true
        }
    })
}