import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "黄炎辉｜道生",
  description: "黄炎辉的个人数字空间。万物有期，人生有序。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
