"use strict";

const Koa = require('koa');
const app = new Koa();

const WeixinTokenAPI = require("./business/WeixinTokenAPI");

// x-response-time

class TokenCache {
  constructor() {
    this._tokenCache = null;
    this.interval2h = 6000000; // 100min 100 * 60 * 1000
  }

  get token(){
    return this._tokenCache;
  }

  get jsToken() {
    return this._jsApiToken;
  }

  async run() {
    let tokenStr = await WeixinTokenAPI.getAccessToken();
    let tokenObj = JSON.parse(tokenStr);
    this._tokenCache = tokenObj.access_token;
    let jsTokenStr = await WeixinTokenAPI.getJSApiToken(this._tokenCache);
    let jsTokenObj = JSON.parse(jsTokenStr);
    this._jsApiToken = jsTokenObj.ticket;
    const start = Date.now();
    console.log("token update at " + start + ", token = " + this._tokenCache + "\n jsApiToken = " + this._jsApiToken);
    setTimeout(this.run.bind(this), this.interval2h);
  }
}

let tokenRunner = new TokenCache();
tokenRunner.run();

app.use(async (ctx, next) => {
  console.log("step1 begin==>>");
  const start = Date.now();
  console.time("step1");
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.timeEnd("step1");
});

app.use(async ctx => {
    console.log("request :: " + ctx.path + ", query = " + JSON.stringify(ctx.query) + ", request = " + JSON.stringify(ctx.request));
    let resp = ctx.request.header.host;
    switch (ctx.path) {
        case "/token":
            let token = tokenRunner.token;
            resp = token;
            console.log("token = ", token);
            break;
        case "/jsToken":
            resp = tokenRunner.jsToken;
            console.log("jsApiToken = ", resp);
            break;
        default:
            console.log("route into default. path = " + ctx.path);
    }
    ctx.body = resp;
});

console.log("listening 3002...");
app.listen(3002);
