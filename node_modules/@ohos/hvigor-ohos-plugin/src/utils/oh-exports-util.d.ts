/**
 * 打包前改写用户配置的oh-exports字段
 * release混淆har/字节码har/hsp的interface har 有多生成的声明文件，这些声明文件也要加入到 oh-exports 中。
 *
 * @param modulePath 模块路径
 * @param packPath 要打包的产物路径
 * @param ohExports oh-exports
 * @return 返回重写后的oh-exports
 */
export declare function rewriteOhExports(modulePath: string, packPath: string, ohExports: string[]): string[];
/**
 * 搜集 oh-exports 文件的绝对路径，对于文件夹要递归搜集下面所有的文件
 *
 * @param basePath 相对的base路径
 * @param ohExports oh-exports
 */
export declare function collectOhExportsFilePaths(basePath: string, ohExports: string[]): string[];
