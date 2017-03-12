/// <reference types="node" />
/// <reference types="file-type" />
/// <reference types="glob" />
/// <reference types="i18next" />
/// <reference types="minimatch" />
import * as Cron from 'cron';
import * as FileType from 'file-type';
import * as FSExtra from 'fs-extra';
import * as Glob from 'glob';
import * as http from 'http';
import * as https from 'https';
import * as i18next from 'i18next';
import * as Minimatch from 'minimatch';
import * as Moment from 'moment';
import * as net from 'net';
import * as SimpleSocket from 'node-simple-socket';
import * as UUID from 'node-uuid';
/**
 * List of possible entity formats.
 */
export declare type EntityFormat = '' | 'h' | 'html' | null | undefined | '4' | 'htm4' | 'html4' | 'v4' | '5' | 'htm5' | 'html5' | 'v5' | 'x' | 'xml';
/**
 * Describes a simple 'completed' action.
 *
 * @param {any} err The occurred error.
 * @param {TResult} [result] The result.
 */
export declare type SimpleCompletedAction<TResult> = (err: any, result?: TResult) => void;
/**
 * A function that converts a value to a string.
 *
 * @param {any} val The value to convert.
 *
 * @returns {string} The value as string.
 */
export declare type StringConverter = (val: any) => string;
/**
 * The default value for the 'toBooleanSafe()' function.
 */
export declare let DefaultBooleanValue: any;
/**
 * The default string encoding.
 */
export declare let DefaultEncoding: any;
/**
 * The default value for the 'detectMimeByFilename()' function.
 */
export declare let DefauleMimeType: any;
/**
 * The default logic for the 'normalizeString()' function.
 */
export declare let DefaultStringNormalizer: StringConverter;
/**
 * Compares data by hashing it.
 *
 * @param {any} x The "left" data.
 * @param {any} y The "right" data.
 * @param {string} [algo] The algorithm to use. Default: sha256
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @returns {Promise<boolean>} The promise that indicates if both data are equal or not.
 */
export declare function areEqual(x: any, y: any, algo?: string, encoding?: string): Promise<boolean>;
/**
 * Converts arguments to an array.
 *
 * @param {IArguments} args The arguments.
 *
 * @returns {any[]} The arguments as array.
 */
export declare function argumentsToArray(args: ArrayLike<any>): any[];
/**
 * Returns a value as array.
 *
 * @param {T|T[]} val The value.
 * @param {boolean} [removeEmpty] Remove empty values or not.
 *
 * @returns {T[]} The value as array.
 */
export declare function asArray<T>(val: T | T[], removeEmpty?: boolean): T[];
/**
 * Returns a return value as a promise.
 *
 * @param {T|PromiseLike<T>} result The result.
 *
 * @returns {Promise<T>} The promise.
 */
export declare function asPromise<T>(result: T | PromiseLike<T>): Promise<T>;
/**
 * Clones an object / value deep.
 *
 * @param {T} val The value / object to clone.
 *
 * @returns {T} The cloned value / object.
 */
export declare function cloneObject<T>(val: T): T;
/**
 * Compares values as strings.
 *
 * @param string x The "left" value.
 * @param string y The "right" value.
 * @param boolean [ignoreCase] Compare case sensitive or not.
 *
 * @returns {number} The "sort value".
 */
export declare function compareAsStrings(x: any, y: any, ignoreCase?: boolean): number;
/**
 * Compares values as strings (descending).
 *
 * @param string x The "left" value.
 * @param string y The "right" value.
 * @param boolean [ignoreCase] Compare case sensitive or not.
 *
 * @returns {number} The "sort value".
 */
export declare function compareAsStringsDesc(x: any, y: any, ignoreCase?: boolean): number;
/**
 * Compares two values for a sort operation.
 *
 * @param {T} x The left value.
 * @param {T} y The right value.
 *
 * @returns {number} The "sort value".
 */
export declare function compareValues<T>(x: T, y: T): number;
/**
 * Compares two values for a sort operation (descending).
 *
 * @param {T} x The left value.
 * @param {T} y The right value.
 *
 * @returns {number} The "sort value".
 */
export declare function compareValuesDesc<T>(x: T, y: T): number;
/**
 * Connects to a secure socket (server).
 *
 * @param {number} port The TCP port.
 * @param {string} [host] The host address.
 *
 * @returns {Promise<SimpleSocket.SimpleSocket>} The promise with the new socket.
 */
