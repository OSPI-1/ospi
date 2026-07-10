import { dizhiByName, tianganByName, type EarthlyBranch, type HeavenlyStem } from "../../data/ganzhi";
import { resultCopy } from "../../data/uiCopy";
import type { Pillars } from "./baziTypes";

const pillarOrder = [
  ["year", resultCopy.bazi.pillarLabels.year],
  ["month", resultCopy.bazi.pillarLabels.month],
  ["day", resultCopy.bazi.pillarLabels.day],
  ["hour", resultCopy.bazi.pillarLabels.hour]
] as const;

export interface BaziPillarDisplayData {
  key: keyof Pillars;
  label: string;
  value: string;
  stem: { value: string; element: string; yinYang: string };
  branch: { value: string; element: string; yinYang: string };
}

const getStemData = (value: string) => {
  const info = tianganByName[value as HeavenlyStem];
  return {
    value: value || resultCopy.bazi.unknownValue,
    element: info?.element ?? resultCopy.bazi.unknownValue,
    yinYang: info?.yinYang ?? resultCopy.bazi.unknownValue
  };
};

const getBranchData = (value: string) => {
  const info = dizhiByName[value as EarthlyBranch];
  return {
    value: value || resultCopy.bazi.unknownValue,
    element: info?.element ?? resultCopy.bazi.unknownValue,
    yinYang: info?.yinYang ?? resultCopy.bazi.unknownValue
  };
};

export const getBaziPillarDisplayData = (pillars: Pillars): BaziPillarDisplayData[] =>
  pillarOrder.map(([key, label]) => {
    const value = typeof pillars[key] === "string" ? pillars[key] : "";
    const stem = value.slice(0, 1);
    const branch = value.slice(1, 2);

    return {
      key,
      label,
      value: value || resultCopy.bazi.unknownValue,
      stem: getStemData(stem),
      branch: getBranchData(branch)
    };
  });

export function FourPillarsDisplay({ pillars }: { pillars: Pillars }) {
  const copy = resultCopy.bazi;

  return (
    <section aria-labelledby="bazi-pillars-title">
      <h3 className="text-base font-semibold text-stone-950" id="bazi-pillars-title">
        {copy.pillarsLabel}
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {getBaziPillarDisplayData(pillars).map((pillar) => (
          <article className="subtle-card p-4" data-pillar-key={pillar.key} key={pillar.key}>
            <p className="text-sm text-stone-500">{pillar.label}</p>
            <p className="mt-2 text-2xl font-semibold text-stone-950">{pillar.value}</p>
            <dl className="mt-3 space-y-2 text-xs text-stone-600">
              <div className="grid grid-cols-[2.5rem_1fr] gap-2">
                <dt>{copy.pillarStemLabel}</dt>
                <dd>
                  <span className="font-medium text-stone-900">{pillar.stem.value}</span> · {copy.stemElementLabel}：
                  {pillar.stem.element} · {copy.yinYangLabel}：{pillar.stem.yinYang}
                </dd>
              </div>
              <div className="grid grid-cols-[2.5rem_1fr] gap-2">
                <dt>{copy.pillarBranchLabel}</dt>
                <dd>
                  <span className="font-medium text-stone-900">{pillar.branch.value}</span> · {copy.branchElementLabel}：
                  {pillar.branch.element} · {copy.yinYangLabel}：{pillar.branch.yinYang}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
