import {
  bagua,
  baguaById,
  baguaByName,
  baguaByOrder,
  type BaguaId,
  type BaguaInfo,
  type YinYangLine
} from "./bagua";

export type BinaryLine = 0 | 1;
export type CompatibleLine = BinaryLine | YinYangLine;
export type TrigramId = BaguaId;

export interface Trigram {
  id: TrigramId;
  order: number;
  name: string;
  symbol: string;
  nature: string;
  lines: [BinaryLine, BinaryLine, BinaryLine];
  copy: string;
  element: BaguaInfo["element"];
  direction: string;
  meaning: string;
  reflectionPrompt: string;
}

const toBinaryLine = (line: CompatibleLine): BinaryLine => (line === true || line === 1 ? 1 : 0);

const toBinaryLines = (lines: readonly CompatibleLine[]): [BinaryLine, BinaryLine, BinaryLine] => {
  if (lines.length !== 3) {
    throw new Error(`Unknown trigram lines length: ${lines.length}`);
  }

  return [toBinaryLine(lines[0]), toBinaryLine(lines[1]), toBinaryLine(lines[2])];
};

const toYinYangLines = (lines: readonly CompatibleLine[]): [YinYangLine, YinYangLine, YinYangLine] => {
  const binaryLines = toBinaryLines(lines);
  return [binaryLines[0] === 1, binaryLines[1] === 1, binaryLines[2] === 1];
};

const toTrigram = (item: BaguaInfo): Trigram => ({
  id: item.id,
  order: item.order,
  name: item.name,
  symbol: item.symbol,
  nature: item.nature,
  lines: toBinaryLines(item.lines),
  copy: item.meaning,
  element: item.element,
  direction: item.direction,
  meaning: item.meaning,
  reflectionPrompt: item.reflectionPrompt
});

export const trigrams: Trigram[] = bagua.map(toTrigram);

export const trigramsById = Object.fromEntries(trigrams.map((item) => [item.id, item])) as Record<TrigramId, Trigram>;
export const trigramsByName = Object.fromEntries(trigrams.map((item) => [item.name, item])) as Record<string, Trigram>;

export const normalizeTrigramLines = toBinaryLines;

export const trigramByLines = (lines: readonly CompatibleLine[]) => {
  const yinYangLines = toYinYangLines(lines);
  const found = bagua.find((item) => item.lines.every((line, index) => line === yinYangLines[index]));
  if (!found) {
    throw new Error(`Unknown trigram lines: ${toBinaryLines(lines).join("")}`);
  }
  return trigramsById[found.id];
};

export const trigramByOrder = (order: number) => {
  const found = baguaByOrder(order);
  return trigramsById[found.id];
};

export { baguaById as trigramsSourceById, baguaByName as trigramsSourceByName };
