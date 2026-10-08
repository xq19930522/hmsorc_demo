/// <reference types='node' />

declare enum AnalyzeMode {
    NORMAL = 0,
    ADVANCED = 1,
    FALSE = 2,
    TRACE = 3
}


declare class BaseEvent {
    protected head: EventHead;
    protected body: EventBody;
    protected additional: EventAdditional;
    constructor(head: EventHead, body: EventBody);
    setStartTime(time?: number): void;
    setEndTime(time?: number): void;
    setTotalTime(time: number): void;
    getId(): string;
    getName(): string;
    getDescription(): string;
    setName(name: string): void;
    getType(): MetricEventType;
    setType(type: MetricEventType): void;
    getTid(): string;
    setTid(tid: string): this;
}

/**
 * 快照抽象基类
 *
 * @since 2022/9/1
 */
declare abstract class BasicFileSnapshot extends Snapshot {
    hashValue: string;
    name: string;
    path: string;
    type: FileType;
    isSymbolicLink: boolean;
    constructor(name?: string, path?: string, type?: FileType, isSymbolicLink?: boolean);
    /**
     * accept
     *
     * @param visitor
     */
    abstract accept(visitor: FileSystemSnapshotHierarchyVisitor): SnapshotVisitResult;
    /**
     * Generator 生成器 ，Depth First order
     */
    abstract walk(): IterableIterator<BasicFileSnapshot>;
    /**
     * equals
     *
     * @param other
     */
    abstract equals(other: BasicFileSnapshot): boolean;
    /**
     * isHashEquals
     *
     * @param other
     */
    isHashEquals(other: BasicFileSnapshot): boolean;
    /**
     * toJsonString
     */
    toJsonString(): string;
    [Symbol.iterator](): IterableIterator<BasicFileSnapshot>;
}

/**
 * 定义构建结果类
 */
export declare class BuildResult {
    private error;
    private report;
    constructor(error: Error | null, report?: any);
    getError(): Error | null;
    private _getError;
    getReportJson(): any;
    private _getReportJson;
}

/**
 * 基础容器类,可以将不同类型的T包装起来，并提供一些通用方法和建立容器之间的关系
 *
 * @since 2022/9/1
 */
declare class CacheEntry<T> {
    private readonly _key;
    private readonly _content;
    constructor(key: string, content: T);
    getKey(): string;
    getContent(): T;
}

/**
 * 对应CacheEntry的基础服务类，定义一些通用的基本方法,比如增删查改
 *
 * @since 2022/9/1
 */
declare interface CacheService<T> {
    initialize(): void;
    get(key: string): T | undefined;
    set(key: string, entryContent: T): void;
    remove(key: string): void;
    close(): void;
}

declare class CacheStore {
    private caches;
    private lruCache;
    private readonly name;
    private readonly pinned;
    private hvigorMemoryThreshold;
    private hvigorEnableMemoryCache;
    constructor(name: string, lruCache: LRUCache, pinned?: boolean);
    getCache(key: string): any;
    get(key: string): any;
    set(key: string, value: any): CacheStore;
    setCache(key: string, value: any, pinned?: boolean): CacheStore;
    hasCache(key: string): boolean;
    clear(): void;
    delete(key: string): boolean;
    size(): number;
    keys(): IterableIterator<string>;
    private completeKey;
    private parseCompleteKey;
}

declare class CacheStoreManager {
    private cacheStores;
    private readonly lruCache;
    constructor(cacheStoreManagerOption?: CacheStoreManagerOption);
    mount(key: string, pinned?: boolean): CacheStore;
    unmount(key: string): boolean;
    clear(): void;
    size(): number;
    keys(): IterableIterator<string>;
    cacheItemSize(): number;
}

declare interface CacheStoreManagerOption {
    capacity?: number;
    ttl?: number;
}

/**
 * 用于给需要区分真实对象类型设置的一个属性
 *
 * @since 2022/6/20
 */
declare interface Class {
    classKind: string;
}

/**
 * LoaderProfile对象
 */
declare interface Config {
    getObject: (name: string) => any;
    setObject: (name: string, obj: object) => void;
}

/**
 * 定义的入参是一个参数的方法接口
 */
declare interface Consumer<T> {
    (arg: T): Promise<void> | void;
}

declare class ContinualEvent extends BaseEvent {
    additional: ContinualEventAdditional;
    constructor(id: string, name: string, description: string, pid: number, tid: string, totalTime?: number, frequency?: number);
    setParent(parentId: string): void;
    getParent(): string | undefined;
    addChild(childId: string): void;
    getChildren(): string[];
    createSubEvent(name: string, description: string): ContinualEvent;
    setLog(name: string, type: MetricLogType, description?: string): void;
    setParentLog(logEvent: LogEvent): void;
    setDetail(name: string): void;
    setChildrenLog(logEvent: LogEvent): void;
}

declare class ContinualEventAdditional implements EventAdditional {
    totalTime: number;
    frequency: number;
    children: string[];
    parent?: string;
    logId?: string;
    detailId?: string;
    constructor(totalTime?: number, frequency?: number);
}

declare class CoreParameter {
    private _properties;
    private _extParams;
    private _startParams;
    private _workspaceDir;
    get properties(): CoreProperties;
    set properties(value: CoreProperties);
    get extParams(): Record<string, string>;
    set extParams(value: Record<string, string>);
    get startParams(): CoreStartParam;
    get workspaceDir(): string;
    set workspaceDir(value: string);
    clean(): void;
}

declare const coreParameter: CoreParameter;

declare interface CoreProperties {
    ohosArkCompileMaxSize?: number;
    hvigorPoolMaxSize?: number;
    hvigorPoolMaxCoreSize?: number;
    hvigorPoolCacheCapacity?: number;
    hvigorPoolCacheTtl?: number;
    enableSignTask?: boolean;
    skipNativeIncremental?: boolean;
    'hvigor.analyzeHtml'?: boolean;
    'ohos.compile.lib.entryfile'?: boolean;
    'ohos.sign.har'?: boolean;
    [key: string]: ParamValue;
    'ohos.arkCompile.sourceMapDir'?: string;
    hvigorMemoryThreshold?: number;
    'ohos.processLib.optimization'?: boolean;
    'ohos.obfuscationRules.optimization'?: boolean;
    'ohos.byteCodeHar.integratedOptimization'?: boolean;
    'ohos.integratedHsp.useGetCurrentBundleName'?: boolean;
    enableOverridesDependencyMap?: boolean;
}

declare interface CoreStartParam {
    hvigorfileTypeCheck: boolean;
    parallelExecution: boolean;
    incrementalExecution: boolean;
    printStackTrace: boolean;
    daemon: boolean;
    analyze: AnalyzeMode;
    optimizationStrategy: string;
    hotCompile?: boolean;
    hotReloadBuild?: boolean;
    customizedParam?: any;
}

/**
 * Hvigor可执行任务的Task的基础抽象类
 *
 * @since 2022/1/20
 */
declare abstract class CoreTask {
    /**
     * 获取Task的可执行function，即Task的实际任务逻辑，是通过该function来执行的
     *
     * @return {Function} Js中的可执行function
     */
    abstract getAction(): Function;
    /**
     * 获取任务名
     *
     * @return {string} task name
     */
    abstract getName(): string;
    /**
     * 获取任务的完整路径,路径为包括该任务所属的Node.eg:NodeName:TaskName
     *
     * @return {string} task path
     */
    abstract getPath(): string;
    /**
     * 获取当前任务所属的hvigorNode对象
     *
     * @return {HvigorCoreNode}
     */
    abstract getNode(): HvigorCoreNode;
    /**
     * 获取当前任务的所有依赖Task的任务名列表
     *
     * @return {string[]} 依赖的任务名列表
     */
    abstract getDependsOn(): string[];
    /**
     * 通过任务名给当前Task设置1...n个依赖Task,并建立任务之间的依赖管理,保存到DAG图中
     * 依赖的任务名必须是在当前module中存在的
     * 区别于{addDependsOn}任务,该任务是以覆盖的方式设置任务依赖
     *
     * @param {string[]} taskNames
     * @return {CoreTask}
     */
    abstract setDependsOn(...taskNames: string[]): CoreTask;
    /**
     * 通过任务名给当前Task添加一个依赖Task,并建立任务之间的依赖,保存到DAG图中
     * 依赖的任务名必须是在当前module中存在的
     * 区别于{setDependsOn}任务,该任务是在原有的基础上增加一个Task依赖
     *
     * @param {string} taskName
     * @return {CoreTask}
     */
    abstract addDependsOn(taskName: string): CoreTask;
    /**
     * 通过任务名或者Task对象直接给当前任务添加依赖，并保存到DAG图中
     * 依赖的任务默认是当前的module
     *
     * @param {string | CoreTask} task
     * @return {CoreTask}
     */
    abstract dependsOn(task: string | CoreTask): CoreTask;
    /**
     * 通过任务名或者Task对象直接给当前任务添加依赖，并保存到DAG图中
     * 依赖的任务可以根据nodeName指定其他Node
     *
     * @param {string | CoreTask} taskName
     * @param {string | HvigorCoreNode} nodeName hvigor Node的名称,保持跟根项目的build-profile.json5中的一致
     * @return {CoreTask}
     */
    abstract dependsOn(taskName: string | CoreTask, nodeName?: string | HvigorCoreNode): CoreTask;
    /**
     * 设置Task的enabled的状态
     *
     * @param {boolean} enabled 是否使用该task
     */
    abstract setEnabled(enabled: boolean): CoreTask;
    /**
     * 获取Task的enabled的状态
     *
     * @return {boolean} true/false
     */
    abstract getEnabled(): boolean;
    /**
     * 标记某些Task不需要跟踪任务执行状态，即不需要检测增量等
     *
     * @param {string} reason 不需要跟踪的原因
     */
    abstract doNotTrackState(reason: string): void;
    /**
     * 设置任务的group分组
     *
     * @param {string} group 任务分组
     */
    abstract setGroup(group: string): CoreTask;
    /**
     * 获取任务的group分组
     *
     * @return {string}
     */
    abstract getGroup(): string;
    /**
     * 设置任务的描述信息
     *
     * @param {string} description 任务描述
     */
    abstract setDescription(description: string): CoreTask;
    /**
     * 获取任务的描述信息
     *
     * @return {string}
     */
    abstract getDescription(): string | undefined;
    /**
     * 任务执行失败之后后的回调
     *
     * @param error
     */
    abstract onFailed(error: Error): void;
    abstract getHvigorTask(): Task | undefined;
    abstract beforeRun(fn: Function): void;
    abstract afterRun(fn: Function): void;
}

/**
 * hvigor task的核心类，包含了基础的成员变量和默认的方法实现
 *
 * @since 2022/4/22
 */
declare class CoreTaskImpl extends CoreTask {
    protected taskLog: HvigorLogger;
    protected node: HvigorCoreNode;
    protected name: string;
    protected path: string;
    protected dependsTask: string[];
    protected fn: Function;
    protected isEnabled: boolean;
    protected group: string;
    protected description: string;
    private subDurationEventMap;
    private readonly workerDelegator;
    private readonly afterRunFnQueue;
    private readonly beforeRunFnStack;
    taskExecutedStatus: TaskExecuteStatus;
    durationEvent: DurationEvent;
    pendingPromises: TaskPendingPromises;
    constructor(node: HvigorCoreNode, taskDetails: TaskDetails);
    getWorkerPool(): WorkerPoolDelegator;
    execute(): Promise<void>;
    taskShouldDo(): boolean;
    onFailed(error: Error): void;
    setDependsOn(...taskNames: string[]): CoreTask;
    getDependsOn(): string[];
    addDependsOn(taskName: string): CoreTask;
    dependsOn(task: string | CoreTask, node?: string | HvigorCoreNode): CoreTask;
    /**
     * 添加模块间任务依赖时，根据对应的模块名找对应依赖的模块,当前顺序为先模块后工程
     * 由于存在模块名和工程名一样的场景,因此增加一个默认':'时代表project
     *
     * @param {string} nodeName
     * @return {Module | Project}
     * @private
     */
    private findTargetNode;
    private isProject;
    getAction(): Function;
    getNode(): HvigorCoreNode;
    getName(): string;
    getPath(): string;
    getTaskLog(): HvigorLogger;
    getEnabled(): boolean;
    setEnabled(enabled: boolean): CoreTask;
    setDescription(description: string): CoreTask;
    getDescription(): string | undefined;
    getGroup(): string;
    setGroup(group: string): CoreTask;
    doNotTrackState(reason: string): void;
    /**
     * 添加任务子矩阵
     *
     * @param workId
     */
    addSubDurationEvent(workId: string): DurationEvent;
    /**
     * 获取任务子矩阵
     *
     * @param workId
     */
    getSubDurationEvent(workId: string): DurationEvent | undefined;
    /**
     * 根据hvigorNode以及task name来获取task的path
     *
     * @param {DefaultNodeImpl} hvigorNode
     * @param {string} taskName
     * @returns {string}
     */
    private static createTaskPath;
    /**
     * 获取当前task对外暴露的HvigorTask对象
     */
    getHvigorTask(): Task | undefined;
    beforeRun(fn: Function): void;
    afterRun(fn: Function): void;
    getAfterRunQueue(): Queue<Function>;
    getBeforeRunStack(): Stack<Function>;
    /**
     * 执行Task的前置hook方法栈
     */
    executeBeforeRun(): Promise<void>;
    /**
     * 执行Task的后置hook队列
     */
    executeAfterRun(): Promise<void>;
}

