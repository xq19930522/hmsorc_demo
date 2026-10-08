import { DefaultCacheService } from './default-cache-service.js';
import { Snapshot } from '../../snapshot/core/snapshot.js';
import { BuildInfoCacheEntry } from '../entry/buildInfo-cache-entry.js';
/**
 * 提供获取构建信息缓存快照的统一服务接口
 *
 *
 */
export declare class BuildInfoCacheService extends DefaultCacheService<Snapshot> {
    private readonly _buildInfoCachePath;
    constructor(buildInfoCachePath: string);
    set(key: string, entryContent: Snapshot): BuildInfoCacheEntry;
    initialize(): void;
}
