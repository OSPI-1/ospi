import { baguaByLines, type YinYangLine } from "../../data/bagua";
import { getGua64 } from "../../data/gua64";
import type { LiuyaoBinaryLine, LiuyaoInput, LiuyaoLineState, LiuyaoResult, YaoValue } from "./liuyaoTypes";

const yinYangToBinaryLine = (line: YinYangLine): LiuyaoBinaryLine => (line ? 1 : 0);

export const resolveYaoValue = (value: YaoValue): LiuyaoLineState => {
  const line = value === 7 || value === 9;
  const moving = value === 6 || value === 9;

  return {
    value,
    line,
    changedLine: moving ? !line : line,
    moving
  };
};

export const calculateLiuyao = (input: LiuyaoInput): LiuyaoResult => {
  if (input.lines.length !== 6) {
    throw new Error("六爻需要自下而上输入 6 条爻。");
  }

  const lineStates = input.lines.map(resolveYaoValue);
  const originalYinYangLines = lineStates.map((item) => item.line);
  const changedYinYangLines = lineStates.map((item) => item.changedLine);
  const movingIndexes = lineStates.flatMap((item, index) => (item.moving ? [index + 1] : []));

  const lower = baguaByLines(originalYinYangLines.slice(0, 3));
  const upper = baguaByLines(originalYinYangLines.slice(3, 6));
  const changedLower = baguaByLines(changedYinYangLines.slice(0, 3));
  const changedUpper = baguaByLines(changedYinYangLines.slice(3, 6));
  const hexagram = getGua64(upper.id, lower.id);
  const changedHexagram = getGua64(changedUpper.id, changedLower.id);

  const movingText =
    movingIndexes.length > 0 ? `动爻在第 ${movingIndexes.join("、")} 爻。` : "本次没有动爻，结构较稳定。";

  return {
    originalLines: originalYinYangLines.map(yinYangToBinaryLine),
    changedLines: changedYinYangLines.map(yinYangToBinaryLine),
    originalYinYangLines,
    changedYinYangLines,
    movingIndexes,
    lineStates,
    upper,
    lower,
    changedUpper,
    changedLower,
    hexagram,
    changedHexagram,
    reflection: `${movingText}可从本卦看当前结构，从变卦看变化后的关系；建议把它当作复盘问题的提示，而不是现实结论。`
  };
};
