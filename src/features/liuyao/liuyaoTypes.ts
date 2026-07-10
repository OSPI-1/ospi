import type { BaguaInfo, YinYangLine } from "../../data/bagua";
import type { Gua64Info } from "../../data/gua64";

export type YaoValue = 6 | 7 | 8 | 9;
export type LiuyaoBinaryLine = 0 | 1;

export interface LiuyaoInput {
  lines: YaoValue[];
  question?: string;
}

export interface LiuyaoLineState {
  value: YaoValue;
  line: YinYangLine;
  changedLine: YinYangLine;
  moving: boolean;
}

export interface LiuyaoResult {
  originalLines: LiuyaoBinaryLine[];
  changedLines: LiuyaoBinaryLine[];
  originalYinYangLines: YinYangLine[];
  changedYinYangLines: YinYangLine[];
  movingIndexes: number[];
  lineStates: LiuyaoLineState[];
  upper: BaguaInfo;
  lower: BaguaInfo;
  changedUpper: BaguaInfo;
  changedLower: BaguaInfo;
  hexagram: Gua64Info;
  changedHexagram: Gua64Info;
  reflection: string;
}