declare class CounterEvent extends BaseEvent {
    additional: CounterEventAdditional;
    constructor(id: string, name: string, description: string, pid: number, tid: string, success?: number, failed?: number);
}

declare class CounterEventAdditional implements EventAdditional {
    success: number;
    failed: number;
    constructor(success?: number, failed?: number);
}

declare interface Debugging {
    stacktrace?: boolean;
}

/**
 * 解码器接口
 */
declare interface Decoder {
    write(buf: Buffer | Uint8Array): string;
    end(): string | undefined;
}

declare const DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME = 'hvigor-config.json5';

/**
 * CacheService的一个基本默认实现,可以根据容器中的具体对象,重载不同的方法实现
 *
 * @since 2022/9/1
 */
declare abstract class DefaultCacheService<T> implements CacheService<T> {
    protected cacheEntries: Map<string, CacheEntry<T>>;
    protected constructor();
    clone(cacheService: DefaultCacheService<T>): void;
    /**
     * 初始化函数,默认只需要一个空的map,子类需要根据不同场景进行重载
     */
    initialize(): void;
    close(): void;
    get(key: string): T | undefined;
    remove(key: string): void;
    size(): number;
    keys(): string[];
    /**
     * Service中保存的是容器对象的Map,该方法提供自动拆包,将容器中的内容提取并返回一个对应的Map<string,T>
     *
     * @return {Map<string, T>}
     */
    getCacheEntryContentMap(): Map<string, T>;
    /**
     * Set方法需要根据具体场景进行实例化
     *
     * @param {string} key
     * @param {T} entryContent
     * @return {CacheEntry<T>}
     */
    abstract set(key: string, entryContent: T): CacheEntry<T>;
}

declare const defaultModelRegistry: DefaultToolingModelBeanRegistry;

/**
 * hvigor中module的默认公共父类
 *
 * @since 2022/1/8
 */
declare abstract class DefaultNodeImpl implements HvigorCoreNode {
    classKind: string;
    protected readonly _nodeName: string;
    protected readonly _nodePath: string;
    protected readonly _packageJsonPath: string;
    protected readonly _buildFilePath: string;
    protected readonly _buildProfilePath: string;
    protected readonly _tasks: LazyTaskContainer;
    protected readonly _taskGraph: TaskDirectedAcyclicGraph;
    protected readonly _pluginContainer: DefaultPluginContainer;
    protected readonly _contextInfo: PluginContext;
    protected readonly _currentNodeLoaderPluginIds: string[];
    protected readonly taskMap: Map<CoreTask, CoreTask[]>;
    private readonly extraOption;
    private configOpt;
    private beforeNodeEvaluateFnQueue;
    private afterNodeEvaluateFnQueue;
    private afterBindSystemPluginsFnQueue;
    protected constructor(nodeName: string, nodePath: string);
    /**
     * 从TaskContainer获取的任务没有模块信息, 组合模块信息后返回
     */
    getTaskPaths(): string[];
    getTaskDepends(task: string): string[];
    /**
     * 获取Module的build-profile.json5路径
     *
     * @return {string} build-profile.json5 path
     */
    getBuildProfilePath(): string;
    /**
     * 获取构建的hvigorfile.js路径
     *
     * @return {string}
     */
    getBuildFilePath(): string;
    /**
     * 获取Node的路径
     *
     * @return {string}
     */
    getNodeDir(): string;
    /**
     * 获取模块的名称
     *
     * @return {string}
     */
    getName(): string;
    /**
     * 获取模块下的package.json路径
     *
     * @return {string}
     */
    getPackageJsonPath(): string;
    /**
     * 绑定具体的Plugin对象到Module对象上
     *
     * @param {HvigorSystemPlugin} plugin
     * @return {HvigorSystemPlugin}
     */
    bindPlugin(plugin: HvigorSystemPlugin): HvigorSystemPlugin;
    /**
     * 获取当前Node的任务DAG图对象
     *
     * @param {string} pluginId 插件标识
     * @param {Function} func context Function
     */
    bindPluginContextFunc(pluginId: string, func: Function): void;
    /**
     * 获取Module对象的plugin对象
     *
     * @param {string} pluginId
     * @returns {HvigorSystemPlugin | undefined}
     */
    getPluginById(pluginId: string): HvigorSystemPlugin | undefined;
    getContext(pluginId: string): any;
    getAllPluginIds(): string[];
    /**
     * 获取当前module注册的所有task
     *
     * @return {CoreTask[]} 任务列表
     */
    getAllTasks(): CoreTask[];
    /**
     * 通过taskName获取当前module的Task对象
     *
     * @param {string} name 任务名
     * @return {CoreTask | undefined}
     */
    getTaskByName(name: string): CoreTask | undefined;
    /**
     * 通过taskName获取当前module的lazy task的creationAction对象
     *
     * @param {string} name 任务名
     * @return {TaskCreation | undefined}
     */
    getTaskCAByName(name: string): TaskCreation | undefined;
    /**
     * 通过需要执行的Function和任务名注册到当前Node中
     * 可以通过传入一个TaskDetails类型的对象，直接对Task的基础信息进行赋值
     *
     * @param {Function} fn
     * @param {string | TaskDetails} taskInfo
     * @return {CoreTask}
     */
    task(fn?: Function, taskInfo?: string | TaskDetails): CoreTask;
    /**
     * 直接通过Task类型的对象注册任务到当前Node中
     * 可以通过传入一个TaskDetails类型的对象，直接对Task的基础信息进行赋值
     *
     * @param {CoreTask} task
     * @return {CoreTask}
     */
    registry(task: CoreTask): CoreTask;
    /**
     * 注册
     *
     * @param {HvigorTask} task
     * @return {HvigorTask}
     */
    registerTask(task: HvigorTask): HvigorTask;
    getTaskContext(): HvigorTaskContext;
    /**
     * 判断该module是否包含对应的task
     *
     * @param {string} name
     * @return {boolean}
     */
    hasTask(name: string): boolean;
    /**
     * 同时注册多个originalTask依赖的task到module中,并创建任务之间的依赖
     * 即不需要再依次再对每个depends task 单独注册到task容器中
     *
     * @param {CoreTask} originalTask 源task
     * @param {CoreTask[]} dependsOnTasks 依赖task
     */
    registryDependsOnTask(originalTask: CoreTask, ...dependsOnTasks: CoreTask[]): void;
    /**
     * 获取当前Node的任务容器
     *
     * @return {TaskContainer}
     */
    getTaskContainer(): TaskContainer;
    /**
     * 获取当前Node的任务DAG图对象
     *
     * @return {TaskDirectedAcyclicGraph}
     */
    getTaskGraph(): TaskDirectedAcyclicGraph;
    clearTaskGraph(): void;
    /**
     * 根据ModuleName获取Module模型
     *
     * @param {string} moduleName 模块名
     * @return {Module | undefined}
     */
    abstract findModuleByName(moduleName: string): Module | undefined;
    /**
     * 获取根项目的Project对象
     *
     * @return {Project}
     */
    abstract getProject(): Project;
    loadConfig(config: any): void;
    getConfigOpt(): Config;
    addExtraOption(key: string, value: any): void;
    getExtraOption(key: string): any;
    beforeNodeEvaluate(fn: Consumer<HvigorNode>): void;
    afterNodeEvaluate(fn: Consumer<HvigorNode>): void;
    executeNodeHook(hookType: HookType.beforeNodeEvaluate | HookType.afterNodeEvaluate): Promise<void>;
    afterBindSystemPlugins(fn: Consumer<HvigorNode>): void;
    executeAfterBindSystemPluginsHook(): Promise<void>;
}

/**
 * 用于保存当前module在hvigorFile.js中exports出来的plugin
 *
 * @since 2022/5/5
 */
declare class DefaultPluginContainer implements PluginContainer {
    private readonly _pluginMap;
    constructor();
    registryPlugin(plugin: HvigorSystemPlugin): HvigorSystemPlugin;
    getPluginById(pluginId: string): HvigorSystemPlugin | undefined;
}

/**
 * Hvigor同步类型任务的基础类,同步类型的任务是用来在插件嵌入到其他平台中提供数据同步作用的
 * 为了跟执行构建任务区分，独立出来，单独扩展和使用，同时可以提高执行构建任务的效率，免去不必要的数据同步
 *
 * @since 2022/1/20
 */
declare abstract class DefaultSyncTask extends DefaultTask {
    protected constructor(defaultModule: HvigorCoreNode, taskName: string);
}

/**
 * Hvigor自定义任务的基础抽象类
 *
 * @since 2022/4/24
 */
declare abstract class DefaultTask extends CoreTaskImpl implements Registry {
    /**
     * 任何自定义的任务类都需要实现此构造方法，分别为指定模块的Node,以及对应的taskInfo
     * taskInfo可以只指定一个taskName，其他为默认值,或者为一个TaskDetails的对象
     *
     * @param {HvigorCoreNode} node
     * @param {string | TaskDetails} taskInfo
     * @protected
     */
    protected constructor(node: HvigorCoreNode, taskInfo: string | TaskDetails);
    /**
     * 注册task function
     *
     * @return {Function} 任务需要执行的逻辑
     */
    registryAction(): Function;
    /**
     * 获取task的执行逻辑函数
     *
     * @return {Function} 任务需要执行的逻辑
     */
    getAction(): Function;
}

/**
 * 默认的Hvigor的数据扩展模型的注册器
 *
 * @since 2022/2/19
 */
declare class DefaultToolingModelBeanRegistry implements ToolingModelBeanRegistry {
    private _log;
    private readonly _modelMap;
    constructor();
    registry(modelBean: ToolingModelBean): void;
    getModelMap(): Map<string, ToolingModelBean>;
    clear(): void;
}

/**
 * 文件夹快照
 *
 * @since 2022/9/1
 */
declare class DirectorySnapshot extends BasicFileSnapshot {
    children: BasicFileSnapshot[];
    accept(visitor: FileSystemSnapshotHierarchyVisitor): SnapshotVisitResult;
    walk(): IterableIterator<BasicFileSnapshot>;
    equals(other: BasicFileSnapshot): boolean;
}

/**
 * compilePlugin 插件语法检查
 *
 * @param compilePluginPath compilePlugin文件绝对路径
 */
declare function doCompilePluginTypeCheck(compilePluginPath: string): void;

declare class DurationEvent extends BaseEvent {
    additional: DurationEventAdditional;
    log: HvigorLogger;
    constructor(id: string, name: string, description: string, pid: number, group: string, tid: string);
    start(state?: DurationEventState, time?: number): this;
    stop(state?: DurationEventState, time?: number): this;
    setState(state: DurationEventState): void;
    createSubEvent(name: string, description: string): DurationEvent;
    addChild(childId: string): void;
    setParent(parentId: string): void;
    getParent(): string | undefined;
    getChildren(): string[];
    setLog(name?: string, type?: MetricLogType, description?: string, totalTime?: number): void;
    setParentLog(logEvent: LogEvent): void;
    setChildrenLog(logEvent: LogEvent): void;
    setDetail(name: string): void;
    setCategory(category: string): void;
    addTaskRunReason(taskRunReason: string): void;
}

declare class DurationEventAdditional implements EventAdditional {
    category?: string;
    parent?: string;
    children: string[];
    state: DurationEventState;
    logId?: string;
    detailId?: string;
    targetName: string;
    moduleName: string;
    taskRunReasons: string[];
    constructor(eventName: string, category: string);
}

declare enum DurationEventState {
    CREATED = 'created',
    BEGINNING = 'beginning',
    RUNNING = 'running',
    FAILED = 'failed',
    SUCCESS = 'success',
    WARN = 'warn'
}

/**
 * 编码器接口
 */
declare interface Encoder {
    write(str: string): Buffer;
    end(): Buffer | undefined;
}

declare interface Environment {
    nodeHome?: string;
    hvigorUserHome?: string;
}

declare type EventAdditional = object;

declare class EventBody {
    pid: number;
    tid: string;
    startTime: number;
    endTime?: number;
    totalTime?: number;
    constructor(pid: number, tid: string);
}

declare class EventHead {
    id: string;
    name: string;
    description: string;
    type: MetricEventType;
    constructor(id: string, name: string, description: string, type: MetricEventType);
}

declare interface Execution {
    daemon?: boolean;
    parallel?: boolean;
    incremental?: boolean;
    typeCheck?: boolean;
    analyze?: string | boolean;
    skipNativeIncremental?: boolean;
    optimizationStrategy?: string;
}

/**
 * 抛出去的错误对象 + 额外信息
 */
declare class ExtendedErrorInfo extends Error {
    extraInfo: ExtraInfo | undefined;
    constructor(message?: string, extraInfo?: ExtraInfo, stack?: string);
}

declare interface ExternalStartParam {
    analyze: string | boolean;
    daemon: boolean;
    parallel: boolean;
    incremental: boolean;
    logLevel: string;
    typeCheck: boolean;
    optimizationStrategy: string;
    hotCompile?: boolean;
    hotReloadBuild?: boolean;
}

declare interface ExtraInfo {
    infoMsg?: string;
    warnMsg?: string;
}

declare class FileLogger {
    debug(message: any, ...args: any[]): any[];
    warn(message: any, ...args: any[]): void;
    info(message: any, ...args: any[]): void;
    error(message: any, ...args: any[]): void;
}

/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2022-2022. All rights reserved.
 */
export declare class FileSet {
    private _group;
    addEntry(path: string, options?: FsOptions): this;
    deleteEntry(path: string): this;
    addEntries(entries: string[], options?: FsOptions): this;
    collect(): Map<string, FsOptions>;
}

