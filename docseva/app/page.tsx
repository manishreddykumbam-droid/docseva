import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 600 }}>
        <div style={{ width: 52, height: 52, background: "#0D1F3C", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 24 }}>📄</div>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#0D1F3C", marginBottom: 14, lineHeight: 1.2 }}>
          Legal documents for every Indian, <span style={{ color: "#E8920A" }}>in minutes</span>
        </h1>
        <p style={{ fontSize: 16, color: "#6C757D", marginBottom: 36, lineHeight: 1.7 }}>
          Rent agreements, affidavits, POA, partnership deeds — AI-drafted, state-specific, ready to print. All 36 states covered.
        </p>
        <Link href="/create" style={{ display: "inline-block", background: "#0D1F3C", color: "white", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
          Create your document free →
        </Link>
        <p style={{ fontSize: 12, color: "#ADB5BD", marginTop: 16 }}>No account needed · ₹0 to start · 3 min avg</p>
      </div>
    </main>
  );
}
