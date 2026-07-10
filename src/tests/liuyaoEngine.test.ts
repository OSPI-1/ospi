import { beforeEach, describe, expect, it } from "vitest";
import { getLiuyaoHistoryDetails } from "../components/HistoryList";
import { resultCopy } from "../data/uiCopy";
import { HEXAGRAM_VISUAL_ORDER } from "../features/liuyao/HexagramDisplay";
import { calculateLiuyao, resolveYaoValue } from "../features/liuyao/liuyaoEngine";
import {
  createRandomLiuyaoFormUpdate,
  createDefaultLiuyaoLines,
  DEFAULT_LIUYAO_LINES,
  LIUYAO_POSITION_LABELS,
  LIUYAO_VISUAL_ORDER,
  replaceLiuyaoLine,
  toLiuyaoInput,
  validateLiuyaoLines
} from "../features/liuyao/LiuyaoForm";
import { getYaoOption, YAO_OPTIONS } from "../features/liuyao/YaoSelector";
import { getMovingLineDetails, getMovingLineSummaryText } from "../features/liuyao/MovingLinesSummary";
import {
  coinTotalToYaoValue,
  createBrowserRandomSource,
  generateSixYaoValues,
  simulateYaoValue,
  type RandomSource
} from "../features/liuyao/randomYao";
import type { YaoValue } from "../features/liuyao/liuyaoTypes";
import { createLiuyaoHistoryPayload } from "../routes/LiuyaoPage";
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

const createSequenceSource = (values: readonly number[]): RandomSource => {
  let index = 0;
  return () => {
    const value = values[index];
    if (value === undefined) {
      throw new Error("Fixed random sequence exhausted.");
    }
    index += 1;
    return value;
  };
};

const randomSequenceForYaoValues = (values: readonly YaoValue[]) =>
  values.flatMap((value) => {
    if (value === 6) return [0.1, 0.1, 0.1];
    if (value === 7) return [0.9, 0.1, 0.1];
    if (value === 8) return [0.9, 0.9, 0.1];
    return [0.9, 0.9, 0.9];
  });

describe("three-coin random yao", () => {
  it("maps coin totals 6, 7, 8 and 9 to the four yao values", () => {
    expect(coinTotalToYaoValue(6)).toBe(6);
    expect(coinTotalToYaoValue(7)).toBe(7);
    expect(coinTotalToYaoValue(8)).toBe(8);
    expect(coinTotalToYaoValue(9)).toBe(9);
    expect(() => coinTotalToYaoValue(5)).toThrow("Invalid three-coin total");
  });

  it("uses three injected coin outcomes for one deterministic yao", () => {
    expect(simulateYaoValue(createSequenceSource([0.1, 0.1, 0.1]))).toBe(6);
    expect(simulateYaoValue(createSequenceSource([0.9, 0.1, 0.1]))).toBe(7);
    expect(simulateYaoValue(createSequenceSource([0.9, 0.9, 0.1]))).toBe(8);
    expect(simulateYaoValue(createSequenceSource([0.9, 0.9, 0.9]))).toBe(9);
  });

  it("prefers crypto values and keeps the fallback injectable", () => {
    const cryptoSource = createBrowserRandomSource({
      getRandomValues(values) {
        values[0] = 0x8000_0000;
        return values;
      }
    });
    const fallbackSource = createBrowserRandomSource(null, () => 0.25);

    expect(cryptoSource()).toBe(0.5);
    expect(fallbackSource()).toBe(0.25);
  });

  it("generates six deterministic yao values from first line to upper line", () => {
    const expected: YaoValue[] = [6, 7, 8, 9, 7, 8];
    const generated = generateSixYaoValues(createSequenceSource(randomSequenceForYaoValues(expected)));

    expect(generated).toEqual(expected);
    expect(LIUYAO_POSITION_LABELS[0]).toBe("初爻");
    expect(generated[0]).toBe(6);
    expect(LIUYAO_POSITION_LABELS[5]).toBe("上爻");
    expect(generated[5]).toBe(8);
  });

  it("fills the form without requesting submit and remains manually editable", () => {
    const update = createRandomLiuyaoFormUpdate(
      createSequenceSource(randomSequenceForYaoValues([6, 7, 8, 9, 7, 8]))
    );
    const edited = replaceLiuyaoLine(update.lines, 2, 6);

    expect(update.shouldSubmit).toBe(false);
    expect(edited).toEqual([6, 7, 6, 9, 7, 8]);
    expect(update.lines).toEqual([6, 7, 8, 9, 7, 8]);
  });

  it("submits fixed random all-young-yang and all-young-yin values through the existing engine", () => {
    const yangUpdate = createRandomLiuyaoFormUpdate(
      createSequenceSource(randomSequenceForYaoValues([7, 7, 7, 7, 7, 7]))
    );
    const yinUpdate = createRandomLiuyaoFormUpdate(
      createSequenceSource(randomSequenceForYaoValues([8, 8, 8, 8, 8, 8]))
    );

    expect(calculateLiuyao(toLiuyaoInput(yangUpdate.lines)).hexagram.name).toBe("乾为天");
    expect(calculateLiuyao(toLiuyaoInput(yinUpdate.lines)).hexagram.name).toBe("坤为地");
  });

  it("keeps the old-yin first-line fixed sample unchanged", () => {
    const update = createRandomLiuyaoFormUpdate(
      createSequenceSource(randomSequenceForYaoValues([6, 8, 8, 8, 8, 8]))
    );
    const result = calculateLiuyao(toLiuyaoInput(update.lines));

    expect(result.hexagram.name).toBe("坤为地");
    expect(result.movingIndexes).toEqual([1]);
    expect(result.changedHexagram.name).toBe("地雷复");
  });
});

