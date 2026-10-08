export interface ExtraInfo {
    infoMsg?: string;
    warnMsg?: string;
}
/**
 * 抛出去的错误对象 + 额外信息
 */
export declare class ExtendedErrorInfo extends Error {
    extraInfo: ExtraInfo | undefined;
    constructor(message?: string, extraInfo?: ExtraInfo, stack?: string);
}
