"use strict";

const https = require('https');
const querystring = require('querystring');
const Q = require("q");

const WeixinTokenAPI = require("./WeixinTokenAPI");

const MENU = JSON.stringify({
    "button": [
        {
            "type": "click",
            "name": "今日歌曲",
            "key": "V1001_TODAY_MUSIC"
        },
        {
            "name": "菜单",
            "sub_button": [
                {
                    "type": "view",
                    "name": "搜索",
                    "url": "http://www.soso.com/"
                },
                {
                    "type": "click",
                    "name": "赞一下我们",
                    "key": "V1001_GOOD"
                }
            ]
        },
        {
            "name": "分享位置",
            "type": "location_select",
            "key": "location_key"
        }
    ]
});
/**
 * http://localhost:3002/token
 * getAccessToken from localhost service
 * @type {[type]}
 */
class WeixinMenu {
    constructor() {
        let options = this._options = {
                host: 'api.weixin.qq.com', // 这个不用说了, 请求地址
                // host: 'localhost',
                path: "/cgi-bin/menu/create?access_token=", // 具体路径, 必须以'/'开头, 是相对于host而言的
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(MENU)
                }
            };
    }

    postMenu() {
        let defer = Q.defer();

        WeixinTokenAPI.getAccessToken().then(accessToken => {
          this._options.path += accessToken;
          console.log("getOptions ready : ", this._options);
          let req = https.request(this._options, function(res) {
              var resData = "";
              res.setEncoding('utf8');
              res.on("data",function(data){
                  resData += data;
              });
              res.on("end", function() {
                  console.log("result = " + resData);
                  defer.resolve(resData);
              });
          });
          req.write(MENU);
          req.on("error", function(e) {
              console.log("request err = ", e);
          });
          req.end();
        }).catch((err) => {
          console.log("postMenu err = " + err);
        });

        return defer.promise;
    }
}

WeixinMenu.getInstance = function() {
    return WeixinMenu.instance || (WeixinMenu.instance = new WeixinMenu());
}

module.exports = WeixinMenu.getInstance();
