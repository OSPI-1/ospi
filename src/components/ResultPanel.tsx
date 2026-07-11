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
    <section className="result-panel surface-card space-y-6 p-5 sm:p-7">
      <div className="result-panel-header pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="result-panel-title text-xl font-semibold">{title}</h2>
            {summary ? <div className="result-panel-summary mt-2 text-sm leading-6">{summary}</div> : null}
          </div>
          {meta ? <div className="result-panel-meta text-sm">{meta}</div> : null}
        </div>
      </div>
      {children}
      {showDisclaimer ? <Disclaimer variant="result" /> : null}
    </section>
  );
}
