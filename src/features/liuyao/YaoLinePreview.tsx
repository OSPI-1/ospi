import { liuyaoFormCopy } from "../../data/uiCopy";

export function YaoLinePreview({ isYang, isMoving }: { isYang: boolean; isMoving: boolean }) {
  const lineLabel = isYang ? liuyaoFormCopy.yangLabel : liuyaoFormCopy.yinLabel;
  const movementLabel = isMoving ? liuyaoFormCopy.movingLabel : liuyaoFormCopy.stableLabel;

  return (
    <div className="flex items-center gap-2" aria-label={`${lineLabel}，${movementLabel}`}>
      <div className="flex h-3 w-20 gap-2" aria-hidden="true">
        {isYang ? (
          <span className="h-3 w-full rounded-sm bg-[#17211b]" />
        ) : (
          <>
            <span className="h-3 flex-1 rounded-sm bg-[#17211b]" />
            <span className="h-3 flex-1 rounded-sm bg-[#17211b]" />
          </>
        )}
      </div>
      {isMoving ? (
        <span className="rounded-full bg-[#f8ebdf] px-2 py-0.5 text-xs font-medium text-[#b23526]">
          {liuyaoFormCopy.movingHint}
        </span>
      ) : null}
    </div>
  );
}
