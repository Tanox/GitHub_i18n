import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub i18n Admin - GitHub 中文翻译管理平台",
  description: "为 GitHub 中文翻译插件提供现代化的 Web 管理界面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-gray-50 dark:bg-gray-950`}>
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 ml-64 flex flex-col">
            <Header />
            <div className="flex-1 p-8 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
