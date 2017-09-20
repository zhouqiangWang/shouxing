"use strict";

const http = require('http');
const querystring = require('querystring');
const Q = require("q");

/**
 * http://localhost:3002/token
 * getAccessToken from localhost service
 * @type {[type]}
 */
class WeixinTokenAPI {
    constructor() {
        let options = this._options = {
                host: '111.231.103.87', // 这个不用说了, 请求地址
                // host: 'localhost',
                path: "/token", // 具体路径, 必须以'/'开头, 是相对于host而言的
                method: 'GET',
                port: 3002,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
    }

    getAccessToken() {
        let defer = Q.defer();
        http.get(this._options, function(res) {
            var resData = "";
            res.on("data",function(data){
                resData += data;
            });
            res.on("end", function() {
                console.log("result = " + resData);
                defer.resolve(resData);
                // callback(null,JSON.parse(resData));
            });
        });

        return defer.promise;
    }
}

WeixinTokenAPI.getInstance = function() {
    return WeixinTokenAPI.instance || (WeixinTokenAPI.instance = new WeixinTokenAPI());
}

module.exports = WeixinTokenAPI.getInstance();
