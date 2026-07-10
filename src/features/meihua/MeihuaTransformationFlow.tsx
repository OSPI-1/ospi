import { linePositionLabels, resultCopy } from "../../data/uiCopy";
import type { MeihuaResult } from "./meihuaTypes";
import { MeihuaYaoLine } from "./MeihuaHexagramDisplay";

export interface MeihuaMovingLineDetail {
  index: number;
  position: string;
  originalLine: boolean;
  changedLine: boolean;
  changeText: string;
}

export const getMeihuaMovingLineDetail = (result: MeihuaResult): MeihuaMovingLineDetail => {
  const lineIndex = result.movingLine - 1;
  const originalLine = result.originalYinYangLines[lineIndex];
  const changedLine = result.changedYinYangLines[lineIndex];

  return {
    index: result.movingLine,
    position: linePositionLabels[lineIndex],
    originalLine,
    changedLine,
    changeText: originalLine ? resultCopy.meihua.yangToYin : resultCopy.meihua.yinToYang
  };
};

export function MeihuaTransformationFlow({ result }: { result: MeihuaResult }) {
  const copy = resultCopy.meihua;
  const detail = getMeihuaMovingLineDetail(result);

  return (
    <section aria-labelledby="meihua-transformation" className="border-b border-stone-200 pb-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-stone-950" id="meihua-transformation">
          {copy.transformationTitle}
        </h3>
        <p className="text-sm font-medium text-[#b23526]">
          第 {detail.index} 爻 · {detail.position} · {detail.changeText}
        </p>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="subtle-card p-3">
          <p className="text-xs text-stone-500">{copy.originalLineLabel}</p>
          <div className="mt-2 max-w-44">
            <MeihuaYaoLine line={detail.originalLine} />
          </div>
        </div>
        <span className="text-center text-stone-400" aria-hidden="true">
          →
        </span>
        <div className="subtle-card p-3">
          <p className="text-xs text-stone-500">{copy.changedLineLabel}</p>
          <div className="mt-2 max-w-44">
            <MeihuaYaoLine line={detail.changedLine} />
          </div>
        </div>
      </div>
    </section>
  );
}
