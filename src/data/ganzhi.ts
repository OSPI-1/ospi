import type { FiveElementId } from "./fiveElements";

export type YinYang = "阳" | "阴";
export type HeavenlyStem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
export type EarthlyBranch = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";

export interface GanInfo {
  name: HeavenlyStem;
  element: FiveElementId;
  yinYang: YinYang;
  meaning: string;
}

export interface ZhiInfo {
  name: EarthlyBranch;
  element: FiveElementId;
  yinYang: YinYang;
  meaning: string;
}

export const tiangan: GanInfo[] = [
  { name: "甲", element: "木", yinYang: "阳", meaning: "甲木常作生发之始的文化象征。" },
  { name: "乙", element: "木", yinYang: "阴", meaning: "乙木常作柔韧延展的文化象征。" },
  { name: "丙", element: "火", yinYang: "阳", meaning: "丙火常作明朗外显的文化象征。" },
  { name: "丁", element: "火", yinYang: "阴", meaning: "丁火常作细致照明的文化象征。" },
  { name: "戊", element: "土", yinYang: "阳", meaning: "戊土常作厚重承载的文化象征。" },
  { name: "己", element: "土", yinYang: "阴", meaning: "己土常作培育整理的文化象征。" },
  { name: "庚", element: "金", yinYang: "阳", meaning: "庚金常作刚健取舍的文化象征。" },
  { name: "辛", element: "金", yinYang: "阴", meaning: "辛金常作精细辨别的文化象征。" },
  { name: "壬", element: "水", yinYang: "阳", meaning: "壬水常作流动开阔的文化象征。" },
  { name: "癸", element: "水", yinYang: "阴", meaning: "癸水常作涵养细流的文化象征。" }
];

export const dizhi: ZhiInfo[] = [
  { name: "子", element: "水", yinYang: "阳", meaning: "子常关联水象与起点意识。" },
  { name: "丑", element: "土", yinYang: "阴", meaning: "丑常关联土象与蓄藏整理。" },
  { name: "寅", element: "木", yinYang: "阳", meaning: "寅常关联木象与生发启动。" },
  { name: "卯", element: "木", yinYang: "阴", meaning: "卯常关联木象与舒展生长。" },
  { name: "辰", element: "土", yinYang: "阳", meaning: "辰常关联土象与转接承载。" },
  { name: "巳", element: "火", yinYang: "阴", meaning: "巳常关联火象与内在明动。" },
  { name: "午", element: "火", yinYang: "阳", meaning: "午常关联火象与外显热度。" },
  { name: "未", element: "土", yinYang: "阴", meaning: "未常关联土象与滋养收束。" },
  { name: "申", element: "金", yinYang: "阳", meaning: "申常关联金象与结构形成。" },
  { name: "酉", element: "金", yinYang: "阴", meaning: "酉常关联金象与沉淀辨析。" },
  { name: "戌", element: "土", yinYang: "阳", meaning: "戌常关联土象与边界守成。" },
  { name: "亥", element: "水", yinYang: "阴", meaning: "亥常关联水象与涵藏回归。" }
];

export const tianganByName = Object.fromEntries(tiangan.map((item) => [item.name, item])) as Record<HeavenlyStem, GanInfo>;
export const dizhiByName = Object.fromEntries(dizhi.map((item) => [item.name, item])) as Record<EarthlyBranch, ZhiInfo>;

export const stemElements = Object.fromEntries(tiangan.map((item) => [item.name, item.element])) as Record<HeavenlyStem, FiveElementId>;
export const branchElements = Object.fromEntries(dizhi.map((item) => [item.name, item.element])) as Record<EarthlyBranch, FiveElementId>;
