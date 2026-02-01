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