/**
 * 包装文件缓存的实例CacheEntry
 *
 * @since 2022/9/1
 */
declare class FileSnapShotCacheEntry extends CacheEntry<BasicFileSnapshot> {
    constructor(key: string, fileSnapShot: BasicFileSnapshot);
}

/**
 * 提供获取文件缓存快照的统一服务接口
 *
 * @since 2022/9/1
 */
declare class FileSnapShotCacheService extends DefaultCacheService<BasicFileSnapshot> {
    private readonly _fileSnapShotCachePath;
    constructor(fileSnapShotCachePath: string);
    initialize(): void;
    /**
     * 需要重载,将对象进行包装
     *
     * @param {string} key
     * @param {BasicFileSnapshot} entryContent
     * @return {FileSnapShotCacheEntry}
     */
    set(key: string, entryContent: BasicFileSnapshot): FileSnapShotCacheEntry;
}

/**
 * FileSystem snapshot 层级 visitor
 *
 * @since 2022/9/1
 */
declare interface FileSystemSnapshotHierarchyVisitor {
    /**
     * Called before visiting the contents of a directory.
     */
    enterDirectory(directorySnapshot: DirectorySnapshot): void;
    /**
     * Called for each regular file/directory/missing/unavailable file.
     *
     * @return how to continue visiting the rest of the snapshot hierarchy.
     */
    visitEntry(snapshot: BasicFileSnapshot): SnapshotVisitResult;
    /**
     * Called afterRun all entries in the directory has been visited.
     */
    leaveDirectory(directorySnapshot: DirectorySnapshot): void;
}

declare enum FileType {
    FILE = 'file',
    DIRECTORY = 'directory',
    UNKNOWN = 'unknown'
}

/**
 * 封装的FileUtil工具类
 */
export declare class FileUtil {
    private static logger;
    /**
     * 判断文件/目录是否存在
     *
     * @param filePath {string} 文件/目录的地址字符串
     * @return boolean
     */
    static exist(filePath: string): boolean;
    private static _exist;
    /**
     * 判断是否是目录
     *
     * @param file {string | NormalizedFile} 文件的路径或者是NormalizedFile
     * @return boolean
     */
    static isDictionary(file: string | NormalizedFile): boolean;
    private static _isDictionary;
    /**
     * 判断是否是文件
     *
     * @param file {string | NormalizedFile} 文件的路径或者是NormalizedFile
     * @return boolean
     */
    static isFile(file: string | NormalizedFile): boolean;
    private static _isFile;
    /**
     * 确保目录存在，不存在就创建
     *
     * @param dirPath {string} 目录路径
     */
    static ensureDirSync(dirPath: string): void;
    private static _ensureDirSync;
    /**
     * 确保文件存在 不存在就创建
     *
     * @param filePath {string} 文件路径
     */
    static ensureFileSync(filePath: string): void;
    private static _ensureFileSync;
    /**
     * 同步读取文件
     *
     * @param file {string | NormalizedFile}
     * @return {Buffer}
     */
    static readFileSync(file: string | NormalizedFile): Buffer;
    private static _readFileSync;
    /**
     * 异步读取文件
     *
     * @param file {string | NormalizedFile}
     * @return {undefined | Promise<Buffer>}
     */
    static readFile(file: string | NormalizedFile): Promise<Buffer> | undefined;
    private static _readFile;
    /**
     * 同步读取Json5文件
     *
     * @param file {string | NormalizedFile}
     * @return {JSON}
     */
    static readJson5(file: string | NormalizedFile): any;
    private static _readJson5;
    /**
     * 异步写入文件
     *
     * @param file {string | NormalizedFile} 文件路径或者NormalizedFile 对象
     * @param content 写入内容
     */
    static writeFile(file: string | NormalizedFile, content: any): Promise<void>;
    private static _writeFile;
    /**
     * 同步写入文件
     *
     * @param file {string | NormalizedFile} 文件路径或者NormalizedFile 对象
     * @param content 写入内容
     */
    static writeFileSync(file: string | NormalizedFile, content: any): void;
    private static _writeFileSync;
    /**
     * 异步复制文件
     *
     * @param file {string | NormalizedFile} 文件路径或者NormalizedFile对象
     * @param dest {string} 目标文件地址
     */
    static copyFile(file: string | NormalizedFile, dest: string): Promise<void>;
    private static _copyFile;
    /**
     * 同步复制文件
     *
     * @param file {string | NormalizedFile} 文件路径或者NormalizedFile对象
     * @param dest {string} 目标文件地址
     */
    static copyFileSync(file: string | NormalizedFile, dest: string): void;
    private static _copyFileSync;
    /**
     * 拼接路径方法类
     *
     * @param paths
     * @return string 拼接好的路径
     */
    static pathResolve(...paths: string[]): string;
    private static _pathResolve;
}

/**
 * 对构建显示时间进行格式化处理
 *
 * @param time 待处理的时间
 */
export declare function formatTime(time: [number, number]): string;

/**
 * 将[Number, Number]转化为ns格式
 *
 * @param time 待处理的时间
 */
export declare function formatTimeToNumber(time: [number, number] | undefined): number;

/**
 * 任务输入输出路径选项
 *
 * @since 2022/8/31
 */
declare interface FsOptions {
    isDirectory?: boolean;
    /**
     * 正则表达式字符串
     */
    test?: RegExp;
    /**
     * 文件夹深度
     */
    depth?: number;
    /**
     * 该文件对应的FileSnapShot快照的HashValue
     */
    fileSnapShotHashValue?: string;
}

declare class GaugeEvent extends BaseEvent {
    additional: GaugeEventAdditional;
    constructor(id: string, name: string, description: string, pid: number, tid: string, utilization: number);
}

declare class GaugeEventAdditional implements EventAdditional {
    utilization: number;
    constructor(utilization: number);
}

declare function getAlignTarget(): string | undefined;

/**
 * 提供接口获取工程hvigor-config.json5文件和用户目录下hvigor-config.json5对应配置项的值，优先获取工程目录的值
 *
 * @param {string} key hvigor-config.json5中配置项的名称
 * @returns {boolean}
 */
declare function getHvigorConfigValue(key: string): boolean;

/**
 * 提供接口在module的hvigorfile.js中获取当前模块的hvigor module对象
 *
 * @param {string} buildScriptFilePath hvigorfile.js文件的路径
 * @returns {HvigorNode | undefined}
 */
export declare function getHvigorNode(buildScriptFilePath?: string): HvigorCoreNode | undefined;

/**
 * 提供接口获取hvigorfile.ts当前节点对对象
 *
 * @param {string} buildScriptFilePath hvigorfile.js文件的路径
 * @returns {HvigorNode} hvigorNode节点对象
 */
export declare function getNode(buildScriptFilePath?: string): HvigorNode | undefined;

/**
 * 保存cli生命周期中常用的全局数据
 *
 * @since 2022/8/17
 */
declare class GlobalData {
    cliEnv: any;
    cliOpts: HvigorCliOptions;
    buildId: string | undefined;
    init(cliEnv: any, cliOpts: HvigorCliOptions): void;
    /**
     * 每次构建结束显式的清除数据 (目前只有buildId有必要)
     */
    clean(): void;
}

declare const globalData: GlobalData;

/**
 * 保存npm全局配置信息
 *
 * @since 2022/10/8
 */
declare class GlobalParam {
    private _log;
    private static instance;
    private configuration;
    private _initialized;
    static getInstance(): GlobalParam;
    private constructor();
    private load;
    getConfig(key: string): any;
    setConfig(key: string, value: any): void;
    private check;
}

declare interface HookArgMap {
    [HookType.configEvaluated]: HvigorConfig;
    [HookType.nodesInitialized]: Hvigor;
    [HookType.beforeNodeEvaluate]: HvigorNode;
    [HookType.afterNodeEvaluate]: HvigorNode;
    [HookType.nodesEvaluated]: Hvigor;
    [HookType.taskGraphResolved]: Hvigor;
    [HookType.buildFinished]: BuildResult;
    [HookType.onWatchWorkerMessage]: any;
}

declare enum HookType {
    configEvaluated = 'configEvaluated',
    nodesInitialized = 'nodesInitialized',
    beforeNodeEvaluate = 'beforeNodeEvaluate',
    afterNodeEvaluate = 'afterNodeEvaluate',
    nodesEvaluated = 'nodesEvaluated',
    taskGraphResolved = 'taskGraphResolved',
    buildFinished = 'buildFinished',
    onWatchWorkerMessage = 'onWatchWorkerMessage'
}

/**
 * hvigor向外部暴露的hvigor对象 通过此对象可以操作hvigor运行中的内容
 *
 * @since 2024-03-13
 */
declare class Hvigor {
    private hvigorLifecycleHook;
    getRootNode(): HvigorNode;
    private _getRootNode;
    getAllNodes(): HvigorNode[];
    private _getAllNodes;
    getNodeByName(nodeName: string, classKind?: string): HvigorNode | undefined;
    private _getNodeByName;
    getHvigorConfig(): HvigorConfig;
    private _getHvigorConfig;
    /**
     * 获取hvgior命令配置参数
     * @return {Parameter} Parameter对象
     */
    getParameter(): Parameter;
    private _getParameter;
    /**
     * 所有的node添加一个beforeNode hook
     * @param fn 方法的入参HvigorNode
     */
    beforeNodeEvaluate(fn: Consumer<HvigorNode>): void;
    private _beforeNodeEvaluate;
    /**
     * 为所有的node添加一个afterNode hook
     * @param fn 方法的入参HvigorNode
     */
    afterNodeEvaluate(fn: Consumer<HvigorNode>): void;
    private _afterNodeEvaluate;
    configEvaluated(fn: Consumer<HvigorConfig>): void;
    private _configEvaluated;
    nodesInitialized(fn: Consumer<Hvigor>): void;
    private _nodesInitialized;
    nodesEvaluated(fn: Consumer<Hvigor>): void;
    private _nodesEvaluated;
    taskGraphResolved(fn: Consumer<Hvigor>): void;
    private _taskGraphResolved;
    buildFinished(fn: Consumer<BuildResult>): void;
    private _buildFinished;
    onWatchWorkerMessage(fn: Consumer<any>): void;
    private _onWatchWorkerMessage;
    getCommandEntryTask(): string[] | undefined;
    private _getCommandEntryTask;
    /**
     * 判断是否是命令入口Task
     *
     * @param {string} taskName 任务名
     * @return {string[]} commandEntryTasks Task集合
     *
     */
    isCommandEntryTask(taskName: string): boolean;
    private _isCommandEntryTask;
    /**
     * 返回在命令行中传递的额外参数
     *
     * @returns {Map<string, string>}
     * @deprecated 已过时，为兼容历史版本而保留不再推荐使用 推荐使用hvigor.getParameter()方法代替
     */
    getExtraConfig(): Map<string, string>;
    private _getExtraConfig;
    /**
     * 返回Project模型
     *
     * @returns {Project | undefined}
     * @deprecated 已过时，为兼容历史版本而保留不再推荐使用
     */
    getProject(): Project | undefined;
    private _getProject;
    getHvigorUserHome(): string;
    private _getHvigorUserHome;
    getHvigorVersion(): string;
    private _getHvigorVersion;
}

export declare const hvigor: Hvigor;

/**
 * Hvigor工程构建生命周期中需要使用的一些公共参数
 *
 * @since 2022/6/18
 */
declare class HvigorBuildConst {
    static readonly MODULE_MODE: string;
    static readonly PROJECT_MODE: string;
}

declare interface HvigorCliOptions {
    _: string[];
    help?: boolean;
    cwd?: string;
    require?: string;
    prop?: string | string[];
    mode?: string;
    sync?: boolean;
    error?: boolean;
    warn?: boolean;
    info?: boolean;
    debug?: boolean;
    parallel?: boolean;
    incremental?: boolean;
    stacktrace?: boolean;
    enableBuildScriptTypeCheck?: boolean;
    daemon?: boolean;
    watch?: boolean;
    stopDaemon?: boolean;
    stopDaemonAll?: boolean;
    startDaemon?: boolean;
    statusDaemon?: boolean;
    nodeHome?: string;
    typeCheck?: boolean;
    pnpmFrozenLockfile?: boolean;
    analyze?: boolean | string;
    verboseAnalyze?: boolean;
    completeCommand?: string;
    config?: string[];
    maxOldSpaceSize?: number;
    Xmx?: number;
    env?: {
        [key: string]: string | undefined;
    };
    hotCompile?: boolean;
    optimizationStrategy?: string;
    hotReloadBuild?: boolean;
    experimentOptions?: {
        [key: string]: string | undefined;
    };
}

/**
 * Hvigor工程中需要使用的一些公共参数
 *
 * @since 2022/6/18
 */
declare class HvigorCommonConst {
    static readonly BUILD_PROFILE_FILE_NAME: string;
    static readonly BUILD_PROFILE_FILE: string;
    static readonly BUILD_FILE_NAME: string;
    static readonly PACKAGE_JSON: string;
    static readonly OH_PACKAGE_JSON: string;
    static readonly BUILD_FILE_NAME_SUFFIX: string[];
    static readonly HVIGOR_CONFIG_FILE_NAME: string;
    static readonly HVIGOR_CONFIG_FILE_NAME_SUFFIX: string[];
}

/**
 * hvigor配置对象 用于提供给用户实现动态加载模块等功能
 */
