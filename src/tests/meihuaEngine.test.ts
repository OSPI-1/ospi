import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMeihuaHistoryDetails } from "../components/HistoryList";
import { createMeihuaFormSubmission } from "../features/meihua/MeihuaForm";
import { MEIHUA_HEXAGRAM_VISUAL_ORDER } from "../features/meihua/MeihuaHexagramDisplay";
import { getMeihuaInputSummary } from "../features/meihua/MeihuaInputSummary";
import { getMeihuaMovingLineDetail } from "../features/meihua/MeihuaTransformationFlow";
import {
  buildNumberMeihuaInput,
  createDefaultNumberDivinationState,
  MEIHUA_NUMBER_MAX
} from "../features/meihua/NumberDivinationForm";
import {
  buildTimeMeihuaInput,
  createEmptyTimeDivinationState,
  createTimeDivinationStateFromDate,
  getSelectedTimeLabel,
  parseLocalDateTime,
  resolveBrowserTimeZone
} from "../features/meihua/TimeDivinationForm";
import { calculateMeihua } from "../features/meihua/meihuaEngine";
import { createMeihuaHistoryPayload } from "../routes/MeihuaPage";
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

describe("meihua number form", () => {
  it("builds valid 1, 1, 1 and 8, 8, 6 submissions", () => {
    expect(buildNumberMeihuaInput({ firstNumber: "1", secondNumber: "1", movingNumber: "1" })).toEqual({
      mode: "number",
      firstNumber: 1,
      secondNumber: 1,
      movingNumber: 1
    });
    expect(buildNumberMeihuaInput({ firstNumber: "8", secondNumber: "8", movingNumber: "6" })).toEqual({
      mode: "number",
      firstNumber: 8,
      secondNumber: 8,
      movingNumber: 6
    });
  });

  it("omits a blank moving number so the engine uses the first two numbers", () => {
    const input = buildNumberMeihuaInput({ firstNumber: "1", secondNumber: "2", movingNumber: "" });
    const result = calculateMeihua(input);

    expect(input.movingNumber).toBeUndefined();
    expect(result.movingLine).toBe(3);
  });

  it("rejects missing required numbers before calling the engine", () => {
    const calculator = vi.fn(calculateMeihua);

    expect(() =>
      createMeihuaFormSubmission(
        "number",
        { firstNumber: "", secondNumber: "2", movingNumber: "" },
        createEmptyTimeDivinationState(),
        calculator
      )
    ).toThrow("请输入第一个数字");
    expect(() =>
      createMeihuaFormSubmission(
        "number",
        { firstNumber: "1", secondNumber: "", movingNumber: "" },
        createEmptyTimeDivinationState(),
        calculator
      )
    ).toThrow("请输入第二个数字");
    expect(calculator).not.toHaveBeenCalled();
  });

  it("rejects decimals, negatives, zero and non-finite text", () => {
    expect(() => buildNumberMeihuaInput({ firstNumber: "1.5", secondNumber: "2", movingNumber: "" })).toThrow(
      "第一个数字必须是正整数"
    );
    expect(() => buildNumberMeihuaInput({ firstNumber: "-1", secondNumber: "2", movingNumber: "" })).toThrow(
      "第一个数字必须是正整数"
    );
    expect(() => buildNumberMeihuaInput({ firstNumber: "0", secondNumber: "2", movingNumber: "" })).toThrow(
      "第一个数字必须大于 0"
    );
    expect(() => buildNumberMeihuaInput({ firstNumber: "Infinity", secondNumber: "2", movingNumber: "" })).toThrow(
      "第一个数字必须是正整数"
    );
  });

  it("rejects values over the front-end maximum", () => {
    expect(() =>
      buildNumberMeihuaInput({ firstNumber: String(MEIHUA_NUMBER_MAX + 1), secondNumber: "2", movingNumber: "" })
    ).toThrow("第一个数字不能超过 999999");
  });

  it("restores the established default number state", () => {
    expect(createDefaultNumberDivinationState()).toEqual({
      firstNumber: "12",
      secondNumber: "34",
      movingNumber: ""
    });
  });
});

