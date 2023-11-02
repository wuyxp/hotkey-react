import { HotkeyConfig } from '../types';
export declare class HotkeyManager {
    currentScope: string;
    scopeNames: string[];
    map: Map<string, Set<string>>;
    constructor();
    get scope(): string;
    private addScope;
    register(keys: HotkeyConfig[], { scopes }: {
        scopes?: never[] | undefined;
    }): () => void;
    unRegister(keys: HotkeyConfig[], scopes: string[]): void;
    bind(scopeName: string, keys: HotkeyConfig[]): void;
    unbind(scopeName: string): void;
    private removeScope;
    private bindHotkeys;
    private setActiveScope;
    private setActive;
    activate: (scopeName: string, validator?: () => boolean) => void;
    /** 用于立即执行，而非切换scope场景 */
    execActivate: (scopeName: string, validator?: () => boolean) => void;
}
export declare const hotkeyManager: HotkeyManager;