declare class HvigorConfig {
    private rootNodeDescriptor;
    private allChildrenNodeDescriptor;
    includeNode(name: string, srcPath: string, extraOptions?: Record<string, any>): void;
    private _includeNode;
    excludeNodeByName(name: string): void;
    private _excludeNodeByName;
    getAllNodeDescriptor(): HvigorNodeDescriptor[];
    private _getAllNodeDescriptor;
    getRootNodeDescriptor(): HvigorNodeDescriptor;
    private _getRootNodeDescriptor;
    getNodeDescriptorByName(name: string): HvigorNodeDescriptor | undefined;
    private _getNodeDescriptorByName;
}

export declare let hvigorConfig: HvigorConfig;

declare interface HvigorConfig_2 {
    modelVersion: string;
    dependencies: Record<string, string>;
    environment?: Environment;
    execution?: Execution;
    logging?: Logging;
    debugging?: Debugging;
    nodeOptions?: NodeOptions;
    javaOptions?: JavaOptions;
    properties?: Record<string, any>;
    parameterFile?: string;
}

declare class HvigorConfigLoader {
    private readonly hvigorConfig;
    private readonly configPropertyMap;
    private static instance;
    private static config;
    /**
     * 初始化读取两个配置文件 userHome下的和项目目录下的
     *
     */
    constructor();
    static init(cliOpts?: HvigorCliOptions): void;
    private static initCommandLineProperties;
    private static convertToParamValue;
    getHvigorConfig(): HvigorConfig_2 | undefined;
    /**
     * 获取properties中的某个配置，会优先尝试读取命令行中是否存在这个数据，然后是工程下hvigor-config.jons5中
     * 最后是userHome下的hvigor-config.json5
     *
     * @param key 配置名
     * @return 读取到的值
     */
    getPropertiesConfigValue<T>(key: string): T | undefined;
    /**
     *  daemon模式下，常驻线程会保存上一次的静态变量 instance, 如果两次构建中间 hvigor-config.json被修改 instance就需要被更新
     */
    static clean(): void;
    /**
     * 获取线程级存储的config loader单例
     */
    static getInstance(): HvigorConfigLoader;
    /**
     * 尝试在启动的命令行(process.argv)中找到所有的config，不能使用命令行工具commands解析，会和工程中其他的内容冲突
     *
     * @return 所有的config组成的数组
     */
    private static getConfigs;
    private static setConfig;
    /**
     * 解析
     * @param value
     * @private
     */
    private parseConfigValue;
}

/**
 * 提供前端工程配置信息的数据类
 *
 * @since 2021/12/09
 */
declare class HvigorCore {
    private readonly version;
    private _project;
    private _extraConfig;
    private _commandEntryTasks;
    private _scriptMap;
    private _hvigorNodeTree;
    private _hvigorAfterNodeInternalHook;
    private _hvigorNodesEvaluatedInternalHook;
    private _hvigorNodesBeforeEvaluatedInternalHook;
    private readonly metaInfo;
    private cacheMap;
    private parameter;
    private changedModuleNameList;
    private moduleDepRelationMap;
    private compileDependArr;
    constructor();
    /**
     * 获取改变的模块的列表
     */
    getModuleDepRelationMap(): Map<string, Set<string>>;
    /**
     * 获取改变的模块的列表
     */
    setChangedModuleNameList(changedModuleNameList: Set<string>): void;
    /**
     * 获取改变的模块的列表
     */
    getChangedModuleNameList(): Set<string>;
    /**
     * 设置compileArkTs任务依赖
     */
    setCompileDependArr(compileDependArr: string[]): void;
    /**
     * 获取compileArkTs任务依赖
     */
    getCompileDependArr(): string[];
    /**
     * 判断hvigor的版本是否发生变化
     */
    versionChanged(): boolean;
    /**
     * 更新meta.json中的属性
     *
     * @param property
     * @param value
     */
    updateMetaProperty(property: string, value: string | undefined): void;
    /**
     * 将更新后的meta属性写入meta.json
     */
    writeMetaProperties(): void;
    /**
     * 获取meta.json中的属性
     *
     * @param property
     */
    getMetaProperty(property: string): string | undefined;
    /**
     * 返回Project模型
     *
     * @returns {Project | undefined}
     */
    getProject(): Project | undefined;
    getParameter(): Parameter;
    /**
     * 根据hvigorfile的文件位置返回对应node的hvigor 模型
     *
     * @param {string} buildScriptFilePath
     * @returns {HvigorNode | undefined}
     */
    getModuleByScriptPath(buildScriptFilePath: string): HvigorCoreNode | undefined;
    getHvigorNodeByScriptPath(buildScriptFilePath: string): HvigorNode | undefined;
    getParentNodeByScriptPath(buildScriptFilePath: string): HvigorNode | undefined;
    getSubNodeByScriptPath(buildScriptFilePath: string): HvigorNode[] | undefined;
    /**
     * 返回在命令行中传递的额外参数
     *
     * @returns {Map<string, string>}
     */
    getExtraConfig(): Map<string, string>;
    /**
     * 保存命令行中的配置
     *
     * @param {Map<string, string>} value
     */
    setExtraConfig(value: Map<string, string>): void;
    /**
     * 判断是否是命令入口Task
     *
     * @param {string} taskName 任务名
     * @return {string[]} commandEntryTasks Task集合
     */
    isCommandEntryTask(taskName: string): boolean;
    /**
     * 保存hvigor命令行中的入口Tasks
     *
     * @param {string[]} commandEntryTasks Task集合
     */
    setCommandEntryTasks(commandEntryTasks: string[]): void;
    getCommandEntryTasks(): string[] | undefined;
    initRootProject(project: Project): void;
    private initSubModules;
    reset(): void;
    hvigorAfterNodeInternalHook(hvigorNodeName: string, fn: Consumer<HookArgMap[HookType.afterNodeEvaluate]>): void;
    getHvigorAfterNodeInternalHookList(hvigorNodeName: string): Consumer<HookArgMap[HookType.afterNodeEvaluate]>[] | undefined;
    hvigorNodeEvaluatedInternalHook(fn: Consumer<HookArgMap[HookType.nodesEvaluated]>): void;
    hvigorNodeBeforeEvaluatedInternalHook(fn: Consumer<HookArgMap[HookType.nodesEvaluated]>): void;
    getCache(cacheName: string): Map<string, any>;
    cleanCache(): void;
    getHvigorNodesEvaluatedInternalHook(): Consumer<Hvigor>[];
    getHvigorNodesBeforeEvaluatedInternalHook(): Consumer<Hvigor>[];
    clearHvigorInternalHookList(): void;
}

/**
 * 一次构建中只存在一个hvigor的单例对象,用来保存和传递全局的信息
 */
declare const hvigorCore: HvigorCore;

/**
 * hvigor的node模型,不论是project还是module都属于这种类型,其中提供了hvigor模块的公共接口
 * 并且继承了TaskManager中定义的模块用于管理任务的相关接口
 *
 * @since 2021/12/27
 */
declare interface HvigorCoreNode extends TaskManager, Class {
    /**
     * 获取Module名称
     *
     * @return {string} name
     */
    getName: () => string;
    /**
     * 获取Module的hvigorFile.js路径
     *
     * @return {string} hvigorFile.js path
     */
    getBuildFilePath: () => string;
    /**
     * 获取Module的build-profile.json5路径
     *
     * @return {string} build-profile.json5 path
     */
    getBuildProfilePath: () => string;
    /**
     * 获取模块路径
     *
     * @return {string} node path
     */
    getNodeDir: () => string;
    /**
     * 获取Module的packageJson
     *
     * @return {string} package.json path
     */
    getPackageJsonPath: () => string;
    /**
     * 通过名称获取Module
     *
     * @param {string} moduleName
     * @return {Module|undefined}
     */
    findModuleByName: (moduleName: string) => Module | undefined;
    /**
     * 注入plugin对象
     *
     * @param {HvigorSystemPlugin} plugin
     */
    bindPlugin: (plugin: HvigorSystemPlugin) => void;
    /**
     * 注入metaInfo上下文
     *
     * @param {string} pluginId 插件标识
     * @param {Function} func context Function
     */
    bindPluginContextFunc(pluginId: string, func: Function): void;
    /**
     * 获取plugin对象
     *
     * @param {string} pluginId
     * @return {HvigorSystemPlugin|undefined}
     */
    getPluginById: (pluginId: string) => HvigorSystemPlugin | undefined;
    /**
     * 根据pluginId获取MetaInfo信息
     *
     * @param {string} pluginId
     */
    getContext(pluginId: string): any;
    /**
     * 获取当前节点加载的所有pluginId
     *
     * @return {string[]}
     */
    getAllPluginIds(): string[];
    /**
     * 获取根项目project
     *
     * @return {Project}
     */
    getProject: () => Project;
    loadConfig(config: any): void;
    getConfigOpt: () => Config;
    addExtraOption(key: string, value: any): void;
    getExtraOption(key: string): any;
    beforeNodeEvaluate(fn: Consumer<HvigorNode>): void;
    afterNodeEvaluate(fn: Consumer<HvigorNode>): void;
    executeNodeHook(hookTpye: HookType.beforeNodeEvaluate | HookType.afterNodeEvaluate): Promise<void>;
    afterBindSystemPlugins(fn: Consumer<HvigorNode>): void;
    executeAfterBindSystemPluginsHook(): Promise<void>;
}

/**
 * 基于log4js封装的HvigorLogger
 *
 * @since 2022/03/02
 */
declare class HvigorLogger {
    private static instanceMap;
    protected readonly anonymizeFileLogger: FileLogger;
    protected durationId: string | undefined;
    protected constructor(category?: string);
    /**
     * 获取对于类别的HvigorLogger实例
     *
     * @param {string} category 默认是default
     * @return {HvigorLogger}
     */
    static getLogger(category?: string): HvigorLogger;
    static getLoggerWithDurationId(category: string, durationId: string): HvigorLogger;
    static clean(): void;
    debug(message: unknown, ...args: unknown[]): void;
    info(message: unknown, ...args: unknown[]): void;
    warn(message: unknown, ...args: unknown[]): void;
    error(message: unknown, ...args: unknown[]): void;
    anonymizeDebug(message: unknown, ...args: unknown[]): void;
    _printTaskExecuteInfo(taskPath: string, time: string): void;
    _printFailedTaskInfo(taskPath: string): void;
    _printDisabledTaskInfo(taskPath: string): void;
    _printUpToDateTaskInfo(taskPath: string): void;
    _printStackErrorToFile(message: unknown, ...args: unknown[]): void;
    errorMessageExit(message: string, ...args: unknown[]): void;
    errorExit(e: Error, message?: string, ...args: unknown[]): void;
    createLogEventByDurationId(message: unknown, logType: MetricLogType, ...args: unknown[]): unknown;
    getMessage(message: string, ...args: unknown[]): string;
    /**
     * 三段式打印错误信息(不阻塞构建)
     * @param errorId 错误码表文件(如：hvigor.json)中的key
     * @param messages message格式化字符串
     * @param solutions solutions格式化字符串，二维数组，每一行对应solution中的一行
     */
    printError(errorId: string, messages?: unknown[], solutions?: unknown[][]): void;
    /**
     * 三段式打印错误信息(阻塞构建)
     * @param errorId 错误码表文件(如：hvigor.json)中的key
     * @param messages message格式化字符串
     * @param solutions solutions格式化字符串，二维数组，每一行对应solution中的一行
     * @param stack stack最终打印的堆栈
     */
    printErrorExit(errorId: string, messages?: unknown[], solutions?: unknown[][], stack?: string): void;
    /**
     * 在 hvigorfile.ts 中调用的函数如果使用 printErrorExit 报错退出会打印 throw 那一行的代码，而压缩后的代码只有一行，会把整个文件的代码都打印出来
     * 所以新增此方法避免打印多余信息影响阅读
     */
    printErrorExitWithoutStack(errorId: string, messages?: unknown[], solutions?: unknown[][]): void;
}

/**
 * Hvigor Plugin扩展接口定义
 */
export declare interface HvigorNode {
    nodeDir: NormalizedFile;
    classKind: string;
    getNodeDir: () => NormalizedFile;
    /**
     * 向当前节点注册任务
     *
     * @param {HvigorPluginTask} task
     */
    registerTask: (task: HvigorTask) => void;
    /**
     * 根据任务名称获取任务
     *
     * @param {string} taskName 任务名
     * @return {HvigorTask | undefined}
     */
    getTaskByName: (taskName: string) => Task | undefined;
    /**
     * 获取当前节点名称
     *
     * @return {string}
     */
    getNodeName: () => string;
    /**
     * 获取当前节点路径
     *
     * @return {string}
     */
    getNodePath: () => string;
    /**
     * 获取父节点对象
     *
     * @return {HvigorNode | undefined}
     */
    getParentNode: () => HvigorNode | undefined;
    /**
     * 获取当前节点下所有字节点对象
     *
     * @return {HvigorNode | []}
     */
    subNodes: (callbackfn: (node: HvigorNode) => void) => void;
    /**
     * 根据节点名称查找子节点
     *
     * @param {string} nodeName 节点名称
     * @return {HvigorNode} hvigor节点对象
     */
    getSubNodeByName: (nodeName: string) => HvigorNode | undefined;
    /**
     * 根据pluginId获取插件提供的元数据
     *
     * @param {string} pluginId
     * @return {any} PluginContext
     */
    getContext: (pluginId: string) => any;
    /**
     * 获取当前节点加载的所有PluginId
     *
     * @return {string[]} pluginId集合
     */
    getAllPluginIds: () => string[];
    getConfigOpt: () => Config;
    addExtraOption(key: string, value: any): void;
    getExtraOption(key: string): any;
    getAllTasks(): Task[];
    beforeNodeEvaluate(fn: Consumer<HvigorNode>): void;
    afterNodeEvaluate(fn: Consumer<HvigorNode>): void;
}

