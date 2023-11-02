import hotkeys from './Hotkeys';
import { HotkeyConfig } from '../types';

hotkeys.filter = (event) => {
	const target = event.target || (event.srcElement as any);
	const { tagName } = target;
	let flag = event.keyCode > 0;
	if (tagName === 'TEXTAREA' || target.isContentEditable) {
		flag = false;
	}
	return flag;
};

export class HotkeyManager {
	currentScope: string;
	scopeNames: string[];
	map: Map<string, Set<string>>;
	constructor() {
		this.currentScope = '';
		this.scopeNames = [];
		this.map = new Map();
	}

	get scope() {
		return hotkeys.getScope();
	}

	private addScope(scopeName: string, keys: HotkeyConfig[]) {
		const index = this.scopeNames.indexOf(scopeName);
		if (index === -1) {
			this.scopeNames.push(scopeName);
			return;
		} else {
			this.bindHotkeys(keys, scopeName);
			this.activate(scopeName);
		}
	}

	register(keys: HotkeyConfig[], { scopes = [] }) {
		scopes.forEach((scope) => {
			this.bindHotkeys(keys, scope);
		});

		return () => this.unRegister(keys, scopes);
	}

	unRegister(keys: HotkeyConfig[], scopes: string[]) {
		scopes.forEach((scope) => {
			keys.forEach((key) => {
				const { keyName } = key;
				const set = this.map.get(scope) || new Set();
				set.delete(keyName);
				hotkeys.unbind(keyName, scope);
			});
		});
	}

	bind(scopeName: string, keys: HotkeyConfig[]) {
		this.addScope(scopeName, keys);
		this.bindHotkeys(keys, scopeName);
		this.setActiveScope(scopeName);
	}

	unbind(scopeName: string) {
		const removed = scopeName || this.currentScope;
		if (removed === 'all') return;
		if (removed) {
			this.removeScope(removed);
		}
	}
	private removeScope(scope: string) {
		const index = this.scopeNames.indexOf(scope);
		if (index === -1) {
			return;
		}
		hotkeys.deleteScope(scope);
		this.scopeNames.splice(index, 1);
		this.map.delete(scope);
		if (this.currentScope === scope && this.scopeNames.length) {
			const newScope = this.scopeNames[this.scopeNames.length - 1];
			this.activate(newScope);
		}
	}
	private bindHotkeys(keys: HotkeyConfig[], scopeName: string) {
		keys.forEach((key) => {
			const { keyName, onKeyDown } = key;
			const set = this.map.get(scopeName) || new Set();
			if (set.has(keyName)) {
				hotkeys.unbind(keyName, scopeName);
			}
			set.add(keyName);
			this.map.set(scopeName, set);
			hotkeys(keyName, { scope: scopeName }, (event, handler) => {
				return typeof onKeyDown === 'function'
					? onKeyDown(keyName, scopeName, event, handler)
					: false;
			});
		});
	}

	private setActiveScope(scopeName: string) {
		if (scopeName === 'all') return;
		this.currentScope = scopeName;
		hotkeys.setScope(scopeName);
	}

	private setActive(scopeName: string) {
		const index = this.scopeNames.indexOf(scopeName);
		if (index === -1) {
			return;
		}
		this.scopeNames.splice(index, 1);
		this.scopeNames.push(scopeName);
		this.setActiveScope(scopeName);
	}

	activate = (scopeName: string, validator?: () => boolean) => {
		const canExecute = typeof validator === 'function' ? validator() : true;
		if (
			scopeName &&
			canExecute &&
			this.scope !== scopeName &&
			this.map.get(scopeName)
		) {
			this.setActive(scopeName);
		}
	};

	/** 用于立即执行，而非切换scope场景 */
	execActivate = (scopeName: string, validator?: () => boolean) => {
		const canExecute = typeof validator === 'function' ? validator() : true;
		if (scopeName && canExecute && this.map.get(scopeName)) {
			this.setActive(scopeName);
		}
	};
}

export const hotkeyManager = /*@__PURE__*/ new HotkeyManager();
