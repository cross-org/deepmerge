import { assertEquals } from "@std/assert";
import { test } from "@cross/test";
import { simpleMerge } from "../mod.ts";

test("Basic simpleMerge scenario", () => {
    interface MergeableObj {
        a?: number;
        b?: {
            c?: number;
            d?: number;
            e?: number;
        };
    }

    const object1: MergeableObj = {
        a: 1,
        b: {
            c: 2,
            d: 1,
            e: 3,
        },
    };
    const object2: MergeableObj = {
        b: {
            d: 3,
        },
    };

    const merged = simpleMerge(object1, object2);
    assertEquals(merged.a, 1);
    assertEquals(typeof merged.b, "object");
    assertEquals(merged.b!.c, 2);
    assertEquals(merged.b!.d, 3);
    assertEquals(merged.b!.e, 3);
});

test("Basic simpleMerge scenario with undefined", () => {

    const obj1 = {
        arr: [1, 2, 3]
    };

    const obj2 = {
        arr: [3, 4, 5]
    };

    const merged = simpleMerge(obj1, undefined, obj2);
    const mergedObj = merged!;

    assertEquals(Array.from(mergedObj.arr), [3, 4, 5]);
});
