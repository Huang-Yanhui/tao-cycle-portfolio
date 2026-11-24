import type { Metadata } from "next";
import { LandscapePreview } from "@/components/landscape-preview";
import "./preview.css";

export const metadata: Metadata = {
  title: "昼夜长卷 · 视觉对比｜黄炎辉",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return <LandscapePreview />;
}
