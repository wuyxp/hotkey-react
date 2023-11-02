import React, { createRef, PureComponent } from 'react';

import { HotkeyManager } from '../utils';

import { HotkeysContext, HotkeysContextInstance } from './HotkeysContext';
import { HotkeysTargetProps } from '../types';

export class HotkeysTarget extends PureComponent<HotkeysTargetProps, any> {
	static displayName = 'HotkeysTarget';
	displayName = 'HotkeysTarget';
	currentContainerRef = createRef<HTMLDivElement>();
	static contextType = HotkeysContext;
	scopeName: string;
	hotkeyManager: HotkeyManager;

	constructor(props: HotkeysTargetProps, context: HotkeysContextInstance) {
		super(props);
		this.scopeName =
			this.props.scopeName ?? Math.random().toString(32).slice(2);
		this.hotkeyManager = context.hotkeyManager;

		if (!props.enableHotkey) return;
	}

	static defaultProps = {
		enableHotkey: true
	};

	componentDidMount() {
		this.initHotkeyManager();
	}

	componentDidUpdate() {
		this.initHotkeyManager();
	}

	isScopeAll = () => {
		return this.scopeName === 'all';
	};

	initHotkeyManager = () => {
		if (!this.props.enableHotkey) {
			return false;
		}
		if (typeof this.hotkeyManager === 'undefined') {
			console.error(
				`HotkeysTarget 组件必须在 HotkeysProvider 的包裹下使用，请检查是否使用了【${(
					this.props.children as any
				)?.displayName}】外部是否包含【HotkeysProvider】组件`
			);
		} else {
			this.hotkeyManager.unbind(this.scopeName);
			const { hotkeys = [] } = this.props;
			this.hotkeyManager.bind(this.scopeName, hotkeys);
			if (this.props.autoActive) {
				setTimeout(() => {
					if (this.isScopeAll()) return;
					this.hotkeyManager.execActivate(this.scopeName);
				}, 20);
			}
		}

		// 如果外部传入了 container Ref ，需要走一个延迟，等外部将容器渲染好后，再进行绑定
		if (this.props.containerRef) {
			setTimeout(() => {
				if (this.isScopeAll()) return;
				this.props.containerRef?.current?.addEventListener?.(
					'click',
					this.activeScope
				);
			}, 100);
		}
	};

	override componentWillUnmount() {
		if (!this.props.enableHotkey) {
			return;
		}
		// 解绑的时候，只需要判断外部是否传入 container 即可，因为外部卸载的时候，必然是有元素的。
		if (this.props.containerRef) {
			this.props.containerRef?.current?.removeEventListener?.(
				'click',
				this.activeScope
			);
		}
		this.hotkeyManager?.unbind?.(this.scopeName);
	}

	activeScope = () => {
		if (this.isScopeAll()) return;
		this.hotkeyManager?.activate?.(this.scopeName);
	};
	containerFocus = () => {
		this.currentContainerRef?.current?.setAttribute('tabIndex', '-1');
		this.currentContainerRef?.current?.focus();
	};

	render() {
		const { style, className, containerRef, children } = this.props;

		if (containerRef) {
			return children;
		}
		return (
			<div
				onClick={this.activeScope}
				style={style}
				ref={this.currentContainerRef}
				className={className}
			>
				{this.props.children}
			</div>
		);
	}
}
