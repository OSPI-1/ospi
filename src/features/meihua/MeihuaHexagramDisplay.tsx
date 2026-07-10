import type { BaguaInfo, YinYangLine } from "../../data/bagua";
import type { Gua64Info } from "../../data/gua64";
import { linePositionLabels, resultCopy } from "../../data/uiCopy";

export const MEIHUA_HEXAGRAM_VISUAL_ORDER = [5, 4, 3, 2, 1, 0] as const;

export function MeihuaYaoLine({ line }: { line: YinYangLine }) {
  return (
    <div className="flex h-3 min-w-0 gap-2" aria-label={line ? "阳爻" : "阴爻"}>
      {line ? (
        <span className="h-3 w-full rounded-sm bg-[#17211b]" />
      ) : (
        <>
          <span className="h-3 flex-1 rounded-sm bg-[#17211b]" />
          <span className="h-3 flex-1 rounded-sm bg-[#17211b]" />
        </>
      )}
    </div>
  );
}

export function MeihuaHexagramDisplay({
  label,
  hexagram,
  upper,
  lower,
  lines,
  movingLine,
  changed = false
}: {
  label: string;
  hexagram: Gua64Info;
  upper: BaguaInfo;
  lower: BaguaInfo;
  lines: readonly YinYangLine[];
  movingLine?: number;
  changed?: boolean;
}) {
  const copy = resultCopy.meihua;
  const upperLower = resultCopy.shared.upperLowerText
    .replace("{upper}", upper.name)
    .replace("{lower}", lower.name);

  return (
    <article className="border-b border-stone-200 pb-5">
      <p className="text-sm font-medium text-[#b23526]">{label}</p>
      <h3 className="mt-1 text-2xl font-semibold text-stone-950">{hexagram.name}</h3>
      <p className="mt-2 text-sm text-stone-600">{upperLower}</p>

      <div className="mt-4 grid gap-5 md:grid-cols-[minmax(13rem,0.8fr)_minmax(0,1.2fr)]">
        <div className="bg-stone-50 p-3">
          <p className="text-sm font-medium text-stone-800">{copy.structureLabel}</p>
          <div className="mt-3 space-y-2" aria-label={`${label}${copy.structureLabel}`}>
            {MEIHUA_HEXAGRAM_VISUAL_ORDER.map((lineIndex) => {
              const isChangingLine = movingLine === lineIndex + 1;
              return (
                <div
                  className="grid min-h-8 grid-cols-[2.75rem_minmax(5.5rem,1fr)_2.5rem] items-center gap-2"
                  data-line-index={lineIndex}
                  data-line-position={linePositionLabels[lineIndex]}
                  key={lineIndex}
                >
                  <span className="text-xs text-stone-500">{linePositionLabels[lineIndex]}</span>
                  <MeihuaYaoLine line={lines[lineIndex]} />
                  <span
                    className={
                      isChangingLine
                        ? `justify-self-end rounded px-1.5 py-0.5 text-xs font-medium ${
                            changed ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                          }`
                        : ""
                    }
                  >
                    {isChangingLine ? (changed ? copy.changedBadge : copy.movingBadge) : null}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-stone-900">{copy.meaningTitle}</h4>
            <p className="mt-1 text-sm leading-6 text-stone-600">{hexagram.meaning}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-900">{copy.hexagramReflectionTitle}</h4>
            <p className="mt-1 text-sm leading-6 text-stone-600">{hexagram.reflectionPrompt}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
