"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const removeDiacritics_1 = require("./removeDiacritics");
const WMM_EDIT_URL_LIMIT = 1300;
const encodingMapping = {
    _: "-",
    "\\&": "_0",
    "\\<": "_1",
    "\\>": "_2",
    "\\*": "_3",
    "\\:": "_4",
    "\\;": "_5",
    "\\?": "_6",
    "\\=": "_7",
    "\\{": "_8",
    "\\}": "_9",
    "\\#": "_A",
    "\\…": "_B",
    "\\.\\.\\.": "_B",
    " _B": "_B",
    "\\!": "_C",
    "\\[": "_D",
    "\\]": "_E",
    '\\"': "_F",
    "\\'": "_G",
    "[^a-zA-Z0-9 -_]": "",
    "\\s\\s": " "
};
const decodeMapping = {
    " ": "\\*",
    "&": "_0",
    "<": "_1",
    ">": "_2",
    "*": "_3",
    ":": "_4",
    ";": "_5",
    "?": "_6",
    "=": "_7",
    "{": "_8",
    "}": "_9",
    "#": "_A",
    "…": "_B",
    "!": "_C",
    "[": "_D",
    "]": "_E",
    '"': "_F",
    "'": "_G"
};
const htmlEntities = {
    nbsp: " ",
    cent: "¢",
    pound: "£",
    yen: "¥",
    euro: "€",
    copy: "©",
    reg: "®",
    lt: "<",
    gt: ">",
    quot: '"',
    amp: "&",
    apos: "'"
};
function htmlDecode(str) {
    return str.replace(/\&([^;]+);/g, (entity, entityCode) => {
        var match;
        if (entityCode in htmlEntities) {
            return htmlEntities[entityCode];
            /*eslint no-cond-assign: 0*/
        }
        else if ((match = entityCode.match(/^#x([\da-fA-F]+)$/))) {
            return String.fromCharCode(parseInt(match[1], 16));
            /*eslint no-cond-assign: 0*/
        }
        else if ((match = entityCode.match(/^#(\d+)$/))) {
            return String.fromCharCode(~~match[1]);
        }
        else {
            return entity;
        }
    });
}
function encode(text) {
    text = htmlDecode(text);
    text = removeDiacritics_1.removeDiacritics(text);
    text = text.replace(/http[s]:[^ "]+/g, "");
    Object.keys(encodingMapping).forEach(key => {
        text = text.replace(new RegExp(key, "g"), encodingMapping[key]);
    });
    return text.trim().replace(/ /g, "*");
}
exports.encode = encode;
function decode(text) {
    Object.keys(decodeMapping).forEach(key => {
        text = text.replace(new RegExp(decodeMapping[key], "g"), key);
    });
    return text;
}
exports.decode = decode;
function encodeArray(str) {
    return str.map(encode).join("!");
}
exports.encodeArray = encodeArray;
function decodeArray(str) {
    return str.split("!").map(decode);
}
exports.decodeArray = decodeArray;
function encodeLimitedArray(str, limit = WMM_EDIT_URL_LIMIT) {
    let count = encode(str[0]).length;
    return str
        .filter(t => encode(t).length !== 0)
        .map(text => {
        const encoded = encode(text);
        const encodedLength = encoded.length;
        if (count + encodedLength < limit) {
            count += encodedLength;
            return encoded;
        }
        return null;
    })
        .filter(e => e !== null)
        .join("!");
}
exports.encodeLimitedArray = encodeLimitedArray;
