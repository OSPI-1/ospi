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
    <div className="min-h-screen bg-[#f7f4ec] text-[#17211b]">
      <a className="focus-ring sr-only fixed left-4 top-4 z-50 rounded-lg bg-[#17211b] px-4 py-3 text-sm font-medium text-white focus:not-sr-only" href="#main-content">
        {routeA11yCopy.skipToContent}
      </a>
      <header className="border-b border-stone-200 bg-[#f7f4ec]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <a className="focus-ring flex items-center gap-3 rounded-lg" href="#/" aria-label="返回首页">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#17211b] text-lg font-semibold text-[#f7f4ec]">
              玄
            </span>
            <span>
              <span className="block text-lg font-semibold">玄览</span>
              <span className="block text-xs text-stone-600">传统术数文化工具</span>
            </span>
          </a>
          <nav className="flex flex-wrap gap-2" aria-label="主导航">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeRoute === item.route;
              return (
                <a
                  className={`focus-ring inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm transition ${
                    active
                      ? "bg-[#b23526] text-white"
                      : "bg-white text-stone-700 hover:bg-stone-100"
                  }`}
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
      <main id="main-content" tabIndex={-1}>{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:pt-6">
        <Disclaimer />
      </footer>
    </div>
  );
}
