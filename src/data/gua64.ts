import { baguaById, type BaguaId } from "./bagua";

export interface Gua64Info {
  id: string;
  name: string;
  upper: BaguaId;
  lower: BaguaId;
  meaning: string;
  reflectionPrompt: string;
}

const gua64NameMatrix: Record<BaguaId, Record<BaguaId, string>> = {
  qian: {
    qian: "乾为天",
    dui: "天泽履",
    li: "天火同人",
    zhen: "天雷无妄",
    xun: "天风姤",
    kan: "天水讼",
    gen: "天山遁",
    kun: "天地否"
  },
  dui: {
    qian: "泽天夬",
    dui: "兑为泽",
    li: "泽火革",
    zhen: "泽雷随",
    xun: "泽风大过",
    kan: "泽水困",
    gen: "泽山咸",
    kun: "泽地萃"
  },
  li: {
    qian: "火天大有",
    dui: "火泽睽",
    li: "离为火",
    zhen: "火雷噬嗑",
    xun: "火风鼎",
    kan: "火水未济",
    gen: "火山旅",
    kun: "火地晋"
  },
  zhen: {
    qian: "雷天大壮",
    dui: "雷泽归妹",
    li: "雷火丰",
    zhen: "震为雷",
    xun: "雷风恒",
    kan: "雷水解",
    gen: "雷山小过",
    kun: "雷地豫"
  },
  xun: {
    qian: "风天小畜",
    dui: "风泽中孚",
    li: "风火家人",
    zhen: "风雷益",
    xun: "巽为风",
    kan: "风水涣",
    gen: "风山渐",
    kun: "风地观"
  },
  kan: {
    qian: "水天需",
    dui: "水泽节",
    li: "水火既济",
    zhen: "水雷屯",
    xun: "水风井",
    kan: "坎为水",
    gen: "水山蹇",
    kun: "水地比"
  },
  gen: {
    qian: "山天大畜",
    dui: "山泽损",
    li: "山火贲",
    zhen: "山雷颐",
    xun: "山风蛊",
    kan: "山水蒙",
    gen: "艮为山",
    kun: "山地剥"
  },
  kun: {
    qian: "地天泰",
    dui: "地泽临",
    li: "地火明夷",
    zhen: "地雷复",
    xun: "地风升",
    kan: "地水师",
    gen: "地山谦",
    kun: "坤为地"
  }
};

export const gua64: Gua64Info[] = Object.entries(gua64NameMatrix).flatMap(([upper, lowerMap]) =>
  Object.entries(lowerMap).map(([lower, name]) => {
    const upperInfo = baguaById[upper as BaguaId];
    const lowerInfo = baguaById[lower as BaguaId];
    return {
      id: `${upper}_${lower}`,
      name,
      upper: upper as BaguaId,
      lower: lower as BaguaId,
      meaning: `${name}由上卦${upperInfo.name}与下卦${lowerInfo.name}组成，可作为观察外在情境与内在基础关系的文化符号。`,
      reflectionPrompt: "可用作整理问题结构的提示，不作为现实决策结论。"
    };
  })
);

export const gua64ById = Object.fromEntries(gua64.map((item) => [item.id, item])) as Record<string, Gua64Info>;
export const gua64ByName = Object.fromEntries(gua64.map((item) => [item.name, item])) as Record<string, Gua64Info>;

export const getGua64 = (upper: BaguaId, lower: BaguaId) => {
  const found = gua64ById[`${upper}_${lower}`];
  if (!found) {
    throw new Error(`Unknown gua64 pair: ${upper}/${lower}`);
  }
  return found;
};
