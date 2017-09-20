"use strict";

// const redisClient = require("./database/RedisClient");

// redisClient.setValue("today", "Friday");
// redisClient.getValue("today");
const Koa = require('koa');
const app = new Koa();
const crypto = require('crypto');
const hash = crypto.createHash('sha1');

const WeixinTokenAPI = require("./business/WeixinTokenAPI");
const WEIXIN_TOKEN = "wang";

// x-response-time

app.use(async (ctx, next) => {
  console.log("step1 begin==>>");
  const start = Date.now();
  console.time("step1");
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.timeEnd("step1");
});

function isValid(options) {
  let params = [WEIXIN_TOKEN, options.timestamp, options.nonce];
  params.sort();
  console.log("params : ", params);
  let paramStr = params[0] + params[1] + params[2];
  hash.update(paramStr);
  let hashStr = hash.digest("hex");

  return hashStr === options.signature;
}

app.use(async ctx => {
    console.log("request :: " + ctx.path + ", query = " + JSON.stringify(ctx.query) + ", request = " + JSON.stringify(ctx.request));
    let resp = "I want you";

    // test data
    // ctx.query.signature = "8a0b495053e957b077ef2110c4ee3c27332454e2";
    // ctx.query.timestamp = "1505672890";
    // ctx.query.nonce = "1582616584";
    // ctx.query.echostr = "10283289359637544635";
    switch (ctx.path) {
        case "/menu":
            let token = await WeixinTokenAPI.getAccessToken();
            resp = token;
            console.log("token = ", token);
            break;
        case "/echo":
            if (isValid(ctx.query)) {
                resp = ctx.query.echostr;
            }
            break;
        default:
            console.log("route into default. path = " + ctx.path);
    }
    console.log("ctx.body = ", resp);
    ctx.body = resp;
});

console.log("listening 80...");
app.listen(80);
