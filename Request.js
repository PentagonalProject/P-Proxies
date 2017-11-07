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

const
    cRequest = require('request'),
    userAgent = require('./UserAgent'),
    Socks5ClientHttpsAgent = require('socks5-https-client/lib/Agent');

function createOption(options) {
    let defaultOptions = {
        method: 'GET',
        'headers': {
            'User-Agent': userAgent.generate(),
            'Accept-Encoding': 'br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Upgrade-Insecure-Requests': '1'
        }
    };

    if (typeof options !== 'object') {
        return defaultOptions;
    }

    if (options.headers
        && typeof options.headers === 'object'
        && Object.prototype.toString.call(options.headers) !== '[object Object]'
    ) {
        options.headers = defaultOptions.headers;
        return options;
    }
    if (typeof options.headers === 'boolean'
        || options.headers === null
    ) {
        let opt = {};
        for (let k in options) {
            if (options.hasOwnProperty(k)) {
                if (k !== 'headers') {
                    opt = options[k];
                }
            }
        }

        return opt;
    }
    if (options.headers
        && typeof options.headers === 'object'
        && Object.prototype.toString.call(options.headers) === '[object Object]'
    ) {
        for (let key in defaultOptions.headers) {
            if (!defaultOptions.headers.hasOwnProperty(key) || options.headers.hasOwnProperty(key)) {
                continue;
            }

            options.headers[key] = defaultOptions.headers[key];
        }
    }

    return options;
}

/**
 * @param url
 * @param options
 * @param callback
 * @return http.ClientRequest
 */
function Client(url, options, callback)
{
    let isop = true;
    if (Object.prototype.toString.call(options) !== '[object Object]') {
        options = {};
        isop = false;
    }
    if (typeof url === 'string') {
        options.url = url;
    } else if (typeof url === 'object' && ! isop ) {
        options = url;
    }

    options = createOption(options);
    callback = callback || function () {};
    return cRequest(options, callback);
}

function ClientSock5(url, options, proxyHost, proxyPort, callback) {
    let isOpt = true;
    if (Object.prototype.toString.call(options) !== '[object Object]') {
        options = {};
        isOpt = false;
    }
    if (typeof url === 'string') {
        options.url = url;
    } else if (typeof url === 'object' && ! isOpt ) {
        options = url;
    }
    let socketOpt = {
        socksHost: proxyHost,
        socksPort: proxyPort
    };

    if (typeof options['socketTimeOut'] === "number") {
        socketOpt.timeout = options['socketTimeOut'];
        delete options['socketTimeOut'];
    } else if (typeof options['timeout'] === "number") {
        socketOpt.timeout = options['timeout'];
    }
    options.agent = new Socks5ClientHttpsAgent(socketOpt);
    options = createOption(options);
    callback = callback || function () {};
    return cRequest(options, callback);
}

function Request() {
    this.Request = this;
    this.createOption = createOption;
    this.Client = Client;
    this.ClientSock5 = ClientSock5;
    return this;
}

Request.prototype.constructor = Request;
Request.constructor = Request;

Request = new Request;
Request.Request = Request;

module.exports = Request;
