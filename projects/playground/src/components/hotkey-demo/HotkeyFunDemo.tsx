/**
 * @Author: wuyang
 * @Date: 2023/11/2
 * @Description: ""
 */

import {
	createHotkeyScope,
	useHotkeysManager,
	HotkeysProvider,
	HotkeysTarget,
	withHotKeys,
	HotkeyConfig
} from 'react-hotkey';
import React, { memo, useMemo } from 'react';

export const HotkeyFunDemo = memo(() => {
	const scopeName = useMemo(() => {
		return createHotkeyScope();
	}, []);
	const hotkeyConfig = useMemo(() => {
		return [
			{
				keyName: 'a',
				onKeyDown: () => {
					console.log('on key down');
				}
			}
		] as HotkeyConfig[];
	}, []);

	const { hotkeyManager } = useHotkeysManager();
	console.log('hotkeyManager', hotkeyManager.currentScope);
	return (
		<HotkeysTarget hotkeys={hotkeyConfig} scopeName={scopeName}>
			<div style={{ width: 200, height: 200, border: '1px solid' }}>
				点击我触发 函数组件的快捷键
			</div>
		</HotkeysTarget>
	);
});
