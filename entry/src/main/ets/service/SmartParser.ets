import { SmartEntity } from '../model/OcrModels';

/** 正则提取规则 */
interface PatternRule {
  type: string;
  regex: RegExp;
}

/**
 * 结构化提取器：基于正则从识别文本中提取高频实体
 */
export class SmartParser {
  private static readonly RULES: PatternRule[] = [
    { type: '手机号', regex: /1[3-9]\d{9}/g },
    { type: '邮箱', regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
    { type: '网址', regex: /https?:\/\/[A-Za-z0-9./?%&=_#-]+/g },
    { type: '金额', regex: /(?:¥|￥|\$)\s?\d+(?:\.\d{1,2})?/g },
    { type: '日期', regex: /\d{4}[-/年]\d{1,2}[-/月]\d{1,2}日?/g }
  ];

  /**
   * 从文本中提取结构化实体（自动去重）
   */
  static parse(text: string): SmartEntity[] {
    const results: SmartEntity[] = [];
    const seen: Set<string> = new Set<string>();
    for (const rule of SmartParser.RULES) {
      const matches = text.match(rule.regex);
      if (matches === null) {
        continue;
      }
      for (const value of matches) {
        const key = `${rule.type}:${value}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ type: rule.type, value: value });
        }
      }
    }
    return results;
  }
}
