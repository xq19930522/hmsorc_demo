/**
 * 设置daemon进程execArgv属性
 * @restartByConfigChange: 是否是hvigor-config文件触发的计算
 */
export declare function calcChildExecArgv(trigByConfigChange?: boolean): string[];
