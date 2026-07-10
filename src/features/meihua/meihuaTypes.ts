import type { BaguaInfo, YinYangLine } from "../../data/bagua";
import type { Gua64Info } from "../../data/gua64";

export type MeihuaMode = "number" | "time";
export type MeihuaBinaryLine = 0 | 1;

export interface MeihuaTrigram extends BaguaInfo {
  copy: string;
}

export interface MeihuaInput {
  mode: MeihuaMode;
  firstNumber?: number;
  secondNumber?: number;
  movingNumber?: number;
  when?: Date;
}

export interface MeihuaResult {
  mode: MeihuaMode;
  upper: MeihuaTrigram;
  lower: MeihuaTrigram;
  mutualUpper: MeihuaTrigram;
  mutualLower: MeihuaTrigram;
  changedUpper: MeihuaTrigram;
  changedLower: MeihuaTrigram;
  movingLine: number;
  originalLines: MeihuaBinaryLine[];
  changedLines: MeihuaBinaryLine[];
  mutualLines: MeihuaBinaryLine[];
  originalYinYangLines: YinYangLine[];
  changedYinYangLines: YinYangLine[];
  mutualYinYangLines: YinYangLine[];
  hexagram: Gua64Info;
  mutualHexagram: Gua64Info;
  changedHexagram: Gua64Info;
  reflection: string;
}
