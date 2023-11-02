import {
	_handlers,
	_keyMap,
	_modifier,
	_mods,
	addEvent,
	compareArray,
	getKeys,
	getMods,
	modifierMap
} from './utils';
import { Hotkeys } from '../types';

let _downKeys: any[] = []; // 记录摁下的绑定键

let _scope = 'all'; // 默认热键范围
const elementHasBindEvent: any[] = []; // 已绑定事件的节点记录

// 返回键码
const code = (x: string) =>
	_keyMap[x.toLowerCase()] ||
	_modifier[x.toLowerCase()] ||
	x.toUpperCase().charCodeAt(0);

// 设置获取当前范围（默认为'所有'）
function setScope(scope: string) {
	_scope = scope || 'all';
}
// 获取当前范围
function getScope() {
	return _scope || 'all';
}
// 获取摁下绑定键的键值
function getPressedKeyCodes() {
	return _downKeys.slice(0);
}

// 表单控件控件判断 返回 Boolean
// hotkey is effective only when filter return true
function filter(event: KeyboardEvent) {
	const target = event.target || event.srcElement;
	// @ts-ignore
	const { tagName } = target;
	let flag = true;
	// ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>
	if (
		// @ts-ignore
		target.isContentEditable ||
		// @ts-ignore
		((tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') &&
			!(target as any)?.readOnly)
	) {
		flag = false;
	}
	return flag;
}

// 判断摁下的键是否为某个键，返回true或者false
function isPressed(keyCode: string | number) {
	if (typeof keyCode === 'string') {
		keyCode = code(keyCode); // 转换成键码
	}
	return _downKeys.indexOf(keyCode) !== -1;
}

// 循环删除handlers中的所有 scope(范围)
function deleteScope(scope: string, newScope: string) {
	let handlers;
	let i;

	// 没有指定scope，获取scope
	if (!scope) scope = getScope();

	for (const key in _handlers) {
		if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
			handlers = _handlers[key];
			for (i = 0; i < handlers.length; ) {
				if (handlers[i].scope === scope) handlers.splice(i, 1);
				else i++;
			}
		}
	}

	// 如果scope被删除，将scope重置为all
	if (getScope() === scope) setScope(newScope || 'all');
}

// 清除修饰键
function clearModifier(event: KeyboardEvent) {
	let key = event.keyCode || event.which || event.charCode;
	const i = _downKeys.indexOf(key);

	// 从列表中清除按压过的键
	if (i >= 0) {
		_downKeys.splice(i, 1);
	}
	// 特殊处理 cmmand 键，在 cmmand 组合快捷键 keyup 只执行一次的问题
	if (event.key && event.key.toLowerCase() === 'meta') {
		_downKeys.splice(0, _downKeys.length);
	}

	// 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除
	if (key === 93 || key === 224) key = 91;
	if (key in _mods) {
		_mods[key] = false;

		// 将修饰键重置为false
		for (const k in _modifier)
			if (_modifier[k] === key) {
				// @ts-ignore
				hotkeys[k] = false;
			}
	}
}

function unbind(keysInfo: any, ...args: any) {
	// unbind(), unbind all keys
	if (!keysInfo) {
		Object.keys(_handlers).forEach((key) => delete _handlers[key]);
	} else if (Array.isArray(keysInfo)) {
		// support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
		keysInfo.forEach((info) => {
			if (info.key) eachUnbind(info);
		});
	} else if (typeof keysInfo === 'object') {
		// support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
		if (keysInfo.key) eachUnbind(keysInfo);
	} else if (typeof keysInfo === 'string') {
		// support old method
		// eslint-disable-line
		let [scope, method] = args;
		if (typeof scope === 'function') {
			method = scope;
			scope = '';
		}
		eachUnbind({
			key: keysInfo,
			scope,
			method,
			splitKey: '+'
		});
	}
}

