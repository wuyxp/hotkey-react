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
	withHotKeys
} from 'react-hotkey';

import { HotkeyFunDemo } from './HotkeyFunDemo';
import { HotkeyClassDemo } from './HotkeyClassDemo';
export const HotkeyDemo = () => {
	return (
		<div>
			hotkeyDemo
			<HotkeysProvider>
				<HotkeyFunDemo></HotkeyFunDemo>
				<HotkeyClassDemo></HotkeyClassDemo>
			</HotkeysProvider>
		</div>
	);
};
