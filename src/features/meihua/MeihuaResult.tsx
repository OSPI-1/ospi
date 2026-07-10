import { ResultPanel } from "../../components/ResultPanel";
import { resultCopy } from "../../data/uiCopy";
import { MeihuaHexagramDisplay } from "./MeihuaHexagramDisplay";
import { MeihuaInputSummary } from "./MeihuaInputSummary";
import { MeihuaTransformationFlow } from "./MeihuaTransformationFlow";
import type { MeihuaInput, MeihuaResult as MeihuaResultType } from "./meihuaTypes";

export function MeihuaResult({
  result,
  input,
  timeZone
}: {
  result: MeihuaResultType;
  input: MeihuaInput;
  timeZone: string;
}) {
  const copy = resultCopy.meihua;

  return (
    <ResultPanel summary={copy.summary} title={copy.title}>
      <MeihuaInputSummary input={input} timeZone={timeZone} />

      <section aria-labelledby="meihua-upper-lower" className="border-b border-stone-200 pb-5">
        <h3 className="text-base font-semibold text-stone-950" id="meihua-upper-lower">
          {copy.upperLowerTitle}
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="bg-stone-50 p-4">
          <p className="text-sm text-stone-500">{copy.upperLabel}</p>
            <p className="mt-2 text-xl font-semibold">
            {result.upper.symbol} {result.upper.name}
          </p>
          <p className="mt-2 text-sm text-stone-600">{result.upper.copy}</p>
        </div>
          <div className="bg-stone-50 p-4">
          <p className="text-sm text-stone-500">{copy.lowerLabel}</p>
            <p className="mt-2 text-xl font-semibold">
            {result.lower.symbol} {result.lower.name}
          </p>
          <p className="mt-2 text-sm text-stone-600">{result.lower.copy}</p>
        </div>
        </div>
      </section>

      <MeihuaHexagramDisplay
        hexagram={result.hexagram}
        label={copy.originalHexagramLabel}
        lines={result.originalYinYangLines}
        lower={result.lower}
        movingLine={result.movingLine}
        upper={result.upper}
      />

      <section className="bg-[#edf5f1] p-4">
        <h3 className="text-sm font-semibold text-stone-900">{copy.mutualRuleTitle}</h3>
        <p className="mt-1 text-sm leading-6 text-stone-700">{copy.mutualRule}</p>
      </section>

      <MeihuaHexagramDisplay
        hexagram={result.mutualHexagram}
        label={copy.mutualHexagramLabel}
        lines={result.mutualYinYangLines}
        lower={result.mutualLower}
        upper={result.mutualUpper}
      />

      <MeihuaTransformationFlow result={result} />

      <MeihuaHexagramDisplay
        changed
        hexagram={result.changedHexagram}
        label={copy.changedHexagramLabel}
        lines={result.changedYinYangLines}
        lower={result.changedLower}
        movingLine={result.movingLine}
        upper={result.changedUpper}
      />
    </ResultPanel>
  );
}
