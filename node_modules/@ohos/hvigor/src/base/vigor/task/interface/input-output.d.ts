import { FileSet } from '../../../internal/snapshot/util/file-set.js';
import { TaskInputValue } from '../../../internal/snapshot/util/task-input-value-entry.js';
export declare class TaskInput {
    private declareInputs;
    private declareInputFiles;
    file(path: string): TaskInput;
    private _file;
    files(paths: string[]): TaskInput;
    private _files;
    property(key: string, value: TaskInputValue): TaskInput;
    private _property;
}
export declare class TaskOutput {
    private declareOutputFiles;
    constructor(declareOutputFiles: FileSet);
    file(path: string): TaskOutput;
    private _file;
    files(paths: string[]): TaskOutput;
    private _files;
}
