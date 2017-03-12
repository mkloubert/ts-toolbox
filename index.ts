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

import * as Cron from 'cron';
import * as crypto from 'crypto';
import * as FileType from 'file-type';
import * as fs from 'fs';
import * as FSExtra from 'fs-extra';
import * as Glob from 'glob';
import * as HtmlEntities from 'html-entities';
import * as http from 'http';
import * as https from 'https';
import * as i18next from 'i18next';
const IsBinaryFile = require("isbinaryfile");
import * as MIME from 'mime';
import * as Minimatch from 'minimatch';
import * as Moment from 'moment';
import * as net from 'net';
import * as SimpleSocket from 'node-simple-socket';
import * as UUID from 'node-uuid';

/**
 * Describes a simple 'completed' action.
 * 
 * @param {any} err The occurred error.
 * @param {TResult} [result] The result.
 */
export type SimpleCompletedAction<TResult> = (err: any, result?: TResult) => void;
/**
 * A function that converts a value to a string.
 * 
 * @param {any} val The value to convert.
 * 
 * @returns {string} The value as string.
 */
export type StringConverter = (val: any) => string;


/**
 * The default value for the 'toBooleanSafe()' function.
 */
export let DefaultBooleanValue: any = false;
/**
 * The default string encoding.
 */
export let DefaultEncoding: any = 'utf8';
/**
 * The default value for the 'detectMimeByFilename()' function.
 */
export let DefauleMimeType: any = 'application/octet-stream';
/**
 * The default logic for the 'normalizeString()' function.
 */
export let DefaultStringNormalizer: StringConverter = (str: string) => str.toLowerCase().trim();


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
export function areEqual(x: any, y: any, algo?: string, encoding?: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        hash(x, algo, encoding).then((hashX) => {
            hash(y, algo, encoding).then((hashY) => {
                resolve(hashX.equals(hashY));
            }, (err) => {
                reject(err);
            });
        }, (err) => {
            reject(err);
        });
    });
}

/**
 * Converts arguments to an array.
 * 
 * @param {IArguments} args The arguments.
 * 
 * @returns {any[]} The arguments as array.
 */
export function argumentsToArray(args: IArguments): any[] {
    if (!args) {
        return <any>args;
    }

    let result: any[] = [];
    for (let i = 0; i < args.length; i++) {
        result.push(args[i]);
    }

    return result;
}

/**
 * Returns a value as array.
 * 
 * @param {T|T[]} val The value.
 * @param {boolean} [removeEmpty] Remove empty values or not.
 * 
 * @returns {T[]} The value as array.
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
 * @returns {Promise<T>} The promise.
 */