/**
 * hvigorNode对象的描述对象 只定义了简单的node中存在的基本属性，用来在node对象创建前描述node
 */
declare interface HvigorNodeDescriptor {
    name: string;
    srcPath: string;
    extraOptions: Map<string, any>;
    getChildNode(): HvigorNodeDescriptor[] | undefined;
    getRootNode(): HvigorNodeDescriptor;
}

/**
 * HvigorPlugin定义声明
 */
export declare interface HvigorPlugin {
    /**
     * 插件的唯一标示ID
     */
    pluginId: string;
    /**
     * 插件元数据定义
     */
    context?: (() => any) | any;
    /**
     * 插件的主体方法，定义插件实现逻辑（例如任务注册等）
     * 在hvigor的生命周期配置阶段调用，进行task的注册
     *
     * @param node
     */
    apply: (node: HvigorNode) => void | Promise<void>;
}

/**
 * 早期提供的接口类型HvigorPluginContext，现已废弃与HvigorNode完全兼容
 * @deprecated 此接口类型名称已废弃，不再推荐使用，请使用HvigorNode替代
 */
export declare type HvigorPluginContext = HvigorNode;

/**
 * 对外暴露接口的plugin的基类
 *
 * @since 2021/12/16
 */
declare abstract class HvigorSystemPlugin {
    protected pluginVersion: string;
    protected readonly pluginId: string;
    protected constructor(pluginId: string);
    getPluginId(): string;
    abstract getContext(): any;
}

/**
 * HvigorTask声明
 */
export declare interface HvigorTask {
    /**
     * 任务名称，全局唯一
     */
    name: string;
    /**
     * task 上下文
     */
    context?: (() => any) | any;
    /**
     * Task 定义增量输入接口
     *
     * @param input
     */
    input?: (input: TaskInput) => void;
    /**
     * task 定义增量输出接口
     *
     * @param output
     */
    output?: (output: TaskOutput) => void;
    /**
     * task beforeRun 在run方法之前执行
     *
     * @param taskContext
     */
    beforeRun?: (taskContext: HvigorTaskContext) => void | Promise<void>;
    /**
     * 增量输入输出
     *
     * @param taskContext
     */
    afterRun?: (taskContext: HvigorTaskContext) => void | Promise<void>;
    /**
     * Task执行逻辑，执行时调用此方法
     *
     * @param taskContext
     */
    run: (taskContext: HvigorTaskContext) => void | Promise<void>;
    /**
     * 当前Task依赖的Task列表
     * 前置依赖的tasks, 先执行前置依赖，再执行此task
     */
    dependencies?: (() => string[]) | string[];
    /**
     * 后置依赖的tasks, 执行后置依赖前，必须先执行此task
     */
    postDependencies?: (() => string[]) | string[];
}

/**
 * hvigorTask上下文信息
 */
export declare interface HvigorTaskContext {
    /**
     * 当前编译的模块的名称
     */
    moduleName: string;
    /**
     * 当前编译的模块的路径
     */
    modulePath: string;
}

/**
 * Hvigor任务类型
 */
declare enum HvigorTaskGroupType {
    HELP_TASK_GROUP = 'Help',
    OTHER_TASK_GROUP = 'Other',
    SYNC_TASK_GROUP = 'Sync',
    INIT_TASK_GROUP = 'Init',
    CUSTOMIZE_TASK_GROUP = 'Customize'
}

declare class Iconv {
    private codecDataCache;
    /**
     * 使用指定字符集解码
     *
     * @param {Buffer | Uint8Array} buffer
     * @param {string} encoding
     * @param {Options} options
     * @return {string}
     */
    decode(buffer: Buffer | Uint8Array, encoding: string, options?: Options): string;
    /**
     * 使用指定字符集编码
     *
     * @param {string} content
     * @param {string} encoding
     * @param {Options} options
     * @return {Buffer}
     */
    encode(content: string, encoding: string, options?: Options): Buffer;
    /**
     * 判断字符集是否存在
     *
     * @param {string} encoding
     * @return {boolean}
     */
    encodingExists(encoding: string): boolean;
    /**
     * 获取指定字符集解码器
     *
     * @param {string} encoding
     * @param {Options} options
     * @return {Decoder}
     */
    getDecoder(encoding: string, options?: Options): Decoder;
    /**
     * 获取指定字符集编码器
     *
     * @param {string} encoding
     * @param {Options} options
     * @return {Encoder}
     */
    getEncoder(encoding: string, options?: Options): Encoder;
    private getCodec;
    private canonicalizeEncoding;
}

/**
 * 用于装饰 declareInputs、declareOutputFiles、declareInputFiles
 * 如果使用了该装饰器，也就是告知了hvigor，增量输入/输出只收集到当前对象，不再向上收集
 */
declare const IgnoreSuperIncremental: () => (target: IncrementalTask, propertyKey: string) => void;

declare const INCREMENTAL_OPTIMIZATION = 'hvigor.task.schedule.optimization';

declare abstract class IncrementalExecTask extends IncrementalTask {
    declareExecutionTool(): string;
    declareExecutionCommand(): string;
    declareExecutionEnv(): Map<string, string>;
}

declare abstract class IncrementalTask extends DefaultTask {
    declareInputs(): Map<string, TaskInputValue>;
    declareInputFiles(): FileSet;
    declareOutputFiles(): FileSet;
    /**
     * 无论是否增量，总是执行此方法
     */
    beforeAlwaysAction(): Promise<void>;
}

/**
 * 增量输入声明装饰器，用于声明外部的增量输入：字面量、对象、数组，示例：
 * class A extends IncrementalTask {
 *   @Input()
 *   private boolean isSucceed;
 *
 *   @Input()
 *   private get useBabel() {
 *     return !!this.targetService.getBuildOptions().strict?.useBabel
 *   }
 * }
 */
declare const Input: () => (target: IncrementalTask, propertyKey: string) => void;

/**
 * 增量输入声明装饰器，用于声明外部的增量输入：文件/文件夹路径，示例：
 * class A extends IncrementalTask {
 *   @InputFile({ isDirectory: false })
 *   private string jsonPath = '/a/b.json';
 *
 *   @InputFile({ isDirectory: false })
 *   private get ohPackageJsonPath() {
 *     return '/a/b.json';
 *   }
 * }
 */
declare const InputFile: (options?: FsOptions | undefined) => (target: IncrementalTask, propertyKey: string) => void;

/**
 * 增量输入声明装饰器，用于声明外部的增量输入：文件/文件夹路径数组，示例：
 * class A extends IncrementalTask {
 *   @InputFiles({ isDirectory: false })
 *   private string jsonPaths = ['/a/b.json'];
 *
 *   @InputFiles({ isDirectory: false })
 *   private get ohPackageJsonPath() {
 *     return ['/a/b.json'];
 *   }
 * }
 */
declare const InputFiles: (options?: FsOptions | undefined) => (target: IncrementalTask, propertyKey: string) => void;

/**
 * 增量输入声明装饰器，用于声明外部的增量输入，仅支持Map：
 * class A extends IncrementalTask {
 *   @Inputs()
 *   private Map<string, TaskInputValue> = new Map();
 *
 * }
 */
declare const Inputs: () => (target: IncrementalTask, propertyKey: string) => void;

declare class InstantEvent extends BaseEvent {
    additional: InstantEventAdditional;
    constructor(id: string, name: string, description: string, pid: number, tid: string);
    setScope(scope: InstantEventScope): void;
}

declare class InstantEventAdditional implements EventAdditional {
    scope?: InstantEventScope;
}

declare enum InstantEventScope {
    THREAD = 'thread',
    PROCESS = 'process',
    GLOBAL = 'global'
}

declare interface JavaOptions {
    Xmx?: number;
}

export declare class Json5Reader {
    private static logger;
    /**
     * 获取json5对象
     *
     * @param {string} json5path json5路径
     * @param {any} encodingStr 编码方式
     */
    static getJson5Obj(json5path: string, encodingStr?: string): any;
    /**
     * 异步API获取json5对象
     *
     * @param {string} json5path json5路径
     * @param {any} encodingStr 编码方式
     */
    static readJson5File(json5path: string, encodingStr?: string): Promise<any>;
    private static handleException;
    /**
     * 获取json5对象中某一个属性的值
     *
     * @param {any} json5对象 json5对象
     * @param {string} key json5对象中的属性名称，多个层级之间用.分隔
     */
    static getJson5ObjProp(obj: any, key: string): any;
}

declare class LazyTaskContainer implements TaskContainer {
    private readonly _moduleName;
    private _tasks;
    private _lazyTasks;
    constructor(moduleName: string);
    registerTask(creation: TaskCreation): void;
    addTask(task: CoreTask): void;
    deleteTask(taskName: string): boolean;
    hasTask(taskName: string): boolean;
    getLazyTask(task: string): TaskCreation | undefined;
    getTask(task: string): CoreTask | undefined;
    /**
     * 获取所有任务
     * 仅返回已初始化的task
     */
    getAllTasks(): CoreTask[];
    getTaskPaths(): string[];
    findTask(taskName: string): CoreTask | undefined;
    findTaskCA(taskName: string): TaskCreation | undefined;
    getTaskDepends(taskPath: string): string[];
    clearTasks(): void;
    private initializeLazyTask;
    private mergeDepends;
}

/**
 * 将对象写进文件中
 *
 * @since 2022/8/25
 */
export declare class LocalFileWriter {
    private static instance;
    private _space;
    private _replacer;
    private constructor();
    withSpace(space: number): void;
    withReplacer(replacer: (this: any, key: string, value: any) => any): void;
    /**
     * 将object对象写进json文件中
     *
     * @param filePath
     * @param content
     */
    write(filePath: string, content: {
        [key: string]: any;
    }): void;
    chunkStringify(content: {
        [key: string]: any;
    }): string[];
    writeStr(filePath: string, content: string): void;
    /**
     * 处理写入文件时报Invalid String length问题
     * @param filePath 文件路径
     * @param contentArray 文件内容拆分后的数组
     */
    writeStrArr(filePath: string, contentArray: string[]): void;
    static getInstance(): LocalFileWriter;
}

/**
 * 日志
 */
declare type Log = {
    type: LogType;
    time: string;
    workerId: number;
};

declare class LogEvent extends BaseEvent {
    additional: LogEventAdditional;
    constructor(id: string, name: string, description: string, pid: number, tid: string, type: MetricLogType);
    getLogType(): MetricLogType;
    setLogType(type: MetricLogType): void;
    getDurationId(): string | undefined;
    setDurationId(durationId: string): void;
    getContinualId(): string | undefined;
    setContinualId(continualId: string): void;
    addChild(id?: string): void;
    setParent(id: string): void;
}

declare class LogEventAdditional implements EventAdditional {
    logType: MetricLogType;
    durationId?: string;
    continualId?: string;
    parent?: string;
    children: string[];
    constructor(logType: MetricLogType);
}

declare interface Logging {
}

/**
 * 日志类型
 *
 * @since 2022/8/18
 */
declare enum LogType {
    WORK = 'work',
    SCHEDULE = 'schedule'
}

declare class LRUCache {
    private cnt;
    private readonly capacity;
    private key2node;
    private readonly head;
    private readonly tail;
    private readonly ttl;
    constructor(cacheStoreManagerOption?: CacheStoreManagerOption);
    access(key: string): void;
    set(key: string): string | undefined;
    delete(key: string): void;
    private moveToHead;
    private eliminate;
    clear(): void;
    getTTL(): number | undefined;
}

declare const MAIN_THREAD = 'Main Thread';

declare class MarkEvent extends BaseEvent {
    additional: MarkEventAdditional;
    constructor(id: string, name: string, description: string, pid: number, tid: string);
    start(state?: MarkEventState, time?: number): void;
    stop(state?: MarkEventState, time?: number): void;
    setMarkType(markType: MarkEventType): void;
    setCategory(category: MarkEventCategory): void;
    setState(state: MarkEventState): void;
    setHvigorVersion(hvigorVersion: string): void;
    setCompleteCommand(completeCommand: string): void;
    setNodeVersion(nodeVersion: string): void;
}

declare class MarkEventAdditional implements EventAdditional {
    markType?: MarkEventType;
    category?: MarkEventCategory;
    state?: MarkEventState;
    time: MarkEventTime;
    hvigorVersion?: string;
    completeCommand?: string;
    nodeVersion?: string;
    constructor();
}

declare enum MarkEventCategory {
    BUILD = 'build',
    CLEAN = 'clean'
}

declare enum MarkEventState {
    SUCCESS = 'success',
    FAILED = 'failed',
    RUNNING = 'running'
}

declare class MarkEventTime {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    constructor(time: Date);
}

declare enum MarkEventType {
    HISTORY = 'history',
    OTHER = 'other'
}

declare class MetadataEvent extends BaseEvent {
    additional: MetadataEventAdditional;
    constructor(id: string, name: string, description: string, pid: number, tid: string, state: MetadataEventState);
    setCategory(category: string): void;
    setSortIndex(sortIndex: string): void;
    setLabel(label: string): void;
    setContent(content: string): void;
}

declare class MetadataEventAdditional implements EventAdditional {
    category?: string;
    sortIndex?: string;
    label?: string;
    content?: string;
    state: MetadataEventState;
    constructor(state: MetadataEventState);
}

