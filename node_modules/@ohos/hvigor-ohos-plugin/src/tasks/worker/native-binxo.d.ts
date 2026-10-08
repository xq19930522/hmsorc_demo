export interface BinxoOptions {
    excludeSoFromBinxo: string[];
    intermediatesLibs: string;
    sdkBinxoPath: string;
    binxoNativeLibs: string;
    moduleName: string;
    taskName: string;
    cacheFilePath: string;
    lastCache: string;
    collectAllLibs: boolean | undefined;
}
export declare function binxo(binxoOptions: BinxoOptions): Promise<void>;
