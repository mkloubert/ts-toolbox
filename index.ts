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

import * as crypto from 'crypto';
import * as FSExtra from 'fs-extra';
import * as Glob from 'glob';
import * as MIME from 'mime';
import * as Minimatch from 'minimatch';
import * as Moment from 'moment';
import * as net from 'net';
import * as SimpleSocket from 'node-simple-socket';


/**
 * A function that converts a value to a string.
 * 
 * @param {any} val The value to convert.
 * 
 * @return {string} The value as string.
 */
export type StringConverter = (val: any) => string;


/**
 * The default value for the 'toBooleanSafe()' function.
 */
export let DefaultBooleanValue: any = false;
/**
 * The default value for the 'detectMimeByFilename()' function.
 */
export let DefauleMimeType: any = 'application/octet-stream';
/**
 * The default logic for the 'normalizeString()' function.
 */
export let DefaultStringNormalizer: StringConverter = (str: string) => str.toLowerCase().trim();


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
 * Returns a return value as a promise.
 * 
 * @param {T|PromiseLike<T>} result The result.
 * 
 * @return {PromiseLike<T>} The promise.
 */
export function asPromise<T>(result: T | PromiseLike<T>): PromiseLike<T> {
    let r: any = result;
    
    return new Promise<T>((resolve, reject) => {
        let nextAction = () => {
            resolve(r);
        };

        if (isObj(r)) {
            if (isFunc(r['then'])) {
                // seems to be a promise

                nextAction = () => {
                    r.then((res: any) => {
                        resolve(res);
                    }, (err: any) => {
                        reject(err);
                    });
                };
            }
        }

        nextAction();
    });
}

/**
 * Clones an object / value deep.
 * 
 * @param {T} val The value / object to clone.
 * 
 * @return {T} The cloned value / object.
 */
export function cloneObject<T>(val: T): T {
    if (!val) {
        return val;
    }

    return JSON.parse(JSON.stringify(val));
}

/**
 * Compares values as strings.
 * 
 * @param string x The "left" value. 
 * @param string y The "right" value.
 * @param boolean [ignoreCase] Compare case sensitive or not.
 * 
 * @return {number} The "sort value".
 */
export function compareAsStrings(x: any, y: any,
                                 ignoreCase = false): number {
    if (ignoreCase) {
        x = normalizeString(x);
        y = normalizeString(y);
    }
    else {
        x = toStringSafe(x);
        y = toStringSafe(y);
    }

    return compareValues<any>(x, y);
}

/**
 * Compares values as strings (descending).
 * 
 * @param string x The "left" value. 
 * @param string y The "right" value.
 * @param boolean [ignoreCase] Compare case sensitive or not.
 * 
 * @return {number} The "sort value".
 */
export function compareAsStringsDesc(x: any, y: any,
                                     ignoreCase = false): number {
    return compareAsStrings(y, x, ignoreCase);
}

/**
 * Compares two values for a sort operation.
 * 
 * @param {T} x The left value.
 * @param {T} y The right value.
 * 
 * @return {number} The "sort value".
 */
export function compareValues<T>(x: T, y: T): number {
    if (x === y) {
        return 0;
    }

    if (x > y) {
        return 1;
    }

    if (x < y) {
        return -1;
    }

    return 0;
}

/**
 * Compares two values for a sort operation (descending).
 * 
 * @param {T} x The left value.
 * @param {T} y The right value.
 * 
 * @return {number} The "sort value".
 */
export function compareValuesDesc<T>(x: T, y: T): number {
    return compareValues<T>(y, x);
}

/**
 * Connects to a secure socket (server).
 * 
 * @param {number} port The TCP port. 
 * @param {string} [host] The host address.
 * 
 * @return {PromiseLike<SimpleSocket.SimpleSocket>} The promise with the new socket.
 */
export function connectToSecureServer(port: number, host?: string): PromiseLike<SimpleSocket.SimpleSocket> {
    return SimpleSocket.connect(port, host);
}

