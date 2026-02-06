import { assertEquals } from "@std/assert";
import { test } from "@cross/test";
import { deepMerge, type DeepMergeOptions } from "./deepmerge.ts";

test("Basic deepMerge scenario", () => {
    const options: DeepMergeOptions = {
        arrayMergeStrategy: "unique",
        setMergeStrategy: "combine",
        mapMergeStrategy: "combine",
    };

    const obj1 = {
        arr: [1, 2, 3],
        mySet: new Set(["a", "b"]),
        myMap: new Map([["x", 1], ["y", 2]]),
    };

    const obj2 = {
        arr: [3, 4, 5],
        mySet: new Set(["c"]),
        myMap: new Map([["y", 3]]),
    };

    const merged = deepMerge.withOptions(options, obj1, obj2);

    assertEquals(Array.from(merged.arr), [1, 2, 3, 4, 5]);
    assertEquals(Array.from(merged.mySet), ["a", "b", "c"]);
    assertEquals(Array.from(merged.myMap), [["x", 1], ["y", 3]]);
});

test("Array Combine", () => {
    const obj1 = { arr: [1, 2, 3] };
    const obj2 = { arr: [3, 4, 5] };
    const merged = deepMerge.withOptions({ arrayMergeStrategy: "combine" }, obj1, obj2);

    assertEquals(Array.from(merged.arr), [1, 2, 3, 3, 4, 5]);
});

test("Array Unique", () => {
    const obj1 = { arr: [1, 2, 3] };
    const obj2 = { arr: [3, 4, 5] };
    const merged = deepMerge.withOptions({ arrayMergeStrategy: "unique" }, obj1, obj2);

    assertEquals(Array.from(merged.arr), [1, 2, 3, 4, 5]);
});

test("Array Replace", () => {
    const obj1 = { arr: [1, 2, 3] };
    const obj2 = { arr: [3, 4, 5] };
    const merged = deepMerge.withOptions({ arrayMergeStrategy: "replace" }, obj1, obj2);

    assertEquals(Array.from(merged.arr), [3, 4, 5]);
});

test("Set Combine", () => {
    const obj1 = { mySet: new Set(["a", "b"]) };
    const obj2 = { mySet: new Set(["c"]) };
    const merged = deepMerge.withOptions({ setMergeStrategy: "combine" }, obj1, obj2);

    assertEquals(Array.from(merged.mySet), ["a", "b", "c"]);
});

test("Set Replace", () => {
    const obj1 = { mySet: new Set(["a", "b"]) };
    const obj2 = { mySet: new Set(["c"]) };
    const merged = deepMerge.withOptions({ setMergeStrategy: "replace" }, obj1, obj2);

    assertEquals(Array.from(merged.mySet), ["c"]);
});

test("Map Combine", () => {
    const obj1 = { myMap: new Map([["x", 1], ["y", 2]]) };
    const obj2 = { myMap: new Map([["y", 3]]) };
    const merged = deepMerge.withOptions({ mapMergeStrategy: "combine" }, obj1, obj2);

    assertEquals(Array.from(merged.myMap), [["x", 1], ["y", 3]]);
});

test("Map Replace", () => {
    const obj1 = { myMap: new Map([["x", 1], ["y", 2]]) };
    const obj2 = { myMap: new Map([["y", 3]]) };
    const merged = deepMerge.withOptions({ mapMergeStrategy: "replace" }, obj1, obj2);

    assertEquals(Array.from(merged.myMap), [["y", 3]]);
});

test("Basic deepMerge scenario with undefined", () => {
    const obj1 = {
        arr: [1, 2, 3],
    };

    const obj2 = {
        arr: [3, 4, 5],
    };

    const merged = deepMerge(obj1, undefined, obj2);
    const mergedObj = merged!;

    assertEquals(Array.from(mergedObj.arr), [1, 2, 3, 3, 4, 5]);
});

test("Date keepEarlier", () => {
    const earlier = new Date("2023-01-01");
    const later = new Date("2024-06-15");
    const obj1 = { date: earlier };
    const obj2 = { date: later };
    const merged = deepMerge.withOptions({ dateMergeStrategy: "keepEarlier" }, obj1, obj2);

    assertEquals(merged.date.getTime(), earlier.getTime());
});

test("Date keepLater", () => {
    const earlier = new Date("2023-01-01");
    const later = new Date("2024-06-15");
    const obj1 = { date: later };
    const obj2 = { date: earlier };
    const merged = deepMerge.withOptions({ dateMergeStrategy: "keepLater" }, obj1, obj2);

    assertEquals(merged.date.getTime(), later.getTime());
});

test("customMergeFunctions overrides Date and Array", () => {
    const options: DeepMergeOptions = {
        customMergeFunctions: {
            Date: (targetVal, sourceVal) => (targetVal > sourceVal ? targetVal : sourceVal),
            Array: (targetArr, sourceArr) => {
                const t = Array.isArray(targetArr) ? targetArr : [];
                const s = Array.isArray(sourceArr) ? sourceArr : [];
                return [...new Set([...t, ...s])];
            },
        },
    };
    const obj1 = {
        date: new Date("2023-06-01"),
        arr: [1, 2, 2, 3],
    };
    const obj2 = {
        date: new Date("2024-01-01"),
        arr: [2, 3, 4],
    };
    const merged = deepMerge.withOptions(options, obj1, obj2);

    assertEquals(merged.date.getTime(), new Date("2024-01-01").getTime());
    assertEquals(merged.arr, [1, 2, 3, 4]);
});

test("circular reference - object referencing itself", () => {
    const obj: Record<string, unknown> = { a: 1, b: { c: 2 } };
    obj.self = obj;

    const merged = deepMerge(obj);
    assertEquals(merged.a, 1);
    assertEquals((merged.b as Record<string, unknown>).c, 2);
    assertEquals(merged.self, merged);
});

test("circular reference - A references B references A", () => {
    const a: Record<string, unknown> = { id: "a", x: 1 };
    const b: Record<string, unknown> = { id: "b", y: 2 };
    a.ref = b;
    b.ref = a;

    const merged = deepMerge(a);
    assertEquals(merged.id, "a");
    assertEquals(merged.x, 1);
    assertEquals((merged.ref as Record<string, unknown>).id, "b");
    assertEquals((merged.ref as Record<string, unknown>).y, 2);
    assertEquals((merged.ref as Record<string, unknown>).ref, merged);
});
