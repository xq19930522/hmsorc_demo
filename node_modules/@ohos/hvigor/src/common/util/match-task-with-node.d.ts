export type TaskWithNode = {
    node: string;
    taskName: string;
};
/**
 * 从完整的任务名中解析出节点名和任务名
 * @param {string} fullTaskName - 完整的任务名
 * @return {TaskWithNode | undefined} - 返回一个包含node和taskName的对象，如果解析失败则返回undefined
 */
export declare function matchTaskWithNode(fullTaskName: string): TaskWithNode | undefined;