declare enum MetadataEventState {
    NEW = 'new',
    IDLE = 'idle',
    BUSY = 'busy',
    CLOSE = 'close',
    BROKEN = 'broken'
}

declare enum MetricEventType {
    DURATION = 'duration',
    INSTANT = 'instant',
    COUNTER = 'counter',
    GAUGE = 'gauge',
    OBJECT = 'object',
    METADATA = 'metadata',
    MARK = 'mark',
    LOG = 'log',
    CONTINUAL = 'continual'
}

/**
 * 矩阵工厂
 *
 * @since 2022/8/17
 */
declare class MetricFactory {
    static getUuid(): `${string}-${string}-${string}-${string}-${string}`;
    static createDurationEvent(name: string, description: string, group: string, tid?: string): DurationEvent;
    static createInstantEvent(name: string, description: string, tid?: string): InstantEvent;
    static createCounterEvent(name: string, description: string, success?: number, failed?: number, tid?: string): CounterEvent;
    static createGaugeEvent(name: string, utilization: number, description: string, tid?: string): GaugeEvent;
    static createObjectEvent(name: string, objectId: string, state: ObjectEventState, description: string, snapshot?: object, tid?: string): ObjectEvent;
    static createMetadataEvent(name: string, state: MetadataEventState, description: string, tid?: string): MetadataEvent;
    static createMarkEvent(name: string, description: string, tid?: string): MarkEvent;
    static createLogEvent(name: string, type: MetricLogType, tid?: string, description?: string): LogEvent;
    static createContinualEvent(name: string, description: string, totalTime?: number, frequency?: number, tid?: string): ContinualEvent;
}

declare enum MetricLogType {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    DETAIL = 'detail'
}

/**
 * 矩阵服务
 *
 * @since 2022/8/17
 */
declare class MetricService implements ReportListener {
    private static instance;
    private metricCacheService;
    private constructor();
    /**
     * 提交metric到缓存服务
     *
     * @param event
     */
    submit(event: BaseEvent): void;
    getEventById(id?: string): BaseEvent | undefined;
    /**
     * 供报告服务查询报告
     */
    queryReport(): Report2<BaseEvent[]>;
    filterDurationEvent(events: BaseEvent[]): BaseEvent[];
    filterLogEvent(events: BaseEvent[]): BaseEvent[];
    /**
     * 清除缓存
     */
    clear(): void;
    static getInstance(): MetricService;
}

/**
 * hvigor项目中的子模块module
 *
 * @since 2022/1/8
 */
declare type Module = HvigorCoreNode;

declare interface NodeOptions {
    maxOldSpaceSize?: number | undefined;
    maxSemiSpaceSize?: number | undefined;
    exposeGC?: boolean;
}

/**
 * 定义的一个空执行函数
 *
 * @since 2022/4/24
 */
declare function noop(): void;

/**
 * 自定义的File类
 */
export declare class NormalizedFile {
    readonly filePath: string;
    private logger;
    constructor(_path: string);
    /**
     * 获取到NormalizedFile对象下深层递归的目录与文件NormalizedFile[]，包含它本身
     *
     *@return NormalizedFile[]
     */
    asFileList(): NormalizedFile[];
    private _asFileList;
    /**
     * 支持在原有的目录下进行链式拼接路径
     *
     * @param _path
     * @return NormalizedFile
     */
    file(_path: string): NormalizedFile | undefined;
    private _file;
    /**
     * 获取当前文件/目录的路径
     *
     * @return string
     */
    getPath(): string;
    private _getPath;
}

/**
 * 普通worker，编译完成后直接terminate。
 * 目前用于预览时级联编译entry所依赖的所有hsp。
 */
declare class NormalWorker {
    private static runningThreadCnt;
    private static workQueue;
    private static promiseMap;
    private readonly maxWorkerNum;
    reset(): void;
    private executeWorker;
    private processNextTask;
}

declare const normalWorker: NormalWorker;

declare class ObjectEvent extends BaseEvent {
    additional: ObjectEventAdditional;
    constructor(id: string, name: string, description: string, pid: number, tid: string, objectId: string, state: ObjectEventState, snapshot?: object);
}

declare class ObjectEventAdditional implements EventAdditional {
    objectId: string;
    state: ObjectEventState;
    snapshot?: object;
    constructor(objectId: string, state: ObjectEventState, snapshot?: object);
}

declare enum ObjectEventState {
    NEW = 'new',
    SNAPSHOT = 'snapshot',
    DESTROY = 'destroy'
}

declare const OHOS_ARK_COMPILE_SOURCE_MAP_DIR = 'ohos.arkCompile.sourceMapDir';

/**
 * 编解码选项
 */
declare interface Options {
    stripBOM?: boolean;
    addBOM?: boolean;
    defaultEncoding?: string;
}

/**
 * 增量输出声明装饰器，用于声明任务的输出：文件/文件夹路径，示例：
 * class A extends IncrementalTask {
 *   @OutputFile({ isDirectory: false })
 *   private string jsonPaths = '/a/b.json';
 *
 *   @OutputFile({ isDirectory: false })
 *   private get ohPackageJsonPath() {
 *     return '/a/b.json';
 *   }
 * }
 */
declare const OutputFile: (options?: FsOptions | undefined) => (target: IncrementalTask, propertyKey: string) => void;

/**
 * 增量输出声明装饰器，用于声明任务的输出：文件/文件夹路径数组，示例：
 * class A extends IncrementalTask {
 *   @OutputFiles({ isDirectory: false })
 *   private string jsonPaths = ['/a/b.json'];
 *
 *   @OutputFile({ isDirectory: false })
 *   private get ohPackageJsonPath() {
 *     return ['/a/b.json'];
 *   }
 * }
 */
declare const OutputFiles: (options?: FsOptions | undefined) => (target: IncrementalTask, propertyKey: string) => void;

declare interface Parameter {
    getProperty(key: string): any | undefined;
    setProperty(key: string, value: any): void;
    getProperties(): Properties;
    getExtParam(key: string): string | undefined;
    getExtParams(): Record<string, string>;
    getStartParams(): StartParam;
    getWorkspaceDir(): string;
}

declare type ParamValue = string | boolean | number | undefined;

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

declare class PathUtil {
    private static hvigorCacheDirHasLogged;
    /**
     * 获取.hvigor的根目录，就是编译时产生的.hvigor文件夹，不是userHome下的
     * 例如D:\test\ToDoListArkTS\.hvigor
     * 会先从项目的配置文件中获取，不存在则获取userHome目录下的配置文件，都不存在返回项目下的
     */
    static getHvigorCacheDir(logger?: HvigorLogger): string;
    /**
     *
     * 检查用来copy的两个路径是否是指向相同的路径
     *
     * @param src
     * @param dest
     * @return 相同路径返回true,不同路径返回false
     */
    static checkCopyPathIsSame(src: string, dest: string): boolean;
    /**
     *
     * 获取一个文件的stats
     * @param path
     * @private
     * @return 返回fse.Stats对象，文件不能读取(不存在或其他报错)返回null
     */
    private static areIdentical;
    private static getCommandHvigorCacheDir;
    static getReportDirPath(): string;
}

/**
 * 对于每一个Hvigor 的Node节点，都可以注册多个自定义的Plugin插件
 * 该接口定义管理插件的相关接口
 *
 * @since 2022/5/6
 */
declare interface PluginContainer {
    /**
     * 注册扩展的HvigorPlugin到对应的Hvigor module中
     *
     * @param {HvigorSystemPlugin} plugin
     * @return {HvigorSystemPlugin}
     */
    registryPlugin(plugin: HvigorSystemPlugin): HvigorSystemPlugin;
    /**
     * 通过Plugin Id来获取当前module中存在的plugin
     *
     * @param {string} pluginId
     * @return {HvigorSystemPlugin|undefined}
     */
    getPluginById(pluginId: string): HvigorSystemPlugin | undefined;
}

declare class PluginContext {
    protected logger: HvigorLogger;
    private contextMap;
    setContextFunc(pluginId: string, func: Function): void;
    getContext(pluginId: string): any;
}

/**
 * 池化管理模块的常量
 *
 * @since 2022/8/15
 */
declare class PoolConstant {
    static readonly MAX_POOL_NUM: number;
    static readonly MIN_POOL_NUM: number;
    static readonly DEFAULT_MAX_IDLE_TIME: number;
    static readonly DEFAULT_RECYCLE_INTERVAL: number;
    static readonly WORKER_ACTION_PATH: string;
    static readonly WORK_DONE: string;
    static readonly WORK_ERROR: string;
    static readonly CALLBACK_ERROR: string;
    static readonly FILE_SUFFIX: string;
    static readonly UNKNOWN_LOG_TIME: string;
    static readonly ENCODING: string;
    static readonly TIME_PREFIX_LENGTH: number;
    static readonly CPU_LIMIT: number;
    static readonly FAIL_DISPATCH_INTERVAL: number;
    static readonly MAX_FAIL_ATTEMPTS: number;
    static readonly TSC_COMMON_CACHE_KEY = 'common';
}

/**
 * 池状态
 *
 * @since 2022/8/12
 */
declare enum PoolState {
    /**
     * 初始化状态，线程池在此阶段初始化各个子模块，创建最小线程数对应的线程
     */
    INIT = 'init',
    /**
     * 运行状态，线程池在此状态能正常接收外部提交的工作，并且正常执行工作
     */
    RUNNING = 'running',
    /**
     * 停止状态，线程池在此状态停止接收外部提交的工作，清空就绪队列，仅继续执行当前正在执行的工作
     */
    STOP = 'stop',
    /**
     * 关闭状态，线程池在此状态停止接收外部提交的工作，但能够正常执行当前正在执行的工作，以及就绪队列中的工作
     */
    CLOSE = 'close',
    /**
     * 终止状态，线程池在此状态活动完全终止
     */
    TERMINATED = 'terminated'
}

/**
 * 工作单元优先级
 */
export declare enum Priority {
    FIRST = 0,
    HEAVY = 1,
    MEDIUM = 2,
    LIGHT = 3,
    LAST = 4
}

/**
 * hvigor项目中的根module
 *
 * @since 2022/1/8
 */
