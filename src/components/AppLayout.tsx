import { BookOpen, Compass, Home, Info, ScrollText } from "lucide-react";
import type { ReactNode } from "react";
import type { RouteId } from "../App";
import { routeA11yCopy } from "../data/routeA11yCopy";
import { Disclaimer } from "./Disclaimer";

const navItems: Array<{ route: RouteId; label: string; href: string; icon: typeof Home }> = [
  { route: "home", label: "首页", href: "#/", icon: Home },
  { route: "bazi", label: "八字", href: "#/bazi", icon: ScrollText },
  { route: "liuyao", label: "六爻", href: "#/liuyao", icon: Compass },
  { route: "meihua", label: "梅花", href: "#/meihua", icon: BookOpen },
  { route: "about", label: "说明", href: "#/about", icon: Info }
];

export function AppLayout({ activeRoute, children }: { activeRoute: RouteId; children: ReactNode }) {
  return (
    <div className="app-shell">
      <a className="app-skip-link focus-ring sr-only fixed left-4 top-4 z-50 px-4 py-3 text-sm font-medium text-white focus:not-sr-only" href="#main-content">
        {routeA11yCopy.skipToContent}
      </a>
      <header className="app-header">
        <div className="app-header-inner">
          <a className="app-brand focus-ring flex items-center gap-3" href="#/" aria-label="返回首页">
            <span className="app-brand-mark grid h-10 w-10 place-items-center text-lg font-semibold">
              玄
            </span>
            <span>
              <span className="block text-lg font-semibold">玄览</span>
              <span className="app-brand-subtitle block text-xs">传统术数文化工具</span>
            </span>
          </a>
          <nav className="app-nav" aria-label="主导航">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeRoute === item.route;
              return (
                <a
                  className={`app-nav-link focus-ring text-sm ${active ? "is-active" : ""}`}
                  href={item.href}
                  key={item.route}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="app-main" id="main-content" tabIndex={-1}>{children}</main>
      <footer className="app-footer">
        <Disclaimer />
      </footer>
    </div>
  );
}
