import { useEffect, useRef } from "react";
import { routeA11yCopy } from "../data/routeA11yCopy";
import { routeCopy } from "../data/uiCopy";

export function RouteLoadError() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <section aria-live="assertive" role="alert" className="page-shell flex min-h-[320px] items-start">
      <div className="max-w-md rounded-lg border border-red-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="focus-ring text-lg font-semibold text-stone-950" tabIndex={-1} ref={titleRef}>{routeCopy.loadErrorTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">{routeCopy.loadErrorDescription}</p>
        <button
          className="focus-ring primary-button mt-4"
          onClick={() => window.location.reload()}
          type="button"
        >
          {routeCopy.reloadButton}
        </button>
        <a className="focus-ring secondary-button ml-2 mt-4" href="#/">
          {routeA11yCopy.homeButton}
        </a>
      </div>
    </section>
  );
}
