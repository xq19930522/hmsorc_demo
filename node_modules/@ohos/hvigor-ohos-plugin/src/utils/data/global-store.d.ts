/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2026. All rights reserved.
 */
/**
 * 采用nodejs的require()模块的单例加载机制实现通用数据的共享
 */
declare class GlobalDataStore {
    private static instance;
    private store;
    constructor();
    set(key: string, value: any): GlobalDataStore;
    get(key: string): any;
    static getInstance(): GlobalDataStore;
}
declare const _default: GlobalDataStore;
export default _default;
