if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    previewPixelMap?: image.PixelMap | undefined;
    running?: boolean;
    session?: OcrSession | undefined;
    entities?: SmartEntity[];
    selectedLineIndex?: number;
}
import type common from "@ohos:app.ability.common";
import type { BusinessError } from "@ohos:base";
import pasteboard from "@ohos:pasteboard";
import type image from "@ohos:multimedia.image";
import { Logger } from "@normalized:N&&&entry/src/main/ets/common/Logger&";
import type { OcrError, OcrLine, OcrSession, SmartEntity } from '../model/OcrModels';
import { ImagePickerService } from "@normalized:N&&&entry/src/main/ets/service/ImagePickerService&";
import { OcrService } from "@normalized:N&&&entry/src/main/ets/service/OcrService&";
import { SmartParser } from "@normalized:N&&&entry/src/main/ets/service/SmartParser&";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__previewPixelMap = new ObservedPropertyObjectPU(undefined, this, "previewPixelMap");
        this.__running = new ObservedPropertySimplePU(false, this, "running");
        this.__session = new ObservedPropertyObjectPU(undefined, this, "session");
        this.__entities = new ObservedPropertyObjectPU([], this, "entities");
        this.__selectedLineIndex = new ObservedPropertySimplePU(-1, this, "selectedLineIndex");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.previewPixelMap !== undefined) {
            this.previewPixelMap = params.previewPixelMap;
        }
        if (params.running !== undefined) {
            this.running = params.running;
        }
        if (params.session !== undefined) {
            this.session = params.session;
        }
        if (params.entities !== undefined) {
            this.entities = params.entities;
        }
        if (params.selectedLineIndex !== undefined) {
            this.selectedLineIndex = params.selectedLineIndex;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__previewPixelMap.purgeDependencyOnElmtId(rmElmtId);
        this.__running.purgeDependencyOnElmtId(rmElmtId);
        this.__session.purgeDependencyOnElmtId(rmElmtId);
        this.__entities.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedLineIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__previewPixelMap.aboutToBeDeleted();
        this.__running.aboutToBeDeleted();
        this.__session.aboutToBeDeleted();
        this.__entities.aboutToBeDeleted();
        this.__selectedLineIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    /** 解码后的预览图 */
    private __previewPixelMap: ObservedPropertyObjectPU<image.PixelMap | undefined>;
    get previewPixelMap() {
        return this.__previewPixelMap.get();
    }
    set previewPixelMap(newValue: image.PixelMap | undefined) {
        this.__previewPixelMap.set(newValue);
    }
    /** 识别进行中标记（防重入 + Loading 展示） */
    private __running: ObservedPropertySimplePU<boolean>;
    get running() {
        return this.__running.get();
    }
    set running(newValue: boolean) {
        this.__running.set(newValue);
    }
    /** 识别会话数据（结果 + 性能统计） */
    private __session: ObservedPropertyObjectPU<OcrSession | undefined>;
    get session() {
        return this.__session.get();
    }
    set session(newValue: OcrSession | undefined) {
        this.__session.set(newValue);
    }
    /** 结构化提取的实体 */
    private __entities: ObservedPropertyObjectPU<SmartEntity[]>;
    get entities() {
        return this.__entities.get();
    }
    set entities(newValue: SmartEntity[]) {
        this.__entities.set(newValue);
    }
    /** 当前选中的行下标 */
    private __selectedLineIndex: ObservedPropertySimplePU<number>;
    get selectedLineIndex() {
        return this.__selectedLineIndex.get();
    }
    set selectedLineIndex(newValue: number) {
        this.__selectedLineIndex.set(newValue);
    }
    aboutToAppear(): void {
        // 提前预热 OCR 引擎，摊薄首次识别的模型加载耗时
        OcrService.init();
    }
    aboutToDisappear(): void {
        // 引擎与预览图成对释放，避免资源泄漏
        OcrService.release();
        this.releasePreview();
    }
    // ==================== 业务逻辑 ====================
    private releasePreview(): void {
        if (this.previewPixelMap !== undefined) {
            this.previewPixelMap.release();
            this.previewPixelMap = undefined;
        }
    }
    private async pickFromGallery(): Promise<void> {
        if (this.running) {
            return;
        }
        try {
            const uri = await ImagePickerService.pickFromGallery();
            if (uri !== undefined) {
                await this.runOcr(uri);
            }
        }
        catch (e) {
            const error = e as BusinessError;
            Logger.error(`pickFromGallery failed, code: ${error.code}, message: ${error.message}`);
        }
    }
    private async takePhoto(): Promise<void> {
        if (this.running) {
            return;
        }
        const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
        try {
            const uri = await ImagePickerService.takePhoto(context);
            if (uri !== undefined) {
                await this.runOcr(uri);
            }
        }
        catch (e) {
            // 用户取消拍照时系统会返回错误码，属正常流程，静默处理
            const error = e as BusinessError;
            Logger.warn(`takePhoto cancelled or failed, code: ${error.code}, message: ${error.message}`);
        }
    }
    /** 核心流程：解码 -> 端侧识别 -> 结构化提取 */
    private async runOcr(uri: string): Promise<void> {
        this.running = true;
        try {
            const runResult = await OcrService.recognize(uri);
            this.releasePreview();
            this.previewPixelMap = runResult.pixelMap;
            this.session = runResult.session;
            this.entities = SmartParser.parse(runResult.session.fullText);
            this.selectedLineIndex = -1;
        }
        catch (e) {
            const error = e as OcrError;
            Logger.error(`OCR failed, code: ${error.code}, message: ${error.message}`);
            this.showToast(OcrService.describeError(error));
        }
        finally {
            this.running = false;
        }
    }
    private async copyText(text: string, tip: string): Promise<void> {
        try {
            const data = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
            await pasteboard.getSystemPasteboard().setData(data);
            this.showToast(tip);
        }
        catch (e) {
            const error = e as BusinessError;
            Logger.error(`copy failed, code: ${error.code}, message: ${error.message}`);
        }
    }
    private copyFullText(): void {
        const session = this.session;
        if (session === undefined) {
            return;
        }
        this.copyText(session.fullText, '已复制全文');
    }
    private clearAll(): void {
        this.releasePreview();
        this.session = undefined;
        this.entities = [];
        this.selectedLineIndex = -1;
    }
    private showToast(message: string): void {
        try {
            this.getUIContext().getPromptAction().showToast({ message: message, duration: 2000 });
        }
        catch (e) {
            const error = e as BusinessError;
            Logger.error(`showToast failed, code: ${error.code}, message: ${error.message}`);
        }
    }
    // ==================== 视图构建 ====================
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777221, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部品牌区
            Column.create({ space: 4 });
            // 顶部品牌区
            Column.width('100%');
            // 顶部品牌区
            Column.alignItems(HorizontalAlign.Start);
            // 顶部品牌区
            Column.padding({ left: 20, right: 20, top: 18, bottom: 18 });
            // 顶部品牌区
            Column.linearGradient({
                angle: 135,
                colors: [['#0A59F7', 0.0], ['#4D8DFF', 1.0]]
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('OCR 智识');
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('HarmonyOS 端侧通用文字识别实战 · Core Vision Kit');
            Text.fontSize(12);
            Text.fontColor('#D9E4FF');
        }, Text);
        Text.pop();
        // 顶部品牌区
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.align(Alignment.Top);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.width('100%');
            Column.padding(16);
        }, Column);
        // 图片预览
        this.PreviewCard.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作按钮
            Row.create({ space: 12 });
            // 操作按钮
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('相册选图');
            Button.layoutWeight(1);
            Button.height(44);
            Button.fontSize(15);
            Button.backgroundColor({ "id": 16777219, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
            Button.enabled(!this.running);
            Button.onClick(() => {
                this.pickFromGallery();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('拍照识别');
            Button.layoutWeight(1);
            Button.height(44);
            Button.fontSize(15);
            Button.backgroundColor('#FFFFFF');
            Button.fontColor({ "id": 16777219, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
            Button.border({ width: 1, color: { "id": 16777219, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" } });
            Button.enabled(!this.running);
            Button.onClick(() => {
                this.takePhoto();
            });
        }, Button);
        Button.pop();
        // 操作按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 识别进行中
            if (this.running) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Center);
                        Row.padding(10);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(22);
                        LoadingProgress.height(22);
                        LoadingProgress.color({ "id": 16777219, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('正在进行端侧识别…');
                        Text.fontSize(14);
                        Text.fontColor({ "id": 16777224, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            // 性能统计
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 性能统计
            if (this.session !== undefined) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.StatsCard.bind(this)(ObservedObject.GetRawObject(this.session));
                });
            }
            // 智能提取
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 智能提取
            if (this.entities.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.EntityCard.bind(this)();
                });
            }
            // 识别结果
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 识别结果
            if (this.session !== undefined) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.ResultCard.bind(this)(ObservedObject.GetRawObject(this.session));
                });
            }
            // 空态提示
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 空态提示
            if (this.session === undefined && !this.running) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('支持相册选图或拍照，识别全程在本机完成，图片不出设备');
                        Text.fontSize(12);
                        Text.fontColor({ "id": 16777224, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                        Text.padding({ top: 8, bottom: 8 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 底部操作条
            if (this.session !== undefined) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 12 });
                        Row.width('100%');
                        Row.padding({ left: 16, right: 16, top: 8, bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('复制全文');
                        Button.layoutWeight(1);
                        Button.height(44);
                        Button.fontSize(15);
                        Button.backgroundColor({ "id": 16777219, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
                        Button.onClick(() => {
                            this.copyFullText();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('清空');
                        Button.layoutWeight(1);
                        Button.height(44);
                        Button.fontSize(15);
                        Button.backgroundColor('#FFFFFF');
                        Button.fontColor({ "id": 16777223, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
                        Button.border({ width: 1, color: '#D5D9E0' });
                        Button.onClick(() => {
                            this.clearAll();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /** 图片预览卡片 */
    PreviewCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(10);
            Column.backgroundColor({ "id": 16777220, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.previewPixelMap !== undefined) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.previewPixelMap);
                        Image.width('100%');
                        Image.height(220);
                        Image.objectFit(ImageFit.Contain);
                        Image.borderRadius(10);
                        Image.backgroundColor('#F7F8FA');
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 6 });
                        Column.width('100%');
                        Column.height(160);
                        Column.justifyContent(FlexAlign.Center);
                        Column.backgroundColor('#F7F8FA');
                        Column.borderRadius(10);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('+');
                        Text.fontSize(36);
                        Text.fontWeight(FontWeight.Lighter);
                        Text.fontColor('#C2C8D1');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择或拍摄包含文字的图片');
                        Text.fontSize(13);
                        Text.fontColor({ "id": 16777224, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /** 性能统计卡片 */
    StatsCard(session: OcrSession, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.width('100%');
            Column.padding(12);
            Column.backgroundColor({ "id": 16777220, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('本次识别');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777223, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(session.totalCost < 1000 ? `${session.totalCost} ms` : `${(session.totalCost / 1000).toFixed(2)} s`);
            Text.fontSize(13);
            Text.fontColor({ "id": 16777219, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.StatItem.bind(this)('解码', `${session.decodeCost} ms`);
        this.StatItem.bind(this)('识别', `${session.recognizeCost} ms`);
        this.StatItem.bind(this)('文本块', `${session.blockCount}`);
        this.StatItem.bind(this)('文本行', `${session.lines.length}`);
        Row.pop();
        Column.pop();
    }
    StatItem(label: string, value: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777223, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(11);
            Text.fontColor({ "id": 16777224, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
    }
    /** 智能提取卡片 */
    EntityCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.width('100%');
            Column.padding(12);
            Column.backgroundColor({ "id": 16777220, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('智能提取');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777223, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('正则结构化 · 自动去重');
            Text.fontSize(11);
            Text.fontColor({ "id": 16777224, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const entity = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create({ space: 8 });
                    Row.width('100%');
                    Row.padding({ top: 4, bottom: 4 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(entity.type);
                    Text.fontSize(11);
                    Text.fontColor({ "id": 16777219, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
                    Text.backgroundColor('#E8F0FE');
                    Text.padding({ left: 8, right: 8, top: 3, bottom: 3 });
                    Text.borderRadius(6);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(entity.value);
                    Text.fontSize(14);
                    Text.fontColor({ "id": 16777223, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
                    Text.layoutWeight(1);
                    Text.maxLines(1);
                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('复制');
                    Text.fontSize(12);
                    Text.fontColor({ "id": 16777219, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
                    Text.onClick(() => {
                        this.copyText(entity.value, '已复制');
                    });
                }, Text);
                Text.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.entities, forEachItemGenFunction, (entity: SmartEntity) => `${entity.type}:${entity.value}`, false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
    }
    /** 识别结果列表卡片 */
    ResultCard(session: OcrSession, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor({ "id": 16777220, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 12, right: 12, top: 12, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('识别结果');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777223, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${session.lines.length} 行 · 点击行可复制`);
            Text.fontSize(11);
            Text.fontColor({ "id": 16777224, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: 6 });
            List.width('100%');
            List.height(320);
            List.padding({ left: 8, right: 8, bottom: 8 });
            List.scrollBar(BarState.Auto);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const line = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, true);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create({ space: 8 });
                            Row.width('100%');
                            Row.padding({ left: 8, right: 8, top: 8, bottom: 8 });
                            Row.borderRadius(8);
                            Row.backgroundColor(this.selectedLineIndex === index ? '#E8F0FE' : '#F7F8FA');
                            Row.onClick(() => {
                                this.selectedLineIndex = index;
                                this.copyText(line.value, `已复制第 ${index + 1} 行`);
                            });
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`${index + 1}`);
                            Text.fontSize(11);
                            Text.fontColor({ "id": 16777224, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
                            Text.width(20);
                            Text.textAlign(TextAlign.Center);
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(line.value);
                            Text.fontSize(14);
                            Text.fontColor({ "id": 16777223, "type": 10001, params: [], "bundleName": "com.harmony7.ocrdemo", "moduleName": "entry" });
                            Text.layoutWeight(1);
                            Text.maxLines(3);
                            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`${line.left},${line.top}`);
                            Text.fontSize(10);
                            Text.fontColor('#B0B6BF');
                        }, Text);
                        Text.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, session.lines, forEachItemGenFunction, (line: OcrLine, index: number) => `${index}-${line.value}`, true, true);
        }, ForEach);
        ForEach.pop();
        List.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.harmony7.ocrdemo", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
