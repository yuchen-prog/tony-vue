export let activeEffect;

// 新添加一个deps属性，用来存所有与该副作用函数相关联的依赖集合
export function effect(fn) {
    const effectFn = () => {
        // 执行之前先清一下依赖
        cleanup(effectFn);
        activeEffect = effectFn;
        fn()
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