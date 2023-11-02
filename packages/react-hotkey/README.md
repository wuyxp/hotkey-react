# 在 React 项目中优雅使用快捷键
提供了类组件模式和函数式组件模式用法
本插件可以解决，在 react 项目中，对于基础组件，业务组件，form 表单等，对快捷键有负责特殊需求的一个解决方案，它能很简便的应用到你 react 项目之中，同时为应对更加复杂的交互场景，提供出 快捷键控制器，可以在任何地方获取到并且可以将快捷键权限交付到任何一个想生效的位置

## 核心概念
`scope` 快捷键作用域，可以控制一批快捷键是否生效，全局的 scope 是 all
`hotkeyManager` 快捷键管理器


## 下面是实例代码

```tsx
// 根节点
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
      <HotkeysProvider>
        <HotkeyFunDemo></HotkeyFunDemo>
        <HotkeyClassDemo></HotkeyClassDemo>
      </HotkeysProvider>
    </div>
  );
};
```


```tsx
// 类组件
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
    const hotkeyManage = (this.props as any).hotkeyManager as HotkeyManager;
    console.log('hotkeyManage', hotkeyManage.currentScope);
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
```

```tsx
// 函数式组件
import {
  createHotkeyScope,
  useHotkeysManager,
  HotkeysProvider,
  HotkeysTarget,
  withHotKeys,
  useHotkeysManager
} from 'react-hotkey';

import React, { memo, useMemo } from "react";

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

```

## 使用者需要关注如下几个对象

1. `HotkeysProvider` 需要再最外层包裹上，不需要传参数
2. `HotkeysTarget` 在需要快捷键的组件上包裹上，参数如下

    1. hotkeys?: HotkeyConfig[]; 快捷键相关配置
    2. scopeName?: string; 当前组件的作用域， 如果是 'all' 则快捷键一直生效
    3. autoActive?: boolean; 组件加载时自动生效当前的快捷组键
    4. className?: string; 快捷键这层 class
    5. style?: React.CSSProperties; 快捷键这层 style
    6. enableHotkey?: boolean; 是否开启快捷键
    7. containerRef?: React.MutableRefObject<HTMLElement>; containerRef 指定 容器生效位置

3. `HotkeyConfig` 配置
   ```ts
    interface HotkeyConfig{
      keyName: string;
      onKeyDown: (keyName: string, scopeName: string, event: KeyboardEvent, handler: HotkeysEvent) => void;
    }
    ```
   
   keyName 可以参考如下配置，可以使用单键，或者组合键
    
    ```ts
    let CTRL_KEY = isMacOS() ? 'command' : 'control';

    export const HOTKEY_MAPPING = {
     left: 'left',
    right: 'right',
       up: 'up',
     down: 'down',
      esc: 'esc',
    space: 'space',
    enter: 'enter',
      tab: 'tab',
   selectCell: 'up,down,left,right',
    undo: `${CTRL_KEY}+z`,
    redo: `${CTRL_KEY}+shift+z`,
    } as const;

   ```

4. hotkeyManager 快捷键控制器
   > 当遇到场景比较复杂的快捷键时，只用组件就无法精确控制快捷键的焦点在哪里生效
