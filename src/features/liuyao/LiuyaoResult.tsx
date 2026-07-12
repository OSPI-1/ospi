import { ResultPanel } from "../../components/ResultPanel";
import { resultCopy } from "../../data/uiCopy";
import { HexagramDisplay } from "./HexagramDisplay";
import type { LiuyaoResult as LiuyaoResultType } from "./liuyaoTypes";
import { MovingLinesSummary } from "./MovingLinesSummary";

export function LiuyaoResult({ result }: { result: LiuyaoResultType }) {
  const copy = resultCopy.liuyao;

  return (
    <ResultPanel summary={copy.summary} title={copy.title}>
      <div className="liuyao-result-flow">
        <HexagramDisplay
          label={copy.originalHexagramLabel}
          lines={result.originalYinYangLines}
          lowerName={result.lower.name}
          meaning={result.hexagram.meaning}
          meaningTitle={copy.originalCultureTitle}
          movingIndexes={result.movingIndexes}
          name={result.hexagram.name}
          upperName={result.upper.name}
          variant="primary"
        />
        <MovingLinesSummary lineStates={result.lineStates} />
        <HexagramDisplay
          changed
          label={copy.changedHexagramLabel}
          lines={result.changedYinYangLines}
          lowerName={result.changedLower.name}
          meaning={result.changedHexagram.meaning}
          meaningTitle={copy.changedCultureTitle}
          movingIndexes={result.movingIndexes}
          name={result.changedHexagram.name}
          upperName={result.changedUpper.name}
          variant="secondary"
        />
      </div>
      <div className="subtle-card p-4">
        <h3 className="text-base font-semibold">{copy.reflectionTitle}</h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">{result.reflection}</p>
      </div>
    </ResultPanel>
  );
}
