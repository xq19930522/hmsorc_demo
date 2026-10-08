import { CoreTask } from '../../../external/task/core-task.js';
import { Task } from '../interface/task.js';
/**
 * 对外提供的Task视图接口实现
 */
export declare class TaskImpl implements Task {
    private readonly task;
    constructor(task: CoreTask);
    getDependencies(): string[];
    getDependenciesInternal(): string[];
    private _getDependencies;
    getName(): string;
    getNameInternal(): string;
    private _getName;
    setEnable(enable: boolean): void;
    setEnableInternal(enable: boolean): void;
    private _setEnable;
    beforeRun(fn: Function): void;
    beforeRunInternal(fn: Function): void;
    private _beforeRun;
    afterRun(fn: Function): void;
    afterRunInternal(fn: Function): void;
    private _afterRun;
}
