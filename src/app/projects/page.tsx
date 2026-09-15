import Link from "next/link";
import { DualityBackground } from "@/components/duality-background";
import { profile } from "@/data/profile";

type Project = (typeof profile.mainProjects)[number] | typeof profile.supplyChainProject;

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card">
      <div className="project-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
      <div className="project-copy">
        <p className="project-period">{project.company} · {project.type}</p>
        <h3>{project.title}</h3>
        <p className="project-summary">{project.summary}</p>
        <ul className="project-focus" aria-label={`${project.title}主要工作`}>
          {project.focus.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <main className="inner-page inner-page-night" id="top">
      <DualityBackground />

      <header className="inner-header">
        <Link className="wordmark" href="/#chapter-2" aria-label="返回主页转折章节">
          道 <i /> 生
        </Link>
        <Link className="inner-back" href="/#chapter-2">
          <span aria-hidden="true">←</span> 返回长卷
        </Link>
      </header>

      <section className="inner-intro" aria-labelledby="projects-title">
        <div>
          <p className="inner-overline">03 / 转 · PROJECTS</p>
          <h1 id="projects-title">转折</h1>
        </div>
        <div className="inner-lead">
          <p>转，不是偏离；是把业务问题拆成规则、数据、工具与可以验收的结果。</p>
          <span>三个 AI 面试主项目 · 一个传统供应链数字化项目</span>
        </div>
      </section>

      <section className="project-sheet" aria-label="AI 面试主项目">
        <div className="sheet-heading">
          <p>主线 / AI PROJECTS</p>
          <h2>三个项目，<br />看训练如何落地。</h2>
        </div>

        <div className="project-list">
          {profile.mainProjects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.title} />
          ))}
        </div>
      </section>

      <section className="project-sheet project-sheet-traditional" aria-label="传统供应链数字化项目">
        <div className="sheet-heading">
          <p>另章 / SUPPLY CHAIN</p>
          <h2>独立一章，<br />回答数字化实践。</h2>
        </div>

        <div className="project-list">
          <ProjectCard project={profile.supplyChainProject} index={3} />
        </div>
      </section>

      <footer className="inner-footer">
        <p>03 / 转 · 所思化为所成</p>
        <Link href="/resonance">下一章：余韵 <span aria-hidden="true">→</span></Link>
      </footer>
    </main>
  );
}
