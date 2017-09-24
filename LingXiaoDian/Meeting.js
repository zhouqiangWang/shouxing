"use strict";

// const redisClient = require("./database/RedisClient");

// redisClient.setValue("today", "Friday");
// redisClient.getValue("today");
const Koa = require('koa');
const serve = require("koa-static");
const app = new Koa();

app.use(serve('./LingXiaoDian/'));


// x-response-time

console.log("listening 3003...");
app.listen(3003);
