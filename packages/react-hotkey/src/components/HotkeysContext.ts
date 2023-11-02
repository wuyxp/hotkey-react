import React from 'react';

import { HotkeyManager } from '../utils';

export interface HotkeysContextInstance {
	hotkeyManager: HotkeyManager;
}
const hotkeyManager = new HotkeyManager();
export const HotkeysContext = React.createContext<HotkeysContextInstance>({
	hotkeyManager
});
