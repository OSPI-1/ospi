import { ResultPanel } from "../../components/ResultPanel";
import { resultCopy } from "../../data/uiCopy";
import { FiveElementsChart } from "./FiveElementsChart";
import { FourPillarsDisplay } from "./FourPillarsDisplay";
import type { BaziResult as BaziResultType } from "./baziTypes";

export function BaziResult({ result }: { result: BaziResultType }) {
  const copy = resultCopy.bazi;

  return (
    <ResultPanel summary={copy.summary} title={copy.title}>
      <FourPillarsDisplay pillars={result.pillars} />
      <FiveElementsChart dominantElements={result.dominantElements} elementCounts={result.elementCounts} />

      {result.notes.length > 0 ? (
        <section className="rounded-lg border border-[#c9ded5] bg-[#edf5f1] p-4" aria-labelledby="bazi-notes-title">
          <h3 className="text-base font-semibold text-stone-950" id="bazi-notes-title">
            {copy.reflectionTitle}
          </h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-stone-700">
            {result.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {result.assumption ? (
        <section className="subtle-card p-4" aria-labelledby="bazi-assumption-title">
          <h3 className="text-base font-semibold text-stone-950" id="bazi-assumption-title">
            {copy.assumptionTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">{result.assumption}</p>
        </section>
      ) : null}

      <section className="border-t border-stone-200 pt-4" aria-labelledby="bazi-attention-title">
        <h3 className="text-base font-semibold text-stone-950" id="bazi-attention-title">
          {copy.attentionTitle}
        </h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">{copy.attentionText}</p>
      </section>
    </ResultPanel>
  );
}
