export { replacer } from './src/common/util/replacer.js';
export { hvigor } from './src/base/external/core/hvigor.js';
export { BuildResult } from './src/base/external/models/build-result.js';
export { getNode } from './src/base/external/core/hvigor-core.js';
export { hvigorConfig } from './src/base/external/core/hvigor-config.js';
export { FileUtil } from './src/common/util/hvigor-file-util.js';
export { TaskInput, TaskOutput } from './src/base/external/api/hvigor-api.js';
export type { HvigorPlugin, HvigorNode, HvigorTask, Task } from './src/base/external/api/hvigor-api.js';
/** 对外提供hvigor自定义任务可以使用线程池的能力 */
export { submitWorker, WorkerOption } from './src/base/external/worker/worker.js';
export { Priority } from './src/base/internal/pool/enum/priority.js';
export { TCB } from './src/base/internal/pool/model/tcb.js';