describe("liuyao form model", () => {
  it("keeps six data positions mapped from bottom to top", () => {
    expect(LIUYAO_POSITION_LABELS).toEqual(["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"]);
    expect(LIUYAO_POSITION_LABELS[0]).toBe("初爻");
    expect(LIUYAO_POSITION_LABELS[5]).toBe("上爻");
  });

  it("renders visual order from upper line to first line without changing data indexes", () => {
    expect(LIUYAO_VISUAL_ORDER).toEqual([5, 4, 3, 2, 1, 0]);
    expect(LIUYAO_POSITION_LABELS[LIUYAO_VISUAL_ORDER[0]]).toBe("上爻");
    expect(LIUYAO_POSITION_LABELS[LIUYAO_VISUAL_ORDER[5]]).toBe("初爻");
    expect(HEXAGRAM_VISUAL_ORDER).toEqual([5, 4, 3, 2, 1, 0]);
    expect(LIUYAO_POSITION_LABELS[HEXAGRAM_VISUAL_ORDER[0]]).toBe("上爻");
    expect(LIUYAO_POSITION_LABELS[HEXAGRAM_VISUAL_ORDER[5]]).toBe("初爻");
  });

  it("keeps reset values aligned with the current default", () => {
    expect(createDefaultLiuyaoLines()).toEqual(DEFAULT_LIUYAO_LINES);
    expect(createDefaultLiuyaoLines()).not.toBe(DEFAULT_LIUYAO_LINES);
  });

  it("validates complete yao values before submit", () => {
    expect(validateLiuyaoLines([7, 8, 7, 8, 7, 8])).toBe(true);
    expect(validateLiuyaoLines([7, 8, 7, 8, 7])).toBe(false);
    expect(validateLiuyaoLines([7, 8, 7, 8, 7, 10])).toBe(false);
    expect(() => toLiuyaoInput([7, 8, 7, 8, 7, 10])).toThrow("请完整选择六爻");
  });

  it("describes the four selectable yao states clearly", () => {
    expect(YAO_OPTIONS).toHaveLength(4);
    expect(getYaoOption(6)).toMatchObject({ name: "老阴", isYang: false, isMoving: true });
    expect(getYaoOption(7)).toMatchObject({ name: "少阳", isYang: true, isMoving: false });
    expect(getYaoOption(8)).toMatchObject({ name: "少阴", isYang: false, isMoving: false });
    expect(getYaoOption(9)).toMatchObject({ name: "老阳", isYang: true, isMoving: true });
  });
});

describe("resolveYaoValue", () => {
  it("maps the four yao values to boolean lines and moving rules", () => {
    expect(resolveYaoValue(7)).toMatchObject({ line: true, moving: false, changedLine: true });
    expect(resolveYaoValue(8)).toMatchObject({ line: false, moving: false, changedLine: false });
    expect(resolveYaoValue(9)).toMatchObject({ line: true, moving: true, changedLine: false });
    expect(resolveYaoValue(6)).toMatchObject({ line: false, moving: true, changedLine: true });
  });
});

