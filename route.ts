import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { docType, state, formData } = await req.json();

  const details = Object.entries(formData as Record<string, string>)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const prompt = `You are an expert Indian legal document drafter. Generate a complete, formal ${docType} for the state of ${state}, India.

User details:
${details}

Requirements:
- Use formal Indian legal language. Cite all relevant Acts (Transfer of Property Act 1882, Indian Partnership Act 1932, Registration Act 1908, etc.)
- Include all standard clauses for this document type in ${state}
- Proper numbered sections, recitals, and witness blocks
- Indian date format (DD/MM/YYYY) with blanks where needed
- Include a note on applicable stamp duty in ${state}
- Return ONLY clean HTML with inline styles only. No external CSS. No html/head/body tags.
- White background, font-family: Georgia,serif, max-width:720px, margin:0 auto, padding:40px
- Bold centered title, numbered section headings, signature table at bottom

Return ONLY the HTML div. No explanation.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "API error" }, { status: 500 });
  }

  const data = await response.json();
  const html = data.content?.find((b: { type: string; text?: string }) => b.type === "text")?.text || "";
  return NextResponse.json({ html });
}
