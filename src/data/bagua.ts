import type { FiveElementId } from "./fiveElements";

export type YinYangLine = boolean;
export type BaguaLines = [YinYangLine, YinYangLine, YinYangLine];
export type BaguaId = "qian" | "dui" | "li" | "zhen" | "xun" | "kan" | "gen" | "kun";

export interface BaguaInfo {
  id: BaguaId;
  name: string;
  symbol: string;
  order: number;
  lines: BaguaLines;
  element: FiveElementId;
  direction: string;
  nature: string;
  meaning: string;
  reflectionPrompt: string;
}

export const bagua: BaguaInfo[] = [
  {
    id: "qian",
    name: "乾",
    symbol: "☰",
    order: 1,
    lines: [true, true, true],
    element: "金",
    direction: "西北",
    nature: "天",
    meaning: "乾象征健行、开端与主动承担，可用于观察行动的发起方式。",
    reflectionPrompt: "此象适合提醒自己：当前行动是否有清晰目标与持续力量。"
  },
  {
    id: "dui",
    name: "兑",
    symbol: "☱",
    order: 2,
    lines: [true, true, false],
    element: "金",
    direction: "西",
    nature: "泽",
    meaning: "兑象征交流、悦纳与表达分寸，可用于观察沟通中的开放度。",
    reflectionPrompt: "此象适合提醒自己：表达与倾听是否保持平衡。"
  },
  {
    id: "li",
    name: "离",
    symbol: "☲",
    order: 3,
    lines: [true, false, true],
    element: "火",
    direction: "南",
    nature: "火",
    meaning: "离象征明辨、显现与依附关系，可用于观察事情被看见的方式。",
    reflectionPrompt: "此象适合提醒自己：判断是否基于清楚的信息。"
  },
  {
    id: "zhen",
    name: "震",
    symbol: "☳",
    order: 4,
    lines: [true, false, false],
    element: "木",
    direction: "东",
    nature: "雷",
    meaning: "震象征启动、警醒与变化初起，可用于观察行动开始时的节奏。",
    reflectionPrompt: "此象适合提醒自己：变化出现时是否能先稳住重点。"
  },
  {
    id: "xun",
    name: "巽",
    symbol: "☴",
    order: 5,
    lines: [false, true, true],
    element: "木",
    direction: "东南",
    nature: "风",
    meaning: "巽象征进入、顺势与持续渗透，可用于观察柔和推进的方式。",
    reflectionPrompt: "此象适合提醒自己：是否能用持续的小行动推动变化。"
  },
  {
    id: "kan",
    name: "坎",
    symbol: "☵",
    order: 6,
    lines: [false, true, false],
    element: "水",
    direction: "北",
    nature: "水",
    meaning: "坎象征险阻、涵养与谨慎前行，可用于观察不确定中的应对。",
    reflectionPrompt: "此象适合提醒自己：面对阻力时是否保留了回旋余地。"
  },
  {
    id: "gen",
    name: "艮",
    symbol: "☶",
    order: 7,
    lines: [false, false, true],
    element: "土",
    direction: "东北",
    nature: "山",
    meaning: "艮象征止息、边界与适时停顿，可用于观察何处需要收束。",
    reflectionPrompt: "此象适合提醒自己：当前是否需要先停下整理边界。"
  },
  {
    id: "kun",
    name: "坤",
    symbol: "☷",
    order: 8,
    lines: [false, false, false],
    element: "土",
    direction: "西南",
    nature: "地",
    meaning: "坤象征承载、包容与顺势积累，可用于观察支持系统与耐心。",
    reflectionPrompt: "此象适合提醒自己：是否给长期积累留出了空间。"
  }
];

export const baguaById = Object.fromEntries(bagua.map((item) => [item.id, item])) as Record<BaguaId, BaguaInfo>;
export const baguaByName = Object.fromEntries(bagua.map((item) => [item.name, item])) as Record<string, BaguaInfo>;

export const baguaLinesKey = (lines: readonly YinYangLine[]) => lines.map((line) => (line ? "1" : "0")).join("");

export const baguaByLines = (lines: readonly YinYangLine[]) => {
  const key = baguaLinesKey(lines);
  const found = bagua.find((item) => baguaLinesKey(item.lines) === key);
  if (!found) {
    throw new Error(`Unknown bagua lines: ${key}`);
  }
  return found;
};

export const baguaByOrder = (order: number) => {
  const normalized = ((order - 1) % 8) + 1;
  const found = bagua.find((item) => item.order === normalized);
  if (!found) {
    throw new Error(`Unknown bagua order: ${order}`);
  }
  return found;
};
