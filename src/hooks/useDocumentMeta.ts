import { useEffect } from "react";
import type { PageMeta } from "../data/pageMeta";

export function useDocumentMeta(meta: PageMeta) {
  useEffect(() => {
    document.title = meta.title;
    let description = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = meta.description;
  }, [meta]);
}
