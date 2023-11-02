import React, { Component, PureComponent } from 'react';

import { HotkeyManager } from '../utils';

import { HotkeysContext } from './HotkeysContext';
import { HotkeysProviderProps } from '../types';

export const createHotkeyScope = (key?: string) => {
	const str = Math.random().toString(32).slice(2);
	return key ? `[${key}]-${str}` : str;
};
export class HotkeysProvider extends PureComponent<HotkeysProviderProps, any> {
	hotkeyManager: HotkeyManager;
	constructor(props: HotkeysProviderProps) {
		super(props);
		this.hotkeyManager = new HotkeyManager();
	}

	render() {
		return (
			<HotkeysContext.Provider
				value={{
					hotkeyManager: this.hotkeyManager
				}}
			>
				{this.props.children}
			</HotkeysContext.Provider>
		);
	}
}

export const withHotKeys = (Component: any) => {
	return (props: any) => (
		<HotkeysContext.Consumer>
			{(context) => (
				<Component {...props} hotkeyManager={context.hotkeyManager} />
			)}
		</HotkeysContext.Consumer>
	);
};
