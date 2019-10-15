"use strict";
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { encodeLimitedArray } = require("./wmmURI");
const saveFilePaths = "../public";
function downloadUser(user) {
    return fetch("https://www.tweetjs.com/API.aspx", {
        credentials: "include",
        headers: {
            accept: "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "text/plain;charset=UTF-8",
            pragma: "no-cache"
        },
        referrer: "https://www.tweetjs.com/ListTweetsOnUserTimeline.html",
        referrerPolicy: "no-referrer-when-downgrade",
        body: `{"Action":"ListTweetsOnUserTimeline","ScreenName":"${user}"}`,
        method: "POST",
        mode: "cors"
    })
        .then((r) => r.text())
        .then((body) => {
        body = encodeTimeline(body);
        fs.writeFileSync(path.resolve(__dirname, saveFilePaths, `${user}.settings`), body);
        return body;
    });
}
function encodeTimeline(body) {
    return encodeLimitedArray(JSON.parse(body).map((el) => el.text));
}
Promise.all(["xps3riments", "psxplace"].map(downloadUser));
