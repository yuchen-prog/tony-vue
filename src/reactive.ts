import { activeEffect, effect } from "./effect";

// 设计一个bucket用于存effectFn
let bucket = new WeakMap();

/**
 * 
 target1
     └── text1
         └── effectFn1
 target2
     └── text2
         └── effectFn2
 * @param obj 
 * @returns 
 */

export function reactive(obj) {
    return new Proxy(obj, {
        get(target, key) {
            // 依赖收集
            if (!activeEffect) return target[key]
            let depsMap = bucket.get(target as any)
            if (!depsMap) {
                bucket.set(target as any, (depsMap = new Map()));
            }
            let deps = depsMap.get(key);
            if (!deps) {
                depsMap.set(key, (deps = new Set()));
            }
            deps.add(activeEffect)
            return target[key]
        },
        set(target, key, value) {
            // 触发依赖
            target[key] = value;
            const depsMap = bucket.get(target);
            if (!depsMap) return true;
            const deps = depsMap.get(key);
            deps && deps.forEach((fn: any) => fn());
            return true
        }
    })
}