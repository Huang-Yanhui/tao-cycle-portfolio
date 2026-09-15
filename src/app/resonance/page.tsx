import Image from "next/image";
import Link from "next/link";
import { DualityBackground } from "@/components/duality-background";
import { profile } from "@/data/profile";

export default function ResonancePage() {
  return (
    <main className="inner-page" id="top">
      <DualityBackground />

      <header className="inner-header">
        <Link className="wordmark" href="/#chapter-3" aria-label="返回主页余韵章节">
          道 <i /> 生
        </Link>
        <Link className="inner-back" href="/#chapter-3">
          <span aria-hidden="true">←</span> 返回长卷
        </Link>
      </header>

      <section className="inner-intro" aria-labelledby="resonance-title">
        <div>
          <p className="inner-overline">04 / 合 · RESONANCE</p>
          <h1 id="resonance-title">余韵</h1>
        </div>
        <div className="inner-lead">
          <p>忙碌之外，也需要留白。咖啡的层次与音乐的回响，构成日常里柔软的一面。</p>
          <span>特调咖啡 · 听歌与现场</span>
        </div>
      </section>

      <section className="resonance-sheet" aria-label="兴趣爱好">
        {profile.interests.map((interest, index) => (
          <figure className={`interest-panel interest-panel-${index + 1}`} key={interest.title}>
            <div className="interest-image">
              <Image
                src={interest.image}
                alt={interest.imageAlt}
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
            <figcaption>
              <p>余韵 · {String(index + 1).padStart(2, "0")}</p>
              <h2>{interest.title}</h2>
              <span>{interest.note}</span>
            </figcaption>
          </figure>
        ))}
      </section>

      <footer className="inner-footer">
        <p>04 / 合 · 兴之所至</p>
        <Link href="/#top">合卷返回 <span aria-hidden="true">↺</span></Link>
      </footer>
    </main>
  );
}
