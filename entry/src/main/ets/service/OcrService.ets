import { textRecognition } from '@kit.CoreVisionKit';
import { image } from '@kit.ImageKit';
import { fileIo } from '@kit.CoreFileKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { Logger } from '../common/Logger';
import { OcrError, OcrLine, OcrSession } from '../model/OcrModels';

/** 解码长边上限：超过则等比降采样，避免大图 OOM 并加速端侧推理 */
const MAX_DECODE_SIZE: number = 2048;

/** 识别执行结果：识别数据 + 解码后的预览图 */
export interface OcrRunResult {
  session: OcrSession;
  pixelMap: image.PixelMap;
}

/**
 * OCR 核心服务：图像解码（自动降采样）+ Core Vision Kit 端侧文字识别 + 性能统计
 */
export class OcrService {
  private static inited: boolean = false;

  /**
   * 初始化 OCR 引擎（首次调用会加载模型，建议提前预热）
   */
  static async init(): Promise<void> {
    if (OcrService.inited) {
      return;
    }
    try {
      await textRecognition.init();
      OcrService.inited = true;
      Logger.info('OCR service init success');
    } catch (e) {
      const error = e as BusinessError;
      Logger.error(`OCR service init failed, code: ${error.code}, message: ${error.message}`);
    }
  }

  /**
   * 释放 OCR 引擎（页面销毁时调用，成对使用避免资源泄漏）
   */
  static async release(): Promise<void> {
    if (!OcrService.inited) {
      return;
    }
    try {
      await textRecognition.release();
      OcrService.inited = false;
      Logger.info('OCR service released');
    } catch (e) {
      const error = e as BusinessError;
      Logger.error(`OCR service release failed, code: ${error.code}, message: ${error.message}`);
    }
  }

  /**
   * 解码图片为 PixelMap（自动等比降采样）
   * @param uri 图片 uri（图库/相机 picker 返回）
   */
  private static async decodePixelMap(uri: string): Promise<image.PixelMap> {
    let file: fileIo.File | undefined = undefined;
    try {
      file = fileIo.openSync(uri, fileIo.OpenMode.READ_ONLY);
      const source = image.createImageSource(file.fd);
      const info: image.ImageInfo = await source.getImageInfo();
      const options: image.DecodingOptions = {};
      // 统一按 RGBA_8888 解码，保证端侧模型输入格式一致
      options.desiredPixelFormat = image.PixelMapFormat.RGBA_8888;
      const width = info.size.width;
      const height = info.size.height;
      const longSide = Math.max(width, height);
      if (longSide > MAX_DECODE_SIZE) {
        // 长边超过 2048 时等比缩小：文本行仍清晰可辨，同时显著降低内存与推理耗时
        const scale = MAX_DECODE_SIZE / longSide;
        options.desiredSize = {
          width: Math.round(width * scale),
          height: Math.round(height * scale)
        };
      }
      return await source.createPixelMap(options);
    } catch (e) {
      // 无效 uri、格式不支持等解码异常统一转为业务异常上抛
      const error = e as BusinessError;
      Logger.error(`decodePixelMap failed, code: ${error.code}, message: ${error.message}`);
      throw new OcrError(error.code, `图片解码失败：${error.message}`);
    } finally {
      // fd 必须及时关闭，否则重复识别会耗尽文件句柄
      if (file !== undefined) {
        try {
          fileIo.closeSync(file);
        } catch (e) {
          const error = e as BusinessError;
          Logger.warn(`close file failed, code: ${error.code}, message: ${error.message}`);
        }
      }
    }
  }

  /**
   * 识别图片中的文字（解码 + 端侧推理 + 结构化 + 耗时统计）
   * @param uri 图片 uri
   */
  static async recognize(uri: string): Promise<OcrRunResult> {
    const totalStart = Date.now();

    // 1. 图像解码（含降采样）
    const decodeStart = Date.now();
    const pixelMap = await OcrService.decodePixelMap(uri);
    const decodeCost = Date.now() - decodeStart;

    // 2. 端侧文字识别
    const recognizeStart = Date.now();
    const visionInfo: textRecognition.VisionInfo = { pixelMap: pixelMap };
    const configuration: textRecognition.TextRecognitionConfiguration = {
      isDirectionDetectionSupported: true
    };
    const result = await OcrService.runRecognize(visionInfo, configuration);
    const recognizeCost = Date.now() - recognizeStart;

    // 3. 结果扁平化：block -> line -> 坐标（cornerPoints 首点为外框左上角）
    const lines: OcrLine[] = [];
    for (const block of result.blocks) {
      for (const line of block.lines) {
        const points = line.cornerPoints;
        lines.push({
          value: line.value,
          left: points.length > 0 ? Math.round(points[0].x) : 0,
          top: points.length > 0 ? Math.round(points[0].y) : 0
        });
      }
    }

    const session: OcrSession = {
      fullText: result.value,
      lines: lines,
      blockCount: result.blocks.length,
      decodeCost: decodeCost,
      recognizeCost: recognizeCost,
      totalCost: Date.now() - totalStart
    };
    Logger.info(`OCR done, lines: ${lines.length}, total: ${session.totalCost}ms ` +
      `(decode: ${decodeCost}ms, recognize: ${recognizeCost}ms)`);
    return { session: session, pixelMap: pixelMap };
  }

  /**
   * 调用端侧识别能力（业务异常统一记录后上抛，由页面按错误码提示）
   */
  private static async runRecognize(visionInfo: textRecognition.VisionInfo,
    configuration: textRecognition.TextRecognitionConfiguration): Promise<textRecognition.TextRecognitionResult> {
    try {
      return await textRecognition.recognizeText(visionInfo, configuration);
    } catch (e) {
      const error = e as BusinessError;
      Logger.error(`recognizeText failed, code: ${error.code}, message: ${error.message}`);
      throw new OcrError(error.code, error.message);
    }
  }

  /**
   * 错误码 -> 用户可读文案
   */
  static describeError(error: OcrError): string {
    switch (error.code) {
      case 200:
        return '识别超时，请重试';
      case 401:
        return '图片参数异常，请更换图片重试';
      case 1001400001:
        return '识别失败，请重试';
      case 1001400002:
        return 'OCR 服务异常，当前设备可能不支持该能力';
      default:
        return `识别失败（错误码 ${error.code}）`;
    }
  }
}
