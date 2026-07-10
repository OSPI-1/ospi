import { Coins } from "lucide-react";
import { liuyaoFormCopy } from "../../data/uiCopy";

export function RandomDivinationPanel({
  hasGenerated,
  onGenerate
}: {
  hasGenerated: boolean;
  onGenerate: () => void;
}) {
  const copy = liuyaoFormCopy.random;

  return (
    <section className="rounded-lg border border-stone-200 bg-[#edf5f1] p-4" aria-labelledby="random-divination-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Coins className="mt-0.5 h-5 w-5 shrink-0 text-[#28735a]" aria-hidden="true" />
          <div>
            <h3 className="text-base font-semibold text-stone-950" id="random-divination-title">
              {copy.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-stone-600">{copy.description}</p>
          </div>
        </div>
        <button
          className="focus-ring inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#28735a] bg-white px-4 font-medium text-[#245e4b] hover:bg-emerald-50"
          onClick={onGenerate}
          type="button"
        >
          <Coins className="h-4 w-4" aria-hidden="true" />
          {copy.button}
        </button>
      </div>
      {hasGenerated ? (
        <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm leading-6 text-stone-700" role="status">
          {copy.success}
        </p>
      ) : null}
    </section>
  );
}
