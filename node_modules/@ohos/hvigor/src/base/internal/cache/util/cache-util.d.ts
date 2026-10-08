import { HvigorCoreNode } from '../../../external/core/hvigor-core-node.js';
/**
 * 提供保存任务缓存快照时一个全局唯一的key
 *
 * @param {string} taskName
 * @param {HvigorNode} node
 * @return {string}
 */
export declare function getTaskSnapCacheEntryUniqueKey(taskName: string, node: HvigorCoreNode): string;