describe("meihua time form", () => {
  it("fills current local time without invoking the engine", () => {
    const calculator = vi.fn(calculateMeihua);
    const fixedNow = new Date(2026, 6, 10, 9, 35, 42);
    const state = createTimeDivinationStateFromDate(fixedNow);

    expect(state).toEqual({ date: "2026-07-10", time: "09:35" });
    expect(calculator).not.toHaveBeenCalled();
  });

  it("builds a valid custom local date and preserves the displayed values", () => {
    const state = { date: "2026-07-10", time: "14:25" };
    const input = buildTimeMeihuaInput(state);

    expect(input.mode).toBe("time");
    expect(input.when).toBeInstanceOf(Date);
    expect(input.when?.getFullYear()).toBe(2026);
    expect(input.when?.getMonth()).toBe(6);
    expect(input.when?.getDate()).toBe(10);
    expect(input.when?.getHours()).toBe(14);
    expect(input.when?.getMinutes()).toBe(25);
    expect(getSelectedTimeLabel(state)).toBe("2026-07-10 14:25");
  });

  it("rejects missing or invalid custom date-time values", () => {
    expect(() => buildTimeMeihuaInput({ date: "", time: "10:00" })).toThrow("请选择完整日期");
    expect(() => buildTimeMeihuaInput({ date: "2026-07-10", time: "" })).toThrow("请选择完整时间");
    expect(() => buildTimeMeihuaInput({ date: "2026-02-30", time: "10:00" })).toThrow("日期或时间无效");
    expect(() => parseLocalDateTime({ date: "2026-07-10", time: "25:00" })).toThrow("日期或时间无效");
    expect(getSelectedTimeLabel({ date: "2026-02-30", time: "10:00" })).not.toContain("Invalid Date");
  });

  it("shows an IANA time zone and a clear fallback", () => {
    expect(resolveBrowserTimeZone(() => "Asia/Shanghai")).toBe("Asia/Shanghai");
    expect(resolveBrowserTimeZone(() => undefined)).toBe("浏览器本地时区（未提供 IANA 名称）");
    expect(resolveBrowserTimeZone(() => {
      throw new Error("unsupported");
    })).toBe("浏览器本地时区（未提供 IANA 名称）");
  });

  it("keeps number and time state independent across mode submissions", () => {
    const numberState = { firstNumber: "8", secondNumber: "8", movingNumber: "6" };
    const timeState = { date: "2026-07-10", time: "11:20" };
    const numberSubmission = createMeihuaFormSubmission("number", numberState, timeState);
    const timeSubmission = createMeihuaFormSubmission("time", numberState, timeState);

    expect(numberSubmission.input).toMatchObject({ mode: "number", firstNumber: 8, secondNumber: 8, movingNumber: 6 });
    expect(timeSubmission.input.mode).toBe("time");
    expect(numberState).toEqual({ firstNumber: "8", secondNumber: "8", movingNumber: "6" });
    expect(timeState).toEqual({ date: "2026-07-10", time: "11:20" });
  });

  it("resets time mode to an empty valid form state", () => {
    expect(createEmptyTimeDivinationState()).toEqual({ date: "", time: "" });
    expect(getSelectedTimeLabel(createEmptyTimeDivinationState())).toBe("请先选择完整的日期和时间。");
  });
});

