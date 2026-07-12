import { Dices, RotateCcw } from "lucide-react";
import { useState } from "react";
import { liuyaoFormCopy } from "../../data/uiCopy";
import { calculateLiuyao } from "./liuyaoEngine";
import type { LiuyaoInput, LiuyaoResult, YaoValue } from "./liuyaoTypes";
import { generateSixYaoValues, type RandomSource } from "./randomYao";
import { RandomDivinationPanel } from "./RandomDivinationPanel";
import { YaoSelector } from "./YaoSelector";

export const DEFAULT_LIUYAO_LINES: YaoValue[] = [7, 8, 7, 8, 7, 8];
export const LIUYAO_POSITION_LABELS = liuyaoFormCopy.positionLabels;
export const LIUYAO_VISUAL_ORDER = [5, 4, 3, 2, 1, 0] as const;

export const isYaoValue = (value: unknown): value is YaoValue =>
  value === 6 || value === 7 || value === 8 || value === 9;

export const validateLiuyaoLines = (values: readonly unknown[]) =>
  values.length === 6 && values.every((value) => isYaoValue(value));

export const createDefaultLiuyaoLines = () => [...DEFAULT_LIUYAO_LINES];

export const replaceLiuyaoLine = (values: readonly YaoValue[], index: number, value: YaoValue) => {
  const next = [...values];
  next[index] = value;
  return next;
};

export const createRandomLiuyaoFormUpdate = (randomSource?: RandomSource) => ({
  lines: generateSixYaoValues(randomSource),
  shouldSubmit: false as const
});

export const toLiuyaoInput = (values: readonly unknown[]): LiuyaoInput => {
  if (!validateLiuyaoLines(values)) {
    throw new Error(liuyaoFormCopy.validationError);
  }
  return { lines: [...values] as YaoValue[] };
};

export function LiuyaoForm({
  onResult,
  randomSource
}: {
  onResult: (input: LiuyaoInput, result: LiuyaoResult) => void;
  randomSource?: RandomSource;
}) {
  const [lines, setLines] = useState<YaoValue[]>(() => createDefaultLiuyaoLines());
  const [error, setError] = useState("");
  const [hasRandomGenerated, setHasRandomGenerated] = useState(false);

  const submit = (nextLines = lines) => {
    try {
      const input = toLiuyaoInput(nextLines);
      const result = calculateLiuyao(input);
      setError("");
      onResult(input, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : liuyaoFormCopy.fallbackError);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const updateLine = (index: number, value: YaoValue) => {
    setLines((current) => replaceLiuyaoLine(current, index, value));
  };

  const applyLines = (nextLines: YaoValue[]) => {
    setLines(nextLines);
    setError("");
    setHasRandomGenerated(false);
  };

  const handleRandomGenerate = () => {
    const update = createRandomLiuyaoFormUpdate(randomSource);
    setLines(update.lines);
    setError("");
    setHasRandomGenerated(true);
  };

  return (
    <form className="surface-card liuyao-form" onSubmit={handleSubmit}>
      <div className="liuyao-form-heading">
        <Dices className="mt-0.5 h-5 w-5 text-[#b23526]" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-semibold">{liuyaoFormCopy.title}</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">{liuyaoFormCopy.helper}</p>
        </div>
      </div>
      <RandomDivinationPanel hasGenerated={hasRandomGenerated} onGenerate={handleRandomGenerate} />
      <p className="liuyao-order-guide">从下往上填写：初爻 → 二爻 → 三爻 → 四爻 → 五爻 → 上爻</p>
      <div className="liuyao-input-list">
        {LIUYAO_VISUAL_ORDER.map((lineIndex) => (
          <YaoSelector
            index={lineIndex}
            key={lineIndex}
            label={LIUYAO_POSITION_LABELS[lineIndex]}
            onChange={(value) => updateLine(lineIndex, value)}
            value={lines[lineIndex]}
          />
        ))}
      </div>
      {error ? <p className="error-message" role="alert">{error}</p> : null}
      <div className="liuyao-form-actions">
        <button className="focus-ring primary-button" type="submit">
          {liuyaoFormCopy.submitButton}
        </button>
        <button
          className="focus-ring secondary-button"
          onClick={() => applyLines(createDefaultLiuyaoLines())}
          type="button"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {liuyaoFormCopy.resetButton}
        </button>
        <button
          className="focus-ring secondary-button"
          onClick={() => applyLines([7, 7, 7, 7, 7, 7])}
          type="button"
        >
          {liuyaoFormCopy.allYoungYangButton}
        </button>
        <button
          className="focus-ring secondary-button"
          onClick={() => applyLines([8, 8, 8, 8, 8, 8])}
          type="button"
        >
          {liuyaoFormCopy.allYoungYinButton}
        </button>
      </div>
    </form>
  );
}
