/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2026. All rights reserved.
 */
export declare class AnonymizeProjectConfig {
    private readonly PROJECT_CONFIG_KEYS;
    private projectConfigRaw;
    anonymizeProjectConfig(projectConfig?: {
        [k: string]: any;
    }): {
        [k: string]: any;
    };
    /**
     * ArkTS工程，获取脱敏后的projectConfig对象
     * @private
     */
    private getAnonymizedProjectConfigArkTS;
}
