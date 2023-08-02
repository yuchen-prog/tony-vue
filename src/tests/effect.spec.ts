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
  }),

    it('noEffect', () => {
      const user = reactive({ age: 10, len: 20 });
      // 记录一下effect内部的执行次数
      let i = 0;
      let newAge;
      effect(() => {
        newAge = user.age + 1;
        i++;
      });
      expect(newAge).toBe(11);
      expect(i).toBe(1);
      user.len = 30;
      expect(i).toBe(1);
    }),

    it('cleanup', () => {
      // data
      //  └── ok
      //      └── effectFn
      //  └── text
      //      └── effectFn
      const obj = reactive({ ok: true, text: 'hello' });
      let text = ''
      let i = 0;
      effect(() => {
        text = obj.ok ? obj.text : 'not'
        i++
      });
      expect(text).toBe('hello')
      // 触发一次trigger
      obj.ok = false;
      expect(i).toBe(2)
      expect(text).toBe('not')

      obj.text = 'hello world';
      // 此时应该不触发依赖
      expect(text).toBe('not');
      expect(i).toBe(2)

    })

})