/**
 * Tries to detect the MIME type of a file.
 * 
 * @param {string} file The Filename.
 * @param {any} [defValue] The default value.
 * 
 * @return {string} The MIME type.
 */
export function detectMimeByFilename(file: string, defValue?: any): string {
    if (arguments.length < 1) {
        defValue = DefauleMimeType;
    }
    
    let mime: string;
    try {
        mime = MIME.lookup(file);
    }
    catch (e) {
        console.log('[ERROR.ts-toolbox] detectMimeByFilename(): ' + e);
    }

    mime = normalizeString(mime);
    if ('' === mime) {
        mime = defValue;
    }

    return mime;
}

/**
 * Removes duplicate entries from an array.
 * 
 * @param {T[]} arr The input array.
 * 
 * @return {T[]} The filtered array.
 */
export function distinctArray<T>(arr: T[]): T[] {
    if (!arr) {
        return arr;
    }

    return arr.filter((x, i) => {
        return arr.indexOf(x) === i;
    });
}

/**
 * Searches for files.
 * 
 * @param {string|string[]} patterns One or more pattern. 
 * @param {Glob.IOptions} [opts] The options for each pattern.
 * 
 * @return {PromiseLike<string[]>} The promise with the found files.
 */
export function glob(patterns: string | string[], opts?: Glob.IOptions): PromiseLike<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        let allFiles: string[] = [];
        let completed = (err: any) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(allFiles);
            }
        };

        try {
            let patternList = asArray(patterns).map(x => toStringSafe(x))
                                               .filter(x => !isEmptyString(x));

            let nextPattern: () => void;

            nextPattern = () => {
                if (patternList.length < 1) {
                    allFiles = distinctArray(allFiles);
                    completed(null);

                    return;
                }
                
                let p = patternList.shift();

                Glob(p, opts, (err, matches) => {
                    if (err) {
                        completed(err);
                    }
                    else {
                        allFiles = allFiles.concat(matches);
                        nextPattern();
                    }
                });
            };

            nextPattern()
        }
        catch (e) {
            completed(e);
        }
    });
}

/**
 * Searches for files (synchronous).
 * 
 * @param {string|string[]} patterns One or more pattern. 
 * @param {Glob.IOptions} [opts] The options for each pattern.
 */
export function globSync(patterns: string | string[], opts?: Glob.IOptions): string[] {
    let patternList = asArray(patterns).map(x => toStringSafe(x))
                                       .filter(x => !isEmptyString(x));

    let allFiles: string[] = [];
    patternList.forEach(p => {
        allFiles = allFiles.concat(Glob.sync(p, opts));
    });

    return distinctArray(allFiles);
}

/**
 * Hashes data.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [algo] The algorithm to use. Default: sha256
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export function hash(data: any, algo?: string, encoding?: string): PromiseLike<Buffer> {
    algo = normalizeString(algo);
    if ('' === algo) {
        algo = 'sha256';
    }
    
    encoding = normalizeString(encoding);
    if ('' === encoding) {
        encoding = 'ascii';
    }
    
    if (!data) {
        data = Buffer.alloc(0);
    }
    
    return new Promise<Buffer>((resolve, reject) => {
        try {
            if (Buffer.isBuffer(data)) {
                resolve(crypto.createHash(algo)
                              .update(data)
                              .digest());
            }
            else if (isObj(data)) {
                let stream: NodeJS.ReadableStream = data;

                let hash = crypto.createHash(algo);

                stream.once('error', (err: any) => {
                    reject(err);
                });

                stream.on('readable', (chunk: Buffer) => {
                    hash.update(chunk);
                });

                stream.once('end', () => {
                    resolve(hash.digest());
                });
            }
            else {
                // handle as string
                // and convert to Buffer

                hash(new Buffer(toStringSafe(data), encoding), algo, encoding).then((hash) => {
                    resolve(hash);
                }, (err) => {
                    reject(err);
                });
            }
        }
        catch (e) {
            reject(e);
        }
    });
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
 * Checks if a value is a function or not.
 * 
 * @param {any} val The value to check.
 * 
 * @return {boolean} Is function or not.
 */