export declare function connectToSecureServer(port: number, host?: string): Promise<SimpleSocket.SimpleSocket>;
/**
 * Creates a simple 'completed' callback for a promise.
 *
 * @param {(value?: TResult | PromiseLike<TResult>) => void} resolve The 'succeeded' callback.
 * @param {(reason: any) => void} [reject] The 'error' callback.
 *
 * @return {SimpleCompletedAction<TResult>} The created action.
 */
export declare function createSimpleCompletedAction<TResult>(resolve: (value?: TResult | PromiseLike<TResult>) => void, reject?: (reason: any) => void): SimpleCompletedAction<TResult>;
/**
 * Decodes the HTML/XML entities in the string representation of data.
 *
 * @param {any} data The data to decode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 * @param {EntityFormat} [format] The format to use. Default: html
 *
 * @returns {string} The decoded string.
 */
export declare function decodeEntities(data: any, encoding?: string, format?: EntityFormat): string;
/**
 * Tries to detect the MIME type of a file.
 *
 * @param {string} file The Filename.
 * @param {any} [defValue] The default value.
 *
 * @returns {string} The MIME type.
 */
export declare function detectMimeByFilename(file: string, defValue?: any): string;
/**
 * Removes duplicate entries from an array.
 *
 * @param {T[]} arr The input array.
 *
 * @returns {T[]} The filtered array.
 */
export declare function distinctArray<T>(arr: T[]): T[];
/**
 * Encodes the HTML/XML entities in the string representation of data.
 *
 * @param {any} data The data to encode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 * @param {EntityFormat} [format] The format to use. Default: html
 *
 * @returns {string} The encoded string.
 */
export declare function encodeEntities(data: any, encoding?: string, format?: EntityFormat): string;
/**
 * Checks the file type of a buffer or file.
 *
 * @param {string|Buffer} bufferOrPath The buffer or the path to the file.
 *
 * @returns {Promise<FileType.FileTypeResult>} The promise with the result.
 */
export declare function fileType(bufferOrPath: string | Buffer): Promise<FileType.FileTypeResult>;
/**
 * Checks the file type of a buffer or file (synchronous).
 *
 * @param {string|Buffer} bufferOrPath The buffer or the path to the file.
 *
 * @returns FileType.FileTypeResult> The result.
 */
export declare function fileTypeSync(bufferOrPath: string | Buffer): FileType.FileTypeResult;
/**
 * Converts a JSON string to an object.
 *
 * @param {any} json The JSON data.
 *
 * @returns {T} The object.
 */
export declare function fromJSON<T>(json: any): T;
/**
 * Searches for files.
 *
 * @param {string|string[]} patterns One or more pattern.
 * @param {Glob.IOptions} [opts] The options for each pattern.
 *
 * @returns {Promise<string[]>} The promise with the found files.
 */
export declare function glob(patterns: string | string[], opts?: Glob.IOptions): Promise<string[]>;
/**
 * Searches for files (synchronous).
 *
 * @param {string|string[]} patterns One or more pattern.
 * @param {Glob.IOptions} [opts] The options for each pattern.
 *
 * @returns {string[]} The matching items.
 */
export declare function globSync(patterns: string | string[], opts?: Glob.IOptions): string[];
/**
 * Alias for 'uuid()'.
 */
export declare function guid(type?: string, opts?: UUID.UUIDOptions): string;
/**
 * Hashes data.
 *
 * @param {any} data The data to hash.
 * @param {string} [algo] The algorithm to use. Default: sha256
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export declare function hash(data: any, algo?: string, encoding?: string): Promise<Buffer>;
/**
 * Decodes the HTML entities in the string representation of data.
 *
 * @param {any} data The data to decode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 *
 * @returns {string} The decoded string.
 */
export declare function htmlDecode(data: any, encoding?: string): string;
/**
 * Encodes the HTML entities in the string representation of data.
 *
 * @param {any} data The data to encode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 *
 * @returns {string} The encoded string.
 */
export declare function htmlEncode(data: any, encoding?: string): string;
/**
 * Initializes the global language storage.
 *
 * @param {i18next.Options} [opts] The options.
 *
 * @returns {Promise<i18next.TranslationFunction>} The promise with the translation function.
 */
