"use client";
import { useState } from "react";
import Link from "next/link";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi (NCT)","Jammu & Kashmir","Ladakh",
  "Chandigarh","Puducherry",
];

const DOC_TYPES = [
  { id: "Rent / Lease Agreement",  icon: "🏠", desc: "Residential or commercial rental" },
  { id: "Business Registration",    icon: "🏢", desc: "Sole prop, partnership, Pvt Ltd" },
  { id: "Affidavit",                icon: "⚖️", desc: "Sworn statement before notary" },
  { id: "Power of Attorney",        icon: "📋", desc: "General or special POA" },
  { id: "Partnership Deed",         icon: "🤝", desc: "Between two or more partners" },
  { id: "No Objection Certificate", icon: "✅", desc: "NOC for any official purpose" },
];

type Field = { name: string; label: string; type: string; required: boolean; opts?: string[] };

const FIELDS: Record<string, Field[]> = {
  "Rent / Lease Agreement": [
    { name: "landlordName",    label: "Landlord full name",    type: "text",     required: true  },
    { name: "tenantName",      label: "Tenant full name",      type: "text",     required: true  },
    { name: "propertyAddress", label: "Property address",      type: "text",     required: true  },
    { name: "monthlyRent",     label: "Monthly rent (₹)",      type: "number",   required: true  },
    { name: "securityDeposit", label: "Security deposit (₹)",  type: "number",   required: true  },
    { name: "leaseStart",      label: "Lease start date",      type: "date",     required: true  },
    { name: "leaseDuration",   label: "Duration (months)",     type: "number",   required: true  },
    { name: "propertyType",    label: "Property type",         type: "select",   required: true, opts: ["Residential", "Commercial", "Industrial"] },
  ],
  "Business Registration": [
    { name: "businessName",     label: "Business name",         type: "text",     required: true  },
    { name: "businessType",     label: "Business type",         type: "select",   required: true, opts: ["Sole Proprietorship", "Partnership Firm", "Private Limited", "LLP", "OPC"] },
    { name: "ownerName",        label: "Owner / promoter name", type: "text",     required: true  },
    { name: "businessAddress",  label: "Business address",      type: "text",     required: true  },
    { name: "businessActivity", label: "Nature of business",    type: "text",     required: true  },
    { name: "capital",          label: "Capital amount (₹)",    type: "number",   required: false },
  ],
  "Affidavit": [
    { name: "deponentName",    label: "Deponent full name",    type: "text",     required: true  },
    { name: "deponentAge",     label: "Age",                   type: "number",   required: true  },
    { name: "deponentAddress", label: "Address",               type: "text",     required: true  },
    { name: "purpose",         label: "Purpose of affidavit",  type: "text",     required: true  },
    { name: "statements",      label: "Facts / statements",    type: "textarea", required: true  },
  ],
  "Power of Attorney": [
    { name: "principalName",    label: "Principal name",        type: "text",     required: true  },
    { name: "principalAddress", label: "Principal address",     type: "text",     required: true  },
    { name: "agentName",        label: "Agent name",            type: "text",     required: true  },
    { name: "agentAddress",     label: "Agent address",         type: "text",     required: true  },
    { name: "poaType",          label: "POA type",              type: "select",   required: true, opts: ["General", "Special", "Durable"] },
    { name: "powers",           label: "Powers granted",        type: "textarea", required: true  },
  ],
  "Partnership Deed": [
    { name: "firmName",       label: "Firm name",             type: "text",     required: true  },
    { name: "firmAddress",    label: "Business address",      type: "text",     required: true  },
    { name: "partner1Name",   label: "Partner 1 name",        type: "text",     required: true  },
    { name: "partner1Share",  label: "Partner 1 share (%)",   type: "number",   required: true  },
    { name: "partner2Name",   label: "Partner 2 name",        type: "text",     required: true  },
    { name: "partner2Share",  label: "Partner 2 share (%)",   type: "number",   required: true  },
    { name: "businessNature", label: "Nature of business",    type: "text",     required: true  },
    { name: "totalCapital",   label: "Total capital (₹)",     type: "number",   required: true  },
    { name: "startDate",      label: "Start date",            type: "date",     required: true  },
  ],
  "No Objection Certificate": [
    { name: "issuerName",    label: "Issuer name / org",    type: "text",     required: true  },
    { name: "issuerAddress", label: "Issuer address",       type: "text",     required: true  },
    { name: "recipientName", label: "Recipient name",       type: "text",     required: true  },
    { name: "purpose",       label: "Purpose of NOC",       type: "text",     required: true  },
    { name: "details",       label: "Additional details",   type: "textarea", required: false },
  ],
};

