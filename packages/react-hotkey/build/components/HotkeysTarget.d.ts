import React, { PureComponent } from 'react';
import { HotkeyManager } from '../utils';
import { HotkeysContextInstance } from './HotkeysContext';
import { HotkeysTargetProps } from '../types';
export declare class HotkeysTarget extends PureComponent<HotkeysTargetProps, any> {
    static displayName: string;
    displayName: string;
    currentContainerRef: React.RefObject<HTMLDivElement>;
    static contextType: React.Context<HotkeysContextInstance>;
    scopeName: string;
    hotkeyManager: HotkeyManager;
    constructor(props: HotkeysTargetProps, context: HotkeysContextInstance);
    static defaultProps: {
        enableHotkey: boolean;
    };
    componentDidMount(): void;
    componentDidUpdate(): void;
    isScopeAll: () => boolean;
    initHotkeyManager: () => false | undefined;
    componentWillUnmount(): void;
    activeScope: () => void;
    containerFocus: () => void;
    render(): string | number | boolean | Iterable<React.ReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
}