declare interface Project extends HvigorCoreNode {
    /**
     * 获取子模块
     * 根据name直接获取子模块
     *
     * @return {Map<string,Module>>}
         */
     getSubModules: () => Map<string, Module>;
     /**
      * 添加子模块
      *
      * @return {Module}
      */
     addSubModule: (module: Module) => void;
     /**
      * 获取所有的的子模块
      *
      * @return {Module[]}
      */
     getAllSubModules: () => Module[];
     /**
      * 获取节点config配置
      */
     getConfigOpt: () => any;
    }

    /**
     * 整个生命周期提供任务相关缓存信息的服务类,采用单例,当前是一个Node进程一个单例，后续有守护进程需要一个工程对应一个实例,
     * 当前包含:
     * TaskSnapShotCacheService 用户管理任务缓存快照
     * FileSnapShotCacheService 用于管理文件缓存快照
     *
     * @since 2022/9/1
     */
    declare class ProjectCacheService {
        private readonly projectNodeDir;
        private readonly projectName;
        private readonly projectTaskSnapShotCacheFilePath;
        private readonly projectFileSnapShotCacheFilePath;
        taskSnapShotCacheService: TaskSnapShotCacheService;
        fileSnapShotCacheService: FileSnapShotCacheService;
        currentTaskSnapShotCacheService: TaskSnapShotCacheService;
        currentFileSnapShotCacheService: FileSnapShotCacheService;
        private static instance?;
        private constructor();
        private getProjectFileSnapShotCacheFilePath;
        private getProjectTaskSnapShotCacheFilePath;
        initialize(): void;
        getTaskSnapShot(taskName: string, node: HvigorCoreNode): TaskSnapshot | undefined;
        getFileSnapShot(filePath: string): BasicFileSnapshot | undefined;
        updateFileSnapShot(key: string, fileSnapShot: BasicFileSnapshot): void;
        updateTaskSnapShot(key: string, taskSnapShot: TaskSnapshot): void;
        /**
         * 整个生命周期结束后，需要对缓存进行序列化更新
         */
        close(): void;
        static getInstance(project: Project): ProjectCacheService;
        private checkMetaInfo;
    }

    /**
     * hvigor工程的基础root module
     *
     * @since 2021/12/27
     */
    declare class ProjectImpl extends DefaultNodeImpl implements Project {
        classKind: string;
        private readonly _subProjects;
        private _config;
        constructor(projectName: string, moduleDir: string);
        findModuleByName(moduleName: string): Module | undefined;
        getProject(): Project;
        getSubModules(): Map<string, Module>;
        addSubModule(module: Module): void;
        getAllSubModules(): Module[];
        loadConfig(config: any): void;
        getConfigOpt(): Config;
    }

    /**
     * 整个工程需要一个全局单一的DAG图用来保存和执行模块之间的任务依赖
     */
    declare const projectTaskDag: TaskDirectedAcyclicGraph;

    declare type Properties = Readonly<CoreProperties>;

    declare class Queue<T> {
        private elements;
        private readonly _capacity;
        constructor(capacity?: number);
        push(element: T): boolean;
        pop(): T | undefined;
        size(): number;
        peek(): T | undefined;
        clear(): void;
        /**
         * 如果存在则移除
         * @param search
         */
        remove(search: T): T | undefined;
        toString(): string;
    }

    declare function readJavaDaemonInfoFromCacheFile(): any | undefined;

    /**
     * 基于Task继承的实现类,必须实现该接口,注册Task的实际执行逻辑
     *
     * @since 2022/4/22
     */
    declare abstract class Registry {
        /**
         * 通过DefaultTask继承实现的用户自定义的类，必须实现该接口，以获取该Task实际需要执行的Function
         *
         * @return {Function}
         */
        abstract registryAction(): Function;
    }

    /**
     * 替换打印内容中的bundleName
     * 若此函数涉及到大对象，需要使用者考虑下性能问题
     * @param msg 打印内容
     * @param bundleName bundleName
     * @param regExp 根据bundleName生成的正则
     */
    declare function replaceBundleName(msg: any, bundleName: string, regExp?: RegExp): any;

    /**
     * 递归替换对象中的占位符
     */
    declare class ReplacePlaceHolderUtil {
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
         * 支持多级路径，如: 'buildProfileFields.buildOptionSetData'
         */
        private getValueByPath;
    }

    /**
     * JSON.stringify将js对象转换为json时，对象内部属性为map时，将得到空对象{}
     * JSON.stringify(traceBuildAnalyze, replacer, 2)
     * 传参数replacer方法，可使得map类型js数据正常转化为json
     *
     * @since 2022/6/11
     * @param key
     * @param value
     * @return any
     */
    declare function replacer(key: string, value: any): any;

    /**
     * 报告实体
     *
     * @since 2022/8/18
     */
    declare class Report2<T> {
        private readonly name;
        private readonly value;
        constructor(name: string, report: T);
        /**
         * 获取报告名
         */
        getName(): string;
        /**
         * 获取报告内容
         */
        getValue(): T;
    }

    /**
     * 报告服务监听器接口
     *
     * @since 2022/8/18
     */
    declare interface ReportListener {
        queryReport(): Report2<any>;
    }

    /**
     * 报告服务接口
     *
     * @since 2022/8/18
     */
    declare interface ReportService {
        report(): void;
        getReport(): any;
        addListener(listener: ReportListener): void;
        removeListener(listener: ReportListener): void;
        startProcessMonitor(): void;
        stopProcessMonitor(): void;
    }

    /**
     * 报告服务实现类
     *
     * @since 2022/8/18
     */
    declare class ReportServiceImpl implements ReportService {
        private reportListeners;
        private static instance;
        private static MAX_REPEAT_TIMES;
        private static REPORT_REG;
        private static HTML_REG;
        private static HTML_RESOURCE_NAME;
        private static UPLOAD_NAME;
        private monitorTimeId;
        private static readonly VERSION;
        private static buildId;
        private static readonly MB_CONVERTER;
        private static readonly REPORT_INTERVAL_MS;
        private static data;
        private constructor();
        report(): void;
        getReport(): any;
        /**
         * 存储到report.json
         *
         * @param reportObj
         * @param reportDirPath
         */
        storage(reportObj: {
            [name: string]: any;
        }, reportDirPath: string): void;
        /**
         * 删除除了report以外的无效文件
         */
        deleteUnusableFiles(reportDirPath: string): void;
        /**
         * 添加监听
         *
         * @param listener
         */
        addListener(listener: ReportListener): void;
        /**
         * 移除监听
         *
         * @param listener
         */
        removeListener(listener: ReportListener): void;
        generateHtmlResource(reportDirPath: string, reportFileName: string, reportObj: {
            [name: string]: any;
        }): void;
        static getInstance(): ReportServiceImpl;
        startProcessMonitor(): void;
        stopProcessMonitor(): void;
        convertToMb(input: number): number;
    }

    declare class Snapshot {
    }

    declare enum SnapshotVisitResult {
        /**
         * Continue visiting. When returned after visiting a directory,
         * the entries in the directory will be visited next.
         */
        CONTINUE = 0,
        /**
         * Terminate visiting immediately.
         */
        TERMINATE = 1,
        /**
         * If returned from visiting a directory, the directories entries will not be visited;
         * otherwise works as {@link #CONTINUE}.
         */
        SKIP_SUBTREE = 2
    }

    /**
     * 对pretty-hrtime格式化后的时间做进一步处理
     *
     * @param source pretty-hrtime格式化后的时间
     */
    declare function splitTime(source: string): string;

    /**
     * 栈, 先进后出
     */
    declare class Stack<T> {
        private readonly stack;
        constructor();
        push(element: T): number;
        pop(): T | undefined;
        peek(): T | undefined;
        size(): number;
        isEmpty(): boolean;
    }

    declare interface StartEnvironment {
        nodeHome: string;
        workspaceDir: string;
    }

    declare let startEnvironment: StartEnvironment;

    export declare type StartParam = Readonly<ExternalStartParam>;

    /**
     * 提交选项
     *
     * @since 2022/8/23
     */
    declare type SubmitOption = {
        workInput?: unknown;
        callback?: Function;
        callbackInput?: unknown[];
        priority?: Priority;
        targetWorkers?: number[];
        useReturnVal?: boolean;
        hasSideEffects?: boolean;
        preludeDeps?: string[];
        memorySensitive?: boolean;
    };

    /**
     * 向线程池提交一个job并执行,注意任务是挂在task上的，代表这个task并没有结束，但此时主线程可以执行其他任务，依赖此task的任务仍然会排队等待
     * @param node 要挂在什么node的task上
     * @param taskName taskName
     * @param workPath 要执行的job的文件路径,可以拼接函数名称,例如D:/xx/a.js/run是指运行a.js的run方法
     * @param workerOption worker配置
     */
    export declare function submitWorker(node: HvigorNode, taskName: string, workPath: string, workerOption: WorkerOption): TCB;

    /**
     * 对外暴露的通过接口获取Task信息的接口
     */
    export declare interface Task {
        /**
         * 任务名称，全局唯一
         */
        getName: () => string;
        /**
         * 当前Task依赖的Task列表
         * 前置依赖的tasks, 先执行前置依赖，再执行此task
         */
        getDependencies: () => string[];
        /**
         * 禁用任务
         *
         * @param enable
         */
        setEnable: (enable: boolean) => void;
        /**
         * beforeRun 先进后出
         *
         * @param fn
         */
        beforeRun: (fn: Function) => void;
        /**
         * afterRun 先进先出
         *
         * @param fn
         */
        afterRun: (fn: Function) => void;
    }

    /**
     * 定义Hvigor任务管理容器支持的方法，主要包括添加，删除，查找等
     *
     * @since 2022/4/24
     */
    export declare interface TaskContainer {
        /**
         * 往容器中增加Task
         *
         * @param {Task} task
         */
        addTask(task: CoreTask): void;
        /**
         * 注册任务TaskCreation
         *
         * @param action
         */
        registerTask(action: TaskCreation): void;
        /**
         * 从容器中删除Task
         *
         * @param {string} taskName
         * @return {boolean}
         */
        deleteTask(taskName: string): boolean;
        /**
         * 从容器中查找Task
         *
         * @param {string} taskName
         * @returns {Task | undefined}
         */
        findTask(taskName: string): CoreTask | undefined;
        /**
         * 从容器中查找任务依赖
         *
         * @param {string} taskPath
         * @returns {string[]}
         */
        getTaskDepends(taskPath: string): string[];
        /**
         * 判断是否存在该task
         *
         * @param {string} taskName
         * @returns {boolean}
         */
        hasTask(taskName: string): boolean;
        /**
         * 获取容器中的所有Task
         *
         * @returns {Task[]}
         */
        getAllTasks(): CoreTask[];
        getTaskPaths(): string[];
        /**
         * 清理容器中所有Task
         */
        clearTasks(): void;
    }

    declare type TaskCreation = {
        provider: () => CoreTask;
        depends: string[];
        details: TaskDetails;
        dependsDefinedByUser: string[];
    };

    /**
     * 定义一个Task所需的基础属性信息
     *
     * @since 2022/5/30
     */
    declare interface TaskDetails {
        readonly name: string;
        readonly group?: string;
        readonly description?: string;
        readonly isEnabled?: boolean;
        [propName: string]: unknown;
    }

    /**
     * 用于保存Hvigor的任务依赖关系的一个DAG图，提供包括添加图中节点，节点之间关系，判断节点之间是否联通等方法
     * _out和_in都是一个MultiMap，其中key是当前节点的唯一标识，即Task的path，value的大小是当前节点的入度或出度
     * _out用来保存所有以当前节点为头节点的节点信息集合,对应节点的出度
     * _in用来保存所有以当前节点为尾节点的节点信息集合，对应节点的入度
     *
     * @since 2022/4/24
     */
    declare class TaskDirectedAcyclicGraph {
        private _out;
        private _in;
        /**
         * 添加一个图中的节点
         *
         * @param {string} nodeKey
         */
        addNode(nodeKey: string): void;
        /**
         * 添加两个节点之间的边,为了保证为一个有向无环图，故添加时需要判断两点之间是否已包含边
         *
         * @param {string} originKey
         * @param {string} targetKey
         * @returns {boolean}
         */
        addEdge(originKey: string, targetKey: string): boolean;
        private _hasEdge;
        /**
         * 删除图中节点,同时要删除关联的起始和结束节点
         *
         * @param {string} nodeKey
         */
        removeNode(nodeKey: string): void;
        /**
         * 清空DAG图
         */
        clear(): void;
        /**
         * 根据节点的key获取其子节点
         *
         * @param {string} nodeKey
         * @returns {Set<string>}
         */
        getChildren(nodeKey: string): Set<string>;
        /**
         * 根据节点的key获取其父节点
         *
         * @param {string} nodeKey
         * @return {Set<string>}
         */
        getParent(nodeKey: string): Set<string>;
        /**
         * 获取所有入度为0的起始节点
         *
         * @returns {Set<string>}
         */
        getAllStartNodes(): Set<string>;
        /**
         * 获取所有出度为0的叶子节点
         *
         * @returns {Set<string>}
         */
        getAllEndNodes(): Set<string>;
        /**
         * 检查是否有环
         */
        checkCircle(): {
            hasCircle: boolean;
            circlePath: string[];
        };
        private dfsCircleCheck;
        private findAllZeroEdgeNodes;
    }

    /**
     * 用于保存一些任务执行状态的信息
     *
     * @since 2022/9/1
     */
    declare class TaskExecuteStatus {
        private _state;
        private _taskBeginTime;
        private _workerTimePeriod;
        private _isUpToDate;
        unTrackStateReason: string | undefined;
        constructor();
        setState(state: number): void;
        getState(): number;
        getTaskBeginTime(): [number, number] | undefined;
        setIsUpToDate(upToDate: boolean): void;
        isUpToDate(): boolean;
        setWorkerTimePeriod(time: [number, number]): void;
        getWorkerTimePeriod(): [number, number][];
    }

    export declare class TaskInput {
        private declareInputs;
        private declareInputFiles;
        file(path: string): TaskInput;
        private _file;
        files(paths: string[]): TaskInput;
        private _files;
        property(key: string, value: TaskInputValue): TaskInput;
        private _property;
    }

    export declare type TaskInputValue = number | string | boolean | string[] | number[] | boolean[];

    /**
     * 定义和提供Hvigor Node的管理任务相关的接口,包括注册,查询,创建模块间任务依赖等
     *
     * @since 2022/4/24
     */
    declare interface TaskManager {
        /**
         * 获取当前Node所有注册了的task
         *
         * @return {CoreTask[]}
         */
        getAllTasks(): CoreTask[];
        getTaskPaths(): string[];
        /**
         * 根据任务名获取当前模块中的task
         *
         * @param {string} name
         * @return {CoreTask | undefined}
         */
        getTaskByName(name: string): CoreTask | undefined;
        /**
         * 根据任务名获取当前模块中的taskCreationAction
         *
         * @param {string} name
         * @return {TaskCreation | undefined}
         */
        getTaskCAByName(name: string): TaskCreation | undefined;
        /**
         * 通过需要执行的Function和任务名注册到当前Node中
         * 可以通过传入一个TaskDetails类型的对象，直接对Task的基础信息进行赋值
         * eg:
         * project.task(()=>{
         *   // do something
         * },'Test Task')
         *
         * project.task(()=>{
         *   // do something
         * },{
         *   name:'Test Task',
         *   group:'Test Group',
         *   description:'This is a test task'
         * })
         *
         * @param {Function} fn Task的可执行function
         * @param {string|TaskDetails} taskInfo Task的描述信息
         * @return {CoreTask} 注册成功后返回的Task对象
         */
        task(fn: Function, taskInfo?: string | TaskDetails): CoreTask;
        /**
         * 直接通过Task对象注册任务到当前Node中
         *
         * @param {CoreTask} task 待注册的task对象
         * @return {CoreTask} 注册成功后返回的Task对象
         */
        registry(task: CoreTask): CoreTask;
        /**
         * 直接通过Task对象注册任务到当前Node中
         *
         * @param {CoreTask} task 待注册的task对象
         * @return {HvigorTaskNode} 注册成功后返回的Task对象
         */
        registerTask(task: HvigorTask): HvigorTask;
        /**
         * 根据任务名判断是否当前Node中是否存在该Task
         *
         * @param {string} name
         * @return {boolean} true|false
         */
        hasTask(name: string): boolean;
        getTaskDepends(task: string): string[];
        /**
         * 获取当前Node的Task管理容器
         *
         * @return {TaskContainer} task容器对象
         */
        getTaskContainer(): TaskContainer;
        /**
         * 获取当前Node的Task DAG图对象
         *
         * @return {TaskDirectedAcyclicGraph}
         */
        getTaskGraph(): TaskDirectedAcyclicGraph;
        /**
         * 清空当前Node的Task DAG图对象
         */
        clearTaskGraph(): void;
        /**
         * 同时注册多个originalTask依赖的task到Node中,并创建任务之间的依赖
         * 即不需要再依次再对每个depends task 单独注册到task容器中
         *
         * @param {CoreTask} originalTask 源task
         * @param {CoreTask[]} dependsOnTasks 依赖task
         */
        registryDependsOnTask(originalTask: CoreTask, ...dependsOnTasks: CoreTask[]): void;
    }

    export declare class TaskOutput {
        private declareOutputFiles;
        constructor(declareOutputFiles: FileSet);
        file(path: string): TaskOutput;
        private _file;
        files(paths: string[]): TaskOutput;
        private _files;
    }

    /**
     * 任务的pendingPromises，用于保存当前任务的promise
     *
     * @since 2023/12/14
     */
    declare class TaskPendingPromises {
        private promiseSet;
        /**
         * 给当前任务添加promise，可添加多个，只有当全部被添加的promise状态都变更为fulfilled，当前任务才算执行成功
         * 可以基于promisify来改造你的异步逻辑，并调用此方法加入promise，内部会检测promise的状态变更来调用相对应的逻辑
         * 同时，你也可以将worker和child_process进行promisify来提高并发处理能力
         *
         * const promise = new Promise((resolve, reject) => {
         *     const worker = new Worker(filename);
         *     worker.on('close', resolve);
         *     worker.on('error', reject);
         * });
         *
         * task.pendingPromises.add(promise);
         *
         * @param promise
         */
        add(promise: Promise<unknown>): void;
        /**
         * 获取当前任务的全部promise
         */
        get(): Promise<unknown>[];
        /**
         * 清空当前任务的promise
         */
        clear(): void;
    }

    /**
     * 增量Task的一个中间代理类，用于在任务实际执行前进行一些增量检查,执行后,刷新增量缓存之类的
     *
     * @since 2022/9/1
     */
    declare class TaskProxy {
        private readonly project;
        private readonly task;
        private readonly taskNode;
        private readonly cacheTaskSnapShot;
        private projectCacheService;
        private snapshotGeneratorService;
        private snapshotComparatorService;
        private curTaskSnapShot;
        private curInputFileSnapShotMap;
        private readonly notDeclareAnyIncrementalLogic;
        private readonly useInputOutputCache;
        constructor(task: CoreTaskImpl);
        /**
         * 判断单个文件是否发生变化
         *
         * @param {string} filePath
         * @param options
         * @return {[BasicFileSnapshot, boolean]}
         * @private
         */
        getFileCompareResult(filePath: string, options?: FsOptions): [BasicFileSnapshot, boolean];
        /**
         * 检查任务快照中具体key对应值与上次构建相比是否发生变化
         *
         * @param {string} filePath
         * @param options
         * @return {[BasicFileSnapshot, boolean]}
         * @private
         */
        taskInputValueChanged(InputKey: string): boolean;
        /**
         * 判断单个Task是否发生变化
         *
         * @return {boolean}
         * @private
         */
        private isTaskChange;
        /**
         * 判断任务设置的增量输入文件是否发生变化
         *
         * @return {boolean}
         * @private
         */
        private isTaskInputFilesChange;
        /**
         * 判断任务设置的增量输出文件是否发生变化
         *
         * @return {boolean}
         * @private
         */
        private isTaskOutputFilesChange;
        /**
         * 执行任务之前的前置任务，比如增量的检查
         *
         * @return {boolean} true/false true->不需要重新执行,false->需要重新执行
         */
        preExecute(): boolean;
        /**
         * 执行任务的实际TaskAction逻辑
         */
        execute(): Promise<void>;
        /**
         * 任务执行成功后的刷新缓存
         */
        postExecute(): void;
        private updateTaskOutputFilesSnapShot;
        private updateTaskInputFilesSnapshot;
        private updateTaskSnapShot;
        getCurTaskSnapShot(): TaskSnapshot | undefined;
    }

    /**
     * 通过执行hvigor 命令打印Hvigor Node的任务详细信息
     * eg.hvigor tasks
     *
     * @since 2022/5/31
     */
    declare class Tasks extends DefaultTask {
        constructor(hvigorNode: HvigorCoreNode);
        registryAction(): Function;
        private transformInfos;
    }

    /**
     * 任务快照数据结构
     *
     * @since 2022/8/31
     */
    declare interface TaskSnapshot {
        /**
         * 根据任务信息组成标识key, 用作定位
         */
        getKey(): string;
        getTaskName(): string;
        getProjectName(): string;
        getModuleName(): string;
        isSuccessful(): boolean;
        getInputs(): ValueEntry[];
        getInputFiles(): Map<string, FsOptions>;
        getOutputFiles(): Map<string, FsOptions>;
        compareTo(other: TaskSnapshot): boolean;
        stringify(): string;
        setExecutedSuccessful(): void;
        updateFilesOptions(projectCacheService: ProjectCacheService): void;
        updateCacheFilesOptions(projectCacheService: ProjectCacheService): void;
    }

    /**
     * 包装TaskSnapShot的实例
     *
     * @since 2022/9/1
     */
    declare class TaskSnapShotCacheEntry extends CacheEntry<TaskSnapshot> {
        constructor(key: string, taskSnapShot: TaskSnapshot);
    }

    /**
     * 提供获取任务缓存快照的统一服务接口
     *
     * @since 2022/9/1
     */
    declare class TaskSnapShotCacheService extends DefaultCacheService<TaskSnapshot> {
        private readonly _taskSnapShotCachePath;
        constructor(taskSnapShotCachePath: string);
        set(key: string, entryContent: TaskSnapshot): TaskSnapShotCacheEntry;
        initialize(): void;
    }

    /**
     * 任务状态
     *
     * @since 2022/8/12
     */
    declare enum TaskState {
        WAITING = 'waiting',
        RUNNING = 'running',
        END = 'end',
        REJECT = 'reject',
        ERROR = 'error'
    }

    /**
     * 任务控制块
     * 任务控制块与工作单元一一对应，使得外部可以通过任务控制块操纵工作单元
     *
     * @since 2022/8/26
     */
    export declare interface TCB {
        /**
         * 获取id
         *
         * @returns {string} 任务控制块id
         */
        getId(): string;
        /**
         * 获取worker的id
         *
         * @returns {number | undefined} worker的id
         */
        getWorkerId(): number | undefined;
        /**
         * 获取提交时间
         *
         * @returns {number} 任务提交时间
         */
        getSubmitTime(): number;
        /**
         * 获取执行开始时间
         *
         * @returns {number | undefined} 任务执行开始时间
         */
        getStartTime(): number | undefined;
        /**
         * 获取执行结束时间
         *
         * @returns {number | undefined} 任务执行结束时间
         */
        getEndTime(): number | undefined;
        /**
         * 获取任务状态
         *
         * @returns {TaskState} 任务状态
         */
        getState(): TaskState;
        /**
         * 获取优先级
         *
         * @returns {Priority} 任务优先级
         */
        getPriority(): Priority;
        /**
         * 获取回调函数
         *
         * @returns {Function} 任务回调函数
         */
        getCallback(): Function;
        /**
         * 获取回调函数的输入
         *
         * @returns {unknown[]} 回调函数输入数据
         */
        getCallbackInput(): unknown[];
        /**
         * 设置优先级
         *
         * @param priority 待设置的优先级
         * @returns {boolean} 是否设置成功
         */
        setPriority(priority: Priority): boolean;
        /**
         * 设置回调函数
         *
         * @param callback 待设置的回调函数
         * @param callbackInput 待设置的回调函数的输入
         * @returns {boolean} 是否设置成功
         */
        setCallback(callback: Function, callbackInput?: unknown[]): boolean;
        /**
         * 获取任务路径
         *
         * @returns {string} 任务路径
         */
        getTaskPath(): string;
        /**
         * 获取任务名
         *
         * @returns {string} 任务名
         */
        getTaskName(): string;
        /**
         * 获取任务完整路径，包含任务路径和任务名
         *
         * @returns {string} 任务完整路径
         */
        getTaskCompletePath(): string;
        /**
         * 回调函数是否使用工作单元的返回值作为输入
         *
         * @returns {boolean} 判断结果
         */
        useReturnVal(): boolean;
    }

    /**
     * TCB存储
     * 维护TCB数据
     *
     * @since 2022/8/16
     */
    export declare class TcbStore {
        private static tcbMap;
        static getTCB(id: string): TCB | undefined;
        static clear(): void;
        static add(tcb: TCB): void;
    }

    /**
     * Hvigor扩展数据模型的接口类型定义
     *
     * @since 2022/2/19
     */
    declare interface ToolingModelBean {
        modelId: string;
        /**
         * 调用相关的函数，来初始化和注册对应的ToolingModelBean
         *
         * @return {object}
         */
        buildModel(): object;
    }

    /**
     * Hvigor的数据扩展模型的注册器接口定义
     *
     * @since 2022/2/19
     */
    declare interface ToolingModelBeanRegistry {
        /**
         * 注册对应的bean对象到当前Node的容器中进行保存
         *
         * @param {ToolingModelBean} modelBean
         */
        registry(modelBean: ToolingModelBean): void;
        /**
         * 提供查询容器中的所有的bean对象的map
         *
         * @return {Map<string, ToolingModelBean>}
         */
        getModelMap(): Map<string, ToolingModelBean>;
    }

    /**
     * 打点管理
     */
    declare class TraceManager {
        private readonly data;
        private callBackList;
        constructor();
        /**
         * 记录数据, 以项目为单位
         * @param {string} key 项目名
         * @param data 打点数据
         * @param {Function} callback 回调，会在落盘后执行
         */
        trace(key: string, data: any, callback?: Function): void;
        /**
         * 将打点数据落盘：.hvigor/outputs/logs/details/details.json
         */
        flush(): void;
        /**
         * 打点数据的key值不能有'.'
         * @param {string} key
         * @returns {string}
         */
        static transformKey(key: string): string;
        /**
         * 对字符串匿名化处理
         * @param {string} str
         * @returns {string}
         */
        static anonymize(str: string): string;
        static trace(key: string, data: any, callback?: Function): void;
    }

    declare function TrackAPI(_target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;

    declare class ValueEntry {
        private readonly _name;
        private readonly _value;
        private readonly _valueType;
        private _hash;
        constructor(name: string, value: TaskInputValue);
        getName(): string;
        getValue(): TaskInputValue;
        getValueType(): unknown;
        getHash(): string;
    }

    declare enum WatchEvent {
        WATCH_START = 'WatchStart',
        WATCH_RESULT = 'WatchResult',
        CLOSE_WATCH = 'CloseWatch',
        WATCH_COMPILE_RESULT = 'WatchCompileResult',
        WATCH_COMPILE_DATA = 'WatchCompileData',
        WATCH_LOG = 'WatchLog',
        TERMINATE_WORKER = 'TerminateWorker',
        NEW_WATCH_WORKER = 'NewWatchWorker',
        SEND_KEEP_ALIVE_SIGNAL = 'SendKeepAliveSignal'
    }

    /**
     * 用于watch任务的线程管理
     *
     * @since 2022/12/7
     */
    declare class WatchWorker {
        private readonly workerMap;
        constructor();
        sendCompileMsgToWorker(): void;
        sendNewWatchMsgToProcess(workerId: number): void;
        /**
         * 如果有自定义终止逻辑则发送TERMINATE_WORKER信号到 worker，否则直接终止 worker
         */
        terminate(id: number): void;
        /**
         * 设置 id 对应的 WorkerItem 的 keepAlive 成员变量
         */
        private setAliveForWorker;
        /**
         * 若 id 对应的 WorkerItem 的 keepAlive 信息为 true 则消费掉
         */
        private consumeKeepAlive;
        private terminateWorker;
        /**
         * 监听主线程传递的来自socket的信息，传递给对应的worker线程
         * @private
         */
        private addListenersOnSessionManager;
    }

    declare const watchWorker: WatchWorker;

    /**
     * 自动替换方法返回对象中的占位符的装饰器工厂
     */
    export declare function WithParamReplacement(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;

    /**
     * workInput 设置要执行的线程的输入值
     * priority 设置线程执行的优先级
     * targetWorkers 可以指定要执行在几号线程中
     * callback 执行完毕 进行的回调
     * callbackInput 回调函数的入参
     * useReturnVal 回调函数入参是否使用线程执行结束的返回值，优先级高于callbackInput
     */
    export declare type WorkerOption = {
        workInput?: unknown;
        priority?: Priority;
        targetWorkers?: number[];
        callback?: Function;
        callbackInput?: unknown[];
        useReturnVal?: boolean;
    };

    /**
     * 工作池代理器
     * 内置于task的对象，提供对工作池功能的间接访问
     *
     * @since 2022/8/31
     */
    declare class WorkerPoolDelegator {
        private workerPool;
        private static isActive;
        private static needWarmUp;
        constructor();
        warmUp(warmUpPath: string): void;
        submit(task: CoreTask, workPath: string, submitOption?: SubmitOption): TCB;
        terminate(): Promise<boolean>;
        getState(): PoolState;
        setState(state: PoolState): void;
        setRecycleInterval(recycleInterval: number): void;
        setMaxIdleTime(maxIdleTime: number): void;
        setErrorCallback(errorCallback: Function): void;
        getLog(type: LogType): Set<Log> | undefined;
        clearLog(type?: LogType): void;
        getMaxPoolNum(): number;
        getMinPoolNum(): number;
        setResident(resident: boolean): void;
        isActive(): boolean;
    }

    export { }
