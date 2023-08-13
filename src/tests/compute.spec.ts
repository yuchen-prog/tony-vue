import { reactive } from "../reactive"
import { computed, watch } from "../computed"
import { effect } from "../effect"

describe('computed', () => {
    // it('should return updated value', () => {
    //     const value = reactive({ foo: 1 })
    //     const cValue = computed(() => value.foo)
    //     expect(cValue.value).toBe(1)
    //     value.foo++;
    //     expect(cValue.value).toBe(2)
    // }),

    //     it('sum', () => {
    //         const obj = reactive({ foo: 1, bar: 2 })
    //         const sumRes = computed(() => obj.foo + obj.bar)
    //         expect(sumRes.value).toBe(3);  // 3
    //     }),

    //     it('nested computed', () => {
    //         const value = reactive({ foo: 1 })
    //         const cValue = computed(() => value.foo)
    //         let val = 0
    //         effect(() => {
    //             val = cValue.value
    //         })
    //         expect(val).toBe(1)
    //         value.foo++;
    //         expect(cValue.value).toBe(2)
    //         expect(val).toBe(2)
    //     }),

    //     it('should work when chained', () => {
    //         const value = reactive({ foo: 0 })
    //         const c1 = computed(() => value.foo)
    //         const c2 = computed(() => c1.value + 1)
    //         expect(c2.value).toBe(1)
    //         expect(c1.value).toBe(0)
    //         value.foo++
    //         expect(c2.value).toBe(2)
    //         expect(c1.value).toBe(1)
    //     }),

    //     it("watch main", () => {
    //         const obj = reactive({ foo: 0 });
    //         let i = 0;
    //         watch(obj, () => {
    //             i++;
    //         });
    //         obj.foo = 1;
    //         expect(i).toBe(1);
    //     }),

    //     it("watch getter", () => {
    //         const obj = reactive({ foo: 0 });
    //         let i = 0;
    //         watch(() => obj.foo, () => {
    //             i++;
    //         })
    //         obj.foo = 2;
    //         expect(i).toBe(1)
    //     }),

        it("watch newVal oldVal", () => {
            const obj = reactive({ foo: 0 });
            let newVal = 0;
            let oldVal = 0;
            watch(() => obj.foo, (newValue, oldValue) => {
                newVal = newValue;
                oldVal = oldValue;
            })
            obj.foo = 2;
            expect(newVal).toBe(2);
            expect(oldVal).toBe(0);
        })

}) 