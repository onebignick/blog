import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nicholas's Blog",
  description: "My Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme') || 'system';
              if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            })();
          `
        }} />
      </head>
      <body className={inter.className}>
        <nav className="flex justify-between items-center max-w-[800px] m-auto px-4 pt-4 pb-2 sticky top-0 bg-background z-10">
          <div className="flex gap-4 items-end">
            <a href='/' className="text-2xl underline hover:opacity-60">nicholas ong</a>
            <a href='/blog' className="underline hover:opacity-60">blog</a>
          </div>
          <ThemeToggle />
        </nav>
        {children}
      </body>
    </html>
  );
}
