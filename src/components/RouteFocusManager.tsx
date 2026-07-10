import { useEffect } from "react";

export function RouteFocusManager({ route }: { route: string }) {
  useEffect(() => {
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [route]);

  return null;
}
