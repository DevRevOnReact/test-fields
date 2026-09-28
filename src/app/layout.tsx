import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Поля — место для мыслей",
  description: "Небольшой журнал записей. Читайте публикации и создавайте свои.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="min-h-screen font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only fixed top-3 left-3 z-50 bg-ink px-4 py-3 text-white focus:not-sr-only"
        >
          Перейти к содержимому
        </a>
        {children}
      </body>
    </html>
  );
}
