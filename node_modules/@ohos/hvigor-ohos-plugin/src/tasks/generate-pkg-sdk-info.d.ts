import { FileSet, TaskInputValue } from '@ohos/hvigor';
import { TargetTaskService } from './service/target-task-service.js';
import { OhosHapTask } from './task/ohos-hap-task.js';
export declare class GeneratePkgSdkInfo extends OhosHapTask {
    private pkgSdkInfoMap;
    private pkgSdkInfoPath;
    constructor(taskService: TargetTaskService);
    private get useNormalizedOHMUrl();
    beforeAlwaysAction(): Promise<void>;
    protected beforeTask(): void;
    declareInputs(): Map<string, TaskInputValue>;
    declareOutputFiles(): FileSet;
    taskShouldDo(): boolean;
    protected doTaskAction(): void;
    initTaskDepends(): void;
    private initPkgSdkInfo;
    private getVersion;
}
