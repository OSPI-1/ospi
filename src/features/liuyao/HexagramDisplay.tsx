import type { YinYangLine } from "../../data/bagua";
import { liuyaoFormCopy, resultCopy } from "../../data/uiCopy";

export const HEXAGRAM_VISUAL_ORDER = [5, 4, 3, 2, 1, 0] as const;

export function HexagramDisplay({
  label,
  name,
  upperName,
  lowerName,
  lines,
  movingIndexes,
  meaning,
  meaningTitle,
  changed = false
}: {
  label: string;
  name: string;
  upperName: string;
  lowerName: string;
  lines: readonly YinYangLine[];
  movingIndexes: readonly number[];
  meaning: string;
  meaningTitle: string;
  changed?: boolean;
}) {
  const copy = resultCopy.liuyao;
  const upperLower = resultCopy.shared.upperLowerText
    .replace("{upper}", upperName)
    .replace("{lower}", lowerName);

  return (
    <article className="subtle-card p-4 sm:p-5">
      <p className="text-sm font-medium text-[#b23526]">{label}</p>
      <h3 className="mt-1 text-2xl font-semibold text-stone-950">{name}</h3>
      <p className="mt-2 text-sm text-stone-600">{upperLower}</p>

      <div className="surface-card mt-4 p-3 shadow-none">
        <p className="text-sm font-medium text-stone-800">{copy.structureLabel}</p>
        <div className="mt-3 space-y-2" aria-label={`${label}${copy.structureLabel}`}>
          {HEXAGRAM_VISUAL_ORDER.map((lineIndex) => {
            const line = lines[lineIndex];
            const isMoving = movingIndexes.includes(lineIndex + 1);

            return (
              <div
                className="grid min-h-8 grid-cols-[2.75rem_minmax(5.5rem,1fr)_2.5rem] items-center gap-2"
                data-line-index={lineIndex}
                data-line-position={liuyaoFormCopy.positionLabels[lineIndex]}
                key={lineIndex}
              >
                <span className="text-xs text-stone-500">{liuyaoFormCopy.positionLabels[lineIndex]}</span>
                <div className="flex h-3 min-w-0 gap-2" aria-label={line ? liuyaoFormCopy.yangLabel : liuyaoFormCopy.yinLabel}>
                  {line ? (
                    <span className="h-3 w-full rounded-sm bg-[#17211b]" />
                  ) : (
                    <>
                      <span className="h-3 flex-1 rounded-sm bg-[#17211b]" />
                      <span className="h-3 flex-1 rounded-sm bg-[#17211b]" />
                    </>
                  )}
                </div>
                <span
                  className={
                    isMoving
                      ? `justify-self-end rounded px-1.5 py-0.5 text-xs font-medium ${
                          changed ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                        }`
                      : ""
                  }
                >
                  {isMoving ? (changed ? copy.changedBadge : copy.movingBadge) : null}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 border-t border-stone-200 pt-3">
        <h4 className="text-sm font-semibold text-stone-900">{meaningTitle}</h4>
        <p className="mt-1 text-sm leading-6 text-stone-600">{meaning}</p>
      </div>
    </article>
  );
}
