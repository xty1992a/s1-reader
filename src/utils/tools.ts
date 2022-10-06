import Taro from "@tarojs/taro";
import tinycolor from "tinycolor2";
export const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));
export const limit = (min: number, max: number) => (value) =>
  Math.max(Math.min(max, value), min);
export const rdm = () =>  Math.random().toString(36).substr(2, 15);
export const copy = (o) => JSON.parse(JSON.stringify(o));
// 不能有的
const excludes = [/^max-age=/i, /^path=/i, /^expires=/i];
// 必须有的
const includes = [/=/];
// 需要格式化的
const drop = [
  (t) => t.trim(),
  (t) => t.replace(/^secure,/, ""),
  (t) => t.replace(/^httponly,/i, ""),
];
export const cookie = {
  parse(text: string): Record<string, string> {
    return text
      .split(";")
      .map((i) => drop.reduce((t, fn) => fn(t), i))
      .filter((i) => includes.every((ex) => ex.test(i)))
      .filter((i) => excludes.every((ex) => !ex.test(i)))
      .map((i) => i.split("="))
      .reduce((json, [k, v]) => ({ ...json, [k]: v }), Object.create(null));
  },
  serialize(json: Record<string, string>) {
    return Object.entries(json)
      .reduce(
        (list, [k, v]) => (k && v ? [...list, [k, v].join("=")] : list),
        []
      )
      .join(";");
  },
};

export function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else if (value instanceof Set) {
    return {
      dataType: "Set",
      value: Array.from(value), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

export function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
    if (value.dataType === "Set") {
      return new Set(value.value);
    }
  }
  return value;
}

class Storage {
  prefix: string;

  constructor(prefix = "") {
    this.prefix = prefix;
  }

  mkKey(key: string) {
    return [this.prefix, key].join(":");
  }

  set(key: string, payload: any) {
    try {
      Taro.setStorageSync(
        this.mkKey(key),
        JSON.stringify({ payload }, replacer, 2)
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  get(key: string) {
    try {
      const value = Taro.getStorageSync(this.mkKey(key));
      return JSON.parse(value, reviver).payload;
    } catch (e) {
      return null;
    }
  }
}

export const storage = new Storage();

export function getCookie() {
  return Taro.getStorageSync("cookie");
}

export function setCookie(str: string) {
  try {
    const old = getCookie();

    const cookieJson = {
      ...cookie.parse(old),
      ...cookie.parse(str),
    };

    const cookieText = cookie.serialize(cookieJson);

    // console.log('now cookie', cookieJson)

    Taro.setStorageSync("cookie", cookieText);
  } catch (e) {
    Taro.removeStorageSync("cookie");
  }
}

export function delCookie() {
  Taro.removeStorageSync("cookie");
}

export function toRgb(color: string) {
  return tinycolor(color).toRgbString();
}

export function toHex(color: string) {
  return tinycolor(color).toHexString();
}
