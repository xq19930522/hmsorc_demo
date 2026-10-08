import { HvigorCoreNode } from '../../../external/core/hvigor-core-node.js';
import { IncrementalTask } from '../../../external/task/incremental-task.js';
import { FileSet } from '../../../internal/snapshot/util/file-set.js';
import { TaskInputValue } from '../../../internal/snapshot/util/task-input-value-entry.js';
import { HvigorTask, HvigorTaskContext } from '../interface/hvigor-task.js';
/**
 * hvigorTask转换为CoreTask
 *
 * @since 2023/12/20
 */
export declare class TransformHvigorTask extends IncrementalTask {
    private logger;
    private _inputs;
    private _inputFiles;
    private _outputFiles;
    protected task: HvigorTask;
    protected taskContext: any;
    protected taskRunContext: HvigorTaskContext;
    constructor(node: HvigorCoreNode, task: HvigorTask);
    initTaskContext(): void;
    /**
     * 初始化任务依赖关系
     * 支持两种格式的依赖初始化方式
     * 1. node:target@task 或 node:task
     * 2. target@task 或 task
     * @return {void}
     */
    initDependency(): void;
    /** 通过设置postDependency，将自定义任务挂上任务执行流程
     * 支持两种格式的依赖初始化方式
     * 1. node:target@task 或 node:task
     * 2. target@task 或 task
     * @param postDependency 后置依赖
     * @param taskName 前置依赖
     */
    initPostDependencyTask(postDependency: string, taskName: string): void;
    initTaskRun(): void;
    getAction(): Function;
    doTaskAction(): Promise<void>;
    getTaskParam(): HvigorTaskContext;
    declareInputs(): Map<string, TaskInputValue>;
    declareInputFiles(): FileSet;
    declareOutputFiles(): FileSet;
}