describe("calculateMeihua", () => {
  it("keeps number-based qian over qian with first moving line", () => {
    const result = calculateMeihua({ mode: "number", firstNumber: 1, secondNumber: 1, movingNumber: 1 });

    expect(result.upper.id).toBe("qian");
    expect(result.lower.id).toBe("qian");
    expect(result.hexagram.name).toBe("乾为天");
    expect(result.mutualHexagram.name).toBe("乾为天");
    expect(result.movingLine).toBe(1);
    expect(result.changedHexagram.name).toBe("天风姤");
  });

  it("keeps number-based kun over kun with upper moving line", () => {
    const result = calculateMeihua({ mode: "number", firstNumber: 8, secondNumber: 8, movingNumber: 6 });

    expect(result.upper.id).toBe("kun");
    expect(result.lower.id).toBe("kun");
    expect(result.hexagram.name).toBe("坤为地");
    expect(result.mutualHexagram.name).toBe("坤为地");
    expect(result.movingLine).toBe(6);
    expect(result.changedHexagram.name).toBe("山地剥");
  });

  it("uses upper kan and lower li as water over fire", () => {
    const result = calculateMeihua({ mode: "number", firstNumber: 6, secondNumber: 3, movingNumber: 1 });

    expect(result.upper.id).toBe("kan");
    expect(result.lower.id).toBe("li");
    expect(result.hexagram.name).toBe("水火既济");
  });

  it("uses upper li and lower kan as fire over water", () => {
    const result = calculateMeihua({ mode: "number", firstNumber: 3, secondNumber: 6, movingNumber: 1 });

    expect(result.upper.id).toBe("li");
    expect(result.lower.id).toBe("kan");
    expect(result.hexagram.name).toBe("火水未济");
  });

  it("calculates mutual hexagram from lines 1-3 and 2-4 in bottom-to-top order", () => {
    const result = calculateMeihua({ mode: "number", firstNumber: 6, secondNumber: 3, movingNumber: 1 });

    expect(result.originalYinYangLines).toEqual([true, false, true, false, true, false]);
    expect(result.mutualLower.id).toBe("kan");
    expect(result.mutualUpper.id).toBe("li");
    expect(result.mutualYinYangLines).toEqual([false, true, false, true, false, true]);
    expect(result.mutualHexagram.name).toBe("火水未济");
  });

  it("keeps legacy binary line fields for existing line diagrams", () => {
    const result = calculateMeihua({ mode: "number", firstNumber: 1, secondNumber: 1, movingNumber: 1 });

    expect(result.originalYinYangLines).toEqual([true, true, true, true, true, true]);
    expect(result.originalLines).toEqual([1, 1, 1, 1, 1, 1]);
    expect(result.changedYinYangLines).toEqual([false, true, true, true, true, true]);
    expect(result.changedLines).toEqual([0, 1, 1, 1, 1, 1]);
  });

  it("keeps the existing two-number moving rule when no moving number is provided", () => {
    const result = calculateMeihua({ mode: "number", firstNumber: 1, secondNumber: 2 });

    expect(result.upper.id).toBe("qian");
    expect(result.lower.id).toBe("dui");
    expect(result.movingLine).toBe(3);
    expect(result.hexagram.name).toBe("天泽履");
  });

  it("keeps time-based hexagram generation deterministic from a Date", () => {
    const result = calculateMeihua({ mode: "time", when: new Date("2026-07-09T10:00:00") });

    expect(result.originalYinYangLines).toHaveLength(6);
    expect(result.changedYinYangLines).toHaveLength(6);
    expect(result.originalLines).toHaveLength(6);
    expect(result.changedLines).toHaveLength(6);
    expect(result.movingLine).toBeGreaterThanOrEqual(1);
    expect(result.movingLine).toBeLessThanOrEqual(6);
  });
});

describe("meihua result presentation", () => {
  it("keeps every displayed hexagram in upper-line-to-initial-line visual order", () => {
    expect(MEIHUA_HEXAGRAM_VISUAL_ORDER).toEqual([5, 4, 3, 2, 1, 0]);
  });

  it("describes first-line yang changing to yin for 1, 1, 1", () => {
    const result = calculateMeihua({ mode: "number", firstNumber: 1, secondNumber: 1, movingNumber: 1 });

    expect(getMeihuaMovingLineDetail(result)).toEqual({
      index: 1,
      position: "初爻",
      originalLine: true,
      changedLine: false,
      changeText: "阳变阴"
    });
  });

  it("describes upper-line yin changing to yang for 8, 8, 6", () => {
    const result = calculateMeihua({ mode: "number", firstNumber: 8, secondNumber: 8, movingNumber: 6 });

    expect(getMeihuaMovingLineDetail(result)).toEqual({
      index: 6,
      position: "上爻",
      originalLine: false,
      changedLine: true,
      changeText: "阴变阳"
    });
  });

  it("shows provided and calculated moving-number sources without undefined values", () => {
    expect(getMeihuaInputSummary({ mode: "number", firstNumber: 1, secondNumber: 1, movingNumber: 1 }, "")).toMatchObject({
      modeLabel: "数字起卦",
      items: [
        { label: "第一个数字", value: "1" },
        { label: "第二个数字", value: "1" },
        { label: "动爻数字", value: "1" }
      ]
    });
    const calculated = getMeihuaInputSummary({ mode: "number", firstNumber: 1, secondNumber: 2 }, "");
    expect(calculated.items[2].value).toBe("由前两数之和计算");
    expect(JSON.stringify(calculated)).not.toMatch(/undefined|NaN|Invalid Date|\[object Object\]/);
  });

  it("shows the exact local time and browser time zone used by time mode", () => {
    const when = new Date(2026, 6, 10, 14, 25);
    const summary = getMeihuaInputSummary({ mode: "time", when }, "Asia/Shanghai");

    expect(summary.modeLabel).toBe("时间起卦");
    expect(summary.items).toEqual([
      { label: "实际采用时间", value: "2026-07-10 14:25" },
      { label: "浏览器时区", value: "Asia/Shanghai" }
    ]);
  });
});

