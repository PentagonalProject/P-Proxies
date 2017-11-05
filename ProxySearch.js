/*
 * MIT License
 *
 * Copyright (c) 2017, Pentagonal
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

"use strict";

const {$} = require('./jQuery');
const fs = require('fs');
const {Client}  = require('./Request');
const userAgent  = require('./UserAgent');
const os         = require('os');
const crypto     = require('crypto');

let shaSum = crypto.createHash('sha1');
shaSum.update(__filename);

const cachePath = os.tmpdir() +'/'+ shaSum.digest('hex') + '/';
// const cachePath = __dirname +'/'+ shaSum.digest('hex') + '/';

const {
    ProxyCountry,
    baseProxyURL,
    ProxyByCountryName
} = require('./ProxyConfig');

let countryCodes = [];
for (let cCode in ProxyCountry) {
    if (ProxyCountry.hasOwnProperty(cCode)) {
        countryCodes.push(cCode);
    }
}
const cachedProxy = {};

function getSearchCode(stringCode)
{
    let theCode = stringCode
        .toLowerCase()
        .replace(/(\s)+/, '$1')
        .replace(/^\s+|\s+$/, '')
        .replace(/(^[a-z]|\s[a-z])/g, function (a, b) {
            return b.toUpperCase();
        });
    let keys = ProxyByCountryName.hasOwnProperty(theCode)
        ? ProxyByCountryName[theCode]
        : null;
    if (keys) {
        return keys;
    }
    switch (theCode) {
        case 'Usa':
        case 'America':
            keys = 'US';
            break;
        case 'Slovak':
            keys = 'SK';
            break;
        case 'Czech':
            keys = 'CZ';
            break;
        case 'Moldova':
            keys = 'MD';
            break;
        case 'Tobago':
        case 'Trinidad':
            keys = 'TT';
            break;
        case 'Dominican':
            keys = 'DM';
            break;
        case 'England':
        case 'British':
            keys = 'UK';
            break;
        case 'Hongkong':
            keys = 'HK';
            break;
        case 'Korea':
            keys = 'KR';
            break;
        case 'Rusia':
            keys = 'RU';
            break;
        case 'Uae':
            keys = 'UA';
            break;
        case 'Emirate':
        case 'Emirates':
        case 'Arab':
            keys = 'SA';
            break;
    }
    return keys;
}

const proxyCrawl = (countries = 'US', cacheTime = 300, debug = false) => new Promise(
    (resolve, reject) => {
        try {
            fs.statSync(cachePath);
        } catch(err) {
            fs.mkdir(cachePath, (err) => {
                if (err) {
                    reject(err);
                }
            });
        }

        let done = 0;
        let tryIt = {};
        cacheTime = typeof cacheTime === 'boolean'
            ? (cacheTime ? 300 : 0)
            : cacheTime;
        cacheTime = typeof cacheTime !== 'number' || cacheTime < 0
            ? 300
            : cacheTime;

        let listLength = 0;
        let countryList = {};
        let isSingle = false;
        if (typeof countries === 'string' && countryCodes.indexOf(countries.toUpperCase()) > -1) {
            listLength++;
            isSingle = countries.toUpperCase();
            countryList[countries.toUpperCase()] = {};
        }
        if (!isSingle) {
            switch (Object.prototype.toString.call(countries)) {
                case '[object Array]':
                    for (let i = 0; countries.length > i; i++) {
                        if (typeof countries[i] !== 'string') {
                            continue;
                        }
                        let currentCode = countries[i].toUpperCase();
                        if (countryCodes.indexOf(currentCode) < 0) {
                            if (currentCode.length > 2) {
                                let keys = getSearchCode(currentCode);
                                if (keys) {
                                    currentCode = keys;
                                    listLength++;
                                    countryList[currentCode] = {};
                                    continue;
                                }
                            }
                            continue;
                        }

                        listLength++;
                        countryList[currentCode] = {};
                    }
                    break;
                default:
                    throw Error('Country list must be as a string or object array');
            }
        }

        if (listLength === 0) {
            return {}
        }

        const createProxySearch = (code) => {
            if (!tryIt[code] && debug) {
                console.log(`Getting proxy list for (${ProxyCountry[code]})`);
            }

            return new Promise((resolve) => Client(
                baseProxyURL + ProxyCountry[code],
                {
                    'method': 'POST',
                    'headers' : {
                        'User-Agent': userAgent.generate(),
                        'Accept-Encoding' : 'br',
                        'Referer': 'https://www.google.com/search?ie=UTF-8&q=Proxy+' + code,
                    },
                    formData: {
                        Country: ProxyCountry[code]
                    },
                },
                function(error, response, body) {
                    resolve({error: error, response: response, body: body});
                }
            )).then(callBackResolve(
                code
            )).catch((err) => {
                if (debug) {
                    console.log(err);
                }

                done++
            })
        };

        const callBackResolve = (type) => function({error, response, body}) {
            if (error || response.statusCode !== 200) {
                if ((!tryIt[type] || tryIt[type] < 5) && !error && response.statusCode === 403) {
                    if (!tryIt[type]) {
                        tryIt[type] = 0;
                    }
                    tryIt[type]++;
                    if (debug) {
                        console.log(`Retry getting proxy list for (${ProxyCountry[type]}) at count : [ ${tryIt[type]} ]`);
                    }

                    return createProxySearch(type);
                }

                done++;
                tryIt[type] = 0;
                return;
            }

            tryIt[type] = 0;
            body = $(body);
            body = body.find('table#tblproxy tbody > tr:not([class="caption"])');
            let c = 0 ;
            countryList[type] = [];
            body.each(function () {
                c++;
                let $td = $(this).find(' > td');
                if ($td.length > 5) {
                    let ip = $td[1].innerHTML.toString().match(/['"]\s*([0-9.]+)/);
                    let port = $td[2].innerHTML.toString().match(/['"]\s*([0-9]+)/);
                    ip = ip[1] || null;
                    port = port[1] || null;
                    if (!port || !ip) {
                        return;
                    }

                    let time = $td[$td.length-1].innerHTML.replace(/s/i, ''),
                        sockType = $td[$td.length-2].innerHTML.toString().toLowerCase(),
                        isSock5 = !(!sockType.match(/socks?5|ks?\/5/i)),
                        isSock4 = !(!sockType.match(/socks?4|ks?\/4/i));
                    time = time.match(/s/) === null ? parseInt(time) : parseInt(parseFloat(time) * 1000);
                    countryList[type].push({
                        ip: ip,
                        port: parseInt(port),
                        type: sockType || null,
                        sock5: isSock5,
                        sock4: isSock4,
                        fast: time
                    });
                }

                if (c >= body.length) {
                    done++;
                }
            });

            // if has no proxy left intact
            if (!countryList[type].length) {
                countryList[type] =
                    cachedProxy[type] = [];
                return;
            }

            countryList[type].sort((a, b) => {
                if (typeof a.fast === 'undefined' && typeof b.fast === 'undefined') {
                    return 0;
                }
                return a.fast > b.fast ? 1 : -1;
            });
            cachedProxy[type] = countryList[type];
            if (debug) {
                // push
                console.log(`Proxies for (${ProxyCountry[type]}) found ${countryList[type].length}`);
            }

            // write into cache
            fs.writeFile(
                cachePath + type + '.json',
                JSON.stringify(countryList[type], null, 2),
                function(err) {
                    if (err) {
                        if (debug) {
                            console.log(`Can not write into cache${cachePath + type}.json`);
                            // console.error(err);
                        }
                    }
                });
        };

        let proxyCheckLength = 0;
        for (let code in countryList) {
            if (!countryList.hasOwnProperty(code) || !ProxyCountry.hasOwnProperty(code)) {
                continue;
            }

            countryList[code] = [];
            proxyCheckLength++;
            if (cachedProxy.hasOwnProperty(code)) {
                countryList = cachedProxy[code];
                continue;
            }
            let fileData = cachePath + code + '.json';
            fs.stat(fileData, function (error, stats) {
                if (error || ((new Date().getTime() - stats.mtime) / 1000) > cacheTime) {
                    createProxySearch(code);
                    return;
                }

                let cb = function (err, data) {
                    if (err) {
                        // if (debug) {
                        //     console.trace('Error:' + err.message);
                        // }
                        createProxySearch(code);
                        return;
                    }

                    try {
                        countryList[code] = JSON.parse(data.toString());
                        if (Object.prototype.toString.call(countryList[code]) === '[object Array]'
                            && countryList[code].length
                            && typeof countryList[code][0]['ip'] === 'string'
                        ) {
                            if (debug) {
                                console.log(`Found Cached Proxies for (${ProxyCountry[code]}) found ${countryList[code].length}`);
                            }
                            cachedProxy[code] = countryList[code];
                            done++;
                            return;
                        }
                        // console.log(countryList[code]);
                        countryList[code] = [];
                        createProxySearch(code);
                    } catch (err) {
                        createProxySearch(code);
                    }
                };
                fs.readFile(fileData, null, cb);
            });
        }

        // await interval
        let interval = setInterval(() => {
            if (done < proxyCheckLength) {
                return;
            }
            if (isSingle) {
                countryList = countryList[isSingle];
            }
            resolve(countryList);
            clearInterval(interval);
        }, 100);
    }
);

function ProxySearch() {
    this.ProxySearch = this;
    this.cachePath = cachePath;
    this.countryList =  ProxyCountry;
    this.proxyCrawl = proxyCrawl;
    this.getSearchCode = getSearchCode;
    return this;
}
ProxySearch.prototype.constructor = ProxySearch;
ProxySearch.constructor = ProxySearch;

ProxySearch = new ProxySearch;
ProxySearch.ProxySearch = ProxySearch;


/**
 * @type {Promise}
 */
module.exports = ProxySearch;
