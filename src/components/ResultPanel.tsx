import type { ReactNode } from "react";
import { Disclaimer } from "./Disclaimer";

export function ResultPanel({
  title,
  summary,
  meta,
  showDisclaimer = true,
  children
}: {
  title: string;
  summary?: ReactNode;
  meta?: ReactNode;
  showDisclaimer?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="surface-card space-y-5 p-5 sm:p-6">
      <div className="border-b border-stone-200 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
            {summary ? <div className="mt-2 text-sm leading-6 text-stone-600">{summary}</div> : null}
          </div>
          {meta ? <div className="text-sm text-stone-500">{meta}</div> : null}
        </div>
      </div>
      {children}
      {showDisclaimer ? <Disclaimer variant="result" /> : null}
    </section>
  );
}
