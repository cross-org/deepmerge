/**
 * @fileoverview This module provides a versatile deep object merging function (deepMerge)
 *               that works consistently across Deno, Bun, and Node.js. It offers
 *               customizable array merging strategies.
 */

/**
 * Optional options interface to control the deep merge process.
 *
 ** **`arrayMergeStrategy`**
 *     * **"combine"**: (default behavior) Appends arrays, preserving duplicates.
 *     * **"unique"**: Creates an array with only unique elements.
 *     * **"replace"**: Substitutes the target array entirely with the source array.
 *
 ** **`setMergeStrategy`**
 *     * **"combine"**: (default behavior) Adds new members to the target Set.
 *     * **"replace"**: Overwrites the target Set with the source Set.
 *
 ** **`mapMergeStrategy`**
 *     * **"combine"**: (default behavior) Merges with the source Map, replacing values for matching keys.
 *     * **"replace"**: Overwrites the target Map with the source Map.
 */
interface DeepMergeOptions {
    arrayMergeStrategy?: "combine" | "unique" | "replace";
    setMergeStrategy?: "combine" | "replace";
    mapMergeStrategy?: "combine" | "replace";
}

/**
 * Represents basic primitive JavaScript data types.
 */
type Primitive = string | number | boolean | bigint | symbol | undefined | null;

/**
 * Represents a Map-like structure where keys can be strings, numbers, or symbols,
 * and values must be of a type that can be merged.
 */
type MergeableMap = Map<string | number | symbol, MergeableValue>;

/**
 * Represents a Set-like structure containing only mergeable values.
 */
type MergeableSet = Set<MergeableValue>;

/**
 * Represents an array-like structure containing only mergeable values.
 */
type MergeableArray = Array<MergeableValue>;

/**
 * Represents the types of values that can be included within objects,
 * Maps, Sets and arrays for the purpose of deep merging.
 */
type MergeableValue =
    | MergeableObject
    | MergeableMap
    | MergeableSet
    | MergeableArray
    | Primitive;

/**
 * Represents an object with string, number or symbol keys, where the
 * values can be any mergeable type (including nested objects, Maps,
 * Sets, arrays, or primitives).
 */
interface MergeableObject {
    [key: string | number | symbol]: MergeableValue;
}

/**
 * @param {*} item - An item to evaluate.
 * @returns {boolean} True if the item is a plain object, false otherwise.
 */
function isObject(item: unknown): item is MergeableObject {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return false;
    }

    if (item instanceof Map || item instanceof Set) {
        return false;
    }

    return true;
}

/**
 * Performs a deep merge of objects, handling arrays, Maps, Sets, and primitives.
 * Supports multiple source objects.
 *
 * @template T
 * @param {T} target - The base object to merge into.
 * @param {...T} sources - One or more source objects to merge.
 * @returns {T} The merged result.
 */
function deepMerge<T>(...sources: T[]): T {
  const result = {} as T;
  const visited = new WeakMap<object, MergeableValue>(); 
  return deepMergeCore(result, {}, visited, ...sources);
}

/**
 * Creates a variation of the deepMerge function that applies provided options.
 *
 * @template T
 * @param {DeepMergeOptions} options - Options to control the merge behavior.
 * @param {...T} sources - Source objects.
 * @returns {T} The merged result.
 */
deepMerge.withOptions = function <T>(options: DeepMergeOptions, ...sources: T[]): T {
    const result = {} as T;
    const visited = new WeakMap<object, MergeableValue>(); 
    return deepMergeCore(result, options, visited, ...sources);
};

/**
 * Core recursive function for deep merging objects. This function handles the logic
 * of merging nested objects, arrays, Maps, Sets, and primitives, while taking
 * into account the provided merge options.
 *
 * @template T
 * @param {DeepMergeOptions} options - Controls merge behavior, particularly for arrays.
 * @param {...T} sources - One or more source objects to merge (processed recursively).
 * @returns {T} The deeply merged result.
 */
  function deepMergeCore<T>(
    current: T,
    options: DeepMergeOptions,
    visited: WeakMap<object, MergeableValue>,
    ...sources: T[] 
  ): T {
    if (!sources.length) return current;
    const source = sources.shift() as MergeableObject;
  
    if (isObject(source)) {
      if (visited.has(source)) {
        return visited.get(source) as T;
      }
  
      visited.set(source, current as MergeableObject);
  
      for (const key in source) {
        const sourceValue = source[key];
  
        if (sourceValue instanceof Map) {
          switch (options.mapMergeStrategy) {
            case "replace":
            (current as MergeableObject)[key] = new Map(sourceValue as MergeableMap);
              break;
            case "combine":
            default:
                (current as MergeableObject)[key] = new Map([
                ...((current as MergeableObject)[key] as MergeableMap) || [],
                ...(sourceValue as MergeableMap),
              ]);
          }
        } else if (sourceValue instanceof Set) {
          switch (options.setMergeStrategy) {
            case "replace":
                (current as MergeableObject)[key] = new Set(sourceValue as MergeableSet);
              break;
            case "combine":
            default:
                (current as MergeableObject)[key] = new Set([
                ...((current as MergeableObject)[key] as MergeableSet) || [],
                ...(sourceValue as MergeableSet),
              ]);
          }
        } else if (Array.isArray(sourceValue)) {
          switch (options.arrayMergeStrategy) {
            case "unique":
                (current as MergeableObject)[key] = Array.from(
                new Set([
                  ...((current as MergeableObject)[key] as MergeableArray) || [],
                  ...(sourceValue as MergeableArray),
                ])
              );
              break;
            case "replace":
                (current as MergeableObject)[key] = sourceValue;
              break;
            case "combine":
            default:
                (current as MergeableObject)[key] = [
                ...((current as MergeableObject)[key] as MergeableArray) || [],
                ...(sourceValue as MergeableArray),
              ];
          }
        } else if (isObject(sourceValue)) {
          (current as MergeableObject)[key] = (current as MergeableObject)[key] || {};
          (current as MergeableObject)[key] = deepMergeCore((current as MergeableObject)[key] as MergeableObject, options, visited, sourceValue);
        } else {
          (current as MergeableObject)[key] = sourceValue;
        }
      }
    } else {
      return source as T;
    }
  
    return deepMergeCore(current, options, visited, ...sources);
  }
  
export { deepMerge };
export type { DeepMergeOptions };

