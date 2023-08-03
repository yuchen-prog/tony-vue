import { v4 as uuidv4 } from 'uuid';

export let activeEffect;
// 设计一个bucket用于存effectFn
let bucket = new WeakMap();
const effectStack: any[] = [];

class ReactiveEffect {
    private _fn: any
    public deps: any
    public _uuid: string
    constructor(fn: any) {
        this._fn = fn;
        this.deps = [];
        this._uuid = uuidv4();
    }

    run() {
        this.cleanup();
        activeEffect = this;
        effectStack.push(this);
        this._fn()
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1]
    }

    cleanup() {
        this.deps.forEach((dep) => {
            dep.delete(this);
        })
        this.deps.length = 0;
    }
}


// 新添加一个deps属性，用来存所有与该副作用函数相关联的依赖集合
export function effect(fn) {
    const reactiveEffect = new ReactiveEffect(fn);
    reactiveEffect.run();
}

export function track(target, key) {
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
    // 反向收集
    activeEffect.deps.push(deps);
}

export function trigger(target, key) {
    const depsMap = bucket.get(target);
    if (!depsMap) return true;
    const deps = depsMap.get(key);

    const effectsToRun = new Set()
    deps && deps.forEach((effect) => {
        if (!activeEffect || effect._uuid !== activeEffect._uuid) {
            effectsToRun.add(effect)
        }   
    })
    effectsToRun.forEach((fn: any) => fn.run());
}