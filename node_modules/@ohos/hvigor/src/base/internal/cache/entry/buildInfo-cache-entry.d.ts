import { CacheEntry } from './cache-entry.js';
import { Snapshot } from '../../snapshot/core/snapshot.js';
/**
 * 包装构建信息SnapShot的实例
 *
 */
export declare class BuildInfoCacheEntry extends CacheEntry<Snapshot> {
    constructor(key: string, buildInfoSnapShot: Snapshot);
}
