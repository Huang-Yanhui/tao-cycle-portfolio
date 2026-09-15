"use client";

import Link from "next/link";
import { phases } from "@/components/cycle-canvas";
import { DualityBackground } from "@/components/duality-background";
import { profile } from "@/data/profile";

const sections = ["此刻", "行旅", "转折", "余韵"];

export default function Home() {
  const moveToSection = (index: number) => {
    document.getElementById(`chapter-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
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
            {profile.age} 岁。所学从电气工程延伸到运营与供应链管理，
            现在专注 AI 数据训练、模型评测与供应商协作。
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
            <h2 id="chapter-now-title">以规则见真</h2>
          </div>
          <div className="chapter-summary">
            <p className="chapter-body">黄炎辉，26 岁。拥有工程与供应链的复合学习经历，目前从事 AI 数据训练、模型评测与供应商管理。</p>
            <Link className="chapter-link" href="/now">
              展开此章 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="chapter chapter-journey" id="chapter-1" aria-labelledby="chapter-journey-title">
          <p className="chapter-index">02 / {phases[1].key}</p>
          <div>
            <p className="chapter-kicker">行旅</p>
            <h2 id="chapter-journey-title">循履迹而行</h2>
          </div>
          <div className="chapter-summary">
            <p className="chapter-body">两段工作。从名创优品的智能补货与供应链数字化，走到汇富物业的 AI 数据全链路工作。</p>
            <Link className="chapter-link" href="/journey">
              展开此章 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="chapter chapter-turn" id="chapter-2" aria-labelledby="chapter-turn-title">
          <p className="chapter-index">03 / {phases[2].key}</p>
          <div>
            <p className="chapter-kicker">转折</p>
            <h2 id="chapter-turn-title">从实践求解</h2>
          </div>
          <div className="chapter-summary">
            <p className="chapter-body">三个 AI 面试主项目，加一个传统供应链数字化项目。只讲项目是什么、做了哪些训练与建设。</p>
            <Link className="chapter-link" href="/projects">
              展开此章 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="chapter chapter-resonance" id="chapter-3" aria-labelledby="chapter-resonance-title">
          <p className="chapter-index">04 / {phases[3].key}</p>
          <div>
            <p className="chapter-kicker">余韵</p>
            <h2 id="chapter-resonance-title">听生活回响</h2>
          </div>
          <div className="chapter-summary">
            <p className="chapter-body">工作之外，以特调咖啡感受细微变化，也在歌单与现场里留住不同阶段的情绪。</p>
            <Link className="chapter-link" href="/resonance">
              展开此章 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <span>黄炎辉</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
