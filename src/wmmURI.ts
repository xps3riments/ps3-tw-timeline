import { removeDiacritics } from "./removeDiacritics";

type Dictionary<Type> = { [key: string]: Type };
const WMM_EDIT_URL_LIMIT = 1300;

const encodingMapping: Dictionary<string> = {
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

const decodeMapping: Dictionary<string> = {
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

const htmlEntities: Dictionary<string> = {
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

function htmlDecode(str: string) {
  return str.replace(/\&([^;]+);/g, (entity, entityCode: string) => {
    var match;

    if (entityCode in htmlEntities) {
      return htmlEntities[entityCode];
      /*eslint no-cond-assign: 0*/
    } else if ((match = entityCode.match(/^#x([\da-fA-F]+)$/))) {
      return String.fromCharCode(parseInt(match[1], 16));
      /*eslint no-cond-assign: 0*/
    } else if ((match = entityCode.match(/^#(\d+)$/))) {
      return String.fromCharCode(~~match[1]);
    } else {
      return entity;
    }
  });
}

export function encode(text: string): string {
  text = htmlDecode(text);
  text = removeDiacritics(text);
  text = text.replace(/http[s]:[^ "]+/g, "");

  Object.keys(encodingMapping).forEach(key => {
    text = text.replace(new RegExp(key, "g"), encodingMapping[key]);
  });

  return text.trim().replace(/ /g, "*");
}

export function decode(text: string): string {
  Object.keys(decodeMapping).forEach(key => {
    text = text.replace(new RegExp(decodeMapping[key], "g"), key);
  });
  return text;
}

export function encodeArray(str: string[]): string {
  return str.map(encode).join("!");
}

export function decodeArray(str: string): string[] {
  return str.split("!").map(decode);
}

export function encodeLimitedArray(
  str: string[],
  limit: number = WMM_EDIT_URL_LIMIT
): string {
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
