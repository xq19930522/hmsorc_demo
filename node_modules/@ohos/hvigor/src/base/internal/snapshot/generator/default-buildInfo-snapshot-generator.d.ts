import { BuildInfoSnapshotGenerator } from './buildInfo-snapshot-generator.js';
import { Snapshot } from '../core/snapshot.js';
/**
 *  构建信息快照生成器
 */
export declare class DefaultBuildInfoSnapshotGenerator implements BuildInfoSnapshotGenerator {
    loadSnapshotCacheFromJson(text: string): Map<string, Snapshot>;
    serializeSnapshotCacheToJson(): string;
}
