/**
 * The default logic for the 'normalizeString()' function.
 */
export declare let DefaultStringNormalizer: StringConverter;
/**
 * A function that converts a value to a string.
 *
 * @param {any} val The value to convert.
 *
 * @return {string} The value as string.
 */
export declare type StringConverter = (val: any) => string;
/**
 * Returns a value as array.
 *
 * @param {T|T[]} val The value.
 * @param {boolean} [removeEmpty] Remove empty values or not.
 *
 * @return {T[]} The value as array.
 */
export declare function asArray<T>(val: T | T[], removeEmpty?: boolean): T[];
/**
 * Checks if the string representation of a value is empty
 * or contains whitespaces only.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is empty or not.
 */
export declare function isEmptyString(val: any): boolean;
/**
 * Checks if a value is (null) or (undefined).
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is (null)/(undefined) or not.
 */
export declare function isNullOrUndefined(val: any): boolean;
/**
 * Normalizes a value as string, so that is comparable.
 *
 * @param {any} val The value to convert.
 * @param StringConverter [normalizer] The custom normalizer.
 *
 * @return {string} The normalized value.
 */
export declare function normalizeString(val: any, normalizer?: StringConverter): string;
/**
 * Converts a value to a string, which is NOT (null) or (undefined).
 *
 * @param {any} str The input value.
 * @param {any} [defValue] The default value.
 *
 * @return {string} The output value.
 */
export declare function toStringSafe(str: any, defValue?: any): string;
