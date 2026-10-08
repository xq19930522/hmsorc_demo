import { Snapshot } from '../core/snapshot.js';
/**
 * 构建信息快照生成器
 *
 */
export interface BuildInfoSnapshotGenerator {
    /**
     * 根据json字符串生成快照map
     *
     * @param text
     */
    loadSnapshotCacheFromJson(text: string): Map<string, Snapshot>;
    /**
     * 将快照map序列化为json字符串
     */
    serializeSnapshotCacheToJson(): string;
}
