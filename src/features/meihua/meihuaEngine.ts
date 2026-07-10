import { baguaByLines, baguaByOrder, type BaguaInfo, type YinYangLine } from "../../data/bagua";
import { getGua64 } from "../../data/gua64";
import type { MeihuaBinaryLine, MeihuaInput, MeihuaResult, MeihuaTrigram } from "./meihuaTypes";

const modBase = (value: number, base: number) => {
  const result = value % base;
  return result === 0 ? base : result;
};

const toBinaryLine = (line: YinYangLine): MeihuaBinaryLine => (line ? 1 : 0);

const toMeihuaTrigram = (item: BaguaInfo): MeihuaTrigram => ({
  ...item,
  copy: item.meaning
});

const toBaguaLines = (lines: readonly YinYangLine[]): [YinYangLine, YinYangLine, YinYangLine] => {
  if (lines.length !== 3) {
    throw new Error(`梅花易数三爻数据长度不正确：${lines.length}`);
  }

  return [lines[0], lines[1], lines[2]];
};

const changeLine = (lines: readonly YinYangLine[], movingLine: number) =>
  lines.map((line, index) => (index + 1 === movingLine ? !line : line));

const getMutualLines = (lines: readonly YinYangLine[]) => {
  if (lines.length !== 6) {
    throw new Error(`梅花易数六爻数据长度不正确：${lines.length}`);
  }

  const lower = toBaguaLines([lines[1], lines[2], lines[3]]);
  const upper = toBaguaLines([lines[2], lines[3], lines[4]]);
  return {
    lower,
    upper,
    all: [...lower, ...upper]
  };
};

export const calculateMeihua = (input: MeihuaInput): MeihuaResult => {
  let upperSeed: number;
  let lowerSeed: number;
  let movingSeed: number;

  if (input.mode === "number") {
    if (!input.firstNumber || !input.secondNumber || input.firstNumber < 1 || input.secondNumber < 1) {
      throw new Error("数字起卦需要两个大于 0 的整数。");
    }
    if (input.movingNumber !== undefined && input.movingNumber < 1) {
      throw new Error("动爻数字需要大于 0。");
    }
    upperSeed = input.firstNumber;
    lowerSeed = input.secondNumber;
    movingSeed = input.movingNumber ?? input.firstNumber + input.secondNumber;
  } else {
    const when = input.when ?? new Date();
    upperSeed = when.getFullYear() + when.getMonth() + 1 + when.getDate();
    lowerSeed = upperSeed + when.getHours();
    movingSeed = lowerSeed;
  }

  const upper = toMeihuaTrigram(baguaByOrder(modBase(upperSeed, 8)));
  const lower = toMeihuaTrigram(baguaByOrder(modBase(lowerSeed, 8)));
  const movingLine = modBase(movingSeed, 6);
  const originalYinYangLines = [...lower.lines, ...upper.lines];
  const changedYinYangLines = changeLine(originalYinYangLines, movingLine);
  const mutual = getMutualLines(originalYinYangLines);

  const mutualLower = toMeihuaTrigram(baguaByLines(mutual.lower));
  const mutualUpper = toMeihuaTrigram(baguaByLines(mutual.upper));
  const changedLower = toMeihuaTrigram(baguaByLines(toBaguaLines(changedYinYangLines.slice(0, 3))));
  const changedUpper = toMeihuaTrigram(baguaByLines(toBaguaLines(changedYinYangLines.slice(3, 6))));

  return {
    mode: input.mode,
    upper,
    lower,
    mutualUpper,
    mutualLower,
    changedUpper,
    changedLower,
    movingLine,
    originalLines: originalYinYangLines.map(toBinaryLine),
    changedLines: changedYinYangLines.map(toBinaryLine),
    mutualLines: mutual.all.map(toBinaryLine),
    originalYinYangLines,
    changedYinYangLines,
    mutualYinYangLines: mutual.all,
    hexagram: getGua64(upper.id, lower.id),
    mutualHexagram: getGua64(mutualUpper.id, mutualLower.id),
    changedHexagram: getGua64(changedUpper.id, changedLower.id),
    reflection: `动爻在第 ${movingLine} 爻。可把上卦理解为外在情境，下卦理解为内在基础，变卦用于观察调整后的关系。`
  };
};
