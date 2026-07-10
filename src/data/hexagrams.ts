import { getGua64, gua64, type Gua64Info } from "./gua64";
import type { TrigramId } from "./trigrams";

export interface HexagramInfo {
  id: string;
  upper: TrigramId;
  lower: TrigramId;
  name: string;
  meaning: string;
  reflectionPrompt: string;
}

export type Hexagram = HexagramInfo;

const toHexagramInfo = (item: Gua64Info): HexagramInfo => ({
  id: item.id,
  upper: item.upper,
  lower: item.lower,
  name: item.name,
  meaning: item.meaning,
  reflectionPrompt: item.reflectionPrompt
});

export const hexagrams: HexagramInfo[] = gua64.map(toHexagramInfo);

export const hexagramsById = Object.fromEntries(hexagrams.map((item) => [item.id, item])) as Record<string, HexagramInfo>;
export const hexagramsByName = Object.fromEntries(hexagrams.map((item) => [item.name, item])) as Record<string, HexagramInfo>;

export const getHexagram = (upper: TrigramId, lower: TrigramId): HexagramInfo => {
  const found = getGua64(upper, lower);
  return toHexagramInfo(found);
};
