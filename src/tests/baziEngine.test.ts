import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBaziHistoryDetails } from "../components/HistoryList";
import { branchElements, stemElements } from "../data/ganzhi";
import { baziInputCopy, resultCopy } from "../data/uiCopy";
import {
  BAZI_MAX_DATE,
  BAZI_MIN_DATE,
  createBaziFormSubmission,
  createDefaultBaziInput,
  validateBaziInput
} from "../features/bazi/BaziForm";
import { calculateBazi, countPillarElements } from "../features/bazi/baziEngine";
import { getFiveElementDisplayData } from "../features/bazi/FiveElementsChart";
import { getBaziPillarDisplayData } from "../features/bazi/FourPillarsDisplay";
import type { BaziInput, Pillars } from "../features/bazi/baziTypes";
import { createBaziHistoryPayload } from "../routes/BaziPage";
import { clearHistory, loadHistory, saveHistoryItem } from "../utils/storage";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

beforeEach(() => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: new MemoryStorage() }
  });
});

const forbiddenPhrases = [
  "一定发财",
  "必有灾祸",
  "婚姻必败",
  "必须辞职",
  "必须投资",
  "改运",
  "化解",
  "开运商品",
  "准确率保证",
  "命中注定",
  "寿命判断",
  "疾病诊断",
  "喜用神推荐"
];

const fixedInput = {
  birthDate: "1990-01-01",
  birthTime: "08:00",
  gender: "unspecified" as const
};

const totalElements = (counts: Record<string, number>) => Object.values(counts).reduce((sum, value) => sum + value, 0);

describe("calculateBazi", () => {
  it("keeps the existing fixed sample pillars and eight counted elements", () => {
    const result = calculateBazi(fixedInput);

    expect(result.pillars).toEqual({
      year: "己巳",
      month: "丙子",
      day: "丙寅",
      hour: "壬辰"
    });
    expect(totalElements(result.elementCounts)).toBe(8);
  });

  it("counts stem and branch elements through ganzhi data", () => {
    const pillars: Pillars = {
      year: "甲子",
      month: "丙午",
      day: "庚申",
      hour: "戊辰"
    };

    expect(stemElements.甲).toBe("木");
    expect(branchElements.子).toBe("水");
    expect(countPillarElements(pillars)).toEqual({
      金: 2,
      木: 1,
      水: 1,
      火: 2,
      土: 2
    });
  });

  it("keeps the fixed sample element distribution unchanged", () => {
    const result = calculateBazi(fixedInput);

    expect(result.elementCounts).toEqual({
      金: 0,
      木: 1,
      水: 2,
      火: 3,
      土: 2
    });
    expect(result.dominantElements).toEqual(["火"]);
  });

  it("keeps the result shape required by the existing page", () => {
    const result = calculateBazi(fixedInput);

    expect(result).toHaveProperty("pillars");
    expect(result).toHaveProperty("elementCounts");
    expect(result).toHaveProperty("dominantElements");
    expect(result).toHaveProperty("notes");
    expect(result).toHaveProperty("assumption");
    expect(Array.isArray(result.notes)).toBe(true);
    expect(typeof result.assumption).toBe("string");
  });

  it("does not include forbidden deterministic or commercial phrases", () => {
    const result = calculateBazi(fixedInput);
    const copy = [...result.notes, result.assumption].join("\n");

    forbiddenPhrases.forEach((phrase) => {
      expect(copy.includes(phrase)).toBe(false);
    });
  });
});

describe("bazi form validation", () => {
  it("uses the established sample input without changing the engine result", () => {
    const calculator = vi.fn(calculateBazi);
    const submission = createBaziFormSubmission(fixedInput, calculator);

    expect(calculator).toHaveBeenCalledWith(fixedInput);
    expect(submission.input).toEqual(fixedInput);
    expect(submission.result.pillars).toEqual({
      year: "己巳",
      month: "丙子",
      day: "丙寅",
      hour: "壬辰"
    });
  });

  it("accepts valid leap-year dates and the latest supported date", () => {
    expect(validateBaziInput({ ...fixedInput, birthDate: "2024-02-29" })).toMatchObject({ birthDate: "2024-02-29" });
    expect(validateBaziInput({ ...fixedInput, birthDate: BAZI_MAX_DATE })).toMatchObject({ birthDate: BAZI_MAX_DATE });
    expect(BAZI_MIN_DATE).toBe("1900-01-01");
  });

  it("rejects missing, impossible and out-of-range dates", () => {
    expect(() => validateBaziInput({ ...fixedInput, birthDate: "" })).toThrow("请输入公历出生日期");
    expect(() => validateBaziInput({ ...fixedInput, birthDate: "2023-02-29" })).toThrow("有效的公历日期");
    expect(() => validateBaziInput({ ...fixedInput, birthDate: "2024-02-30" })).toThrow("有效的公历日期");
    expect(() => validateBaziInput({ ...fixedInput, birthDate: "1899-12-31" })).toThrow("1900-01-01");
    expect(() => validateBaziInput({ ...fixedInput, birthDate: "2101-01-01" })).toThrow("2100-12-31");
  });

  it("accepts 23:59 and rejects missing or invalid civil times", () => {
    expect(validateBaziInput({ ...fixedInput, birthTime: "23:59" })).toMatchObject({ birthTime: "23:59" });
    expect(() => validateBaziInput({ ...fixedInput, birthTime: "" })).toThrow("请输入出生时间");
    expect(() => validateBaziInput({ ...fixedInput, birthTime: "24:00" })).toThrow("有效的出生时间");
    expect(() => validateBaziInput({ ...fixedInput, birthTime: "-1:00" })).toThrow("有效的出生时间");
    expect(() => validateBaziInput({ ...fixedInput, birthTime: "12:60" })).toThrow("有效的出生时间");
    expect(() => validateBaziInput({ ...fixedInput, birthTime: "9:00" })).toThrow("有效的出生时间");
    expect(() => validateBaziInput({ ...fixedInput, birthTime: "Infinity:00" })).toThrow("有效的出生时间");
  });

  it("does not call the engine for invalid input", () => {
    const calculator = vi.fn(calculateBazi);

    expect(() => createBaziFormSubmission({ ...fixedInput, birthDate: "2023-02-29" }, calculator)).toThrow();
    expect(() => createBaziFormSubmission({ ...fixedInput, birthTime: "24:00" }, calculator)).toThrow();
    expect(calculator).not.toHaveBeenCalled();
  });

  it("restores a blank stable default instead of fictional birth data", () => {
    expect(createDefaultBaziInput()).toEqual({
      birthDate: "",
      birthTime: "",
      gender: "unspecified"
    });
  });

  it("keeps gender as a recorded field without changing the current calculation", () => {
    const female = calculateBazi({ ...fixedInput, gender: "female" });
    const male = calculateBazi({ ...fixedInput, gender: "male" });

    expect(female.pillars).toEqual(male.pillars);
    expect(baziInputCopy.genderNote).toContain("不参与基础四柱计算");
  });

  it("contains the required calculation-boundary explanations", () => {
    const copy = baziInputCopy.assumptions.join("\n") + baziInputCopy.timeBoundaryNotice;

    expect(copy).toContain("公历");
    expect(copy).toContain("民用时间");
    expect(copy).toContain("不进行经度校正");
    expect(copy).toContain("不计算真太阳时");
    expect(copy).toContain("影响时柱");
  });
});

