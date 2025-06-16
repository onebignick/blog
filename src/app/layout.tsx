import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={inter.className}>
        <nav className="flex max-w-[800px] m-auto p-4 sticky top-0 bg-inherit">
          <div className="flex gap-4 items-end">
            <a href='/' className="text-2xl hover:underline">nicholas ong</a>
            <a href='/blog' className="hover:underline">blog</a>
          </div>

        </nav>
        {children}
      </body>
    </html>
  );
}
