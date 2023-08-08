import { reactive } from "../reactive"
import { computed } from "../computed"

describe('computed', () => {
    it('should return updated value', () => {
        const value = reactive({ foo: 1 })
        const cValue = computed(() => value.foo)
        expect(cValue.value).toBe(1)
        value.foo++;
        expect(cValue.value).toBe(2)
    }),

        it('sum', () => {
            const obj = reactive({ foo: 1, bar: 2 })
            const sumRes = computed(() => obj.foo + obj.bar)
            expect(sumRes.value).toBe(3);  // 3
        })

}) 