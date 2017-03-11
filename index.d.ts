/// <reference types="glob" />
/// <reference types="node" />
/// <reference types="minimatch" />
import * as Glob from 'glob';
import * as Minimatch from 'minimatch';
import * as net from 'net';
import * as SimpleSocket from 'node-simple-socket';
/**
 * A function that converts a value to a string.
 *
 * @param {any} val The value to convert.
 *
 * @return {string} The value as string.
 */
export declare type StringConverter = (val: any) => string;
/**
 * The default value for the 'toBooleanSafe()' function.
 */
export declare let DefaultBooleanValue: any;
/**
 * The default value for the 'detectMimeByFilename()' function.
 */
export declare let DefauleMimeType: any;
/**
 * The default logic for the 'normalizeString()' function.
 */
export declare let DefaultStringNormalizer: StringConverter;
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
 * Returns a return value as a promise.
 *
 * @param {T|PromiseLike<T>} result The result.
 *
 * @return {PromiseLike<T>} The promise.
 */
export declare function asPromise<T>(result: T | PromiseLike<T>): PromiseLike<T>;
/**
 * Clones an object / value deep.
 *
 * @param {T} val The value / object to clone.
 *
 * @return {T} The cloned value / object.
 */
export declare function cloneObject<T>(val: T): T;
/**
 * Compares values as strings.
 *
 * @param string x The "left" value.
 * @param string y The "right" value.
 * @param boolean [ignoreCase] Compare case sensitive or not.
 *
 * @return {number} The "sort value".
 */
export declare function compareAsStrings(x: any, y: any, ignoreCase?: boolean): number;
/**
 * Compares values as strings (descending).
 *
 * @param string x The "left" value.
 * @param string y The "right" value.
 * @param boolean [ignoreCase] Compare case sensitive or not.
 *
 * @return {number} The "sort value".
 */
export declare function compareAsStringsDesc(x: any, y: any, ignoreCase?: boolean): number;
/**
 * Compares two values for a sort operation.
 *
 * @param {T} x The left value.
 * @param {T} y The right value.
 *
 * @return {number} The "sort value".
 */
export declare function compareValues<T>(x: T, y: T): number;
/**
 * Compares two values for a sort operation (descending).
 *
 * @param {T} x The left value.
 * @param {T} y The right value.
 *
 * @return {number} The "sort value".
 */
export declare function compareValuesDesc<T>(x: T, y: T): number;
/**
 * Connects to a secure socket (server).
 *
 * @param {number} port The TCP port.
 * @param {string} [host] The host address.
 *
 * @return {PromiseLike<SimpleSocket.SimpleSocket>} The promise with the new socket.
 */
export declare function connectToSecureServer(port: number, host?: string): PromiseLike<SimpleSocket.SimpleSocket>;
/**
 * Tries to detect the MIME type of a file.
 *
 * @param {string} file The Filename.
 * @param {any} [defValue] The default value.
 *
 * @return {string} The MIME type.
 */
export declare function detectMimeByFilename(file: string, defValue?: any): string;
/**
 * Removes duplicate entries from an array.
 *
 * @param {T[]} arr The input array.
 *
 * @return {T[]} The filtered array.
 */
export declare function distinctArray<T>(arr: T[]): T[];
/**
 * Searches for files.
 *
 * @param {string|string[]} patterns One or more pattern.
 * @param {Glob.IOptions} [opts] The options for each pattern.
 *
 * @return {PromiseLike<string[]>} The promise with the found files.
 */
export declare function glob(patterns: string | string[], opts?: Glob.IOptions): PromiseLike<string[]>;
/**
 * Searches for files (synchronous).
 *
 * @param {string|string[]} patterns One or more pattern.
 * @param {Glob.IOptions} [opts] The options for each pattern.
 */
export declare function globSync(patterns: string | string[], opts?: Glob.IOptions): string[];
/**
 * Hashes data.
 *
 * @param {any} data The data to hash.
 * @param {string} [algo] The algorithm to use. Default: sha256
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export declare function hash(data: any, algo?: string, encoding?: string): PromiseLike<Buffer>;
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
 * Checks if a value is a function or not.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is function or not.
 */
export declare function isFunc(val: any): boolean;
/**
 * Checks if a value is (null) or (undefined).
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is (null)/(undefined) or not.
 */
export declare function isNullOrUndefined(val: any): boolean;
/**
 * Checks if a value is an object or not.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is object or not.
 */
export declare function isObj(val: any): boolean;
/**
 * Finds matching strings.
 *
 * @param {any|any[]} values The list of values to search in.
 * @param {string|string[]} patterns One or more pattern.
 * @param {Minimatch.IOptions} [opts] The options to use.
 *
 * @return {string[]} The matching values a strings.
 */
export declare function match(values: any | any[], patterns: string | string[], opts?: Minimatch.IOptions): string[];
/**
 * Hashes data with MD5.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export declare function md5(data: any, encoding?: string): PromiseLike<Buffer>;
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
 * Replaces all occurrences of the string representation of a value.
 *
 * @param {any} val The input value.
 * @param {any} searchValue The value to search for.
 * @param {any} replaceValue The value to replace 'searchValue' with.
 *
 * @return {string} The output string.
 */
export declare function replaceAllStrings(val: any, searchValue: any, replaceValue: any): string;
/**
 * Hashes data with SHA-1.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export declare function sha1(data: any, encoding?: string): PromiseLike<Buffer>;
/**
 * Hashes data with SHA-256.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export declare function sha256(data: any, encoding?: string): PromiseLike<Buffer>;
/**
 * Hashes data with SHA-384.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export declare function sha384(data: any, encoding?: string): PromiseLike<Buffer>;
/**
 * Hashes data with SHA-512.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export declare function sha512(data: any, encoding?: string): PromiseLike<Buffer>;
/**
 * Starts a secure TCP server.
 *
 * @param {number} port The TCP port the server should listen on.
 * @param {SimpleSocket.ListenCallback} cb The callback for the new connections.
 *
 * @return {PromiseLike<net.Server>} The promise with the underlying Node server instance.
 */
export declare function startSecureServer(port: number, cb: SimpleSocket.ListenCallback): PromiseLike<net.Server>;
/**
 * Converts a value to a boolean.
 *
 * @param {any} val The value to convert.
 * @param {any} [defaultValue] The value to return if 'val' is (null) or (undefined).
 *
 * @return {boolean} The converted value.
 */
export declare function toBooleanSafe(val: any, defaultValue?: any): boolean;
/**
 * Converts a value to a string, which is NOT (null) or (undefined).
 *
 * @param {any} str The input value.
 * @param {any} [defValue] The default value.
 *
 * @return {string} The output value.
 */
export declare function toStringSafe(str: any, defValue?: any): string;
/**
 * Hashes data with Whirlpool.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export declare function whirlpool(data: any, encoding?: string): PromiseLike<Buffer>;
