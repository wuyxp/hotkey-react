import React from 'react';

import {
	createHotkeyScope,
	useHotkeysManager,
	HotkeysProvider,
	HotkeysTarget,
	withHotKeys
} from 'react-hotkey';
import type { HotkeyConfig } from 'react-hotkey';
export class HotkeyClassDemoContainer extends React.PureComponent {
	scopeName: string = createHotkeyScope('HotkeyClassDemo');
	hotkeyConfig: HotkeyConfig[] = [
		{
			keyName: 'a',
			onKeyDown: () => {
				console.log('on key down');
			}
		}
	];
	render() {
		return (
			<HotkeysTarget hotkeys={this.hotkeyConfig} scopeName={this.scopeName}>
				<div style={{ width: 200, height: 200, border: '1px solid' }}>
					点击我触发 类组件的快捷键
				</div>
			</HotkeysTarget>
		);
	}
}

export const HotkeyClassDemo = withHotKeys(HotkeyClassDemoContainer);
