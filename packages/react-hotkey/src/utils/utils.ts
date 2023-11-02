export const isff =
  typeof navigator !== 'undefined'
    ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0
    : false;

// 绑定事件
export function addEvent(object: any, event: any, method: any) {
  if (object.addEventListener) {
    object.addEventListener(event, method, false);
  } else if (object.attachEvent) {
    object.attachEvent(`on${event}`, () => {
      method(window.event);
    });
  }
}

// 修饰键转换成对应的键码
export function getMods(modifier: any, key: any) {
  const mods = key.slice(0, key.length - 1);
  for (let i = 0; i < mods.length; i++) mods[i] = modifier[mods[i].toLowerCase()];
  return mods;
}

// 处理传的key字符串转换成数组
export function getKeys(key: any) {
  if (typeof key !== 'string') key = '';
  key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等
  const keys = key.split(','); // 同时设置多个快捷键，以','分割
  let index = keys.lastIndexOf('');

  // 快捷键可能包含','，需特殊处理
  for (; index >= 0; ) {
    keys[index - 1] += ',';
    keys.splice(index, 1);
    index = keys.lastIndexOf('');
  }

  return keys;
}

// 比较修饰键的数组
export function compareArray(a1: any, a2: any) {
  const arr1 = a1.length >= a2.length ? a1 : a2;
  const arr2 = a1.length >= a2.length ? a2 : a1;
  let isIndex = true;

  for (let i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
  }
  return isIndex;
}

export const _keyMap: { [x: string]: number } = {
  'backspace': 8,
  'tab': 9,
  'clear': 12,
  'enter': 13,
  'return': 13,
  'esc': 27,
  'escape': 27,
  'space': 32,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'del': 46,
  'delete': 46,
  'ins': 45,
  'insert': 45,
  'home': 36,
  'end': 35,
  'pageup': 33,
  'pagedown': 34,
  'capslock': 20,
  'num_0': 96,
  'num_1': 97,
  'num_2': 98,
  'num_3': 99,
  'num_4': 100,
  'num_5': 101,
  'num_6': 102,
  'num_7': 103,
  'num_8': 104,
  'num_9': 105,
  'num_multiply': 106,
  'num_add': 107,
  'num_enter': 108,
  'num_subtract': 109,
  'num_decimal': 110,
  'num_divide': 111,
  '⇪': 20,
  ',': 188,
  '.': 190,
  '/': 191,
  '`': 192,
  '-': isff ? 173 : 189,
  '=': isff ? 61 : 187,
  ';': isff ? 59 : 186,
  "'": 222,
  '[': 219,
  ']': 221,
  '\\': 220,
};

// Modifier Keys
export const _modifier: { [x: string]: number } = {
  // shiftKey
  '⇧': 16,
  'shift': 16,
  // altKey
  '⌥': 18,
  'alt': 18,
  'option': 18,
  // ctrlKey
  '⌃': 17,
  'ctrl': 17,
  'control': 17,
  // metaKey
  '⌘': 91,
  'cmd': 91,
  'command': 91,
};
export const modifierMap: { [x: number | string]: string | number } = {
  16: 'shiftKey',
  18: 'altKey',
  17: 'ctrlKey',
  91: 'metaKey',

  shiftKey: 16,
  ctrlKey: 17,
  altKey: 18,
  metaKey: 91,
};
export const _mods: { [x: number]: boolean } = {
  16: false,
  18: false,
  17: false,
  91: false,
};
export const _handlers: { [x: string]: any } = {};

// F1~F12 special key
for (let k = 1; k < 20; k++) {
  // @ts-ignore
  _keyMap[`f${k}`] = 111 + k;
}
