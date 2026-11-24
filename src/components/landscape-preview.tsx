"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import OriginalHome from "@/components/original-home";
import { LivingLandscape } from "@/components/living-landscape";
import { chapterAtmospheres, measureCycle, sampleCycle, scrollChapters } from "@/lib/landscape-cycle";
import { profile } from "@/data/profile";

const chapters = [
  { name: "此刻", phase: "起", title: "以规则见真", note: "此刻所处", href: "/now", body: "黄炎辉，26 岁。拥有工程与供应链的复合学习经历，目前从事 AI 数据训练、模型评测与供应商管理。" },
  { name: "行旅", phase: "承", title: "循履迹而行", note: "所学与所行", href: "/journey", body: "两段工作。从名创优品的智能补货与供应链数字化，走到汇富的 AI 数据全链路工作。" },
  { name: "转折", phase: "转", title: "从实践求解", note: "所思化所成", href: "/projects", body: "三个 AI 面试主项目，加一个传统供应链数字化项目。" },
  { name: "余韵", phase: "合", title: "听生活回响", note: "兴之所至处", href: "/resonance", body: "工作之外，以特调咖啡感受细微变化，也在歌单与现场里留住不同阶段的情绪。" },
];

function goToChapter(index: number) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(scrollChapters[index])?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" });
}

