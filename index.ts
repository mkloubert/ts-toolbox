/// <reference types="node" />

// The MIT License (MIT)
// 
// ts-toolbox (https://github.com/mkloubert/ts-toolbox)
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER


/**
 * The default logic for the 'normalizeString()' function.
 */
export let DefaultStringNormalizer: StringConverter = (str: string) => str.toLowerCase().trim();

/**
 * A function that converts a value to a string.
 * 
 * @param {any} val The value to convert.
 * 
 * @return {string} The value as string.
 */
export type StringConverter = (val: any) => string;

/**
 * Returns a value as array.
 * 
 * @param {T|T[]} val The value.
 * @param {boolean} [removeEmpty] Remove empty values or not.
 * 
 * @return {T[]} The value as array.
 */
export function asArray<T>(val: T | T[], removeEmpty = true): T[] {
    if (!Array.isArray(val)) {
        val = [ val ];
    }

    if (removeEmpty) {
        val = val.filter(x => x);
    }

    return val;
}

/**
 * Checks if the string representation of a value is empty
 * or contains whitespaces only.
 * 
 * @param {any} val The value to check.
 * 
 * @return {boolean} Is empty or not.
 */
export function isEmptyString(val: any): boolean {
    return '' === toStringSafe(val).trim();
}

/**
 * Checks if a value is (null) or (undefined).
 * 
 * @param {any} val The value to check.
 * 
 * @return {boolean} Is (null)/(undefined) or not.
 */
export function isNullOrUndefined(val: any): boolean {
    return null === val ||
           'undefined' === typeof val;
}

/**
 * Normalizes a value as string, so that is comparable.
 * 
 * @param {any} val The value to convert.
 * @param StringConverter [normalizer] The custom normalizer.
 * 
 * @return {string} The normalized value.
 */
export function normalizeString(val: any, normalizer?: StringConverter): string {
    if (!normalizer) {
        normalizer = DefaultStringNormalizer;
    }
    if (!normalizer) {
        normalizer = (str: string) => str;
    }

    return normalizer(toStringSafe(val));
}

/**
 * Converts a value to a string, which is NOT (null) or (undefined).
 * 
 * @param {any} str The input value.
 * @param {any} [defValue] The default value.
 * 
 * @return {string} The output value.
 */
export function toStringSafe(str: any, defValue: any = ''): string {
    if (isNullOrUndefined(str)) {
        str = '';
    }
    str = '' + str;
    if ('' === str) {
        str = defValue;
    }

    return str;
}
