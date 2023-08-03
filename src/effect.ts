export let activeEffect;
const effectStack: any[] = [];

class ReactiveEffect{
    private _fn: any
    public deps: any
    constructor(fn: any) {
        this._fn = fn;
        this.deps = [];
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