import Link from "next/link";
import { DualityBackground } from "@/components/duality-background";
import { profile } from "@/data/profile";

const journey = [
  ...[...profile.work].reverse().map((item) => ({
    period: item.period,
    title: item.company,
    role: item.role,
    summary: item.summary,
    tags: item.tags,
    highlights: item.highlights,
  })),
];

export default function JourneyPage() {
  return (
    <main className="inner-page" id="top">
      <DualityBackground />

      <header className="inner-header">
        <Link className="wordmark" href="/#chapter-1" aria-label="返回主页行旅章节">
          道 <i /> 生
        </Link>
        <Link className="inner-back" href="/#chapter-1">
          <span aria-hidden="true">←</span> 返回长卷
        </Link>
      </header>

      <section className="inner-intro" aria-labelledby="journey-title">
        <div>
          <p className="inner-overline">02 / 承 · JOURNEY</p>
          <h1 id="journey-title">行旅</h1>
        </div>
        <div className="inner-lead">
          <p>路不是年份的堆叠，而是选择留下的纹理。</p>
          <span>从名创优品的业务实践，到汇富物业的 AI 数据训练。</span>
        </div>
      </section>

      <section className="journey-sheet" aria-label="工作经历时间轴">
        <div className="sheet-heading">
          <p>履迹 / TRACE</p>
          <h2>沿时间回望，<br />也向下一程展开。</h2>
        </div>

        <ol className="journey-timeline">
          {journey.map((item, index) => (
            <li key={`${item.period}-${item.title}`} className="journey-entry">
              <div className="journey-marker" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <article>
                <p className="journey-period">{item.period}</p>
                <h3>{item.title}</h3>
                <p className="journey-role">{item.role}</p>
                <p className="journey-summary">{item.summary}</p>
                {item.highlights.length > 0 && (
                  <ul className="journey-highlights">
                    {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                )}
                <ul className="journey-tags" aria-label="经历关键词">
                  {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <footer className="inner-footer">
        <p>02 / 承 · 所学与所行</p>
        <Link href="/projects">下一章：转折 <span aria-hidden="true">→</span></Link>
      </footer>
    </main>
  );
}
