/**
 * hvigor-wrapper使用的接口
 */
export { PROJECT_CACHES, WORK_SPACE, PNPM_TOOL, HVIGOR, DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME, CUR_HVIGOR_VERSION } from '../../common/const/const.js';
export type { HvigorConfigJson, PackageJson } from '../../common/type.js';
export { getHvigorUserHomeCacheDir } from '../../common/util/hvigor-user-home.js';
export { calcChildExecArgv } from '../../common/util/cacl-exec-argv-util.js';
export { exit } from '../../base/boot/hooks/exit.js';
export { ParseJsonFile } from '../../common/util/parse-json-file.js';
export { HVIGOR_PROJECT_WRAPPER_HOME, HVIGOR_PROJECT_ROOT_DIR, HVIGOR_USER_HOME, HVIGOR_WRAPPER_TOOLS_HOME, HVIGOR_WRAPPER_PNPM_SCRIPT_PATH, HVIGOR_PNPM_STORE_PATH, } from '../../common/const/path-const.js';
export { calProjectCacheDir } from './util.js';
