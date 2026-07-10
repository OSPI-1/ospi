import { BookOpen, Compass, ScrollText } from "lucide-react";
import { ModuleCard } from "../components/ModuleCard";
import { homeCopy, moduleCopy } from "../data/moduleCopy";

export function HomePage() {
  return (
    <div>
      <section className="ink-scene">
        <div className="mx-auto grid min-h-[520px] max-w-6xl items-center gap-8 px-4 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl text-white">
            <p className="text-sm font-medium text-[#f3c46f]">{homeCopy.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{homeCopy.title}</h1>
            <p className="mt-5 text-lg leading-8 text-stone-100">{homeCopy.description}</p>
          </div>
          <div className="grid gap-3 rounded-lg border border-white/20 bg-white/10 p-5 text-white backdrop-blur">
            {homeCopy.sceneItems.map((item) => (
              <div className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-3" key={item.symbol}>
                <span className="text-2xl font-semibold">{item.symbol}</span>
                <span className="text-sm text-stone-200">{item.caption}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          <ModuleCard
            accent="bg-[#edf5f1] text-[#2f6f61]"
            href="#/bazi"
            icon={ScrollText}
            subtitle={moduleCopy.bazi.subtitle}
            title={moduleCopy.bazi.title}
          />
          <ModuleCard
            accent="bg-[#f8ebdf] text-[#b23526]"
            href="#/liuyao"
            icon={Compass}
            subtitle={moduleCopy.liuyao.subtitle}
            title={moduleCopy.liuyao.title}
          />
          <ModuleCard
            accent="bg-[#fff4d8] text-[#8a621b]"
            href="#/meihua"
            icon={BookOpen}
            subtitle={moduleCopy.meihua.subtitle}
            title={moduleCopy.meihua.title}
          />
        </div>
      </section>
    </div>
  );
}
