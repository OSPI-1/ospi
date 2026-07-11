import { useRef } from "react";
import { ArrowDown, ArrowRight, BookOpen, Compass, Database, Scale, ScrollText, ShieldCheck } from "lucide-react";
import { ModuleCard } from "../components/ModuleCard";
import { homeCopy, moduleCopy } from "../data/moduleCopy";

export function HomePage() {
  const modulesRef = useRef<HTMLElement>(null);
  const principleIcons = [Database, ShieldCheck, Scale];

  function scrollToModules() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    modulesRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="home-page">
      <section className="home-hero ink-scene">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-eyebrow">{homeCopy.eyebrow}</p>
            <h1 className="home-hero-title">
              <span className="home-hero-brand">{homeCopy.title}</span>
              <span className="home-hero-headline">
                {homeCopy.headline.map((line) => <span key={line}>{line}</span>)}
              </span>
            </h1>
            <p className="home-hero-description">{homeCopy.description}</p>
            <p className="home-hero-boundary">{homeCopy.boundary}</p>
            <div className="home-hero-actions">
              <button type="button" className="home-primary-action focus-ring" onClick={scrollToModules}>
                {homeCopy.actions.explore}<ArrowDown aria-hidden="true" size={17} strokeWidth={1.8} />
              </button>
              <a className="home-secondary-action focus-ring" href="#/about">
                {homeCopy.actions.about}<ArrowRight aria-hidden="true" size={17} strokeWidth={1.8} />
              </a>
            </div>
          </div>
          <div className="home-hero-figure" aria-hidden="true">
            <div className="home-hero-orbit home-hero-orbit--outer" />
            <div className="home-hero-orbit home-hero-orbit--inner" />
            <div className="home-hero-lines">
              <span className="home-hero-line" /><span className="home-hero-line home-hero-line--broken" />
              <span className="home-hero-line" /><span className="home-hero-line home-hero-line--broken" />
              <span className="home-hero-line home-hero-line--broken" /><span className="home-hero-line" />
            </div>
            <span className="home-hero-seal">象</span>
          </div>
        </div>
      </section>

      <section ref={modulesRef} className="home-section home-tools" aria-labelledby="home-tools-title">
        <div className="home-section-intro">
          <p className="home-eyebrow">{homeCopy.modules.eyebrow}</p>
          <h2 id="home-tools-title">{homeCopy.modules.title}</h2>
          <p>{homeCopy.modules.description}</p>
        </div>
        <div className="home-module-grid">
          <ModuleCard accent="bg-[#edf5f1] text-[#2f6f61]" href="#/bazi" icon={ScrollText} title={moduleCopy.bazi.title} subtitle={homeCopy.modules.details.bazi} />
          <ModuleCard accent="bg-[#f8ebdf] text-[#b23526]" href="#/liuyao" icon={Compass} title={moduleCopy.liuyao.title} subtitle={homeCopy.modules.details.liuyao} />
          <ModuleCard accent="bg-[#fff4d8] text-[#8a621b]" href="#/meihua" icon={BookOpen} title={moduleCopy.meihua.title} subtitle={homeCopy.modules.details.meihua} />
        </div>
      </section>

      <section className="home-section home-principles" aria-labelledby="home-principles-title">
        <div className="home-section-intro">
          <p className="home-eyebrow">使用原则</p>
          <h2 id="home-principles-title">让工具保持清晰，也让判断留在自己手中。</h2>
        </div>
        <div className="home-principle-grid">
          {homeCopy.principles.map((principle, index) => {
            const Icon = principleIcons[index];
            return <article key={principle.title} className="home-principle">
              <Icon aria-hidden="true" size={21} strokeWidth={1.7} />
              <h3>{principle.title}</h3><p>{principle.description}</p>
            </article>;
          })}
        </div>
      </section>

      <section className="home-section home-expression" aria-labelledby="home-expression-title">
        <div className="home-expression-copy">
          <p className="home-eyebrow">{homeCopy.expression.eyebrow}</p>
          <h2 id="home-expression-title">{homeCopy.expression.title}</h2>
          <p>{homeCopy.expression.description}</p>
        </div>
        <div className="home-expression-mark" aria-hidden="true">
          <span className="home-expression-axis home-expression-axis--horizontal" />
          <span className="home-expression-axis home-expression-axis--vertical" />
          <span className="home-expression-circle home-expression-circle--outer" />
          <span className="home-expression-circle home-expression-circle--inner" />
          <span className="home-expression-dot home-expression-dot--top" />
          <span className="home-expression-dot home-expression-dot--right" />
          <span className="home-expression-dot home-expression-dot--bottom" />
          <span className="home-expression-dot home-expression-dot--left" />
        </div>
      </section>

      <section className="home-closing" aria-label="使用边界">
        <p>{homeCopy.closing.text}</p>
        <a className="home-closing-link focus-ring" href="#/about">
          {homeCopy.closing.action}<ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
        </a>
      </section>
    </div>
  );
}
