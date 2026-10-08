import { Component } from '@ohos/sdkmanager-common';
import { SdkComponent } from '../superior/sdk-component.js';
export declare class HmsCoreNativeComponent extends SdkComponent {
    private readonly _binxoTool;
    constructor(component: Component);
    getHmsToolchainFile(): string;
    getHmsBiShengToolchainFile(): string;
    getSdkBinxoTool(): string;
}
