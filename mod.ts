/**
 * @fileoverview This module provides a versatile deep object merging function (deepMerge)
 *               that works consistently across Deno, Bun, and Node.js. It offers
 *               customizable array merging strategies.
 */

/**
 * Optional options interface to control the deep merge process.
 *
 * **arrayMergeStrategy:**
 *   * **concatenate** (default): Combines arrays by appending elements.
 *   * **unique**: Creates a new array with only unique elements.
 *   * **replace**: Replaces the target array entirely with the source array. 
 */
interface DeepMergeOptions {
    arrayMergeStrategy?: "concatenate" | "unique" | "replace";
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
export interface MergeableObject {
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
function deepMerge<T>(target: T, ...sources: T[]): T {
    return deepMergeCore(target, {}, ...sources);
}

/**
 * Creates a variation of the deepMerge function that applies provided options.
 *
 * @template T
 * @param {DeepMergeOptions} options - Options to control the merge behavior.
 * @param {T} target - The initial object to merge.
 * @param {...T} sources - Source objects.
 * @returns {T} The merged result.
 */
deepMerge.withOptions = function <T>(options: DeepMergeOptions, target: T, ...sources: T[]): T {
    return deepMergeCore(target, options, ...sources);
};

/**
 * Core recursive function for deep merging objects. This function handles the logic
 * of merging nested objects, arrays, Maps, Sets, and primitives, while taking
 * into account the provided merge options.
 *
 * @template T
 * @param {T} target - The current target object being merged into.
 * @param {DeepMergeOptions} options - Controls merge behavior, particularly for arrays.
 * @param {...T} sources - One or more source objects to merge (processed recursively).
 * @returns {T} The deeply merged result.
 */
function deepMergeCore<T>(target: T, options: DeepMergeOptions, ...sources: T[]): T {
    const targetObject = target as MergeableObject;

    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(targetObject) && isObject(source)) {
        for (const key in source) {
            if (source[key] instanceof Map) {
                targetObject[key] = new Map([
                    ...(targetObject[key] as MergeableMap) || [],
                    ...(source[key] as MergeableMap),
                ]);
            } else if (source[key] instanceof Set) {
                targetObject[key] = new Set([
                    ...(targetObject[key] as MergeableSet) || [],
                    ...(source[key] as MergeableSet),
                ]);
            } else if (Array.isArray(source[key])) {
                switch (options.arrayMergeStrategy) {
                    case "unique":
                        targetObject[key] = Array.from(
                            new Set([
                                ...(targetObject[key] as MergeableArray) || [],
                                ...(source[key] as MergeableArray),
                            ]),
                        );
                        break;
                    case "replace":
                        targetObject[key] = source[key];
                        break;
                    case "concatenate":
                    default:
                        targetObject[key] = [
                            ...(targetObject[key] as MergeableArray) || [],
                            ...(source[key] as MergeableArray),
                        ];
                        break;
                }
            } else if (isObject(source[key])) {
                const sourceValue = source[key];
                const targetValue = targetObject[key];
                targetObject[key] = deepMergeCore(targetValue || {}, options, sourceValue);
            } else {
                targetObject[key] = source[key];
            }
        }
    }

    return deepMergeCore(targetObject as T, options, ...sources);
}

export { deepMerge };
export type { DeepMergeOptions };
