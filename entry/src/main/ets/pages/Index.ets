import { common } from '@kit.AbilityKit';
import { BusinessError, pasteboard } from '@kit.BasicServicesKit';
import { image } from '@kit.ImageKit';
import { Logger } from '../common/Logger';
import { OcrError, OcrLine, OcrSession, SmartEntity } from '../model/OcrModels';
import { ImagePickerService } from '../service/ImagePickerService';
import { OcrService } from '../service/OcrService';
import { SmartParser } from '../service/SmartParser';

/**
 * OCR 智识主页：选图/拍照 -> 端侧识别 -> 结构化展示
 */
@Entry
@Component
struct Index {
  /** 解码后的预览图 */
  @State previewPixelMap: image.PixelMap | undefined = undefined;
  /** 识别进行中标记（防重入 + Loading 展示） */
  @State running: boolean = false;
  /** 识别会话数据（结果 + 性能统计） */
  @State session: OcrSession | undefined = undefined;
  /** 结构化提取的实体 */
  @State entities: SmartEntity[] = [];
  /** 当前选中的行下标 */
  @State selectedLineIndex: number = -1;

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
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      const error = e as OcrError;
      Logger.error(`OCR failed, code: ${error.code}, message: ${error.message}`);
      this.showToast(OcrService.describeError(error));
    } finally {
      this.running = false;
    }
  }

  private async copyText(text: string, tip: string): Promise<void> {
    try {
      const data = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
      await pasteboard.getSystemPasteboard().setData(data);
      this.showToast(tip);
    } catch (e) {
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
    } catch (e) {
      const error = e as BusinessError;
      Logger.error(`showToast failed, code: ${error.code}, message: ${error.message}`);
    }
  }

  // ==================== 视图构建 ====================

  build() {
    Column() {
      // 顶部品牌区
      Column({ space: 4 }) {
        Text('OCR 智识')
          .fontSize(26)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
        Text('HarmonyOS 端侧通用文字识别实战 · Core Vision Kit')
          .fontSize(12)
          .fontColor('#D9E4FF')
      }
      .width('100%')
      .alignItems(HorizontalAlign.Start)
      .padding({ left: 20, right: 20, top: 18, bottom: 18 })
      .linearGradient({
        angle: 135,
        colors: [['#0A59F7', 0.0], ['#4D8DFF', 1.0]]
      })

      Scroll() {
        Column({ space: 12 }) {
          // 图片预览
          this.PreviewCard()

          // 操作按钮
          Row({ space: 12 }) {
            Button('相册选图')
              .layoutWeight(1)
              .height(44)
              .fontSize(15)
              .backgroundColor($r('app.color.brand_color'))
              .enabled(!this.running)
              .onClick(() => {
                this.pickFromGallery();
              })
            Button('拍照识别')
              .layoutWeight(1)
              .height(44)
              .fontSize(15)
              .backgroundColor('#FFFFFF')
              .fontColor($r('app.color.brand_color'))
              .border({ width: 1, color: $r('app.color.brand_color') })
              .enabled(!this.running)
              .onClick(() => {
                this.takePhoto();
              })
          }
          .width('100%')

          // 识别进行中
          if (this.running) {
            Row({ space: 10 }) {
              LoadingProgress()
                .width(22)
                .height(22)
                .color($r('app.color.brand_color'))
              Text('正在进行端侧识别…')
                .fontSize(14)
                .fontColor($r('app.color.text_secondary'))
            }
            .width('100%')
            .justifyContent(FlexAlign.Center)
            .padding(10)
          }

          // 性能统计
          if (this.session !== undefined) {
            this.StatsCard(this.session)
          }

          // 智能提取
          if (this.entities.length > 0) {
            this.EntityCard()
          }

          // 识别结果
          if (this.session !== undefined) {
            this.ResultCard(this.session)
          }

          // 空态提示
          if (this.session === undefined && !this.running) {
            Text('支持相册选图或拍照，识别全程在本机完成，图片不出设备')
              .fontSize(12)
              .fontColor($r('app.color.text_secondary'))
              .width('100%')
              .textAlign(TextAlign.Center)
              .padding({ top: 8, bottom: 8 })
          }
        }
        .width('100%')
        .padding(16)
      }
      .layoutWeight(1)
      .align(Alignment.Top)

      // 底部操作条
      if (this.session !== undefined) {
        Row({ space: 12 }) {
          Button('复制全文')
            .layoutWeight(1)
            .height(44)
            .fontSize(15)
            .backgroundColor($r('app.color.brand_color'))
            .onClick(() => {
              this.copyFullText();
            })
          Button('清空')
            .layoutWeight(1)
            .height(44)
            .fontSize(15)
            .backgroundColor('#FFFFFF')
            .fontColor($r('app.color.text_primary'))
            .border({ width: 1, color: '#D5D9E0' })
            .onClick(() => {
              this.clearAll();
            })
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 8, bottom: 12 })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.page_background'))
  }

  /** 图片预览卡片 */
  @Builder
  PreviewCard() {
    Column() {
      if (this.previewPixelMap !== undefined) {
        Image(this.previewPixelMap)
          .width('100%')
          .height(220)
          .objectFit(ImageFit.Contain)
          .borderRadius(10)
          .backgroundColor('#F7F8FA')
      } else {
        Column({ space: 6 }) {
          Text('+')
            .fontSize(36)
            .fontWeight(FontWeight.Lighter)
            .fontColor('#C2C8D1')
          Text('选择或拍摄包含文字的图片')
            .fontSize(13)
            .fontColor($r('app.color.text_secondary'))
        }
        .width('100%')
        .height(160)
        .justifyContent(FlexAlign.Center)
        .backgroundColor('#F7F8FA')
        .borderRadius(10)
      }
    }
    .width('100%')
    .padding(10)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius(16)
  }

  /** 性能统计卡片 */
  @Builder
  StatsCard(session: OcrSession) {
    Column({ space: 10 }) {
      Row() {
        Text('本次识别')
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor($r('app.color.text_primary'))
        Blank()
        Text(session.totalCost < 1000 ? `${session.totalCost} ms` : `${(session.totalCost / 1000).toFixed(2)} s`)
          .fontSize(13)
          .fontColor($r('app.color.brand_color'))
      }
      .width('100%')

      Row() {
        this.StatItem('解码', `${session.decodeCost} ms`)
        this.StatItem('识别', `${session.recognizeCost} ms`)
        this.StatItem('文本块', `${session.blockCount}`)
        this.StatItem('文本行', `${session.lines.length}`)
      }
      .width('100%')
    }
    .width('100%')
    .padding(12)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius(16)
  }

  @Builder
  StatItem(label: string, value: string) {
    Column({ space: 4 }) {
      Text(value)
        .fontSize(15)
        .fontWeight(FontWeight.Medium)
        .fontColor($r('app.color.text_primary'))
      Text(label)
        .fontSize(11)
        .fontColor($r('app.color.text_secondary'))
    }
    .layoutWeight(1)
  }

  /** 智能提取卡片 */
  @Builder
  EntityCard() {
    Column({ space: 8 }) {
      Row() {
        Text('智能提取')
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor($r('app.color.text_primary'))
        Blank()
        Text('正则结构化 · 自动去重')
          .fontSize(11)
          .fontColor($r('app.color.text_secondary'))
      }
      .width('100%')

      ForEach(this.entities, (entity: SmartEntity) => {
        Row({ space: 8 }) {
          Text(entity.type)
            .fontSize(11)
            .fontColor($r('app.color.brand_color'))
            .backgroundColor('#E8F0FE')
            .padding({ left: 8, right: 8, top: 3, bottom: 3 })
            .borderRadius(6)
          Text(entity.value)
            .fontSize(14)
            .fontColor($r('app.color.text_primary'))
            .layoutWeight(1)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
          Text('复制')
            .fontSize(12)
            .fontColor($r('app.color.brand_color'))
            .onClick(() => {
              this.copyText(entity.value, '已复制');
            })
        }
        .width('100%')
        .padding({ top: 4, bottom: 4 })
      }, (entity: SmartEntity) => `${entity.type}:${entity.value}`)
    }
    .width('100%')
    .padding(12)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius(16)
  }

  /** 识别结果列表卡片 */
  @Builder
  ResultCard(session: OcrSession) {
    Column() {
      Row() {
        Text('识别结果')
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor($r('app.color.text_primary'))
        Blank()
        Text(`${session.lines.length} 行 · 点击行可复制`)
          .fontSize(11)
          .fontColor($r('app.color.text_secondary'))
      }
      .width('100%')
      .padding({ left: 12, right: 12, top: 12, bottom: 8 })

      List({ space: 6 }) {
        ForEach(session.lines, (line: OcrLine, index: number) => {
          ListItem() {
            Row({ space: 8 }) {
              Text(`${index + 1}`)
                .fontSize(11)
                .fontColor($r('app.color.text_secondary'))
                .width(20)
                .textAlign(TextAlign.Center)
              Text(line.value)
                .fontSize(14)
                .fontColor($r('app.color.text_primary'))
                .layoutWeight(1)
                .maxLines(3)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
              Text(`${line.left},${line.top}`)
                .fontSize(10)
                .fontColor('#B0B6BF')
            }
            .width('100%')
            .padding({ left: 8, right: 8, top: 8, bottom: 8 })
            .borderRadius(8)
            .backgroundColor(this.selectedLineIndex === index ? '#E8F0FE' : '#F7F8FA')
            .onClick(() => {
              this.selectedLineIndex = index;
              this.copyText(line.value, `已复制第 ${index + 1} 行`);
            })
          }
        }, (line: OcrLine, index: number) => `${index}-${line.value}`)
      }
      .width('100%')
      .height(320)
      .padding({ left: 8, right: 8, bottom: 8 })
      .scrollBar(BarState.Auto)
    }
    .width('100%')
    .backgroundColor($r('app.color.card_background'))
    .borderRadius(16)
  }
}
