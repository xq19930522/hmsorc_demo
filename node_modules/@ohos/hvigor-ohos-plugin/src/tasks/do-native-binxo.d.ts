import { TaskInputValue } from '@ohos/hvigor';
import { AbstractNativeStrip } from './abstract/abstract-native-strip.js';
import { TargetTaskService } from './service/target-task-service.js';
export declare class DoNativeBinxo extends AbstractNativeStrip {
    private _log;
    declareInputs(): Map<string, TaskInputValue>;
    private get doBinxoNativeLibs();
    constructor(targetService: TargetTaskService);
    protected doTaskAction(): Promise<void>;
    initTaskDepends(): void;
}
