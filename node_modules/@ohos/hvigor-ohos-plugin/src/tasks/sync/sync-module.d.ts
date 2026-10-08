import { DefaultSyncTask, Module, TaskDetails } from '@ohos/hvigor';
/**
 * Module级别的Sync任务
 *
 * @since 2022/2/19
 */
export declare class SyncModule extends DefaultSyncTask {
    private readonly isFaMode;
    constructor(module: Module, taskName: string | TaskDetails, isFaMode: boolean);
    registryAction: () => Function;
}