export default function CreatePage() {
  const [step, setStep]       = useState<"type" | "state" | "form" | "result">("type");
  const [docType, setDocType] = useState("");
  const [state, setState]     = useState("");
  const [form, setForm]       = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState("");
  const [error, setError]     = useState("");

  const fields = docType ? (FIELDS[docType] ?? []) : [];
  const reqOk  = fields.filter(f => f.required).every(f => form[f.name]?.trim());

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, state, formData: form }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.html);
      setStep("result");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep("type"); setDocType(""); setState(""); setForm({}); setResult(""); setError(""); };

  const print = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${docType}</title></head><body>${result}</body></html>`);
    w.document.close();
    w.print();
  };

  const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", fontSize: 13, border: "1px solid #DEE2E6", borderRadius: 8, background: "white", color: "#212529", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 500, color: "#495057", marginBottom: 5 };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA" }}>

      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #DEE2E6", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 16, color: "#0D1F3C", textDecoration: "none" }}>📄 DocSeva</Link>
        <span style={{ fontSize: 12, color: "#ADB5BD" }}>AI-powered legal documents</span>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>

        {/* STEP: choose doc type */}
        {step === "type" && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0D1F3C", marginBottom: 6 }}>What document do you need?</h1>
            <p style={{ fontSize: 14, color: "#6C757D", marginBottom: 24 }}>Select the type of legal document to create.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
              {DOC_TYPES.map(d => (
                <button key={d.id} onClick={() => { setDocType(d.id); setStep("state"); }}
                  style={{ background: "white", border: "1px solid #DEE2E6", borderRadius: 12, padding: "16px 14px", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{d.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0D1F3C", marginBottom: 4 }}>{d.id}</div>
                  <div style={{ fontSize: 11, color: "#6C757D" }}>{d.desc}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP: choose state */}
        {step === "state" && (
          <>
            <button onClick={() => setStep("type")} style={{ background: "none", border: "none", color: "#6C757D", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0 }}>← Back</button>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0D1F3C", marginBottom: 6 }}>Select your state</h1>
            <p style={{ fontSize: 14, color: "#6C757D", marginBottom: 20 }}>Document will use laws specific to this state.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(148px, 1fr))", gap: 6 }}>
              {STATES.map(s => (
                <button key={s} onClick={() => { setState(s); setStep("form"); }}
                  style={{ padding: "8px 10px", fontSize: 12, textAlign: "left", cursor: "pointer", border: "1px solid #DEE2E6", borderRadius: 7, background: "white", color: "#212529" }}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP: form */}
        {step === "form" && (
          <>
            <button onClick={() => setStep("state")} style={{ background: "none", border: "none", color: "#6C757D", fontSize: 13, cursor: "pointer", marginBottom: 12, padding: 0 }}>← Back</button>
            <div style={{ background: "#E6EEF7", border: "1px solid #B5D4F4", borderRadius: 8, padding: "8px 14px", marginBottom: 20, fontSize: 12, color: "#0C447C", fontWeight: 500 }}>
              {docType} · {state}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {fields.map(f => (
                <div key={f.name}>
                  <label style={lbl}>{f.label}{f.required && <span style={{ color: "#DC3545", marginLeft: 2 }}>*</span>}</label>
                  {f.type === "select" ? (
                    <select value={form[f.name] ?? ""} onChange={e => setForm({ ...form, [f.name]: e.target.value })} style={inp}>
                      <option value="">Select…</option>
                      {f.opts?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea rows={3} value={form[f.name] ?? ""} onChange={e => setForm({ ...form, [f.name]: e.target.value })} style={{ ...inp, resize: "vertical" }} placeholder="Enter details…" />
                  ) : (
                    <input type={f.type} value={form[f.name] ?? ""} onChange={e => setForm({ ...form, [f.name]: e.target.value })} style={inp} placeholder={f.type === "date" ? "" : f.label + "…"} />
                  )}
                </div>
              ))}
              {error && <p style={{ color: "#DC3545", fontSize: 13 }}>{error}</p>}
              <button onClick={generate} disabled={!reqOk || loading}
                style={{ marginTop: 4, padding: "12px 28px", fontSize: 14, fontWeight: 600, borderRadius: 9, border: "none", background: (!reqOk || loading) ? "#CED4DA" : "#0D1F3C", color: "white", cursor: (!reqOk || loading) ? "not-allowed" : "pointer" }}>
                {loading ? "Drafting your document… (5–10 sec)" : "Generate document →"}
              </button>
            </div>
          </>
        )}

        {/* STEP: result */}
        {step === "result" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: "#0D1F3C" }}>Document ready</span>
              <span style={{ fontSize: 12, color: "#6C757D" }}>— {docType} · {state}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              <button onClick={print} style={{ padding: "9px 18px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", background: "#0D1F3C", color: "white", cursor: "pointer" }}>
                🖨 Print / Save as PDF
              </button>
              <button onClick={reset} style={{ padding: "9px 16px", fontSize: 13, borderRadius: 8, border: "1px solid #DEE2E6", background: "white", cursor: "pointer" }}>
                + New document
              </button>
            </div>
            <div style={{ border: "1px solid #DEE2E6", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ background: "#F8F9FA", padding: "8px 14px", borderBottom: "1px solid #DEE2E6", fontSize: 11, color: "#6C757D" }}>Document preview</div>
              <div style={{ maxHeight: 560, overflowY: "auto", background: "white", padding: 16 }} dangerouslySetInnerHTML={{ __html: result }} />
            </div>
            <p style={{ fontSize: 11, color: "#ADB5BD", marginTop: 10 }}>
              AI-generated draft. Have a licensed advocate review before use. Print on correct-value stamp paper.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