describe("bazi result presentation", () => {
  it("keeps the year, month, day and hour pillar order and reads ganzhi attributes", () => {
    const result = calculateBazi(fixedInput);
    const pillars = getBaziPillarDisplayData(result.pillars);

    expect(pillars.map((pillar) => pillar.label)).toEqual(["年柱", "月柱", "日柱", "时柱"]);
    expect(pillars.map((pillar) => pillar.value)).toEqual(["己巳", "丙子", "丙寅", "壬辰"]);
    expect(pillars[0].stem).toMatchObject({ value: "己", element: "土", yinYang: "阴" });
    expect(pillars[0].branch).toMatchObject({ value: "巳", element: "火", yinYang: "阴" });
    expect(JSON.stringify(pillars)).not.toMatch(/undefined/);
  });

  it("shows all five elements, zero counts and a total of eight", () => {
    const result = calculateBazi(fixedInput);
    const items = getFiveElementDisplayData(result.elementCounts);

    expect(items.map((item) => item.info.name)).toEqual(resultCopy.bazi.elementOrder);
    expect(items.map((item) => item.count)).toEqual([0, 1, 2, 3, 2]);
    expect(items.reduce((sum, item) => sum + item.count, 0)).toBe(8);
    expect(items[0].percentage).toBe(0);
  });
});

describe("bazi history", () => {
  it("stores the input context, result data and calculation flags", () => {
    const result = calculateBazi(fixedInput);
    const payload = createBaziHistoryPayload(fixedInput, result);

    expect(payload).toMatchObject({
      mode: "bazi",
      solarDate: "1990-01-01",
      birthTime: "08:00",
      gender: "unspecified",
      genderAffectsCalculation: false,
      locationCorrection: false,
      trueSolarTime: false,
      pillars: result.pillars,
      elementCounts: result.elementCounts,
      dominantElements: ["火"]
    });
  });

  it("reads new and legacy payloads without invalid display values", () => {
    const result = calculateBazi(fixedInput);
    const item = {
      id: "bazi-new",
      module: "bazi" as const,
      title: "八字 1990-01-01 08:00",
      createdAt: "2026-07-10T12:00:00.000Z",
      payload: createBaziHistoryPayload(fixedInput, result)
    };
    const legacyItem = { ...item, id: "bazi-legacy", payload: result };
    const details = getBaziHistoryDetails(item);
    const legacyDetails = getBaziHistoryDetails(legacyItem);

    expect(details).toMatchObject({
      solarDate: "1990-01-01",
      birthTime: "08:00",
      gender: "未填写",
      pillars: "年柱己巳 · 月柱丙子 · 日柱丙寅 · 时柱壬辰",
      elementSummary: "金0、木1、水2、火3、土2",
      locationCorrection: "未进行",
      trueSolarTime: "未采用"
    });
    expect(legacyDetails).toMatchObject({
      solarDate: "旧记录未保存完整输入信息",
      pillars: "年柱己巳 · 月柱丙子 · 日柱丙寅 · 时柱壬辰",
      elementSummary: "金0、木1、水2、火3、土2",
      gender: "未填写"
    });
    expect(JSON.stringify(details)).not.toMatch(/undefined|NaN|Invalid Date|\[object Object\]/);
  });

  it("keeps ten records, reloads them and clears them", () => {
    const result = calculateBazi(fixedInput);
    const payload = createBaziHistoryPayload(fixedInput, result);

    for (let index = 1; index <= 11; index += 1) {
      saveHistoryItem({ module: "bazi", title: `八字记录 ${index}`, payload });
    }

    expect(loadHistory()).toHaveLength(10);
    expect(loadHistory()[0].title).toBe("八字记录 11");
    clearHistory();
    expect(loadHistory()).toEqual([]);
  });
});
