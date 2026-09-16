import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { DifyChatbot } from "@/components/dify-chatbot";
import "./globals.css";

export const metadata: Metadata = {
  title: "黄炎辉｜道生",
  description: "黄炎辉的个人数字空间，记录 AI 数据训练、供应链实践与生活余韵。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const siteStyle = {
    "--duality-background-image": `url("${basePath}/images/duality-landscape-v1.png")`,
  } as CSSProperties;

  return (
    <html lang="zh-CN">
      <body style={siteStyle}>
        {children}
        <DifyChatbot />
      </body>
    </html>
  );
}
