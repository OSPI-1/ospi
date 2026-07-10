import { baziInputCopy } from "../../data/uiCopy";

export function BaziAssumptionNotice() {
  return (
    <aside className="subtle-card p-4" aria-labelledby="bazi-assumptions-title">
      <h3 className="text-sm font-semibold text-stone-900" id="bazi-assumptions-title">
        {baziInputCopy.assumptionsTitle}
      </h3>
      <ul className="mt-2 space-y-1 text-sm leading-6 text-stone-600">
        {baziInputCopy.assumptions.map((assumption) => (
          <li key={assumption}>{assumption}</li>
        ))}
      </ul>
      <p className="mt-3 border-t border-stone-200 pt-3 text-sm leading-6 text-stone-600">
        {baziInputCopy.timeBoundaryNotice}
      </p>
    </aside>
  );
}
