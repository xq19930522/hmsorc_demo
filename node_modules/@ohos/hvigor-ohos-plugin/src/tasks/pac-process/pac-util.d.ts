import { PacFile } from './data-structure.js';
/**
 * 检查pac.json是否包含必选字段, 当前规格为'dataProcess', 'specialAPIs'其中之一
 *
 * @param filePath
 */
export declare function checkPacJsonRequiredFields(filePath: string): boolean;
export declare function checkPacJsonExistAndGetObj(pacPath: string): PacFile | undefined;
export declare function pacFileValidate(moduleName: string, originalPacJsonPath: string, pacSchemaPath: string): boolean;
