import React from 'react';

export interface HotkeyConfig {
	keyName: string;
	onKeyDown: (
		keyName: string,
		scopeName: string,
		event: KeyboardEvent,
		handler: HotkeysEvent
	) => void;
}

export interface HotkeysEvent {
	key: string;
	method: KeyHandler;
	mods: number[];
	scope: string;
	shortcut: string;
}

export interface KeyHandler {
	(keyboardEvent: KeyboardEvent, hotkeysEvent: HotkeysEvent): void | boolean;
}

export type Options = {
	scope?: string;
	element?: HTMLElement | null;
	keyup?: boolean | null;
	keydown?: boolean | null;
	splitKey?: string;
};

export interface Hotkeys {
	(key: string, method: KeyHandler): void;
	(key: string, scope: string, method: KeyHandler): void;
	(key: string, options: Options, method: KeyHandler): void;

	shift: boolean;
	ctrl: boolean;
	alt: boolean;
	option: boolean;
	control: boolean;
	cmd: boolean;
	command: boolean;

	setScope(scopeName: string): void;
	getScope(): string;
	deleteScope(scopeName: string): void;

	noConflict(): Hotkeys;

	unbind(key?: string): void;
	unbind(key: string, scopeName: string): void;
	unbind(key: string, scopeName: string, method: KeyHandler): void;
	unbind(key: string, method: KeyHandler): void;

	isPressed(keyCode: number): boolean;
	isPressed(keyCode: string): boolean;
	getPressedKeyCodes(): number[];

	filter(event: KeyboardEvent): boolean;
}

export interface HotkeysProviderProps {
	children: React.ReactNode;
}

export interface HotkeysTargetProps {
	children: React.ReactNode;
	hotkeys?: HotkeyConfig[];
	scopeName?: string;
	/**
	 * autoActive 组件加载时自动生效当前的快捷组键
	 */
	autoActive?: boolean;
	className?: string;
	style?: React.CSSProperties;
	enableHotkey?: boolean;
	/**
	 * containerRef 指定 容器生效位置
	 */
	containerRef?: React.MutableRefObject<HTMLElement>;
}
