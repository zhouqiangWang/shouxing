"use strict";

const https = require('https');
const querystring = require('querystring');
const Q = require("q");

/**
 * https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
 * test account
 * appid=wx792859b3af8af30c&secret=e5ea7631c76ec48efa58adc2b186bc46
 *
 * https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi
 *
 * @type {[type]}
 */
class WeixinTokenAPI {
    constructor() {
        let options = this._options = {
                host: 'api.weixin.qq.com', // 这个不用说了, 请求地址
                path: "/cgi-bin/token?grant_type=client_credential&appid=wx792859b3af8af30c&secret=e5ea7631c76ec48efa58adc2b186bc46", // 具体路径, 必须以'/'开头, 是相对于host而言的
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
    }

    getAccessToken() {
        console.log("getAccessToken");
        this._options.path = "/cgi-bin/token?grant_type=client_credential&appid=wx792859b3af8af30c&secret=e5ea7631c76ec48efa58adc2b186bc46";
        let defer = Q.defer();
        https.get(this._options, function(res) {
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

    getJSApiToken(accessToken) {
        console.log("getAccessToken");
        this._options.path = "/cgi-bin/ticket/getticket?type=jsapi&access_token=" + accessToken;
        let defer = Q.defer();
        https.get(this._options, function(res) {
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
