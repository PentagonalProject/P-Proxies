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

let fs = require('fs');
const {generate} =  require('random-ua');
eval(fs.readFileSync(require.resolve('random-ua'))+'');

let _browser = {
    firefox: function (...args) {
        return browser.apply(args);
    },
    chrome: function (...args) {
        return browser.chrome.apply(args);
    },
    iexplorer: function (...args) {
        return browser.iexplorer.apply(args);
    },
    opera: function (...args) {
        return browser.opera.apply(args);
    },
    safari: function (...args) {
        return browser.safari.apply(args);
    },
};

function UserAgent() {
    this.UserAgent = this;
    this.browser = _browser;
    this.generate = generate;
    return this;
}

UserAgent.prototype.constructor = UserAgent;
UserAgent.constructor = UserAgent;

UserAgent = new UserAgent;
UserAgent.UserAgent = UserAgent;

module.exports = UserAgent;