export declare function initI18(opts?: i18next.Options): Promise<i18next.TranslationFunction>;
/**
 * Checks if data/file is/contains binary or text content.
 *
 * @param {Buffer|string} dataOrFilepath The data or the path to the file to check.
 *
 * @returns {Promise<boolean>} The promise that indicates if data is binary or not.
 */
export declare function isBinary(dataOrFilepath: Buffer | string): Promise<boolean>;
/**
 * Checks if data/file is/contains binary or text content (synchronous).
 *
 * @param {Buffer|string} dataOrFilepath The data or the path to the file to check.
 *
 * @returns {boolean} Is binary content or not.
 */
export declare function isBinarySync(dataOrFilepath: Buffer | string): boolean;
/**
 * Checks if the string representation of a value is empty
 * or contains whitespaces only.
 *
 * @param {any} val The value to check.
 *
 * @returns {boolean} Is empty or not.
 */
export declare function isEmptyString(val: any): boolean;
/**
 * Checks if a value is a function or not.
 *
 * @param {any} val The value to check.
 *
 * @returns {boolean} Is function or not.
 */
export declare function isFunc(val: any): boolean;
/**
 * Checks if a value is (null) or (undefined).
 *
 * @param {any} val The value to check.
 *
 * @returns {boolean} Is (null)/(undefined) or not.
 */
export declare function isNullOrUndefined(val: any): boolean;
/**
 * Checks if a value is an object or not.
 *
 * @param {any} val The value to check.
 *
 * @returns {boolean} Is object or not.
 */
export declare function isObj(val: any): boolean;
/**
 * Finds matching strings.
 *
 * @param {any|any[]} values The list of values to search in.
 * @param {string|string[]} patterns One or more pattern.
 * @param {Minimatch.IOptions} [opts] The options to use.
 *
 * @returns {string[]} The matching values a strings.
 */
export declare function match(values: any | any[], patterns: string | string[], opts?: Minimatch.IOptions): string[];
/**
 * Hashes data with MD5.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export declare function md5(data: any, encoding?: string): Promise<Buffer>;
/**
 * Creates a directory.
 *
 * @param {string|Buffer} path The path of the new directory.
 * @param {string|number} [mode] The custom mode.
 *
 * @returns {Promise<any>} The promise.
 */
export declare function mkdir(path: string | Buffer, mode?: string | number): Promise<any>;
/**
 * Creates a directory deep.
 *
 * @param {string} path The path of the new directory.
 * @param {FSExtra.MkdirOptions} [opts] The options.
 *
 * @returns {Promise<any>} The promise.
 */
export declare function mkdirs(path: string, opts?: FSExtra.MkdirOptions): Promise<any>;
/**
 * Creates a directory (synchronous).
 *
 * @param {string|Buffer} path The path of the new directory.
 * @param {string|number} [mode] The custom mode.
 */
export declare function mkdirSync(path: string | Buffer, mode?: string | number): void;
/**
 * Creates a directory deep (synchronous).
 *
 * @param {string} path The path of the new directory.
 * @param {FSExtra.MkdirOptions} [opts] The options.
 */
export declare function mkdirsSync(dir: string, opts?: FSExtra.MkdirOptions): void;
/**
 * Creates a new cron job.
 *
 * @param {(string|Date)} time The cron time.
 * @param {() => void} onTick The "tick" function.
 * @param {string} [timeZone] The custom timezone to use.
 *
 * @returns {Cron.CronJob} The new job.
 */
export declare function newCron(time: string | Date, onTick: () => void, timeZone?: string): Cron.CronJob;
/**
 * Normalizes a value as string, so that is comparable.
 *
 * @param {any} val The value to convert.
 * @param StringConverter [normalizer] The custom normalizer.
 *
 * @returns {string} The normalized value.
 */
export declare function normalizeString(val: any, normalizer?: StringConverter): string;
/**
 * Returns the current time.
 *
 * @returns {Moment.Moment} The current time.
 */
export declare function now(): Moment.Moment;
/**
 * Replaces all occurrences of the string representation of a value.
 *
 * @param {any} val The input value.
 * @param {any} searchValue The value to search for.
 * @param {any} replaceValue The value to replace 'searchValue' with.
 *
 * @returns {string} The output string.
 */
