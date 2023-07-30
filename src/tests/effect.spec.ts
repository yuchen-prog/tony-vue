import { effect } from "../effect";
import { reactive } from "../reactive";

// 响应式数据基本实现
/**
 * const obj = { text: 'hello' }
 * 
 * function effect() {
 *   document.body.innerText = obj.text
 * }
 * 
 * 1. effect会触发obj.text的读取操作，把effect存起来
 * 2. 设置obj.text的时候，将effect拿出来执行
 */

describe('effect', () => {
    it('init', () => {
        const user = reactive({ age: 10 });
        let newAge;
        effect(() => newAge = user.age + 1);
        expect(newAge).toBe(11);

        // update
        user.age++;
        expect(newAge).toBe(12);
    })

})