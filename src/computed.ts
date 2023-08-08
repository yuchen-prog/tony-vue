import { effect } from "./effect";

export function computed(getter) {
     const effectFn = effect(getter, {
        lazy: true
     })

     const res = {
        get value() {
            return effectFn();
        }
     }

     return res;
}