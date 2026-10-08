import { Hvigor } from '../../base/external/core/hvigor.js';
import { HvigorConfig } from '../../base/external/core/hvigor-config.js';
import { BuildResult } from '../../base/external/models/build-result.js';
import { HvigorNode } from '../../base/vigor/plugin/interface/hvigor-node.js';
export declare enum HookType {
    configEvaluated = "configEvaluated",
    nodesInitialized = "nodesInitialized",
    beforeNodeEvaluate = "beforeNodeEvaluate",
    afterNodeEvaluate = "afterNodeEvaluate",
    nodesEvaluated = "nodesEvaluated",
    taskGraphResolved = "taskGraphResolved",
    buildFinished = "buildFinished",
    onWatchWorkerMessage = "onWatchWorkerMessage"
}
export interface HookArgMap {
    [HookType.configEvaluated]: HvigorConfig;
    [HookType.nodesInitialized]: Hvigor;
    [HookType.beforeNodeEvaluate]: HvigorNode;
    [HookType.afterNodeEvaluate]: HvigorNode;
    [HookType.nodesEvaluated]: Hvigor;
    [HookType.taskGraphResolved]: Hvigor;
    [HookType.buildFinished]: BuildResult;
    [HookType.onWatchWorkerMessage]: any;
}
