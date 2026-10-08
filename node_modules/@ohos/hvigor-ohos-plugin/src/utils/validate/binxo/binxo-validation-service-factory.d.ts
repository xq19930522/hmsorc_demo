import { TargetTaskService } from '../../../tasks/service/target-task-service.js';
import { BinxoValidationService } from './binxo-validation-service.js';
/**
 * BinxoValidationService 的简单工厂类，负责创建 BinxoValidationService 实例
 *
 * @since 2026/03/05
 */
export declare class BinxoValidationServiceFactory {
    /**
     * 创建新的 BinxoValidationService 实例
     *
     * @param targetService
     * @returns BinxoValidationService 实例
     */
    static createBinxoValidationService(targetService: TargetTaskService): BinxoValidationService;
}
