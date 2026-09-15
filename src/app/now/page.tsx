import Link from "next/link";
import { DualityBackground } from "@/components/duality-background";
import { profile } from "@/data/profile";

export default function NowPage() {
  return (
    <main className="inner-page" id="top">
      <DualityBackground />

      <header className="inner-header">
        <Link className="wordmark" href="/#chapter-0" aria-label="返回主页此刻章节">
          道 <i /> 生
        </Link>
        <Link className="inner-back" href="/#chapter-0">
          <span aria-hidden="true">←</span> 返回长卷
        </Link>
      </header>

      <section className="inner-intro" aria-labelledby="now-title">
        <div>
          <p className="inner-overline">01 / 起 · NOW</p>
          <h1 id="now-title">此刻</h1>
        </div>
        <div className="inner-lead">
          <p>{profile.headline}</p>
          <span>黄炎辉 · {profile.age} 岁</span>
        </div>
      </section>

      <section className="profile-sheet" aria-label="个人简介">
        <div className="sheet-heading">
          <p>本真 / PROFILE</p>
          <h2>不以一词定义，<br />从走过的路认识。</h2>
        </div>

        <div className="profile-content">
          <div className="fact-grid">
            <article className="fact-card">
              <span>姓名</span>
              <strong>{profile.name}</strong>
            </article>
            <article className="fact-card">
              <span>年龄</span>
              <strong>{profile.age} 岁</strong>
            </article>
            <article className="fact-card fact-card-wide">
              <span>当下的交汇点</span>
              <strong>AI 数据训练 × 供应商管理 × 供应链业务</strong>
            </article>
          </div>

          <div className="profile-block">
            <p className="profile-label">所学 / EDUCATION</p>
            <ol className="education-path">
              {profile.education.map((item) => (
                <li key={item.school}>
                  <p>{item.period}</p>
                  <h3>{item.school}</h3>
                  <span>{item.degree} · {item.place}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="profile-block">
            <p className="profile-label">所用 / TOOLS</p>
            <ul className="skill-cloud" aria-label="工具与技能">
              {profile.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          </div>

          <div className="profile-block profile-languages">
            <p className="profile-label">语言 / LANGUAGES</p>
            <p>{profile.languages.join("　·　")}</p>
          </div>
        </div>
      </section>

      <footer className="inner-footer">
        <p>01 / 起 · 此刻所处</p>
        <Link href="/journey">下一章：行旅 <span aria-hidden="true">→</span></Link>
      </footer>
    </main>
  );
}
