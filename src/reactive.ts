import { track, trigger } from "./effect";

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
            track(target, key);
            return target[key]
        },
        set(target, key, value) {
            // 触发依赖
            target[key] = value;
            trigger(target, key);
            return true
        }
    })
}