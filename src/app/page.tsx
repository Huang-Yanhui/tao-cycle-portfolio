"use client";

import { phases } from "@/components/cycle-canvas";
import { DualityBackground } from "@/components/duality-background";

const sections = ["此刻", "行旅", "转折", "余韵"];

export default function Home() {
  const moveToSection = (index: number) => {
    document.getElementById(`chapter-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      <DualityBackground />
      <a className="skip-link" href="#content">
        跳至内容
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="道生首页">
          道 <i /> 生
        </a>
        <nav className="top-nav" aria-label="页面导航">
          {sections.map((section, index) => (
            <button key={section} onClick={() => moveToSection(index)} type="button">
              {section}
            </button>
          ))}
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">PERSONAL FIELD NOTES · 01</p>
          <h1 id="page-title">黄炎辉</h1>
          <p className="hero-line">万物有期，人生有序。</p>
          <p className="hero-note">
            这里记录正在发生的事。故事尚在展开，不急于定义。
          </p>
          <button className="explore-link" type="button" onClick={() => moveToSection(0)}>
            向下探索 <span aria-hidden="true">↓</span>
          </button>
        </div>
        <div className="hero-seal" aria-hidden="true">
          <span>昼夜相生</span>
          <i />
        </div>
      </section>

      <div id="content" className="chapters">
        <section className="chapter chapter-now" id="chapter-0" aria-labelledby="chapter-now-title">
          <p className="chapter-index">01 / {phases[0].key}</p>
          <div>
            <p className="chapter-kicker">此刻</p>
            <h2 id="chapter-now-title">从一片留白开始。</h2>
          </div>
          <p className="chapter-body">自我介绍将在这里慢慢补全。比起匆忙贴上标签，更愿意先保留真实的空白。</p>
        </section>

        <section className="chapter chapter-journey" id="chapter-1" aria-labelledby="chapter-journey-title">
          <p className="chapter-index">02 / {phases[1].key}</p>
          <div>
            <p className="chapter-kicker">行旅</p>
            <h2 id="chapter-journey-title">行路未完，故事待续。</h2>
          </div>
          <p className="chapter-body">工作与学习经历会在这里以时间和转折串联，而不只是按年份罗列。</p>
        </section>

        <section className="chapter chapter-turn" id="chapter-2" aria-labelledby="chapter-turn-title">
          <p className="chapter-index">03 / {phases[2].key}</p>
          <div>
            <p className="chapter-kicker">转折</p>
            <h2 id="chapter-turn-title">变化并非偏离，亦是路径。</h2>
          </div>
          <p className="chapter-body">未来可在此收纳重要选择、项目、学习和那些改变方向的时刻。</p>
        </section>

        <section className="chapter chapter-resonance" id="chapter-3" aria-labelledby="chapter-resonance-title">
          <p className="chapter-index">04 / {phases[3].key}</p>
          <div>
            <p className="chapter-kicker">余韵</p>
            <h2 id="chapter-resonance-title">一切仍在流动。</h2>
          </div>
          <p className="chapter-body">兴趣、随笔、实验与新的连接，将在此处汇成下一次出发的涟漪。</p>
        </section>
      </div>

      <footer className="site-footer">
        <span>黄炎辉</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
