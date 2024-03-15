# @cross/deepmerge

[![JSR Version](https://jsr.io/badges/@cross/deepmerge)](https://jsr.io/@cross/deepmerge)
[![JSR Score](https://jsr.io/badges/@cross/deepmerge/score)](https://jsr.io/@cross/deepmerge/score)

## Overview

Cross-runtime deep object merging in JavaScript environments, including Deno, Bun, Node.js and Browser. It is designed
to handle complex data structures, including arrays, Maps, Sets, and primitive values. It provides flexible
customization options for handling array, Set, and Map merging strategies.

Follow the library on [JSR.io](https://jsr.io/@cross/deepmerge)

## Features

- **Cross-Runtime Compatibility:**
- **Deep Merging:** Recursively combines objects at all levels of nesting.
- **Array Merging Customization:** Choose among strategies:
  - `combine` (default): Concatenates arrays, preserves duplicates.
  - `unique`: Produces an array of unique elements.
  - `replace`: Overwrites the target array with the source array.
- **Set Merging Customization:** Select between strategies:
  - `combine` (default): Adds new set elements.
  - `replace`: Overwrites the target set with the source set.
- **Map Merging Customization:** Select between strategies:
  - `combine` (default): Adds new entries, replaces entries with the same key.
  - `replace`: Overwrites the target map with the source map.
- **Date Merging Customization:** Select between strategies:
  - `replace` (default): Overwrites the target Date with the source Date.
  - `keepEarlier`: Keeps the earlier Date.
  - `keepLater`: Keeps the later Date.
- **Supply custom merging functions:** Allows specifying custom merge functions for handling specific types or
  structures during the merge process.

## Installation

```bash
#For Deno
deno add @cross/deepmerge

#For Bun
bunx jsr add @cross/deepmerge

#For Node.js
npx jsr add @cross/deepmerge
```

```javascript
import { deepMerge } from "@cross/deepmerge";
//or for simple object merging.
import { simpleMerge } from "@cross/deepmerge";
```

For browser you can use esm.sh as CDN to retrieve the ESM module for now.

```javascript
import { deepMerge } from "https://esm.sh/jsr/@cross/deepmerge";
//or for simple object merging.
import { simpleMerge } from "https://esm.sh/jsr/@cross/deepmerge";
```

Here is an simple example [jsfiddle](https://jsfiddle.net/pinta365/54gnohdb/) to try it out live in your browser.

## Usage

Most basic usage of `simpleMerge` and `deepMerge` is just to merge one or more objects:

```javascript
// Example interface of the object we are merging.
interface MergeableObj {
    a?: number;
    b?: {
        c?: number;
        d?: number;
    };
    e?: number;
}

const object1: MergeableObj = { a: 1, b: { c: 2 } };
const object2: MergeableObj = { b: { c:1, d: 3 }, e: 4 };

const merged = simpleMerge(object1, object2); //We don't need deepMerge for this simple object.
console.log(merged);
// Output: { a: 1, b: { c: 1, d: 3 }, e: 4 }
```

Below is an more advanced example that showcases the usage of the `deepMerge` library with more complex objects,
including Maps and Sets, along with a options strategies.

```javascript
import { deepMerge, DeepMergeOptions } from "@cross/deepmerge";

// Define the merging options
const options: DeepMergeOptions = {
    arrayMergeStrategy: "unique",
    setMergeStrategy: "combine",
    mapMergeStrategy: "combine"
};

const obj1 = {
    arr: [1, 2, 3],
    mySet: new Set(["a", "b"]),
    myMap: new Map([["x", 1], ["y", 2]])
};

const obj2 = {
    arr: [3, 4, 5],
    mySet: new Set(["c"]),
    myMap: new Map([["y", 3]])
};

const merged = deepMerge.withOptions(options, obj1, obj2);

console.log(merged);
// Output:
// {
//   arr: [1, 2, 3, 4, 5],
//   mySet: new Set(["a", "b", "c"]),
//   myMap: new Map([["x", 1], ["y", 3]]) 
// }
```

Below demonstrates a possible use case of default or standard configurations that can be customized or overridden by
user-specified configurations.

```javascript
import { deepMerge } from "@cross/deepmerge";

// Standard application configurations
const defaultConfig = {
    theme: "light",
    layout: {
        header: "visible",
        footer: "visible",
    },
    plugins: ["plugin1", "plugin2"],
    advanced: {
        cache: true,
        cacheSize: 1024,
    },
};

// User-specified configurations to override or extend the defaults
const userConfig = {
    theme: "dark", // Override theme
    plugins: ["plugin3"], // Override plugins array
    advanced: {
        cacheSize: 2048, // Override just the cacheSize in the advanced config
    },
};

// Merge the default configurations with user specified ones, inline option
// configuration to replace the arrays instead of concatenating.
const mergedConfig = deepMerge.withOptions({ arrayMergeStrategy: "replace" }, defaultConfig, userConfig);

console.log(mergedConfig);
// Expected output:
// {
//   theme: "dark",
//   layout: {
//     header: "visible",
//     footer: "visible",
//   },
//   plugins: ["plugin3"], // replaced by userConfig
//   advanced: {
//     cache: true, // Inherits from defaultConfig
//     cacheSize: 2048, // Overridden by userConfig
//   }
// }
```

This showcase the custom merging function to override the default merging functions.

```javascript
import { deepMerge, DeepMergeOptions } from "@cross/deepmerge";

// Define the merging options.
// Use latest date for Date types
// Store unique array values for Array keys
const options: DeepMergeOptions = {
    customMergeFunctions: {
        /* This will be used as date merger function instead of the default ones */
        Date: (targetVal, sourceVal) => {
            return targetVal > sourceVal ? targetVal : sourceVal;
        },
        /* This will be used as array merger function instead of the default ones */
        Array: (targetArr, sourceArr) => {
            if (!Array.isArray(targetArr)) {
                targetArr = [];
            }
            if (!Array.isArray(sourceArr)) {
                sourceArr = [];
            }
            return [...new Set([...targetArr, ...sourceArr])];
        }
    }
};

const obj1 = { a: 1, b: { c: 2 }, e: [1, 2, 3, 4], date: new Date("2023-12-20") };
const obj2 = { b: { c: 1, d: 3 }, e: [3, 4, 5], date: new Date("2024-01-15") };
const obj3 = { b: { c: 1, d: 3 }, e: [3, 4, 5], date: new Date("2023-01-02") };

const merged = deepMerge.withOptions(options, obj1, obj2, obj3);
console.log(merged);
// Output:
//{
//  a: 1,
//  b: { c: 1, d: 3 },
//  e: [ 1, 2, 3, 4, 5 ],
//  date: 2024-01-15T00:00:00.000Z
//}
```

## API Reference

For detailed docs see the [JSR docs](https://jsr.io/@cross/deepmerge/doc)

### `simpleMerge(...sources)`

Simple object deep merger that can be used for most objects situations where you need to merge objects without arrays,
sets and maps.

### `deepMerge(...sources)`

More complex object deep merger that handles arrays, sets and maps also.

### `deepMerge.withOptions(options, ...sources)`

Same as above but with options as seen below.

#### `DeepMergeOptions`

- **`arrayMergeStrategy`**
  - **"combine"**: (default behavior) Appends arrays, preserving duplicates.
  - **"unique"**: Creates an array with only unique elements.
  - **"replace"**: Substitutes the target array entirely with the source array.

- **`setMergeStrategy`**
  - **"combine"**: (default behavior) Adds new members to the target Set.
  - **"replace"**: Overwrites the target Set with the source Set.

- **`mapMergeStrategy`**
  - **"combine"**: (default behavior) Merges with the source Map, replacing values for matching keys.
  - **"replace"**: Overwrites the target Map with the source Map.

- **`dateMergeStrategy`**
  - **"replace"**: (default behavior) Overwrites the target Date with the source Date.
  - **"keepEarlier"**: Keeps the earlier Date
  - **"keepLater"**: Keeps the later Date

- **`customMergeFunctions`**
  - Allows specifying custom merge functions for handling specific types or structures during the merge process.
  - Each key in this object corresponds to the constructor name of the value to be merged.
  - The function assigned to each key is used to merge values of that type.
  - **Key**: The constructor name of the values to be merged (e.g., "Date").
  - **Value**: A function that takes two parameters (`targetVal`, `sourceVal`) and returns the merged result.

## Issues

Issues or questions concerning the library can be raised at the
[github repository](https://github.com/cross-org/deepmerge/issues) page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
