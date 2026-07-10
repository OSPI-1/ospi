import { describe, expect, it } from "vitest";
import { bagua, baguaById, baguaByLines, type BaguaId } from "../data/bagua";
import { fiveElements } from "../data/fiveElements";
import { dizhi, tiangan } from "../data/ganzhi";
import { getGua64, gua64 } from "../data/gua64";
import { getHexagram, hexagrams } from "../data/hexagrams";
import { homeCopy, moduleCopy } from "../data/moduleCopy";
import { aboutCopy, historyCopy, moduleCardCopy, resultCopy } from "../data/uiCopy";
import { trigramByLines, trigramByOrder, trigrams } from "../data/trigrams";

const forbiddenPhrases = [
  "一定发财",
  "必有灾祸",
  "婚姻必败",
  "必须辞职",
  "必须投资",
  "改运",
  "化解",
  "开运商品",
  "准确率保证"
];

const expectedBaguaLines: Record<BaguaId, [boolean, boolean, boolean]> = {
  qian: [true, true, true],
  dui: [true, true, false],
  li: [true, false, true],
  zhen: [true, false, false],
  xun: [false, true, true],
  kan: [false, true, false],
  gen: [false, false, true],
  kun: [false, false, false]
};

const fixedGua64Cases: Array<{ upper: BaguaId; lower: BaguaId; expectedName: string }> = [
  { upper: "qian", lower: "qian", expectedName: "乾为天" },
  { upper: "kun", lower: "kun", expectedName: "坤为地" },
  { upper: "kan", lower: "li", expectedName: "水火既济" },
  { upper: "li", lower: "kan", expectedName: "火水未济" },
  { upper: "xun", lower: "zhen", expectedName: "风雷益" },
  { upper: "zhen", lower: "xun", expectedName: "雷风恒" },
  { upper: "dui", lower: "gen", expectedName: "泽山咸" },
  { upper: "gen", lower: "dui", expectedName: "山泽损" }
];

const fixedLegacyHexagramCases: Array<{ upper: BaguaId; lower: BaguaId; expectedName: string }> = [
  { upper: "qian", lower: "qian", expectedName: "乾为天" },
  { upper: "kun", lower: "kun", expectedName: "坤为地" },
  { upper: "kan", lower: "li", expectedName: "水火既济" },
  { upper: "li", lower: "kan", expectedName: "火水未济" }
];

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(collectStrings);
  }
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
};

const allCopy = [
  ...bagua.flatMap((item) => [item.meaning, item.reflectionPrompt]),
  ...gua64.flatMap((item) => [item.meaning, item.reflectionPrompt]),
  ...fiveElements.map((item) => item.meaning),
  ...tiangan.map((item) => item.meaning),
  ...dizhi.map((item) => item.meaning),
  ...collectStrings(homeCopy),
  ...collectStrings(moduleCopy),
  ...collectStrings(aboutCopy),
  ...collectStrings(historyCopy),
  ...collectStrings(moduleCardCopy),
  ...collectStrings(resultCopy)
].join("\n");

describe("data integrity", () => {
  it("contains the required base data counts", () => {
    expect(bagua).toHaveLength(8);
    expect(gua64).toHaveLength(64);
    expect(fiveElements).toHaveLength(5);
    expect(tiangan).toHaveLength(10);
    expect(dizhi).toHaveLength(12);
  });

  it("uses bottom-to-top boolean lines for bagua", () => {
    Object.entries(expectedBaguaLines).forEach(([id, lines]) => {
      const item = baguaById[id as BaguaId];
      expect(item.lines).toEqual(lines);
      expect(item.lines.every((line) => typeof line === "boolean")).toBe(true);
      expect(baguaByLines(lines).id).toBe(id);
    });
  });

  it("uses the required xiantian order for bagua", () => {
    expect(baguaById.qian.order).toBe(1);
    expect(baguaById.dui.order).toBe(2);
    expect(baguaById.li.order).toBe(3);
    expect(baguaById.zhen.order).toBe(4);
    expect(baguaById.xun.order).toBe(5);
    expect(baguaById.kan.order).toBe(6);
    expect(baguaById.gen.order).toBe(7);
    expect(baguaById.kun.order).toBe(8);
  });

  it("keeps five-element generation and control relationships closed", () => {
    const ids = new Set(fiveElements.map((item) => item.id));
    fiveElements.forEach((item) => {
      expect(ids.has(item.generates)).toBe(true);
      expect(ids.has(item.generatedBy)).toBe(true);
      expect(ids.has(item.controls)).toBe(true);
      expect(ids.has(item.controlledBy)).toBe(true);

      const generated = fiveElements.find((candidate) => candidate.id === item.generates);
      const controlled = fiveElements.find((candidate) => candidate.id === item.controls);
      expect(generated?.generatedBy).toBe(item.id);
      expect(controlled?.controlledBy).toBe(item.id);
    });
  });

  it("keeps all gua64 upper and lower ids linked to bagua", () => {
    const baguaIds = new Set(bagua.map((item) => item.id));
    const guaIds = new Set(gua64.map((item) => item.id));
    expect(guaIds.size).toBe(64);

    gua64.forEach((item) => {
      expect(baguaIds.has(item.upper)).toBe(true);
      expect(baguaIds.has(item.lower)).toBe(true);
      expect(item.meaning.length).toBeGreaterThan(0);
      expect(item.reflectionPrompt.length).toBeGreaterThan(0);
    });
  });

  it("keeps fixed gua64 upper-lower semantic mappings", () => {
    fixedGua64Cases.forEach(({ upper, lower, expectedName }) => {
      const gua = getGua64(upper, lower);
      expect(gua.name).toBe(expectedName);
      expect(gua.upper).toBe(upper);
      expect(gua.lower).toBe(lower);
    });
  });

  it("keeps legacy trigram exports mapped to bagua data", () => {
    expect(trigrams).toHaveLength(8);
    expect(trigramByLines([1, 1, 1]).id).toBe("qian");
    expect(trigramByLines([true, true, false]).id).toBe("dui");
    expect(trigramByLines([0, 1, 0]).id).toBe("kan");
    expect(trigramByOrder(1).id).toBe("qian");
    expect(trigramByOrder(8).id).toBe("kun");
    expect(trigramByOrder(9).id).toBe("qian");
  });

  it("keeps legacy hexagram exports mapped to gua64 data", () => {
    expect(hexagrams).toHaveLength(64);
    fixedLegacyHexagramCases.forEach(({ upper, lower, expectedName }) => {
      const gua = getHexagram(upper, lower);
      expect(gua.name).toBe(expectedName);
      expect(gua.upper).toBe(upper);
      expect(gua.lower).toBe(lower);
    });
  });

  it("does not include forbidden deterministic or commercial phrases", () => {
    forbiddenPhrases.forEach((phrase) => {
      expect(allCopy.includes(phrase)).toBe(false);
    });
  });
});