export declare function replaceAllStrings(val: any, searchValue: any, replaceValue: any): string;
/**
 * Hashes data with SHA-1.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export declare function sha1(data: any, encoding?: string): Promise<Buffer>;
/**
 * Hashes data with SHA-256.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export declare function sha256(data: any, encoding?: string): Promise<Buffer>;
/**
 * Hashes data with SHA-384.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export declare function sha384(data: any, encoding?: string): Promise<Buffer>;
/**
 * Hashes data with SHA-512.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export declare function sha512(data: any, encoding?: string): Promise<Buffer>;
/**
 * Starts a new cron job.
 *
 * @param {(string|Date)} time The cron time.
 * @param {() => void} onTick The "tick" function.
 * @param {string} [timeZone] The custom timezone to use.
 *
 * @returns {Cron.CronJob} The new job.
 */
export declare function startCron(time: string | Date, onTick: () => void, timeZone?: string): Cron.CronJob;
/**
 * Starts a new HTTP server.
 *
 * @param {(req: http.IncomingMessage, resp: http.ServerResponse) => void} requestListener The request listener.
 * @param {number} [port] The TCP port to use. Default: 80 or 443
 * @param {https.ServerOptions} [httpsOpts] If defined, server will start using secure HTTP.
 *
 * @returns {(Promise<http.Server|https.Server>)} The promise with the new server instance.
 */
export declare function startHttpServer(requestListener: (req: http.IncomingMessage, resp: http.ServerResponse) => void, port?: number, httpsOpts?: https.ServerOptions): Promise<http.Server | https.Server>;
/**
 * Starts a secure TCP server.
 *
 * @param {number} port The TCP port the server should listen on.
 * @param {SimpleSocket.ListenCallback} cb The callback for the new connections.
 *
 * @returns {Promise<net.Server>} The promise with the underlying Node server instance.
 */
export declare function startSecureServer(port: number, cb: SimpleSocket.ListenCallback): Promise<net.Server>;
/**
 * Starts a new TCP server.
 *
 * @param {number} port The TCP port.
 * @param {(socket: net.Socket) => void} listener The connection/socket listener.
 * @param {{ allowHalfOpen?: boolean; }} [opts] The options.
 *
 * @returns {Promise<net.Server>} The promise with the new server instance.
 */
export declare function startServer(port: number, listener: (socket: net.Socket) => void, opts?: {
    allowHalfOpen?: boolean;
}): Promise<net.Server>;
/**
 * Returns a global translation value.
 *
 * @param {string} key The key.
 * @param {i18next.TranslationOptions} [opts] The options.
 *
 * @returns {any} The value.
 */
export declare function t(key: string, opts?: i18next.TranslationOptions): any;
/**
 * Converts a value to a boolean.
 *
 * @param {any} val The value to convert.
 * @param {any} [defaultValue] The value to return if 'val' is (null) or (undefined).
 *
 * @returns {boolean} The converted value.
 */
export declare function toBooleanSafe(val: any, defaultValue?: any): boolean;
/**
 * Converts a value to a string, which is NOT (null) or (undefined).
 *
 * @param {any} str The input value.
 * @param {any} [defValue] The default value.
 *
 * @returns {string} The output value.
 */
export declare function toStringSafe(str: any, defValue?: any): string;
/**
 * Returns the current UTC time.
 *
 * @returns {Moment.Moment} The UTC time.
 */
export declare function utcNow(): Moment.Moment;
/**
 * Generates an UUID.
 *
 * @param {string} [format] The format. Default: v4
 * @param {UUID.UUIDOptions} [opts] The options.
 *
 * @returns {string} The generated UUID.
 */
export declare function uuid(format?: string, opts?: UUID.UUIDOptions): string;
/**
 * Hashes data with Whirlpool.
 *
 * @param {any} data The data to hash.
 * @param {string} [encoding] The string encoding to use. Default: ascii
 *
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export declare function whirlpool(data: any, encoding?: string): Promise<Buffer>;
/**
 * Decodes the XML entities in the string representation of data.
 *
 * @param {any} data The data to decode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 *
 * @returns {string} The decoded string.
 */
export declare function xmlDecode(data: any, encoding?: string): string;
/**
 * Encodes the XML entities in the string representation of data.
 *
 * @param {any} data The data to encode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 *
 * @returns {string} The encoded string.
 */
export declare function xmlEncode(data: any, encoding?: string): string;