// 解除绑定某个范围的快捷键
// @ts-ignore
const eachUnbind = ({ key, scope, method, splitKey = '+' }) => {
	const multipleKeys = getKeys(key);
	multipleKeys.forEach((originKey: string) => {
		const unbindKeys = originKey.split(splitKey);
		const len = unbindKeys.length;
		const lastKey = unbindKeys[len - 1];
		const keyCode = lastKey === '*' ? '*' : code(lastKey);
		if (!_handlers[keyCode]) return;
		// 判断是否传入范围，没有就获取范围
		if (!scope) scope = getScope();
		const mods = len > 1 ? getMods(_modifier, unbindKeys) : [];
		_handlers[keyCode] = _handlers[keyCode].map((record: any) => {
			// 通过函数判断，是否解除绑定，函数相等直接返回
			const isMatchingMethod = method ? record.method === method : true;
			if (
				isMatchingMethod &&
				record.scope === scope &&
				compareArray(record.mods, mods)
			) {
				return {};
			}
			return record;
		});
	});
};

// 对监听对应快捷键的回调函数进行处理
function eventHandler(event: any, handler: any, scope: string) {
	let modifiersMatch;

	// 看它是否在当前范围
	if (handler.scope === scope || handler.scope === 'all') {
		// 检查是否匹配修饰符（如果有返回true）
		modifiersMatch = handler.mods.length > 0;

		for (const y in _mods) {
			if (Object.prototype.hasOwnProperty.call(_mods, y)) {
				if (
					(!_mods[y] && handler.mods.indexOf(+y) > -1) ||
					(_mods[y] && handler.mods.indexOf(+y) === -1)
				) {
					modifiersMatch = false;
				}
			}
		}

		// 调用处理程序，如果是修饰键不做处理
		if (
			(handler.mods.length === 0 &&
				!_mods[16] &&
				!_mods[18] &&
				!_mods[17] &&
				!_mods[91]) ||
			modifiersMatch ||
			handler.shortcut === '*'
		) {
			const result = handler.method(event, handler);
			if (result === false) {
				if (event.preventDefault) event.preventDefault();
				else event.returnValue = false;
				if (event.stopPropagation) event.stopPropagation();
				if (event.cancelBubble) event.cancelBubble = true;
			}
		}
	}
}

// 处理keydown事件
function dispatch(event: KeyboardEvent) {
	const asterisk = _handlers['*'];
	let key = event.keyCode || event.which || event.charCode;
	// 表单控件过滤 默认表单控件不触发快捷键
	// @ts-ignore
	if (!hotkeys.filter.call(this, event)) return;

	// Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
	// Webkit左右 command 键值不一样
	if (key === 93 || key === 224) key = 91;

	if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
	['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach((keyName) => {
		const keyNum = modifierMap[keyName];
		// @ts-ignore
		if (event[keyName] && _downKeys.indexOf(keyNum) === -1) {
			_downKeys.push(keyNum);
		} else {
			// @ts-ignore
			if (!event[keyName] && _downKeys.indexOf(keyNum) > -1) {
				_downKeys.splice(_downKeys.indexOf(keyNum), 1);
			} else if (
				keyName === 'metaKey' &&
				event[keyName] &&
				_downKeys.length === 3
			) {
				if (!(event.ctrlKey || event.shiftKey || event.altKey)) {
					_downKeys = _downKeys.slice(_downKeys.indexOf(keyNum));
				}
			}
		}
	});
	if (key in _mods) {
		_mods[key] = true;

		// 将特殊字符的key注册到 hotkeys 上
		for (const k in _modifier) {
			if (_modifier[k] === key) {
				// @ts-ignore
				hotkeys[k] = true;
			}
		}

		if (!asterisk) return;
	}

	// 将 modifierMap 里面的修饰键绑定到 event 中
	for (const e in _mods) {
		if (Object.prototype.hasOwnProperty.call(_mods, e)) {
			// @ts-ignore
			_mods[e] = event[modifierMap[e]];
		}
	}
	if (
		event.getModifierState &&
		!(event.altKey && !event.ctrlKey) &&
		event.getModifierState('AltGraph')
	) {
		if (_downKeys.indexOf(17) === -1) {
			_downKeys.push(17);
		}

		if (_downKeys.indexOf(18) === -1) {
			_downKeys.push(18);
		}

		_mods[17] = true;
		_mods[18] = true;
	}

	// 获取范围 默认为 `all`
	const scope = getScope();
	// 对任何快捷键都需要做的处理
	if (asterisk) {
		for (let i = 0; i < asterisk.length; i++) {
			if (
				asterisk[i].scope === scope &&
				((event.type === 'keydown' && asterisk[i].keydown) ||
					(event.type === 'keyup' && asterisk[i].keyup))
			) {
				eventHandler(event, asterisk[i], scope);
			}
		}
	}
	// key 不在 _handlers 中返回
	if (!(key in _handlers)) return;

	for (let i = 0; i < _handlers[key].length; i++) {
		if (
			(event.type === 'keydown' && _handlers[key][i].keydown) ||
			(event.type === 'keyup' && _handlers[key][i].keyup)
		) {
			if (_handlers[key][i].key) {
				const record = _handlers[key][i];
				const { splitKey } = record;
				const keyShortcut = record.key.split(splitKey);
				const _downKeysCurrent = []; // 记录当前按键键值
				for (let a = 0; a < keyShortcut.length; a++) {
					_downKeysCurrent.push(code(keyShortcut[a]));
				}
				const _downKeysCurrent_rep = _downKeysCurrent
					.map((k) => (k === 91 ? 17 : k))
					.sort()
					.join('-');
				const _downKeys_rep = _downKeys
					.filter((k) => k !== 91)
					.map((k) => (k === 91 ? 17 : k))
					.sort()
					.join('-')
					.replaceAll('91', '17');
				_mods[91] = false;
				record.mods = (record.mods || []).map((m: any) => (m === 91 ? 17 : m));
				// 由于 mac 上 command 键 会 自动带上 mate 键 与cmd 键值，导致下面对比的时候有问题，所以此处需要进行判断时做兼容，判断两个同时相等，或者在 command 的时候，将 91 统一修改成 17号键进行对比
				if (_downKeysCurrent_rep === _downKeys_rep) {
					// 找到处理内容
					eventHandler(event, record, scope);
				}
			}
		}
	}
}

