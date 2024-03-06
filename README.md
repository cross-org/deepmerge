# @cross/deepmerge

## Overview

The deepMerge library offers a versatile and cross-runtime function for performing deep merges of objects in JavaScript
environments, including Deno, Bun, and Node.js. It is designed to handle complex data structures, including arrays,
Maps, Sets, and primitive values, with customizable behavior for array merging.

## Features

- **Deep Merging:** Recursively merges objects, including handling of Maps, Sets, and arrays, ensuring a deep
  integration of source objects into a target object.
- **Customizable Array Merging Strategies:** Offers three strategies for array merging:
  - `concatenate` (default): Combines arrays by appending elements from the source array to the target array.
  - `unique`: Merges arrays by creating a new array with only unique elements from both the source and target arrays.
  - `replace`: Replaces the target array entirely with the source array.
- **Cross-Platform Compatibility:** Works consistently across Deno, Bun, and Node.js environments, making it a flexible
  choice for various JavaScript projects.

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

## Usage

Most basic usage of `deepMerge` is just to merge one or more objects into the first one:

```javascript
const object1 = { a: 1, b: { c: 2 } };
const object2 = { b: { d: 3 }, e: 4 };

deepMerge(object1, object2);
console.log(object1);
// Output: { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

Below is an more advanced example that showcases the usage of the `deepMerge` library with more complex objects,
including Maps and Sets, along with a unique array merging strategy.

```javascript
import { deepMerge, DeepMergeOptions } from "@cross/deepmerge";

// Define the merging options
const options: DeepMergeOptions = { arrayMergeStrategy: "unique" };

// Create complex objects including arrays, Maps, and Sets
const one = {
  arrayProp: [1, 2, 3],
  mapProp: new Map([['key1', 'value1'], ['key2', 'value2']]),
  setProp: new Set([1, 2, 3]),
  nested: {
    nestedArray: [1, 2, 3],
    nestedMap: new Map([['nestedKey1', 10], ['nestedKey2', 20]]),
    nestedSet: new Set(['a', 'b', 'c'])
  }
};

const two = {
  arrayProp: [2, 3, 4, 5],
  mapProp: new Map([['key2', 'updatedValue2'], ['key3', 'value3']]),
  setProp: new Set([2, 3, 4]),
  nested: {
    nestedArray: [3, 4, 5],
    nestedMap: new Map([['nestedKey2', 25], ['nestedKey3', 30]]),
    nestedSet: new Set(['b', 'c', 'd'])
  },
  oneExtraProp: "Hello"
};

// Perform the deep merge with custom options
const mergedObject = deepMerge.withOptions(options, one, two);

// Print the merged object
console.log(mergedObject);

// Expected output will show unique array merging, combined Maps and Sets, and deep merged nested objects.
// For example:
// {
//   arrayProp: [1, 2, 3, 4, 5],
//   mapProp: Map { 'key1' => 'value1', 'key2' => 'updatedValue2', 'key3' => 'value3' },
//   setProp: Set { 1, 2, 3, 4 },
//   nested: {
//     nestedArray: [1, 2, 3, 4, 5],
//     nestedMap: Map { 'nestedKey1' => 10, 'nestedKey2' => 25, 'nestedKey3' => 30 },
//     nestedSet: Set { 'a', 'b', 'c', 'd' }
//   },
//   oneExtraProp: "Hello"
// }
```

Below demonstrates a set of default or standard configurations that can be customized or overridden by user-specified
configurations.

```javascript
import { deepMerge } from "./mod.ts";

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
//   plugins: ["plugin3"], // Replaced by userConfig
//   advanced: {
//     cache: true, // Inherits from defaultConfig
//     cacheSize: 2048, // Overridden by userConfig
//   }
// }
```

### Customizing array merge strategy

To customize the array merging strategy, use the `withOptions` method:

```javascript
const options = { arrayMergeStrategy: "unique" };
const one = { arrayProp: [1, 2, 3] };
const two = { arrayProp: [2, 3, 4, 5] };

const mergedObject = deepMerge.withOptions(options, one, two);
console.log(mergedObject);
// Output: { arrayProp: [1, 2, 3, 4, 5] } // with 'unique' strategy

// Example with other strategies
// Output: { arrayProp: [1, 2, 3, 2, 3, 4, 5] } // with 'concatenate' strategy
// Output: { arrayProp: [2, 3, 4, 5] } // with 'replace' strategy
```

## API Reference

For detailed docs see the [JSR docs](https://jsr.io/@cross/deepmerge/doc)

### `deepMerge(target, ...sources)`

### `deepMerge.withOptions(options, target, ...sources)`

#### `DeepMergeOptions`

An interface to control the behavior of the deep merge process, especially regarding how arrays are handled during the
merge. The following properties can be configured:

- `arrayMergeStrategy`: Specifies the strategy used to merge arrays. Possible values include:
  - `concatenate` (default): Combines arrays by appending the elements of the source array to those of the target array.
  - `unique`: Merges arrays by creating a new array containing only unique elements from both the target and the source
    arrays, eliminating duplicates.
  - `replace`: Replaces the target array entirely with the source array, disregarding any existing elements in the
    target.

## Known issues
No support for breaking on circular references.

## Issues

Issues or questions concerning the library can be raised at the
[github repository](https://github.com/cross-org/deepmerge/issues) page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