export function asPromise<T>(result: T | PromiseLike<T>): Promise<T> {
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
 * @returns {T} The cloned value / object.
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
 * @returns {number} The "sort value".
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
 * @returns {number} The "sort value".
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
 * @returns {number} The "sort value".
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
 * @returns {number} The "sort value".
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
 * @returns {Promise<SimpleSocket.SimpleSocket>} The promise with the new socket.
 */
export function connectToSecureServer(port: number, host?: string): Promise<SimpleSocket.SimpleSocket> {
    return SimpleSocket.connect(port, host);
}

function createOrStartCron(start: boolean,
                           time: string | Date,
                           onTick: () => void,
                           timeZone?: string): Cron.CronJob {
    let newCronJob = new Cron.CronJob({
        cronTime: time,
        onTick: onTick,
        start: start,
        timeZone: timeZone,
    });

    return newCronJob;
}

/**
 * Creates a simple 'completed' callback for a promise.
 * 
 * @param {(value?: TResult | PromiseLike<TResult>) => void} resolve The 'succeeded' callback.
 * @param {(reason: any) => void} [reject] The 'error' callback.
 * 
 * @return {SimpleCompletedAction<TResult>} The created action.
 */
export function createSimpleCompletedAction<TResult>(resolve: (value?: TResult | PromiseLike<TResult>) => void,
                                                     reject?: (reason: any) => void): SimpleCompletedAction<TResult> {
    return function(err, result?) {
        if (err) {
            if (reject) {
                reject(err);
            }
        }
        else {
            if (resolve) {
                if (arguments.length > 1) {
                    resolve(result);
                }
                else {
                    resolve();
                }
            }
        }
    };
}


/**
 * Decodes the HTML/XML entities in the string representation of data.
 * 
 * @param {any} data The data to decode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 * @param {string} [format] The format to use. Default: html
 * 
 * @returns {string} The decoded string.
 */
export function decodeEntities(data: any, encoding?: string, format?: string): string {
    return deOrEncodeEntities.apply(null,
                                    [ 'decode' ].concat(argumentsToArray(arguments)));
}

function deOrEncodeEntities(mode: 'decode' | 'encode',
                            data: any, encoding?: string, format?: string): string {
    encoding = normalizeString(encoding);
    if ('' === encoding) {
        encoding = 'utf8';
    }

    format = normalizeString(format);

    let entities: HtmlEntities.Entities;
    switch (format) {
        case '':
        case 'h':
        case 'html':
            entities = new HtmlEntities.AllHtmlEntities();
            break;

        case '4':
        case 'v4':
        case 'html4':
        case 'htm4':
            entities = new HtmlEntities.Html4Entities();
            break;

        case '5':
        case 'v5':
        case 'html5':
        case 'htm5':
            entities = new HtmlEntities.Html5Entities();
            break;

        case 'x':
        case 'xml':
            entities = new HtmlEntities.XmlEntities();
            break;
    }

    if (!entities) {
        throw new Error(`'${format} is NOT supported!`);
    }

    if (isNullOrUndefined(data)) {
        return data;
    }

    if (Buffer.isBuffer(data)) {
        data = data.toString(encoding);
    }
    else {
        data = toStringSafe(data);
    }

    let m: Function = (<any>entities)[mode];
    return m(data);
}

/**
 * Tries to detect the MIME type of a file.
 * 
 * @param {string} file The Filename.
 * @param {any} [defValue] The default value.
 * 
 * @returns {string} The MIME type.
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
 * @returns {T[]} The filtered array.
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
 * Encodes the HTML/XML entities in the string representation of data.
 * 
 * @param {any} data The data to encode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 * @param {string} [format] The format to use. Default: html
 * 
 * @returns {string} The encoded string.
 */
export function encodeEntities(data: any, encoding?: string, format?: string): string {
    return deOrEncodeEntities.apply(null,
                                    [ 'encode' ].concat(argumentsToArray(arguments)));
}

/**
 * Checks the file type of a buffer or file.
 * 
 * @param {string|Buffer} bufferOrPath The buffer or the path to the file.
 *  
 * @returns {Promise<FileType.FileTypeResult>} The promise with the result.
 */
export function fileType(bufferOrPath: string | Buffer): Promise<FileType.FileTypeResult> {
    return new Promise<FileType.FileTypeResult>((resolve, reject) => {
        let completed = (err: any, result?: FileType.FileTypeResult) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        };
        
        try {
            if (isNullOrUndefined(bufferOrPath)) {
                completed(null, <any>bufferOrPath);
            }
            else {
                if (Buffer.isBuffer(bufferOrPath)) {
                    completed(null, FileType(bufferOrPath));
                }
                else {
                    fs.readFile(toStringSafe(bufferOrPath), (err, data) => {
                        if (err) {
                            completed(err);
                        }
                        else {
                            completed(null, FileType(data));
                        }
                    });
                }
            }
        }
        catch (e) {
            completed(e);
        }
    });
}

/**
 * Checks the file type of a buffer or file (synchronous).
 * 
 * @param {string|Buffer} bufferOrPath The buffer or the path to the file.
 *  
 * @returns FileType.FileTypeResult> The result.
 */
export function fileTypeSync(bufferOrPath: string | Buffer): FileType.FileTypeResult {
    if (isNullOrUndefined(bufferOrPath)) {
        return <any>bufferOrPath;
    }

    let buff: Buffer;
    if (Buffer.isBuffer(bufferOrPath)) {
        buff = bufferOrPath;
    }
    else {
        buff = fs.readFileSync(toStringSafe(bufferOrPath));
    }

    return FileType(buff);
}

/**
 * Converts a JSON string to an object.
 * 
 * @param {any} json The JSON data.
 * 
 * @returns {T} The object.
 */
export function fromJSON<T>(json: any): T {
    json = toStringSafe(json);
    if (isEmptyString(json)) {
        return undefined;
    }

    return JSON.parse(toStringSafe(json));
}

