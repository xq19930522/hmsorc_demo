<div style="text-align: center;font-size: xxx-large" >Hvigor</div>
<div style="text-align: center">A new automated build tool for OpenHarmonyOS application</div>

## Hvigor是什么?
***
- Hvigor是基于任务管理机制实现的一款全新的自动化构建工具，主要提供任务注册编排，编译工程模型管理，编译配置定制,插件扩展等核心能力，当前主要面向OpenHarmonyOS应用JS/eTS开发场景。
- Hvigor结构化模型：hvigor工程主要以build-profile.json5与hvigorfile.ts组成
```
rootProject                        // Hvigor工程根目录
├── build-profile.json5            // 工程级别Hvigor配置，主要配置工程相关信息，包括子模块名字、路径等。
├── hvigorfile.ts                  // 工程级别任务脚本，当前暂不支持自定义
├── moduleA
│   ├── build-profile.json5  // 模块级别Hvigor配置，主要模块构建相关参数
│   └── hvigorfile.ts        // 模块级别任务脚本，当前暂不支持自定义
└── moduleB
    ├── build-profile.json5       // 模块级别Hvigor配置，主要模块构建相关参数
    └── hvigorfile.ts             // 模块级别任务脚本，当前暂不支持自定义
```

## 安装使用
***
- hvigor命令行

  运行命令行的结构
    ```shell
     hvigorw [taskName...] [--option-name]
    ```
  详细参数：
    ```shell
        Usage: hvigor [options]
        Options:
        --version, -v  Print the global and local vigor versions.            [boolean]
        --cwd          Manually set the CWD. The search for the vigorfile, as well as
                       the relativity of all requires will be from here.      [string]
        --require      Will require a module before running the vigorfile. This is
                       useful for transpilers but also has other applications.[string]
        --prop, -p     Define extra properties.                               [string]
        --mode, -m     Specifies the mode in which the command is currently executed.[string]
        --sync, -s     Sync the information in plugin for other platform.    [boolean]
        --error, -e    Log errors only.                                      [boolean]
        --warn, -w     Set log level to warn.                                [boolean]
        --info, -i     Set log level to info.                                [boolean]
        --debug,-d     Set log level to debug.                               [boolean]
    ```
## 约束
***
    node版本要求： v18.20.1以及以上版本