// 判断 element 是否已经绑定事件
function isElementBind(element: any) {
	return elementHasBindEvent.indexOf(element) > -1;
}

function hotkeys(key: string, option: any, method: any) {
	_downKeys = [];
	const keys = getKeys(key); // 需要处理的快捷键列表
	let mods = [];
	let scope = 'all'; // scope默认为all，所有范围都有效
	let element = document; // 快捷键事件绑定节点
	let i = 0;
	let keyup = false;
	let keydown = true;
	let splitKey = '+';

	// 对为设定范围的判断
	if (method === undefined && typeof option === 'function') {
		method = option;
	}

	if (Object.prototype.toString.call(option) === '[object Object]') {
		if (option.scope) scope = option.scope; // eslint-disable-line
		if (option.element) element = option.element; // eslint-disable-line
		if (option.keyup) keyup = option.keyup; // eslint-disable-line
		if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line
		if (typeof option.splitKey === 'string') splitKey = option.splitKey; // eslint-disable-line
	}

	if (typeof option === 'string') scope = option;

	// 对于每个快捷键进行处理
	for (; i < keys.length; i++) {
		key = keys[i].split(splitKey); // 按键列表
		mods = [];

		// 如果是组合快捷键取得组合快捷键
		if (key.length > 1) mods = getMods(_modifier, key);

		// 将非修饰键转化为键码
		key = key[key.length - 1];
		// @ts-ignore
		key = key === '*' ? '*' : code(key); // *表示匹配所有快捷键

		// 判断key是否在_handlers中，不在就赋一个空数组
		if (!(key in _handlers)) _handlers[key] = [];
		_handlers[key].push({
			keyup,
			keydown,
			scope,
			mods,
			shortcut: keys[i],
			method,
			key: keys[i],
			splitKey
		});
	}
	// 在全局document上设置快捷键
	if (typeof element !== 'undefined' && !isElementBind(element) && window) {
		elementHasBindEvent.push(element);
		addEvent(element, 'keydown', (e: any) => {
			dispatch(e);
		});
		addEvent(window, 'focus', () => {
			_downKeys = [];
		});
		addEvent(element, 'keyup', (e: any) => {
			dispatch(e);
			clearModifier(e);
		});
	}
}

const _api = {
	setScope,
	getScope,
	deleteScope,
	getPressedKeyCodes,
	isPressed,
	filter,
	unbind
};
for (const a in _api) {
	if (Object.prototype.hasOwnProperty.call(_api, a)) {
		// @ts-ignore
		hotkeys[a] = _api[a];
	}
}

export default hotkeys as unknown as Hotkeys;