/**
 * Searches for files.
 * 
 * @param {string|string[]} patterns One or more pattern. 
 * @param {Glob.IOptions} [opts] The options for each pattern.
 * 
 * @returns {Promise<string[]>} The promise with the found files.
 */
export function glob(patterns: string | string[], opts?: Glob.IOptions): Promise<string[]> {
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
 * 
 * @returns {string[]} The matching items.
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
 * Alias for 'uuid()'.
 */
export function guid(type = 'v4', opts?: UUID.UUIDOptions): string {
    return uuid.apply(null, arguments);
}

/**
 * Hashes data.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [algo] The algorithm to use. Default: sha256
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export function hash(data: any, algo?: string, encoding?: string): Promise<Buffer> {
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
 * Decodes the HTML entities in the string representation of data.
 * 
 * @param {any} data The data to decode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 * 
 * @returns {string} The decoded string.
 */
export function htmlDecode(data: any, encoding?: string): string {
    return decodeEntities(data, encoding, 'html');
}

/**
 * Encodes the HTML entities in the string representation of data.
 * 
 * @param {any} data The data to encode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 * 
 * @returns {string} The encoded string.
 */
export function htmlEncode(data: any, encoding?: string): string {
    return encodeEntities(data, encoding, 'html');
}

/**
 * Initializes the global language storage.
 * 
 * @param {i18next.Options} [opts] The options.
 * 
 * @returns {Promise<i18next.TranslationFunction>} The promise with the translation function.
 */
export function initI18(opts?: i18next.Options): Promise<i18next.TranslationFunction> {
    return new Promise<i18next.TranslationFunction>((resolve, reject) => {
        i18next.init(opts, (err, t) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(t);
            }
        });
    });
}

/**
 * Checks if data/file is/contains binary or text content.
 * 
 * @param {Buffer|string} dataOrFilepath The data or the path to the file to check.
 * 
 * @returns {Promise<boolean>} The promise that indicates if data is binary or not.
 */
export function isBinary(dataOrFilepath: Buffer | string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        let completed = (err: any, isBinary?: boolean) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(isBinary);
            }
        };

        if (isNullOrUndefined(dataOrFilepath)) {
            completed(null, <any>dataOrFilepath);
        }
        else {
            IsBinaryFile(dataOrFilepath, null, (err: any, result: boolean) => {
                if (err) {
                    completed(err);
                }
                else {
                    completed(null, result);
                }
            });
        }
    });
}

/**
 * Checks if data/file is/contains binary or text content (synchronous).
 * 
 * @param {Buffer|string} dataOrFilepath The data or the path to the file to check.
 * 
 * @returns {boolean} Is binary content or not.
 */
export function isBinarySync(dataOrFilepath: Buffer | string): boolean {
    if (isNullOrUndefined(dataOrFilepath)) {
        return <any>dataOrFilepath;
    }

    return IsBinaryFile.sync(dataOrFilepath, null);
}

/**
 * Checks if the string representation of a value is empty
 * or contains whitespaces only.
 * 
 * @param {any} val The value to check.
 * 
 * @returns {boolean} Is empty or not.
 */
export function isEmptyString(val: any): boolean {
    return '' === toStringSafe(val).trim();
}

/**
 * Checks if a value is a function or not.
 * 
 * @param {any} val The value to check.
 * 
 * @returns {boolean} Is function or not.
 */
export function isFunc(val: any): boolean {
    return 'function' === typeof val;
}

/**
 * Checks if a value is (null) or (undefined).
 * 
 * @param {any} val The value to check.
 * 
 * @returns {boolean} Is (null)/(undefined) or not.
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
 * @returns {boolean} Is object or not.
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
 * @returns {string[]} The matching values a strings.
 */
export function match(values: any | any[], patterns: string | string[], opts?: Minimatch.IOptions): string[] {
    let list = asArray<any>(values, false).map(x => isNullOrUndefined(x) ? x : toStringSafe(x));
    let patternList = asArray(patterns).map(x => toStringSafe(x))
                                       .filter(x => !isEmptyString(x));

    let allMatches: string[] = [];
    list.forEach(x => {
        for (let i = 0; i < patternList.length; i++) {
            let p = patternList[i];
            if (Minimatch.match([ x ], p, opts).length > 0) {
                allMatches.push(x);
                break;
            }
        }
    });

    return allMatches;
}

