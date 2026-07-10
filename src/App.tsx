import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { AppLayout } from "./components/AppLayout";
import { RouteFocusManager } from "./components/RouteFocusManager";
import { RouteLoadingFallback } from "./components/RouteLoadingFallback";
import { pageMeta } from "./data/pageMeta";
import { useDocumentMeta } from "./hooks/useDocumentMeta";
import { HomePage } from "./routes/HomePage";
import { NotFoundPage } from "./routes/NotFoundPage";

const BaziPage = lazy(() => import("./routes/BaziPage").then(({ BaziPage: page }) => ({ default: page })));
const LiuyaoPage = lazy(() => import("./routes/LiuyaoPage").then(({ LiuyaoPage: page }) => ({ default: page })));
const MeihuaPage = lazy(() => import("./routes/MeihuaPage").then(({ MeihuaPage: page }) => ({ default: page })));
const AboutPageLazy = lazy(() => import("./routes/AboutPage").then(({ AboutPage: page }) => ({ default: page })));

export const lazyRoutePages = {
  bazi: BaziPage,
  liuyao: LiuyaoPage,
  meihua: MeihuaPage,
  about: AboutPageLazy
};

export type RouteId = "home" | "bazi" | "liuyao" | "meihua" | "about" | "not-found";

export const routeFromHash = (): RouteId => {
  const raw = window.location.hash.replace(/^#\/?/, "");
  if (raw === "bazi" || raw === "liuyao" || raw === "meihua" || raw === "about") {
    return raw;
  }
  return raw === "" ? "home" : "not-found";
};

export function App() {
  const [route, setRoute] = useState<RouteId>(() => routeFromHash());

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useDocumentMeta(pageMeta[route]);

  const page = useMemo(() => {
    switch (route) {
      case "bazi":
        return <BaziPage />;
      case "liuyao":
        return <LiuyaoPage />;
      case "meihua":
        return <MeihuaPage />;
      case "about":
        return <AboutPageLazy />;
      case "not-found":
        return <NotFoundPage path={window.location.hash || "#/"} />;
      default:
        return <HomePage />;
    }
  }, [route]);

  return (
    <AppLayout activeRoute={route}>
      <RouteFocusManager route={route} />
      <AppErrorBoundary key={route}>
        <Suspense fallback={<RouteLoadingFallback />}>{page}</Suspense>
      </AppErrorBoundary>
    </AppLayout>
  );
}