export function LandscapePreview({ comparison = true }: { comparison?: boolean }) {
  const [edition, setEdition] = useState<"original" | "renewed">("renewed");
  const [paused, setPaused] = useState(false);
  const [scenery, setScenery] = useState(false);
  const [active, setActive] = useState(0);
  const [help, setHelp] = useState(false);
  const savedPosition = useRef<{ id: string; fraction: number } | null>(null);

  useEffect(() => {
    if (!comparison) return;
    const query = new URLSearchParams(location.search);
    if (query.get("version") === "original") setEdition("original");
    document.documentElement.dataset.landscapePreview = "true";
    return () => { delete document.documentElement.dataset.landscapePreview; };
  }, [comparison]);

  useEffect(() => {
    let anchors = measureCycle();
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(sampleCycle(scrollY, anchors).chapter));
    };
    const measure = () => { anchors = measureCycle(); update(); };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", measure); };
  }, [edition]);

  useLayoutEffect(() => {
    const saved = savedPosition.current;
    if (!saved) return;
    const section = document.getElementById(saved.id);
    if (section) window.scrollTo({ top: section.getBoundingClientRect().top + scrollY + section.offsetHeight * saved.fraction, behavior: "instant" });
    savedPosition.current = null;
  }, [edition]);

  const compare = (next: typeof edition) => {
    if (next === edition) return;
    let id: string = "top";
    for (const chapter of scrollChapters) {
      const element = document.getElementById(chapter);
      if (element && element.getBoundingClientRect().top <= 1) id = chapter;
    }
    const element = document.getElementById(id);
    savedPosition.current = { id, fraction: element ? -element.getBoundingClientRect().top / element.offsetHeight : 0 };
    setEdition(next);
    const url = new URL(location.href);
    url.searchParams.set("version", next);
    history.replaceState(null, "", url);
  };

  return (
    <div className={`landscape-comparison ${edition === "renewed" ? "is-renewed" : "is-original"} ${scenery && edition === "renewed" ? "is-scenery" : ""}`} data-paused={paused} data-chapter={active}>
      {edition === "original" ? <OriginalHome /> : (
        <main className="scroll-edition">
          <LivingLandscape paused={paused} />
          <a className="skip-link" href="#content">跳至内容</a>
          <header className="scroll-header">
            <button className="scroll-wordmark" onClick={() => goToChapter(0)} aria-label="回到长卷开篇">道<span>生</span></button>
            <span className="scroll-signature">黄炎辉的个人长卷</span>
            <nav aria-label="章节导航">
              {chapters.map((chapter, index) => <button type="button" key={chapter.name} onClick={() => goToChapter(index + 1)} aria-current={active === index + 1 ? "location" : undefined}><small>0{index + 1}</small>{chapter.name}</button>)}
            </nav>
          </header>

          <section className="scroll-hero" id="top" aria-labelledby="scroll-title">
            <div className="scroll-hero-copy reading-surface">
              <p className="scroll-eyebrow"><span /> PERSONAL FIELD NOTES <i>序</i></p>
              <h1 id="scroll-title">黄炎辉</h1>
              <p className="scroll-mantra">万物有期，人生有序。</p>
              <p className="scroll-biography">{profile.age} 岁。所学从电气工程延伸到运营与供应链管理，<br className="desktop-break" />现在专注 AI 数据训练、模型评测与供应商协作。</p>
              <button className="scroll-entry" onClick={() => goToChapter(1)}><span>循卷而行</span><i aria-hidden="true">↓</i></button>
            </div>
            <div className="scroll-poem" aria-hidden="true">昼夜相生<span>周而复始</span></div>
            <div className="scroll-footnote"><span>一卷山水 · 四时流转</span><span>向下，走入长卷 <i>↓</i></span></div>
          </section>

          <div id="content">
            {chapters.map((chapter, index) => (
              <section key={chapter.phase} className={`scroll-chapter ${index === 2 ? "scroll-chapter-night" : ""}`} id={`chapter-${index}`} aria-labelledby={`scroll-chapter-title-${index}`}>
                <div className="scroll-chapter-number"><span>0{index + 1}</span><i />{chapter.phase}</div>
                <div className="scroll-chapter-title reading-surface"><p className="scroll-eyebrow">{chapter.name}<span />{chapter.note}</p><h2 id={`scroll-chapter-title-${index}`}>{chapter.title}</h2></div>
                <div className="scroll-chapter-copy reading-surface"><p>{chapter.body}</p><Link href={chapter.href} className="scroll-chapter-link">展开此章 <span aria-hidden="true">↗</span></Link></div>
                <span className="scroll-chapter-watermark" aria-hidden="true">{chapter.phase}</span>
              </section>
            ))}
          </div>
          <footer className="scroll-footer"><span>黄炎辉 <i>·</i> © {new Date().getFullYear()}</span><button onClick={() => goToChapter(0)}>合卷，再启 <span>↑</span></button></footer>
          <aside className="scroll-compass" aria-label="长卷位置">
            {scrollChapters.map((id, index) => <button key={id} aria-label={index ? `前往${chapters[index - 1].name}` : "前往首页"} aria-current={active === index ? "location" : undefined} onClick={() => goToChapter(index)}><span />{active === index && <small>{index ? chapters[index - 1].phase : "序"}</small>}</button>)}
          </aside>
        </main>
      )}

      {comparison && <div className="preview-dock" role="region" aria-label="视觉版本对比">
        <span className="preview-label">本地对比</span>
        <div className="preview-versions" role="group" aria-label="选择版本">
          <button aria-pressed={edition === "original"} onClick={() => compare("original")}>原版</button>
          <button aria-pressed={edition === "renewed"} onClick={() => compare("renewed")}>升级版</button>
        </div>
        <span className="preview-atmosphere" aria-live="polite">{chapterAtmospheres[active]}</span>
        <button className="preview-icon" disabled={edition === "original"} aria-pressed={paused} onClick={() => setPaused(!paused)} title={paused ? "继续动效" : "暂停动效"}>{paused ? "继续" : "暂停"}</button>
        <button className="preview-icon" disabled={edition === "original"} aria-pressed={scenery} onClick={() => setScenery(!scenery)}>{scenery ? "看文字" : "赏山水"}</button>
        <button className="preview-help-button" aria-expanded={help} aria-label="对比说明" onClick={() => setHelp(!help)}>?</button>
      </div>}
      {help && <aside className="preview-help"><strong>在同一处，比较两种画境。</strong><p>移动鼠标，看雾与水的回应。向下滚动，走完明 → 暮 → 夜 → 明的一周。「赏山水」可以暂时收起正文。</p><p>本次样板升级首页长卷；「展开此章」仍通向现有内页。</p><button onClick={() => setHelp(false)}>知道了</button></aside>}
    </div>
  );
}