/**
 * Hashes data with MD5.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export function md5(data: any, encoding?: string): Promise<Buffer> {
    return hash(data, 'md5', encoding);
}

/**
 * Creates a directory.
 * 
 * @param {string|Buffer} path The path of the new directory.
 * @param {string|number} [mode] The custom mode.
 * 
 * @returns {Promise<any>} The promise.
 */
export function mkdir(path: string | Buffer, mode?: string | number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        FSExtra.mkdir(path, <any>mode, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

/**
 * Creates a directory deep.
 * 
 * @param {string} path The path of the new directory.
 * @param {FSExtra.MkdirOptions} [opts] The options.
 * 
 * @returns {Promise<any>} The promise.
 */
export function mkdirs(path: string, opts?: FSExtra.MkdirOptions): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        FSExtra.mkdirs(toStringSafe(path), opts, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

/**
 * Creates a directory (synchronous).
 * 
 * @param {string|Buffer} path The path of the new directory.
 * @param {string|number} [mode] The custom mode.
 */
export function mkdirSync(path: string | Buffer, mode?: string | number): void {
    return FSExtra.mkdirSync(path, <any>mode);
}

/**
 * Creates a directory deep (synchronous).
 * 
 * @param {string} path The path of the new directory.
 * @param {FSExtra.MkdirOptions} [opts] The options.
 */
export function mkdirsSync(dir: string, opts?: FSExtra.MkdirOptions): void {
    return FSExtra.mkdirsSync(dir, opts);
}

/**
 * Creates a new cron job.
 * 
 * @param {(string|Date)} time The cron time.
 * @param {() => void} onTick The "tick" function.
 * @param {string} [timeZone] The custom timezone to use.
 * 
 * @returns {Cron.CronJob} The new job.
 */
export function newCron(time: string | Date,
                        onTick: () => void,
                        timeZone?: string): Cron.CronJob {
    return createOrStartCron.apply(null,
                                   [ false ].concat(argumentsToArray(arguments)));
}

/**
 * Normalizes a value as string, so that is comparable.
 * 
 * @param {any} val The value to convert.
 * @param StringConverter [normalizer] The custom normalizer.
 * 
 * @returns {string} The normalized value.
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
 * @returns {Moment.Moment} The current time.
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
 * @returns {string} The output string.
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
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export function sha1(data: any, encoding?: string): Promise<Buffer> {
    return hash(data, 'sha1', encoding);
}

/**
 * Hashes data with SHA-256.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export function sha256(data: any, encoding?: string): Promise<Buffer> {
    return hash(data, 'sha256', encoding);
}

/**
 * Hashes data with SHA-384.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export function sha384(data: any, encoding?: string): Promise<Buffer> {
    return hash(data, 'sha384', encoding);
}

/**
 * Hashes data with SHA-512.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export function sha512(data: any, encoding?: string): Promise<Buffer> {
    return hash(data, 'sha512', encoding);
}

/**
 * Starts a new cron job.
 * 
 * @param {(string|Date)} time The cron time.
 * @param {() => void} onTick The "tick" function.
 * @param {string} [timeZone] The custom timezone to use.
 * 
 * @returns {Cron.CronJob} The new job.
 */
export function startCron(time: string | Date,
                          onTick: () => void,
                          timeZone?: string): Cron.CronJob {
    return createOrStartCron.apply(null,
                                   [ true ].concat(argumentsToArray(arguments)));
}

/**
 * Starts a new HTTP server.
 * 
 * @param {(req: http.IncomingMessage, resp: http.ServerResponse) => void} requestListener The request listener.
 * @param {number} [port] The TCP port to use. Default: 80 or 443
 * @param {https.ServerOptions} [httpsOpts] If defined, server will start using secure HTTP.
 * 
 * @returns {(Promise<http.Server|https.Server>)} The promise with the new server instance. 
 */
export function startHttpServer(requestListener: (req: http.IncomingMessage, resp: http.ServerResponse) => void,
                                port?: number,
                                httpsOpts?: https.ServerOptions): Promise<http.Server | https.Server> {
    port = parseInt(toStringSafe(port).trim());
    let isSecure = arguments.length > 2;
    
    return new Promise<http.Server | https.Server>((resolve, reject) => {
        try {
            let newServer: http.Server | https.Server;
            if (isSecure) {
                newServer = https.createServer(httpsOpts, requestListener);
            }
            else {
                newServer = http.createServer(requestListener);
            }

            if (isNaN(port)) {
                port = isSecure ? 443 : 80;
            }

            newServer.once('error', (err: any) => {
                reject(err);
            });

            newServer.listen(port, () => {
                resolve(newServer);
            });
        }
        catch (e) {
            reject(e);
        }
    });
}

/**
 * Starts a secure TCP server.
 * 
 * @param {number} port The TCP port the server should listen on.
 * @param {SimpleSocket.ListenCallback} cb The callback for the new connections.
 * 
 * @returns {Promise<net.Server>} The promise with the underlying Node server instance.
 */
export function startSecureServer(port: number, cb: SimpleSocket.ListenCallback): Promise<net.Server> {
    return SimpleSocket.listen(port, cb);
}

/**
 * Starts a new TCP server.
 * 
 * @param {number} port The TCP port.
 * @param {(socket: net.Socket) => void} listener The connection/socket listener. 
 * @param {{ allowHalfOpen?: boolean; }} [opts] The options.
 * 
 * @returns {Promise<net.Server>} The promise with the new server instance.
 */
export function startServer(port: number,
                            listener: (socket: net.Socket) => void,
                            opts?: { allowHalfOpen?: boolean; }): Promise<net.Server> {
    port = parseInt(toStringSafe(port).trim());
    
    return new Promise<net.Server>((resolve, reject) => {
        try {
            let newServer = net.createServer(opts, listener);

            newServer.once('error', (err) => {
                reject(err);
            });

            newServer.once('listening', () => {
                resolve(newServer);
            });

            newServer.listen(port);
        }
        catch (e) {
            reject(e);
        }
    });
}

/**
 * Returns a global translation value.
 * 
 * @param {string} key The key.
 * @param {i18next.TranslationOptions} [opts] The options.
 * 
 * @returns {any} The value.
 */
export function t(key: string, opts?: i18next.TranslationOptions): any {
    return i18next.t(key, opts);
}

/**
 * Converts a value to a boolean.
 * 
 * @param {any} val The value to convert.
 * @param {any} [defaultValue] The value to return if 'val' is (null) or (undefined).
 * 
 * @returns {boolean} The converted value.
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
 * @returns {string} The output value.
 */
export function toStringSafe(str: any, defValue: any = ''): string {
    if (Buffer.isBuffer(str)) {
        let enc = normalizeString(DefaultEncoding);
        if ('' === enc) {
            enc = 'ascii';
        }

        str = str.toString(enc);
    }

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
 * @returns {Moment.Moment} The UTC time.
 */
export function utcNow(): Moment.Moment {
    return now().utc();
}

/**
 * Generates an UUID.
 * 
 * @param {string} [format] The format. Default: v4 
 * @param {UUID.UUIDOptions} [opts] The options.
 * 
 * @returns {string} The generated UUID.
 */
export function uuid(format?: string, opts?: UUID.UUIDOptions): string {
    format = normalizeString(format);

    let func: Function;
    switch (format) {
        case '':
        case '4':
        case 'v4':
            func = UUID.v4;
            break;

        case '1':
        case 'v1':
            func = UUID.v1;
            break;
    }

    if (!func) {
        throw Error(`'${format}' is NOT supported!`);
    }

    return func(opts);
}

/**
 * Hashes data with Whirlpool.
 * 
 * @param {any} data The data to hash. 
 * @param {string} [encoding] The string encoding to use. Default: ascii
 * 
 * @returns {Promise<Buffer>} The promise with the hash.
 */
export function whirlpool(data: any, encoding?: string): Promise<Buffer> {
    return hash(data, 'whirlpool', encoding);
}

/**
 * Decodes the XML entities in the string representation of data.
 * 
 * @param {any} data The data to decode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 * 
 * @returns {string} The decoded string.
 */
export function xmlDecode(data: any, encoding?: string): string {
    return decodeEntities(data, encoding, 'xml');
}

/**
 * Encodes the XML entities in the string representation of data.
 * 
 * @param {any} data The data to encode.
 * @param {string} [encoding] The string encoding to use. Default: utf8
 * 
 * @returns {string} The encoded string.
 */
export function xmlEncode(data: any, encoding?: string): string {
    return encodeEntities(data, encoding, 'xml');
}
