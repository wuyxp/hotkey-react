import { PureComponent } from 'react';
import { HotkeyManager } from '../utils';
import { HotkeysProviderProps } from '../types';
export declare const createHotkeyScope: (key?: string) => string;
export declare class HotkeysProvider extends PureComponent<HotkeysProviderProps, any> {
    hotkeyManager: HotkeyManager;
    constructor(props: HotkeysProviderProps);
    render(): import("react/jsx-runtime").JSX.Element;
}
export declare const withHotKeys: (Component: any) => (props: any) => import("react/jsx-runtime").JSX.Element;