describe("calculateLiuyao", () => {
  it("keeps all young yang lines as qian without moving lines", () => {
    const result = calculateLiuyao({ lines: [7, 7, 7, 7, 7, 7] });

    expect(result.originalYinYangLines).toEqual([true, true, true, true, true, true]);
    expect(result.hexagram.name).toBe("乾为天");
    expect(result.movingIndexes).toEqual([]);
    expect(result.changedHexagram.name).toBe("乾为天");
    expect(getMovingLineSummaryText(result.lineStates)).toBe(resultCopy.liuyao.noMovingLines);
  });

  it("keeps all young yin lines as kun without moving lines", () => {
    const result = calculateLiuyao({ lines: [8, 8, 8, 8, 8, 8] });

    expect(result.originalYinYangLines).toEqual([false, false, false, false, false, false]);
    expect(result.hexagram.name).toBe("坤为地");
    expect(result.movingIndexes).toEqual([]);
    expect(result.changedHexagram.name).toBe("坤为地");
  });

  it("changes an old yin first line from yin to yang", () => {
    const result = calculateLiuyao({ lines: [6, 8, 8, 8, 8, 8] });

    expect(result.hexagram.name).toBe("坤为地");
    expect(result.movingIndexes).toEqual([1]);
    expect(result.changedYinYangLines).toEqual([true, false, false, false, false, false]);
    expect(result.changedLower.id).toBe("zhen");
    expect(result.changedUpper.id).toBe("kun");
    expect(result.changedHexagram.name).toBe("地雷复");
    expect(getMovingLineDetails(result.lineStates)).toEqual([
      { index: 1, position: "初爻", value: 6, changeText: "老阴：阴变阳" }
    ]);
  });

  it("uses lower lines 0-2 and upper lines 3-5 for water over fire", () => {
    const result = calculateLiuyao({ lines: [7, 8, 7, 8, 7, 8] });

    expect(result.lower.id).toBe("li");
    expect(result.upper.id).toBe("kan");
    expect(result.hexagram.name).toBe("水火既济");
  });

  it("uses lower lines 0-2 and upper lines 3-5 for fire over water", () => {
    const result = calculateLiuyao({ lines: [8, 7, 8, 7, 8, 7] });

    expect(result.lower.id).toBe("kan");
    expect(result.upper.id).toBe("li");
    expect(result.hexagram.name).toBe("火水未济");
  });

  it("keeps legacy binary line fields for existing line diagrams", () => {
    const result = calculateLiuyao({ lines: [9, 7, 7, 8, 8, 6] });

    expect(result.movingIndexes).toEqual([1, 6]);
    expect(result.originalLines).toEqual([1, 1, 1, 0, 0, 0]);
    expect(result.changedLines).toEqual([0, 1, 1, 0, 0, 1]);
  });

  it("describes an old yang moving line as yang changing to yin", () => {
    const result = calculateLiuyao({ lines: [9, 7, 7, 7, 7, 7] });

    expect(getMovingLineDetails(result.lineStates)[0]).toMatchObject({
      position: "初爻",
      value: 9,
      changeText: "老阳：阳变阴"
    });
  });

  it("summarizes multiple moving lines by count and traditional positions", () => {
    const result = calculateLiuyao({ lines: [6, 7, 9, 8, 7, 6] });

    expect(result.movingIndexes).toEqual([1, 3, 6]);
    expect(getMovingLineSummaryText(result.lineStates)).toBe("3 条：初爻、三爻、上爻");
  });
});

describe("liuyao history", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { localStorage: new MemoryStorage() }
    });
  });

  it("stores names, moving summary and the six original yao values", () => {
    const input = { lines: [6, 8, 8, 8, 8, 8] as const };
    const result = calculateLiuyao({ lines: [...input.lines] });
    const payload = createLiuyaoHistoryPayload({ lines: [...input.lines] }, result);

    saveHistoryItem({ module: "liuyao", title: "六爻 坤为地 → 地雷复", payload });
    const saved = loadHistory()[0];
    const details = getLiuyaoHistoryDetails(saved);

    expect(saved.module).toBe("liuyao");
    expect("source" in payload).toBe(false);
    expect(details).toEqual({
      originalName: "坤为地",
      changedName: "地雷复",
      movingSummary: "1 条：初爻",
      inputLines: [6, 8, 8, 8, 8, 8]
    });
    expect(JSON.stringify(details)).not.toMatch(/undefined|NaN|\[object Object\]/);
  });

  it("stores generated input lines without requiring a new global history field", () => {
    const update = createRandomLiuyaoFormUpdate(
      createSequenceSource(randomSequenceForYaoValues([9, 7, 8, 6, 7, 8]))
    );
    const input = toLiuyaoInput(update.lines);
    const payload = createLiuyaoHistoryPayload(input, calculateLiuyao(input));

    expect(payload.inputLines).toEqual([9, 7, 8, 6, 7, 8]);
    expect("source" in payload).toBe(false);
  });

  it("keeps only the latest ten records and reloads them from localStorage", () => {
    const result = calculateLiuyao({ lines: [7, 7, 7, 7, 7, 7] });
    const payload = createLiuyaoHistoryPayload({ lines: [7, 7, 7, 7, 7, 7] }, result);

    for (let index = 1; index <= 11; index += 1) {
      saveHistoryItem({ module: "liuyao", title: `记录 ${index}`, payload });
    }

    const reloaded = loadHistory();
    expect(reloaded).toHaveLength(10);
    expect(reloaded[0].title).toBe("记录 11");
    expect(reloaded[9].title).toBe("记录 2");
    expect(getLiuyaoHistoryDetails(reloaded[0])?.movingSummary).toBe(resultCopy.liuyao.noMovingLines);
  });

  it("clears all persisted history records", () => {
    const result = calculateLiuyao({ lines: [8, 8, 8, 8, 8, 8] });
    saveHistoryItem({
      module: "liuyao",
      title: "六爻 坤为地 → 坤为地",
      payload: createLiuyaoHistoryPayload({ lines: [8, 8, 8, 8, 8, 8] }, result)
    });

    clearHistory();
    expect(loadHistory()).toEqual([]);
  });
});
