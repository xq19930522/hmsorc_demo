import hilog from "@ohos:hilog";
const DOMAIN: number = 0x0001;
const TAG: string = 'OcrDemo';
/**
 * 统一日志封装
 */
export class Logger {
    static info(message: string): void {
        hilog.info(DOMAIN, TAG, '%{public}s', message);
    }
    static warn(message: string): void {
        hilog.warn(DOMAIN, TAG, '%{public}s', message);
    }
    static error(message: string): void {
        hilog.error(DOMAIN, TAG, '%{public}s', message);
    }
}
