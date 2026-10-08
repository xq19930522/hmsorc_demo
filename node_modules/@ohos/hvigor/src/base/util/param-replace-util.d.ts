/**
 * 递归替换对象中的占位符
 */
export declare class ReplacePlaceHolderUtil {
    private readonly _log;
    private static instance;
    /**
     *  获取单例 防止重复创建logger
     */
    static getInstance(): ReplacePlaceHolderUtil;
    replacePlaceholders(obj: any, params: Record<string, string>): any;
    /**
     * 替换 buildProfileFields 对象中的占位符
     */
    private replaceBuildProfileFields;
    /**
     * 替换字符串数组中的字符串占位符
     */
    private replacePathArray;
    /**
     * 替换字符串中的路径占位符
     * 格式: @param:path.to.property
     * 会从 params 对象中按路径逐级取值
     */
    private replaceStringPlaceholders;
    /**
     * 根据路径从对象中取值
     * 支持多级路径，如: "buildProfileFields.buildOptionSetData"
     */
    private getValueByPath;
}
