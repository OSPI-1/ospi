export type FiveElement = "金" | "木" | "水" | "火" | "土";
export type FiveElementId = FiveElement;

export interface FiveElementInfo {
  id: FiveElementId;
  name: FiveElement;
  meaning: string;
  generates: FiveElementId;
  generatedBy: FiveElementId;
  controls: FiveElementId;
  controlledBy: FiveElementId;
}

export const fiveElements: FiveElementInfo[] = [
  {
    id: "木",
    name: "木",
    meaning: "木象征生发、条达与成长，可作为观察学习力和长期积累的文化隐喻。",
    generates: "火",
    generatedBy: "水",
    controls: "土",
    controlledBy: "金"
  },
  {
    id: "火",
    name: "火",
    meaning: "火象征明朗、表达与热度，可作为观察行动感和外在呈现的文化隐喻。",
    generates: "土",
    generatedBy: "木",
    controls: "金",
    controlledBy: "水"
  },
  {
    id: "土",
    name: "土",
    meaning: "土象征承载、稳定与转化，可作为观察节奏、秩序和消化能力的文化隐喻。",
    generates: "金",
    generatedBy: "火",
    controls: "水",
    controlledBy: "木"
  },
  {
    id: "金",
    name: "金",
    meaning: "金象征收敛、判断与边界，可作为观察取舍、规则和执行感的文化隐喻。",
    generates: "水",
    generatedBy: "土",
    controls: "木",
    controlledBy: "火"
  },
  {
    id: "水",
    name: "水",
    meaning: "水象征流动、涵养与适应，可作为观察弹性、感受和复盘能力的文化隐喻。",
    generates: "木",
    generatedBy: "金",
    controls: "火",
    controlledBy: "土"
  }
];

export const fiveElementsById = Object.fromEntries(
  fiveElements.map((element) => [element.id, element])
) as Record<FiveElementId, FiveElementInfo>;

export const elementCopy = Object.fromEntries(
  fiveElements.map((element) => [element.id, element.meaning])
) as Record<FiveElement, string>;

// Kept here for Step 1 compatibility. Step 3 will migrate engines to data/ganzhi.ts.
export const stemElements: Record<string, FiveElement> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水"
};

// Kept here for Step 1 compatibility. Step 3 will migrate engines to data/ganzhi.ts.
export const branchElements: Record<string, FiveElement> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水"
};

export const emptyElementCounts = (): Record<FiveElement, number> => ({
  金: 0,
  木: 0,
  水: 0,
  火: 0,
  土: 0
});
