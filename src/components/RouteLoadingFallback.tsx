import { routeCopy } from "../data/uiCopy";

export function RouteLoadingFallback() {
  return (
    <section aria-live="polite" role="status" className="page-shell flex min-h-[320px] items-start">
      <p className="surface-card px-4 py-3 text-sm text-stone-600">
        {routeCopy.loading}
      </p>
    </section>
  );
}
