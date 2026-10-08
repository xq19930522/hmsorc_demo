/**
 * 解析JSON/JSON5文件
 *
 * @param filePath json文件路径
 * @param location 是否携带位置信息
 * @param encoding
 */
export declare class ParseJsonFile {
    static parseJsonFile(filePath: string, location?: boolean, encoding?: string): any;
}
/**
 * 防止其他库如arkuix引用导致版本不同引发的报错
 * @param filePath
 * @param location
 * @param encoding
 */
export declare function parseJsonFile(filePath: string, location?: boolean, encoding?: string): any;
