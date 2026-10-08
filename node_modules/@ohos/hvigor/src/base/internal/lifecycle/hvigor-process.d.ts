/// <reference types="node" />
import EventEmitter from 'events';
import { HvigorLogger } from '../../log/hvigor-log.js';
declare class HvigorBuildProcess extends EventEmitter {
    taskBeginTime: [number, number] | undefined;
    hasTaskDone: boolean;
    constructor();
    /**
     * 初始化hvigorProcess,包括创建监听等
     *
     */
    init(): void;
    startProcessMonitor(): void;
    /**
     * 开始启动hvigorProcess的生命周期执行
     *
     */
    setTaskBeginTime(): void;
    /**
     * hvigor process正常结束
     *
     */
    close(): void;
    /**
     * hvigor process异常结束
     *
     */
    error(error: Error, taskLog?: HvigorLogger): void;
    /**
     * 兜底对错误信息给出解决方案和错误码
     * @param error
     * @private
     */
    private getErrorMessageWithSolution;
    /**
     * 获取脱敏后的projectConfig
     * @private
     */
    private getAnonymizedProjectConfig;
    /**
     * 获取脱敏后的堆栈
     * @param error
     * @private
     */
    private getAnonymizedStack;
}
export declare const hvigorProcess: HvigorBuildProcess;
export {};
