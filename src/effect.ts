export let activeEffect;
const effectStack: any[] = [];

// 新添加一个deps属性，用来存所有与该副作用函数相关联的依赖集合
export function effect(fn) {
    const effectFn = () => {
        // 执行之前先清一下依赖
        cleanup(effectFn);
        activeEffect = effectFn;
        effectStack.push(effectFn);
        fn();
        // fn执行结束时，完成依赖收集
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.deps = [];
    effectFn()
}

export function cleanup(effectFn) {
    effectFn.deps.forEach((dep) => {
        dep.delete(effectFn);
    })
    effectFn.deps.length = 0;
}