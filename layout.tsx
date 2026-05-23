import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DocSeva — Legal Documents Instantly",
  description: "AI-powered legal documents for all Indian states",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F8F9FA" }}>
        {children}
      </body>
    </html>
  );
}