export function isFunc(val: any): boolean {
    return 'function' === typeof val;
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
 * Checks if a value is an object or not.
 * 
 * @param {any} val The value to check.
 * 
 * @return {boolean} Is object or not.
 */
export function isObj(val: any): boolean {
    return 'object' === typeof val;
}

/**
 * Finds matching strings.
 * 
 * @param {any|any[]} values The list of values to search in. 
 * @param {string|string[]} patterns One or more pattern. 
 * @param {Minimatch.IOptions} [opts] The options to use.
 * 
 * @return {string[]} The matching values a strings.
 */
export function match(values: any | any[], patterns: string | string[], opts?: Minimatch.IOptions): string[] {
    let list = asArray<any>(values, false).map(x => isNullOrUndefined(x) ? x : toStringSafe(x));
    let patternList = asArray(patterns).map(x => toStringSafe(x))
                                       .filter(x => !isEmptyString(x));

    let allMatches: string[] = [];
    patternList.forEach(p => {
        allMatches = allMatches.concat(Minimatch.match(list, p, opts));
    });

    return allMatches;
}

/**
 * Hashes data with MD5.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export function md5(data: any, encoding?: string): PromiseLike<Buffer> {
    return hash(data, 'md5', encoding);
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
 * Returns the current time.
 * 
 * @return {Moment.Moment} The current time.
 */
export function now(): Moment.Moment {
    return Moment();
}

/**
 * Replaces all occurrences of the string representation of a value.
 * 
 * @param {any} val The input value.
 * @param {any} searchValue The value to search for.
 * @param {any} replaceValue The value to replace 'searchValue' with.
 * 
 * @return {string} The output string.
 */
export function replaceAllStrings(val: any, searchValue: any, replaceValue: any): string {
    if (isNullOrUndefined(val)) {
        return val;
    }

    return toStringSafe(val).split(toStringSafe(searchValue))
                            .join(toStringSafe(replaceValue));
}

/**
 * Hashes data with SHA-1.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export function sha1(data: any, encoding?: string): PromiseLike<Buffer> {
    return hash(data, 'sha1', encoding);
}

/**
 * Hashes data with SHA-256.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export function sha256(data: any, encoding?: string): PromiseLike<Buffer> {
    return hash(data, 'sha256', encoding);
}

/**
 * Hashes data with SHA-384.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export function sha384(data: any, encoding?: string): PromiseLike<Buffer> {
    return hash(data, 'sha384', encoding);
}

/**
 * Hashes data with SHA-512.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export function sha512(data: any, encoding?: string): PromiseLike<Buffer> {
    return hash(data, 'sha512', encoding);
}

/**
 * Starts a secure TCP server.
 * 
 * @param {number} port The TCP port the server should listen on.
 * @param {SimpleSocket.ListenCallback} cb The callback for the new connections.
 * 
 * @return {PromiseLike<net.Server>} The promise with the underlying Node server instance.
 */
export function startSecureServer(port: number, cb: SimpleSocket.ListenCallback): PromiseLike<net.Server> {
    return SimpleSocket.listen(port, cb);
}

/**
 * Converts a value to a boolean.
 * 
 * @param {any} val The value to convert.
 * @param {any} [defaultValue] The value to return if 'val' is (null) or (undefined).
 * 
 * @return {boolean} The converted value.
 */
export function toBooleanSafe(val: any, defaultValue?: any): boolean {
    if (arguments.length < 2) {
        defaultValue = DefaultBooleanValue;
    }

    if (isNullOrUndefined(val)) {
        return defaultValue;
    }

    return !!val;
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

/**
 * Returns the current UTC time.
 * 
 * @return {Moment.Moment} The UTC time.
 */
export function utcNow(): Moment.Moment {
    return now().utc();
}

/**
 * Hashes data with Whirlpool.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @return {PromiseLike<Buffer>} The promise with the hash.
 */
export function whirlpool(data: any, encoding?: string): PromiseLike<Buffer> {
    return hash(data, 'whirlpool', encoding);
}
