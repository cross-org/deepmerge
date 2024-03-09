# @cross/deepmerge

[![JSR Version](https://jsr.io/badges/@cross/deepmerge)](https://jsr.io/@cross/deepmerge)
[![JSR Score](https://jsr.io/badges/@cross/deepmerge/score)](https://jsr.io/@cross/deepmerge/score)

## Overview

Cross-runtime deep object merging in JavaScript environments, including Deno, Bun, Node.js and Browser. It is designed to handle complex data structures, including arrays, Maps, Sets, and primitive values. It provides flexible customization options for handling array, Set, and Map merging strategies.

## Features

* **Cross-Runtime Compatibility:**
* **Deep Merging:** Recursively combines objects at all levels of nesting.
* **Array Merging Customization:** Choose among strategies:
    * `combine` (default): Concatenates arrays, preserves duplicates.
    * `unique`: Produces an array of unique elements.
    * `replace`: Overwrites the target array with the source array.
* **Set Merging Customization:** Select between strategies:
    * `combine` (default): Adds new set elements.
    * `replace`: Overwrites the target set with the source set.
* **Map Merging Customization:** Select between strategies:
    * `combine` (default): Adds new entries, replaces entries with the same key.
    * `replace`: Overwrites the target map with the source map.

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
```

For browser you can use esm.sh as CDN to retrieve the ESM module for now.

```javascript
import { deepMerge } from "https://esm.sh/jsr/@cross/deepmerge";
```

Here is an simple example [jsfiddle](https://jsfiddle.net/pinta365/54gnohdb/) to try it out live in your browser.

## Usage

Most basic usage of `deepMerge` is just to merge one or more objects:

```javascript
const object1 = { a: 1, b: { c: 2 } };
const object2 = { b: { d: 3 }, e: 4 };

const merged = deepMerge(object1, object2);
console.log(merged);
// Output: { a: 1, b: { c: 2, d: 3 }, e: 4 }
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

Below demonstrates a possible use case of default or standard configurations that can be customized or overridden by user-specified
configurations.

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

## API Reference

For detailed docs see the [JSR docs](https://jsr.io/@cross/deepmerge/doc)

### `deepMerge(...sources)`

### `deepMerge.withOptions(options, ...sources)`

#### `DeepMergeOptions`
* **`arrayMergeStrategy`**
     * **"combine"**: (default behavior) Appends arrays, preserving duplicates.
     * **"unique"**: Creates an array with only unique elements.
     * **"replace"**: Substitutes the target array entirely with the source array.

* **`setMergeStrategy`**
     * **"combine"**: (default behavior) Adds new members to the target Set.
     * **"replace"**: Overwrites the target Set with the source Set.

* **`mapMergeStrategy`**
     * **"combine"**: (default behavior) Merges with the source Map, replacing values for matching keys.
     * **"replace"**: Overwrites the target Map with the source Map.

## Issues

Issues or questions concerning the library can be raised at the
[github repository](https://github.com/cross-org/deepmerge/issues) page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
