/**
 * OCR 数据模型定义
 */

/**
 * OCR 业务异常
 * ArkTS 限制 throw 只能抛出 Error 及其派生类，
 * 因此统一用该类承载业务错误码，供 UI 层按码提示
 */
export class OcrError extends Error {
  /** 业务错误码（1001400001 识别失败 / 1001400002 服务异常等） */
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = 'OcrError';
    this.code = code;
  }
}

/** 识别出的文本行（含外框左上角坐标） */
export interface OcrLine {
  /** 行文本内容 */
  value: string;
  /** 行外框左上角 X 坐标 */
  left: number;
  /** 行外框左上角 Y 坐标 */
  top: number;
}

/** 结构化提取的实体 */
export interface SmartEntity {
  /** 实体类型（手机号/邮箱/网址/金额/日期） */
  type: string;
  /** 实体内容 */
  value: string;
}

/** 一次完整识别会话的结果与性能数据 */
export interface OcrSession {
  /** 整图识别出的全量文本 */
  fullText: string;
  /** 逐行文本（含坐标） */
  lines: OcrLine[];
  /** 文本块数量 */
  blockCount: number;
  /** 图像解码耗时（ms） */
  decodeCost: number;
  /** 端侧推理识别耗时（ms） */
  recognizeCost: number;
  /** 端到端总耗时（ms） */
  totalCost: number;
}