describe("meihua history", () => {
  it("stores number input context and all three hexagram names", () => {
    const input = { mode: "number", firstNumber: 1, secondNumber: 1, movingNumber: 1 } as const;
    const result = calculateMeihua(input);
    const payload = createMeihuaHistoryPayload(input, result, "Asia/Shanghai");

    expect(payload).toMatchObject({
      mode: "number",
      firstNumber: 1,
      secondNumber: 1,
      movingNumber: 1,
      movingNumberSource: "provided",
      originalHexagramName: "乾为天",
      mutualHexagramName: "乾为天",
      changedHexagramName: "天风姤",
      movingLine: 1
    });
    expect(payload.originalLines).toEqual([1, 1, 1, 1, 1, 1]);
    expect(payload.changedLines).toEqual([0, 1, 1, 1, 1, 1]);
  });

  it("marks a blank moving number as the sum of the first two numbers", () => {
    const input = { mode: "number", firstNumber: 1, secondNumber: 2 } as const;
    const payload = createMeihuaHistoryPayload(input, calculateMeihua(input), "Asia/Shanghai");

    expect(payload.mode).toBe("number");
    if (payload.mode !== "number") {
      throw new Error("Expected number history payload");
    }
    expect(payload.movingNumber).toBeNull();
    expect(payload.movingNumberSource).toBe("sum-of-first-two");
    expect(getMeihuaHistoryDetails({
      id: "number-history",
      module: "meihua",
      title: "梅花易数 天泽履 → 乾为天",
      createdAt: "2026-07-10T06:25:00.000Z",
      payload
    })?.inputSummary).toContain("由前两数之和计算");
  });

  it("stores a parseable time, local label and time zone", () => {
    const when = new Date(2026, 6, 10, 14, 25);
    const input = { mode: "time", when } as const;
    const payload = createMeihuaHistoryPayload(input, calculateMeihua(input), "Asia/Shanghai");

    expect(payload.mode).toBe("time");
    if (payload.mode !== "time") {
      throw new Error("Expected time history payload");
    }
    expect(payload).toMatchObject({
      mode: "time",
      usedDateTime: when.toISOString(),
      timeZone: "Asia/Shanghai",
      localTimeLabel: "2026-07-10 14:25"
    });
    expect(Number.isNaN(new Date(payload.usedDateTime).getTime())).toBe(false);
  });

  it("reads legacy engine-result payloads without optional input fields", () => {
    const legacyPayload = calculateMeihua({ mode: "number", firstNumber: 1, secondNumber: 1, movingNumber: 1 });
    const details = getMeihuaHistoryDetails({
      id: "legacy-history",
      module: "meihua",
      title: "梅花易数 乾为天 → 天风姤",
      createdAt: "2026-07-10T06:25:00.000Z",
      payload: legacyPayload
    });

    expect(details).toMatchObject({
      mode: "number",
      originalName: "乾为天",
      mutualName: "乾为天",
      changedName: "天风姤",
      movingLine: 1,
      inputSummary: "旧记录未保存完整起卦输入"
    });
    expect(JSON.stringify(details)).not.toMatch(/undefined|NaN|Invalid Date|\[object Object\]/);
  });

  it("keeps the latest ten records, reloads them and clears them", () => {
    const input = { mode: "number", firstNumber: 8, secondNumber: 8, movingNumber: 6 } as const;
    const payload = createMeihuaHistoryPayload(input, calculateMeihua(input), "Asia/Shanghai");

    for (let index = 1; index <= 11; index += 1) {
      saveHistoryItem({ module: "meihua", title: `梅花记录 ${index}`, payload });
    }

    expect(loadHistory()).toHaveLength(10);
    expect(loadHistory()[0].title).toBe("梅花记录 11");
    expect(getMeihuaHistoryDetails(loadHistory()[0])?.changedName).toBe("山地剥");
    clearHistory();
    expect(loadHistory()).toEqual([]);
  });
});
