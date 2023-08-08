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

    }),

    it("effect stack", () => {
      // 解决嵌套的effect
      let _out = 0
      let _in = 0
      let tmp1, tmp2
      const obj = reactive({ foo: true, bar: true });
      effect(() => {
        _out++;
        effect(() => {
          _in++;
          tmp1 = obj.bar
        });
        tmp2 = obj.foo
      })

      expect(_out).toBe(1);
      expect(_in).toBe(1);

      // 希望当修改 obj.foo 时会触发 effectFn1 执行。由于effectFn2 嵌套在 effectFn1 里，所以会间接触发 effectFn2 执行
      obj.foo = false;
      expect(_out).toBe(2);
      expect(_in).toBe(2);
    }),

    it("endless circle", () => {
      const obj = reactive({ foo: 1 })
      effect(() => obj.foo++)
    })

  it('return runner', () => {
    let newAge = 10
    const fn = effect(() => {
      newAge++
      return 'hello'
    })
    const f = fn();
    expect(newAge).toBe(12);
    expect(f).toBe('hello');
  })

  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // // should not run yet
    expect(dummy).toBe(1)
    // // manually run
    run()
    // // should have run
    expect(dummy).toBe(2)
  })

  it('micro queue', () => {
    const obj = reactive({ foo: 1 })
    let i = 0;
    const jobQueue = new Set();
    let isFlushing = false;
    const p = Promise.resolve();

    function flushJob() {
      if (isFlushing) return;
      isFlushing = true;
      p.then(() => {
        jobQueue.forEach((job) =>
          job.run()
        )
      }).finally(() => {
        isFlushing = false;
      })
    }


    effect(() => {
      console.log(obj.foo)
      i++
    }, {
      scheduler(fn) {
        jobQueue.add(fn);
        flushJob();
      }
    })
    obj.foo++;
    obj.foo++;
    obj.foo++;
    // 在下一个宏任务下判断
    setTimeout(() => {
      expect(i).toBe(2)
    }, 0);

  })

  it('lazy', () => {
    const obj = reactive({ foo: 1 })
    let dummy
    const runner = effect(() => (dummy = obj.foo), { lazy: true })
    expect(dummy).toBe(undefined)

    expect(runner()).toBe(1)
    expect(dummy).toBe(1)
    obj.foo = 2
    expect(dummy).toBe(2)
  })
})