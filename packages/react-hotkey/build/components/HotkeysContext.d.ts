import React from 'react';
import { HotkeyManager } from '../utils';
export interface HotkeysContextInstance {
    hotkeyManager: HotkeyManager;
}
export declare const HotkeysContext: React.Context<HotkeysContextInstance>;
